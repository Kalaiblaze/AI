let activeVoiceToken = 0;
let masterAudioCtx: AudioContext | null = null;
let activeSourceNode: AudioBufferSourceNode | null = null;
let activeHtmlAudio: HTMLAudioElement | null = null;
let segmentTimer: ReturnType<typeof setTimeout> | null = null;
let activeAbortController: AbortController | null = null;
let activePromiseResolver: ((resolved: boolean) => void) | null = null;

export function hardStopVoiceEngine(): void {
  activeVoiceToken++;
  if (activeAbortController) {
    try { activeAbortController.abort(); } catch (_e) {}
    activeAbortController = null;
  }
  if (activePromiseResolver) {
    try { activePromiseResolver(false); } catch (_e) {}
    activePromiseResolver = null;
  }
  if (segmentTimer) {
    clearTimeout(segmentTimer);
    segmentTimer = null;
  }
  if (activeSourceNode) {
    try { activeSourceNode.stop(); } catch (_e) {}
    try { activeSourceNode.disconnect(); } catch (_e) {}
    activeSourceNode = null;
  }
  if (activeHtmlAudio) {
    try {
      activeHtmlAudio.pause();
      activeHtmlAudio.src = '';
    } catch (_e) {}
    activeHtmlAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (_e) {}
  }
}

// Backward-compatible aliases
export const stopNewsAnchorSpeech = hardStopVoiceEngine;
export const stopCrystalClearBriefing = hardStopVoiceEngine;

export interface StoryVoiceInput {
  id?: string;
  pillar?: string;
  pillarId?: string;
  title?: string;
  headline?: string;
  emotion?: 'CRISIS' | 'TENSION' | 'BREAKTHROUGH' | string;
  sourceBadge?: string;
  analogy?: string;
  summary?: string;
  englishSummary?: string;
  thunglishAnalogy?: string | string[];
  failureAutopsy?: string;
  presentTrigger?: string;
  futureImpact?: string;
  winnerStrategy?: string;
  titanTakeaway?: string;
  simpleDecodes?: Array<{ everydayMeaning?: string; whyItMattersToYou?: string }>;
  tamilSegments?: Array<{ stepIndex: number; emotion: string; label: string; text: string }>;
  tamilSummary?: string;
}

// Automatically generates a 4-part authentic Tamil News Reader script (தமிழ்) for any story
export async function buildSynchronizedTamilNewsScript(story: StoryVoiceInput): Promise<Array<{ stepIndex: number; emotion: string; label: string; text: string }>> {
  if (story.tamilSegments && Array.isArray(story.tamilSegments) && story.tamilSegments.length === 4) {
    return story.tamilSegments;
  }

  const pillarTamilMap: Record<string, string> = {
    'Economics & Money': 'பொருளாதாரம் மற்றும் நிதித்துறை',
    'Geopolitics': 'உலக அரசியல் மற்றும் வர்த்தகம்',
    'Defence': 'பாதுகாப்பு மற்றும் ராணுவத் தொழில்நுட்பம்',
    'Aerospace': 'விண்வெளி ஆராய்ச்சி மற்றும் ஏரோஸ்பேஸ்',
    'Tech & Embedded': 'செமிகண்டக்டர் மற்றும் எம்படெட் தொழில்நுட்பம்'
  };
  const tamilPillar = pillarTamilMap[story.pillar || ''] || story.pillar || 'செய்திப் பிரிவு';

  // Secure Backend Proxy Call for Tamil Broadcast generation
  try {
    const controller = new AbortController();
    activeAbortController = controller;

    const res = await fetch('/api/voice-anchor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        headline: story.title || story.headline || '',
        emotion: story.emotion || 'TENSION',
        pillar: story.pillar || story.pillarId || 'MONEY',
        scriptText: `Story Title: ${story.title || story.headline}. Summary: ${story.summary || story.analogy}`,
        voiceName: story.emotion === 'CRISIS' ? 'Kore' : 'Aoede'
      }),
      signal: controller.signal
    });

    if (res.ok) {
      const data = await res.json();
      if (data.tamilSegments && Array.isArray(data.tamilSegments) && data.tamilSegments.length === 4) {
        story.tamilSegments = data.tamilSegments;
        return data.tamilSegments;
      }
    }
  } catch (_e) {
    // Fallback to robust deterministic template
  } finally {
    if (activeAbortController) activeAbortController = null;
  }

  return [
    {
      stepIndex: 0,
      emotion: story.emotion === 'CRISIS' ? 'ANGRY_TAMIL' : 'HEADLINE_TAMIL',
      label: '🔴 முக்கியச் செய்தி (BREAKING LEAD)',
      text: `வணக்கம். ${tamilPillar} பிரிவில் ஒரு முக்கியச் செய்தி. ${story.title || story.headline || 'உலகளாவிய தொழில்நுட்ப மாற்றம்.'}`
    },
    {
      stepIndex: 1,
      emotion: 'CLEAR_TAMIL',
      label: '⚡ எளிய விளக்கம் (CORE DECODE)',
      text: `இதன் முக்கியப் பின்னணி என்னவென்றால், ${story.tamilSummary || story.summary || 'இந்த நிகழ்வு உலகளாவிய விநியோகச் சங்கிலி மற்றும் தொழில்நுட்பக் கட்டமைப்பில் நேரடி மாற்றத்தைக் கொண்டுவருகிறது.'}`
    },
    {
      stepIndex: 2,
      emotion: 'ANGRY_TAMIL',
      label: '🔥 முக்கியக் குறைபாடு (CRITICAL FLAW)',
      text: `இதில் உள்ள மிகப்பெரிய ஆபத்து என்னவென்றால், மாற்று ஏற்பாடு இல்லாமல் ஒரே ஒரு சிஸ்டத்தை மட்டும் நம்பியிருந்த பழைய கட்டமைப்புகள் தோல்வியடைந்துள்ளன.`
    },
    {
      stepIndex: 3,
      emotion: 'VERDICT_TAMIL',
      label: '🏆 அடுத்தகட்ட நகர்வு (FUTURE SHIFT)',
      text: `இதன் அடுத்தகட்ட விளைவாக, அதிநவீன பாதுகாப்பு மற்றும் சுயசார்பு தொழில்நுட்பத்தைக் கொண்ட நிறுவனங்கள் மட்டுமே இந்தப் போட்டியில் வெற்றிபெறும்.`
    }
  ];
}

// 4-Stage Studio Vocal Clarity EQ for crisp Tamil retroflex consonants (ழ, ள, ற, த, க)
function createTamilVocalClarityEQ(ctx: AudioContext): AudioNode {
  const highPass = ctx.createBiquadFilter();
  highPass.type = 'highpass';
  highPass.frequency.value = 115;

  const deMud = ctx.createBiquadFilter();
  deMud.type = 'peaking';
  deMud.frequency.value = 250;
  deMud.Q.value = 1.2;
  deMud.gain.value = -4.0;

  const tamilClarityBoost = ctx.createBiquadFilter();
  tamilClarityBoost.type = 'peaking';
  tamilClarityBoost.frequency.value = 3600;
  tamilClarityBoost.Q.value = 1.0;
  tamilClarityBoost.gain.value = 6.0;

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -20;
  compressor.ratio.value = 4;

  highPass.connect(deMud);
  deMud.connect(tamilClarityBoost);
  tamilClarityBoost.connect(compressor);
  compressor.connect(ctx.destination);
  return highPass;
}

// Robust WAV vs Raw PCM Audio Decoding & Secure Backend TTS Proxy
async function decodeAndPlayAudio(base64Data: string, myToken: number, onEnded?: () => void): Promise<boolean> {
  if (myToken !== activeVoiceToken) return false;
  try {
    if (!masterAudioCtx || masterAudioCtx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      masterAudioCtx = new AudioCtx();
    }
    if (masterAudioCtx.state === 'suspended') {
      await masterAudioCtx.resume();
    }

    const binaryString = window.atob(base64Data);
    const byteLength = binaryString.length;
    const bytes = new Uint8Array(byteLength);
    for (let i = 0; i < byteLength; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Inspect header for WAV vs raw PCM16
    const headerStr = byteLength > 4 ? String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) : '';
    let audioBuffer: AudioBuffer;

    if (headerStr === 'RIFF') {
      const arrayBufferCopy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
      audioBuffer = await masterAudioCtx.decodeAudioData(arrayBufferCopy);
    } else {
      const sampleCount = Math.floor(byteLength / 2);
      const int16View = new DataView(bytes.buffer);
      audioBuffer = masterAudioCtx.createBuffer(1, Math.max(1, sampleCount), 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < sampleCount; i++) {
        channelData[i] = int16View.getInt16(i * 2, true) / 32768.0;
      }
    }

    return await new Promise<boolean>((resolve) => {
      if (myToken !== activeVoiceToken) return resolve(false);
      activePromiseResolver = resolve;

      const source = masterAudioCtx!.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = 1.0;
      source.connect(createTamilVocalClarityEQ(masterAudioCtx!));
      activeSourceNode = source;

      source.onended = () => {
        activePromiseResolver = null;
        if (myToken === activeVoiceToken && onEnded) onEnded();
        resolve(true);
      };
      source.start(0);
    });
  } catch (_e) {
    return false;
  }
}

// TIER 1: Secure Backend Proxy TTS call
async function tryPlayGeminiTamilSegment(segment: { text: string; emotion: string }, myToken: number): Promise<boolean> {
  if (myToken !== activeVoiceToken) return false;
  try {
    const controller = new AbortController();
    activeAbortController = controller;

    const res = await fetch('/api/voice-anchor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        headline: segment.text,
        emotion: segment.emotion === 'ANGRY_TAMIL' ? 'CRISIS' : 'TENSION',
        pillar: 'TECH',
        scriptText: segment.text,
        voiceName: segment.emotion === 'ANGRY_TAMIL' ? 'Kore' : 'Aoede'
      }),
      signal: controller.signal
    });

    if (!res.ok) return false;
    const data = await res.json();
    if (myToken !== activeVoiceToken || !data.audioBase64) return false;

    return await decodeAndPlayAudio(data.audioBase64, myToken);
  } catch (_e) {
    return false;
  } finally {
    if (activeAbortController) activeAbortController = null;
  }
}

// TIER 2: Google Official ta-IN Neural Tamil Broadcast Stream
function tryPlayGoogleTaInNeuralStream(text: string, speedRate: number, myToken: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (myToken !== activeVoiceToken) return resolve(true);
    const chunks = text.match(/.{1,180}(?:\s|$)/g) || [text];
    let cIdx = 0;

    function playNextChunk() {
      if (myToken !== activeVoiceToken || cIdx >= chunks.length) {
        return resolve(true);
      }
      try {
        const q = encodeURIComponent(chunks[cIdx].trim());
        const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=ta-IN&client=tw-ob&q=${q}`;
        const audio = new Audio(url);
        audio.playbackRate = Math.min(1.0, Math.max(0.82, speedRate));
        activeHtmlAudio = audio;

        audio.onended = () => {
          cIdx++;
          segmentTimer = setTimeout(playNextChunk, 320);
        };
        audio.onerror = () => {
          resolve(false);
        };
        audio.play().catch(() => resolve(false));
      } catch (_e) {
        resolve(false);
      }
    }

    playNextChunk();
  });
}

// TIER 3: Browser Speech Synthesis with ta-IN lang
function tryPlayBrowserTamilSynthesis(text: string, speedRate: number, myToken: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (myToken !== activeVoiceToken || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return resolve(true);
    }

    try {
      const voices = window.speechSynthesis.getVoices();
      const tamilVoice = voices.find(v => /ta-IN|Tamil/i.test(v.lang) || /ta/i.test(v.lang)) || voices[0];

      const utter = new SpeechSynthesisUtterance(text);
      if (tamilVoice) utter.voice = tamilVoice;
      utter.lang = 'ta-IN';
      utter.rate = Math.min(0.9, Math.max(0.75, speedRate));
      utter.pitch = 1.0;

      utter.onend = () => {
        if (myToken === activeVoiceToken) resolve(true);
      };
      utter.onerror = () => {
        if (myToken === activeVoiceToken) resolve(false);
      };

      window.speechSynthesis.speak(utter);
    } catch (_e) {
      resolve(false);
    }
  });
}

export async function startOrSwitchStoryVoice(
  story: StoryVoiceInput,
  userRate = 0.82,
  onSubtitleUpdate?: (subtitle: string, tone?: string) => void,
  onStateChange?: (speaking: boolean) => void,
  onStepChange?: (stepIndex: number) => void
): Promise<void> {
  if (!story) return;
  hardStopVoiceEngine();
  const myToken = ++activeVoiceToken;
  if (onStateChange) onStateChange(true);

  try {
    if (onSubtitleUpdate) {
      onSubtitleUpdate('🎙️ தமிழ் செய்தித் தொகுப்பு தயாரிப்பு...', 'HEADLINE_TAMIL');
    }

    const segments = await buildSynchronizedTamilNewsScript(story);

    for (let i = 0; i < segments.length; i++) {
      if (myToken !== activeVoiceToken) break;
      const seg = segments[i];

      if (onStepChange) {
        onStepChange(i);
      }

      if (onSubtitleUpdate) {
        onSubtitleUpdate(`[${seg.label}] ${seg.text}`, seg.emotion);
      }

      // Try Tier 1: Secure Backend Proxy Gemini Audio
      let played = await tryPlayGeminiTamilSegment(seg, myToken);
      if (myToken !== activeVoiceToken) break;

      // If Tier 1 failed, try Tier 2: Google ta-IN Neural Stream
      if (!played) {
        played = await tryPlayGoogleTaInNeuralStream(seg.text, userRate, myToken);
      }
      if (myToken !== activeVoiceToken) break;

      // If Tier 2 failed, try Tier 3: Browser Speech Synthesis
      if (!played) {
        await tryPlayBrowserTamilSynthesis(seg.text, userRate, myToken);
      }

      // Natural breath pause between segments
      if (myToken === activeVoiceToken) {
        await new Promise<void>((r) => {
          segmentTimer = setTimeout(r, 600);
        });
      }
    }
  } catch (_e) {
    // Graceful catch
  } finally {
    if (myToken === activeVoiceToken && onStateChange) {
      onStateChange(false);
    }
  }
}

/**
 * Drop-in wrapper that seamlessly bridges playLiveNewsAnchorBriefing to the Tamil News Reader engine.
 */
export async function playLiveNewsAnchorBriefing(
  story: StoryVoiceInput,
  options?: {
    onSubtitleChange?: (stageDirection: string, text: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  }
): Promise<void> {
  const { onSubtitleChange, onStart, onEnd } = options || {};

  await startOrSwitchStoryVoice(
    story,
    0.82,
    (sub, tone) => {
      if (onSubtitleChange) {
        const parts = sub.match(/^(\[[^\]]+\])\s*(.*)$/);
        if (parts) {
          onSubtitleChange(parts[1], parts[2]);
        } else {
          onSubtitleChange(`[${tone || 'தமிழ் செய்தி'}]`, sub);
        }
      }
    },
    (speaking) => {
      if (speaking && onStart) onStart();
      if (!speaking && onEnd) onEnd();
    }
  );
}

/**
 * Backward-compatible drop-in for speakEmotionalNewsAnchor.
 */
export function speakEmotionalNewsAnchor(
  story: StoryVoiceInput,
  onSubtitleChange?: (stageDirection: string, text: string) => void,
  onComplete?: () => void
): void {
  void playLiveNewsAnchorBriefing(story, {
    onSubtitleChange,
    onEnd: onComplete
  });
}
