// Clean, zero-jargon Thunglish voiceover player (Server Gemini 3.8 TTS WAV + Web Speech fallback)

const clientAudioCache = new Map<string, string>();
let activeHtmlAudio: HTMLAudioElement | null = null;
let currentPlayToken = 0;

/**
 * Strips emoji flags/icons and expands technical symbols into smooth spoken words
 * so TTS pronounces Thunglish (Romanized Tamil + English) clearly and naturally.
 */
export function prepareSpokenThunglishText(rawText: string): string {
  return rawText
    .replace(/➔|→/g, ' to ')
    // Remove emoji flags and decorative symbols
    .replace(
      /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ''
    )
    .replace(/\$([0-9.]+)T\b/gi, '$1 Trillion Dollars')
    .replace(/\$([0-9.]+)B\/mo\b/gi, '$1 Billion Dollars per month')
    .replace(/\$([0-9.]+)B\b/gi, '$1 Billion Dollars')
    .replace(/\$([0-9.]+)M\b/gi, '$1 Million Dollars')
    .replace(/\$([0-9,]+)\/kg\b/gi, '$1 Dollars per kilogram')
    .replace(/\$([0-9.,]+)\/shot\b/gi, '$1 Dollars per shot')
    .replace(/\$([0-9,]+)/g, '$1 Dollars')
    .replace(/([0-9.]+)%/g, '$1 percent')
    .replace(/\b2nm\b/gi, '2 nanometer')
    .replace(/\b1\.6T\b/gi, '1.6 Terabits')
    .replace(/\bVLEO\b/g, 'Very Low Earth Orbit')
    .replace(/\bEUV\b/g, 'E U V laser')
    .replace(/\bIMEC\b/g, 'India Middle East Europe Corridor')
    .replace(/\bRBI\b/g, 'R B I')
    .replace(/\bISRO\b/g, 'ISRO')
    .replace(/\bDRDO\b/g, 'D R D O')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stopActiveThunglishVoice(): void {
  currentPlayToken += 1;
  if (activeHtmlAudio) {
    try {
      activeHtmlAudio.pause();
      activeHtmlAudio.currentTime = 0;
    } catch {
      // ignore
    }
    activeHtmlAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

function speakWithBrowserFemaleVoice(
  spokenText: string,
  token: number,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    const voices = window.speechSynthesis.getVoices();

    // Prefer South Indian / Indian English female voices first, then clear female English voices
    const preferredVoice =
      voices.find(
        (v) =>
          (v.lang.includes('ta-IN') || v.lang.includes('en-IN')) &&
          /female|heera|veena|lekha|priya|kalyani|google|siri|zoya/i.test(
            v.name
          )
      ) ||
      voices.find(
        (v) => v.lang.includes('en-IN') || v.lang.includes('ta-IN')
      ) ||
      voices.find((v) =>
        /female|samantha|victoria|karen|moira|tessa|aria|jenny|google uk english female/i.test(
          v.name
        )
      ) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    } else {
      utterance.lang = 'en-IN';
    }

    // Crisp, poised, clear diction
    utterance.rate = 0.96;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (token === currentPlayToken) onStart?.();
    };
    utterance.onend = () => {
      if (token === currentPlayToken) onEnd?.();
    };
    utterance.onerror = () => {
      if (token === currentPlayToken) onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
  }
}

export async function playThunglishVoiceover(
  rawText: string,
  cacheKey: string,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
  }
): Promise<void> {
  stopActiveThunglishVoice();
  const token = currentPlayToken;
  const spokenText = prepareSpokenThunglishText(rawText);

  if (!spokenText) {
    options?.onEnd?.();
    return;
  }

  // 1. Check client WAV cache first
  const cachedDataUrl = clientAudioCache.get(cacheKey);
  if (cachedDataUrl && typeof Audio !== 'undefined') {
    try {
      const audio = new Audio(cachedDataUrl);
      activeHtmlAudio = audio;
      audio.onplay = () => {
        if (token === currentPlayToken) options?.onStart?.();
      };
      audio.onended = () => {
        if (token === currentPlayToken) options?.onEnd?.();
      };
      audio.onerror = () => {
        if (token === currentPlayToken) {
          speakWithBrowserFemaleVoice(
            spokenText,
            token,
            options?.onStart,
            options?.onEnd
          );
        }
      };
      await audio.play();
      return;
    } catch {
      // Fallback to browser speech if autoplay blocked
    }
  }

  // 2. Request server-side Gemini 3.8 TTS WAV synthesis
  try {
    const res = await fetch('/api/tts-briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: spokenText, cacheKey }),
      signal: AbortSignal.timeout(6500)
    });

    if (token !== currentPlayToken) return;

    if (res.ok) {
      const data = await res.json();
      if (data?.audioBase64 && typeof Audio !== 'undefined') {
        const dataUrl = `data:audio/wav;base64,${data.audioBase64}`;
        clientAudioCache.set(cacheKey, dataUrl);
        const audio = new Audio(dataUrl);
        activeHtmlAudio = audio;
        audio.onplay = () => {
          if (token === currentPlayToken) options?.onStart?.();
        };
        audio.onended = () => {
          if (token === currentPlayToken) options?.onEnd?.();
        };
        audio.onerror = () => {
          if (token === currentPlayToken) {
            speakWithBrowserFemaleVoice(
              spokenText,
              token,
              options?.onStart,
              options?.onEnd
            );
          }
        };
        await audio.play();
        return;
      }
    }
  } catch {
    // Proceed to instant browser female voice fallback
  }

  if (token === currentPlayToken) {
    speakWithBrowserFemaleVoice(
      spokenText,
      token,
      options?.onStart,
      options?.onEnd
    );
  }
}
