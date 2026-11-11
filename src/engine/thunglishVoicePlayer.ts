// Crystal-Clear Voice Briefing Engine (Linux/Desktop/Mobile Browser TTS Optimization)

declare global {
  interface Window {
    __futifyAudioCtx?: AudioContext;
  }
}

/**
 * Strips emoji flags/icons and expands technical symbols into smooth spoken words
 * so TTS pronounces technical terms, abbreviations, and units clearly.
 */
export function prepareSpokenThunglishText(rawText: string): string {
  return rawText
    .replace(/➔|->/g, ' to ')
    .replace(/\/\/|—|\||•|\*/g, ', ')
    .replace(/\$(\d+(\.\d+)?)T\b/gi, '$1 Trillion Dollars')
    .replace(/\$(\d+(\.\d+)?)B\b/gi, '$1 Billion Dollars')
    .replace(/\$(\d+(\.\d+)?)M\b/gi, '$1 Million Dollars')
    .replace(/([0-9.]+)%/g, '$1 percent')
    .replace(/\b2nm\b/gi, '2 nanometer')
    .replace(/\bV4L2\b/gi, 'Video for Linux 2')
    .replace(/\bMIPI CSI-2\b/gi, 'M I P I Camera Serial Interface')
    .replace(/\bDMA-BUF\b/gi, 'D M A Buffer')
    .replace(
      /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Stops any active speech synthesis briefing immediately.
 */
export function stopCrystalClearBriefing(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function stopActiveThunglishVoice(): void {
  stopCrystalClearBriefing();
}

/**
 * RULE 2: CRYSTAL-CLEAR VOICE BRIEFING ENGINE
 * Delivers 100% crisp, natural, articulated speech without stuttering or cutoff.
 */
export function speakCrystalClearBriefing(
  rawText: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  // 1. Stop any overlapping speech or background Web Audio immediately
  window.speechSynthesis.cancel();
  if (window.__futifyAudioCtx && window.__futifyAudioCtx.state === 'running') {
    void window.__futifyAudioCtx.suspend().catch(() => {});
  }

  // 2. Sanitize text so TTS never reads symbols, slashes, or emojis out loud
  const cleanText = rawText
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
    .replace(/\/\/|➔|->|—|\||•|\*/g, ', ') // replace symbols with natural pauses
    .replace(/\$(\d+(\.\d+)?)T\b/gi, '$1 trillion dollars')
    .replace(/\$(\d+(\.\d+)?)B\b/gi, '$1 billion dollars')
    .replace(/\bV4L2\b/gi, 'Video for Linux 2')
    .replace(/\bMIPI CSI-2\b/gi, 'M I P I Camera Serial Interface')
    .replace(/\bDMA-BUF\b/gi, 'D M A Buffer')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  // 3. Split into clean sentence chunks so browser TTS never stutters or cuts off
  const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find(
      (v) =>
        /Google US English|Google UK English|Natural|en-IN|en-GB|en-US/i.test(
          v.name
        ) && v.localService === false
    ) ||
    voices.find((v) => /en-IN|en-US|en-GB/i.test(v.lang)) ||
    voices[0];

  let index = 0;
  if (onStart) onStart();

  function speakNextSentence(): void {
    if (index >= sentences.length) {
      if (onEnd) onEnd();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.92; // Slightly slower for crisp articulation
    utterance.pitch = 1.0; // Natural human pitch
    utterance.volume = 1.0; // Full clear volume

    utterance.onend = () => {
      index++;
      speakNextSentence();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };
    window.speechSynthesis.speak(utterance);
  }

  speakNextSentence();
}

/**
 * Drop-in wrapper for playThunglishVoiceover backed by speakCrystalClearBriefing.
 */
export async function playThunglishVoiceover(
  rawText: string,
  _cacheKey?: string,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
  }
): Promise<void> {
  speakCrystalClearBriefing(rawText, options?.onStart, options?.onEnd);
}
