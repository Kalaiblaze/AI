import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Mic,
  MicOff,
  X,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Send
} from 'lucide-react';
import {
  VoiceCommandAction,
  VoiceStoryCandidate,
  VOICE_COMMAND_EXAMPLES,
  computeWaveformBars,
  parseVoiceCommand
} from '../engine/voiceCommandEngine';

interface BrowserSpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface BrowserSpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: BrowserSpeechRecognitionResult;
  };
}

interface BrowserSpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: BrowserSpeechRecognition, ev: Event) => unknown) | null;
  onresult:
    | ((
        this: BrowserSpeechRecognition,
        ev: BrowserSpeechRecognitionEvent
      ) => unknown)
    | null;
  onerror:
    | ((
        this: BrowserSpeechRecognition,
        ev: BrowserSpeechRecognitionErrorEvent
      ) => unknown)
    | null;
  onend: ((this: BrowserSpeechRecognition, ev: Event) => unknown) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

interface VoiceCommandOverlayProps {
  isOpen: boolean;
  stories: VoiceStoryCandidate[];
  activePillarName: string;
  activeHeadline: string;
  onClose: () => void;
  onExecuteCommand: (action: VoiceCommandAction) => boolean;
}

type ListeningPhase = 'listening' | 'executed' | 'error' | 'unsupported';

export const VoiceCommandOverlay: React.FC<VoiceCommandOverlayProps> = ({
  isOpen,
  stories,
  activePillarName,
  activeHeadline,
  onClose,
  onExecuteCommand
}) => {
  const [phase, setPhase] = useState<ListeningPhase>('listening');
  const [transcript, setTranscript] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Speak a pillar, story, or view command...'
  );
  const [micActive, setMicActive] = useState<boolean>(false);
  const [manualPhrase, setManualPhrase] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechEnergyRef = useRef<number>(0);
  const phaseTickRef = useRef<number>(0);
  const phaseRef = useRef<ListeningPhase>('listening');
  const mountedRef = useRef<boolean>(false);
  const storiesRef = useRef<VoiceStoryCandidate[]>(stories);
  const onExecuteRef = useRef(onExecuteCommand);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    storiesRef.current = stories;
    onExecuteRef.current = onExecuteCommand;
    onCloseRef.current = onClose;
  }, [stories, onExecuteCommand, onClose]);

  const stopHardwareAndSpeech = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch {
        // Ignore teardown exceptions
      }
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch {
        // Ignore stream cleanup exceptions
      }
      mediaStreamRef.current = null;
    }

    if (audioCtxRef.current) {
      try {
        if (audioCtxRef.current.state !== 'closed') {
          void audioCtxRef.current.close();
        }
      } catch {
        // Ignore AudioContext close errors
      }
      audioCtxRef.current = null;
      analyserRef.current = null;
    }

    setMicActive(false);
  }, []);

  const handleRecognizedTranscript = useCallback(
    (spokenText: string) => {
      const action = parseVoiceCommand(spokenText, storiesRef.current);
      setTranscript(spokenText);

      if (action.type === 'UNKNOWN') {
        setPhase('error');
        setStatusMessage(action.description);
        return;
      }

      const ok = onExecuteRef.current(action);
      if (ok) {
        setPhase('executed');
        setStatusMessage(action.description);
        stopHardwareAndSpeech();
        closeTimerRef.current = setTimeout(() => {
          if (mountedRef.current) {
            onCloseRef.current();
          }
        }, 900);
      } else {
        setPhase('error');
        setStatusMessage('Target story or section is currently unavailable.');
      }
    },
    [stopHardwareAndSpeech]
  );

  const startWaveformVisualizer = useCallback(async () => {
    // Attempt live microphone FFT stream for real audio waveform reactivity
    if (
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function'
    ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        });
        if (!mountedRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        mediaStreamRef.current = stream;
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const src = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.78;
          src.connect(analyser);
          analyserRef.current = analyser;
          setMicActive(true);
        }
      } catch {
        // Headless or mic-permission-denied fallback stays active cleanly without throwing
        setMicActive(false);
      }
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const renderFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 520;
      const cssH = canvas.clientHeight || 88;
      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssW, cssH);

      let freqData: Uint8Array<ArrayBuffer> | null = null;
      if (analyserRef.current) {
        freqData = new Uint8Array(
          new ArrayBuffer(analyserRef.current.frequencyBinCount)
        );
        analyserRef.current.getByteFrequencyData(freqData);
      }

      phaseTickRef.current += prefersReducedMotion ? 0.2 : 1;
      speechEnergyRef.current = Math.max(0, speechEnergyRef.current * 0.94);

      const currentPhase = phaseRef.current;
      const isActiveWave = currentPhase === 'listening';
      const bars = computeWaveformBars(
        freqData,
        36,
        phaseTickRef.current,
        isActiveWave,
        speechEnergyRef.current
      );

      const gap = 5;
      const barW = Math.max(3, (cssW - gap * (bars.length - 1)) / bars.length);
      const centerY = cssH / 2;

      // Subtle center baseline hairline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, centerY - 0.5, cssW, 1);

      bars.forEach((amp, i) => {
        const x = i * (barW + gap);
        const halfH = Math.max(4, amp * (cssH * 0.44));
        const grad = ctx.createLinearGradient(x, centerY - halfH, x, centerY + halfH);

        if (currentPhase === 'executed') {
          grad.addColorStop(0, '#34d399');
          grad.addColorStop(1, '#06b6d4');
        } else if (currentPhase === 'error' || currentPhase === 'unsupported') {
          grad.addColorStop(0, '#fb7185');
          grad.addColorStop(1, '#f43f5e');
        } else {
          grad.addColorStop(0, '#22d3ee');
          grad.addColorStop(0.5, '#f43f5e');
          grad.addColorStop(1, '#22d3ee');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, centerY - halfH, barW, halfH * 2, barW / 2);
        ctx.fill();
      });

      ctx.restore();
      rafRef.current = requestAnimationFrame(renderFrame);
    };

    rafRef.current = requestAnimationFrame(renderFrame);
  }, []);

  const startVoiceSession = useCallback(() => {
    stopHardwareAndSpeech();
    setTranscript('');
    setManualPhrase('');

    const SpeechRec = getSpeechRecognitionConstructor();
    if (!SpeechRec) {
      setPhase('unsupported');
      setStatusMessage(
        'Web Speech API is unavailable in this browser. Use a preset or enter a phrase below.'
      );
      void startWaveformVisualizer();
      return;
    }

    setPhase('listening');
    setStatusMessage('Listening via Web Speech API — speak your command...');

    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      if (!mountedRef.current) return;
      setPhase('listening');
    };

    recognition.onresult = (event) => {
      if (!mountedRef.current) return;
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const spoken = result[0]?.transcript || '';
        if (result.isFinal) {
          finalTranscript += spoken;
        } else {
          interim += spoken;
        }
      }

      if (interim.trim()) {
        setTranscript(interim.trim());
        speechEnergyRef.current = 0.85;
      }

      if (finalTranscript.trim()) {
        speechEnergyRef.current = 1;
        handleRecognizedTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      if (!mountedRef.current) return;
      const code = event.error;
      if (code === 'aborted') return;

      const friendlyMap: Record<string, string> = {
        'not-allowed':
          'Microphone permission was denied. Allow mic access or choose a command below.',
        'no-speech':
          'No speech detected. Click "Listen Again" or select a command below.',
        'audio-capture':
          'No active microphone found on this device. Choose a voice command below.',
        network:
          'Speech recognition service needs network access. Try a quick command below.'
      };
      setPhase('error');
      setStatusMessage(
        friendlyMap[code] ||
          `Speech recognition error (${code}). Select a command or try again.`
      );
    };

    recognition.onend = () => {
      if (!mountedRef.current) return;
      // Keep error/executed states intact; if ended quietly with interim text, evaluate it
      setPhase((curr) => {
        if (curr === 'listening') {
          setStatusMessage(
            'Listening paused. Click "Listen Again" or run a command below.'
          );
          return 'error';
        }
        return curr;
      });
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setPhase('error');
      setStatusMessage(
        'Could not start speech listener. Click "Listen Again" or select a command below.'
      );
    }

    void startWaveformVisualizer();
  }, [
    handleRecognizedTranscript,
    startWaveformVisualizer,
    stopHardwareAndSpeech
  ]);

  useEffect(() => {
    mountedRef.current = true;
    if (isOpen) {
      startVoiceSession();
    } else {
      stopHardwareAndSpeech();
    }

    return () => {
      mountedRef.current = false;
      stopHardwareAndSpeech();
    };
  }, [isOpen, startVoiceSession, stopHardwareAndSpeech]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPhrase.trim()) return;
    speechEnergyRef.current = 0.9;
    handleRecognizedTranscript(manualPhrase.trim());
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Voice Command Navigation Overlay"
      data-testid="voice-command-overlay"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-[#070A12]/95 border border-white/15 shadow-[0_32px_90px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                phase === 'executed'
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                  : phase === 'error' || phase === 'unsupported'
                  ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                  : 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
              }`}
            >
              {phase === 'executed' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : phase === 'error' || phase === 'unsupported' ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white leading-tight">
                Hands-Free Voice Navigation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
                Active: {activePillarName} · {activeHeadline}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close voice command overlay"
            data-testid="close-voice-overlay-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Waveform & Transcript Area */}
        <div className="p-6 space-y-6">
          {/* Live Audio Waveform Canvas */}
          <div className="rounded-xl bg-black/55 border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-300 flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {phase === 'listening'
                    ? micActive
                      ? 'Live Microphone Spectrum'
                      : 'Listening Wave Active'
                    : phase === 'executed'
                    ? 'Command Executed'
                    : 'Standby'}
                </span>
              </span>
              <span className="font-mono tabular-nums text-slate-400">
                Web Speech API
              </span>
            </div>

            <canvas
              ref={canvasRef}
              data-testid="voice-waveform-canvas"
              className="w-full h-[88px] block"
              aria-label="Real-time voice audio waveform visualizer"
            />

            {/* Live Recognized Transcript / Status */}
            <div className="pt-2 border-t border-white/10 space-y-1">
              <div
                data-testid="voice-transcript-display"
                className="font-display text-base sm:text-lg font-semibold text-white min-h-[28px]"
              >
                {transcript ? `“${transcript}”` : 'Speak a navigation command...'}
              </div>
              <div
                data-testid="voice-status-message"
                className={`text-xs flex items-center gap-1.5 ${
                  phase === 'executed'
                    ? 'text-emerald-300'
                    : phase === 'error' || phase === 'unsupported'
                    ? 'text-amber-300'
                    : 'text-slate-400'
                }`}
              >
                {(phase === 'error' || phase === 'unsupported') && (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            </div>
          </div>

          {/* Retry / Fallback Phrase Form */}
          <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={manualPhrase}
              onChange={(e) => setManualPhrase(e.target.value)}
              placeholder='Type command (e.g. "Go to Aerospace", "Next story")'
              aria-label="Test voice command phrase"
              data-testid="voice-manual-input"
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 focus:border-cyan-400/70 text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="submit"
                data-testid="voice-manual-submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Run Command</span>
              </button>
              <button
                type="button"
                data-testid="voice-listen-again-btn"
                onClick={startVoiceSession}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-display text-xs font-semibold cursor-pointer transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span>Listen Again</span>
              </button>
            </div>
          </form>

          {/* Interactive Voice Command Examples */}
          <div className="space-y-2.5">
            <div className="text-xs font-medium text-slate-400">
              Supported Voice Commands (say aloud or click to trigger):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VOICE_COMMAND_EXAMPLES.map((cmd) => (
                <button
                  key={cmd.phrase}
                  type="button"
                  data-testid={`voice-preset-${cmd.phrase
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                  onClick={() => handleRecognizedTranscript(cmd.phrase)}
                  className="text-left px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-semibold text-white truncate">
                    “{cmd.phrase}”
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {cmd.intentLabel}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
