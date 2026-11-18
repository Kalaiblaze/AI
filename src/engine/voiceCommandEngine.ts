import { NeatPillarId, NEAT_PILLARS } from './nexusNeatEngine';

export type VoiceNavViewTarget =
  | 'XRAY'
  | 'MIND_MAP'
  | 'DOJO'
  | 'THEATER'
  | 'MENTOR'
  | 'ANCHOR_PLAY'
  | 'ANCHOR_STOP';

export type VoiceCommandAction =
  | {
      type: 'NAVIGATE_PILLAR';
      pillarId: NeatPillarId;
      matchedPhrase: string;
      description: string;
    }
  | {
      type: 'NAVIGATE_HOME';
      matchedPhrase: string;
      description: string;
    }
  | {
      type: 'NEXT_STORY';
      matchedPhrase: string;
      description: string;
    }
  | {
      type: 'PREVIOUS_STORY';
      matchedPhrase: string;
      description: string;
    }
  | {
      type: 'SELECT_STORY_INDEX';
      index: number;
      matchedPhrase: string;
      description: string;
    }
  | {
      type: 'SELECT_STORY_BY_KEYWORD';
      storyId: string;
      headline: string;
      matchedPhrase: string;
      description: string;
    }
  | {
      type: 'OPEN_VIEW';
      view: VoiceNavViewTarget;
      matchedPhrase: string;
      description: string;
    }
  | {
      type: 'UNKNOWN';
      transcript: string;
      description: string;
    };

export interface VoiceStoryCandidate {
  id: string;
  headline: string;
  pillarId: NeatPillarId;
}

export const VOICE_COMMAND_EXAMPLES: {
  phrase: string;
  intentLabel: string;
}[] = [
  { phrase: 'Next story', intentLabel: 'Cycle forward' },
  { phrase: 'Previous story', intentLabel: 'Step backward' },
  { phrase: 'Go to Aerospace', intentLabel: 'Space & Orbit' },
  { phrase: 'Go to Defence', intentLabel: 'Autonomous Tech' },
  { phrase: 'Open Tech', intentLabel: 'Linux & Silicon' },
  { phrase: 'Show Money', intentLabel: 'Macro & Gold' },
  { phrase: 'Geopolitics', intentLabel: 'Trade & Chips' },
  { phrase: 'Open X-Ray', intentLabel: 'Spatial HUD' }
];

const PILLAR_SYNONYMS: { pillarId: NeatPillarId; patterns: RegExp[] }[] = [
  {
    pillarId: 'AEROSPACE',
    patterns: [
      /\baerospace\b/,
      /\bspace\b/,
      /\bstarship\b/,
      /\borbit(?:al)?\b/,
      /\bsatellite\b/,
      /\brocket\b/
    ]
  },
  {
    pillarId: 'DEFENCE',
    patterns: [
      /\bdefen[cs]e\b/,
      /\bmilitary\b/,
      /\bdrone(?:s)?\b/,
      /\blaser(?:s)?\b/,
      /\bwarfare\b/,
      /\bmissile\b/
    ]
  },
  {
    pillarId: 'GEOPOLITICS',
    patterns: [
      /\bgeopolitics\b/,
      /\bdiplomacy\b/,
      /\btariff(?:s)?\b/,
      /\btrade\b/,
      /\bcorridor\b/,
      /\bimec\b/,
      /\bworld\b/
    ]
  },
  {
    pillarId: 'MONEY',
    patterns: [
      /\bmoney\b/,
      /\beconom(?:y|ics)\b/,
      /\bfinance\b/,
      /\bgold\b/,
      /\btreasury\b/,
      /\bdebt\b/,
      /\bbank(?:s)?\b/
    ]
  },
  {
    pillarId: 'TECH',
    patterns: [
      /\btech(?:nology)?\b/,
      /\bembedded\b/,
      /\bsilicon\b/,
      /\bsemiconductor\b/,
      /\bv4l2\b/,
      /\blinux\b/,
      /\bchip(?:s)?\b/
    ]
  }
];

const ORDINAL_MAP: Record<string, number> = {
  one: 0,
  '1': 0,
  first: 0,
  two: 1,
  '2': 1,
  second: 1,
  three: 2,
  '3': 2,
  third: 2,
  four: 3,
  '4': 3,
  fourth: 3,
  five: 4,
  '5': 4,
  fifth: 4
};

export function parseVoiceCommand(
  rawTranscript: string,
  stories: VoiceStoryCandidate[] = []
): VoiceCommandAction {
  const cleaned = (rawTranscript || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return {
      type: 'UNKNOWN',
      transcript: '',
      description: 'No speech detected. Speak a pillar, story, or view command.'
    };
  }

  // 1. Story traversal (Next / Previous)
  if (
    /\b(next|forward|skip|following)\b/.test(cleaned) &&
    !/\bpillar\b/.test(cleaned)
  ) {
    return {
      type: 'NEXT_STORY',
      matchedPhrase: rawTranscript.trim(),
      description: 'Advanced to next intelligence story'
    };
  }

  if (/\b(previous|prev|back|earlier|last)\b/.test(cleaned)) {
    return {
      type: 'PREVIOUS_STORY',
      matchedPhrase: rawTranscript.trim(),
      description: 'Stepped back to previous intelligence story'
    };
  }

  // 2. Ordinal story selection ("story 2", "open second story", "first headline")
  const storyOrdinalMatch =
    cleaned.match(/\b(?:story|headline|card|item)\s+(one|two|three|four|five|1|2|3|4|5)\b/) ||
    cleaned.match(/\b(first|second|third|fourth|fifth)\s+(?:story|headline|card|item)\b/);

  if (storyOrdinalMatch) {
    const token = storyOrdinalMatch[1];
    const index = ORDINAL_MAP[token];
    if (typeof index === 'number') {
      return {
        type: 'SELECT_STORY_INDEX',
        index,
        matchedPhrase: rawTranscript.trim(),
        description: `Selected story #${index + 1}`
      };
    }
  }

  // 3. View & Audio Controls
  if (/\b(stop|mute|silence|quiet)\b/.test(cleaned)) {
    return {
      type: 'OPEN_VIEW',
      view: 'ANCHOR_STOP',
      matchedPhrase: rawTranscript.trim(),
      description: 'Stopped live voice anchor playback'
    };
  }

  if (/\b(listen|read aloud|speak|anchor|brief me)\b/.test(cleaned)) {
    return {
      type: 'OPEN_VIEW',
      view: 'ANCHOR_PLAY',
      matchedPhrase: rawTranscript.trim(),
      description: 'Started live news anchor voice briefing'
    };
  }

  if (/\b(x\s*-?\s*ray|xray|spatial|hud)\b/.test(cleaned)) {
    return {
      type: 'OPEN_VIEW',
      view: 'XRAY',
      matchedPhrase: rawTranscript.trim(),
      description: 'Navigated to Spatial X-Ray Breakdown'
    };
  }

  if (/\b(mind\s*map|domino|causal|graph)\b/.test(cleaned)) {
    return {
      type: 'OPEN_VIEW',
      view: 'MIND_MAP',
      matchedPhrase: rawTranscript.trim(),
      description: 'Navigated to Mind Map View'
    };
  }

  if (/\b(dojo|titan|winner|autopsy|failure)\b/.test(cleaned)) {
    return {
      type: 'OPEN_VIEW',
      view: 'DOJO',
      matchedPhrase: rawTranscript.trim(),
      description: 'Navigated to Titan vs. Failure Dojo'
    };
  }

  if (/\b(theater|visual briefing|video)\b/.test(cleaned)) {
    return {
      type: 'OPEN_VIEW',
      view: 'THEATER',
      matchedPhrase: rawTranscript.trim(),
      description: 'Opened Visual Briefing Theater'
    };
  }

  if (/\b(mentor|carbon mentor|ask ai|chat)\b/.test(cleaned)) {
    return {
      type: 'OPEN_VIEW',
      view: 'MENTOR',
      matchedPhrase: rawTranscript.trim(),
      description: 'Opened Carbon Mentor drawer'
    };
  }

  // 4. Explicit Home navigation
  if (/\b(home|all pillars|reset view|top|overview)\b/.test(cleaned)) {
    return {
      type: 'NAVIGATE_HOME',
      matchedPhrase: rawTranscript.trim(),
      description: 'Returned to Home All-Pillar view'
    };
  }

  // 5. Story headline keyword match if user asks for a specific story topic
  if (stories.length > 0 && /\b(story|article|report|about)\b/.test(cleaned)) {
    const queryWords = cleaned
      .replace(/\b(open|show|go to|switch to|select|read|story|article|report|about|the|on)\b/g, ' ')
      .trim()
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    if (queryWords.length > 0) {
      let bestStory: VoiceStoryCandidate | null = null;
      let bestScore = 0;
      for (const st of stories) {
        const lowerH = st.headline.toLowerCase();
        let score = 0;
        for (const word of queryWords) {
          if (lowerH.includes(word)) score += 1;
        }
        if (score > bestScore) {
          bestScore = score;
          bestStory = st;
        }
      }
      if (bestStory && bestScore > 0) {
        return {
          type: 'SELECT_STORY_BY_KEYWORD',
          storyId: bestStory.id,
          headline: bestStory.headline,
          matchedPhrase: rawTranscript.trim(),
          description: `Opened story: ${bestStory.headline}`
        };
      }
    }
  }

  // 6. Direct 5-pillar navigation
  for (const entry of PILLAR_SYNONYMS) {
    if (entry.patterns.some((rx) => rx.test(cleaned))) {
      const label = NEAT_PILLARS[entry.pillarId].shortName;
      return {
        type: 'NAVIGATE_PILLAR',
        pillarId: entry.pillarId,
        matchedPhrase: rawTranscript.trim(),
        description: `Switched to ${label} pillar`
      };
    }
  }

  // 7. Fuzzy story headline match even without "story" keyword
  if (stories.length > 0) {
    const words = cleaned
      .replace(/\b(open|show|go to|switch to|select|find|the|to|in)\b/g, ' ')
      .trim()
      .split(/\s+/)
      .filter((w) => w.length >= 4);

    if (words.length > 0) {
      let bestStory: VoiceStoryCandidate | null = null;
      let bestScore = 0;
      for (const st of stories) {
        const lowerH = st.headline.toLowerCase();
        let score = 0;
        for (const w of words) {
          if (lowerH.includes(w)) score += 1;
        }
        if (score > bestScore) {
          bestScore = score;
          bestStory = st;
        }
      }
      if (bestStory && bestScore > 0) {
        return {
          type: 'SELECT_STORY_BY_KEYWORD',
          storyId: bestStory.id,
          headline: bestStory.headline,
          matchedPhrase: rawTranscript.trim(),
          description: `Opened story: ${bestStory.headline}`
        };
      }
    }
  }

  return {
    type: 'UNKNOWN',
    transcript: rawTranscript.trim(),
    description: `Unrecognized command "${rawTranscript.trim()}". Try "Next story", "Switch to Aerospace", or "Open X-Ray".`
  };
}

export function getNextStoryId(
  stories: { id: string }[],
  currentId: string,
  direction: 'next' | 'prev'
): string | null {
  if (!stories || stories.length === 0) return null;
  const idx = stories.findIndex((s) => s.id === currentId);
  const safeIdx = idx === -1 ? 0 : idx;
  const nextIdx =
    direction === 'next'
      ? (safeIdx + 1) % stories.length
      : (safeIdx - 1 + stories.length) % stories.length;
  return stories[nextIdx]?.id || null;
}

export function computeWaveformBars(
  frequencyData: ArrayLike<number> | null,
  barCount: number,
  phaseTick: number,
  isListening: boolean,
  speechEnergy = 0
): number[] {
  const count = Math.max(8, barCount);
  const bars: number[] = [];

  for (let i = 0; i < count; i++) {
    // Symmetric taper so center bars naturally feel responsive like a voice equalizer
    const centerDist = Math.abs(i - (count - 1) / 2) / ((count - 1) / 2);
    const envelope = Math.max(0.25, 1 - centerDist * 0.65);

    if (frequencyData && frequencyData.length > 0 && isListening) {
      const binIdx = Math.min(
        frequencyData.length - 1,
        Math.floor((i / count) * (frequencyData.length * 0.75))
      );
      const rawVal = (frequencyData[binIdx] || 0) / 255;
      // Blend gentle floor ambient wave with live microphone FFT energy
      const waveFloor =
        0.12 +
        Math.abs(Math.sin(phaseTick * 0.14 + i * 0.45)) *
          (0.14 + speechEnergy * 0.35);
      const amplitude = Math.min(
        1,
        Math.max(0.1, Math.max(rawVal * 1.15, waveFloor) * envelope)
      );
      bars.push(Number(amplitude.toFixed(3)));
    } else if (isListening) {
      const wave =
        0.18 +
        Math.abs(Math.sin(phaseTick * 0.18 + i * 0.5)) *
          (0.28 + speechEnergy * 0.55) +
        Math.abs(Math.cos(phaseTick * 0.11 - i * 0.3)) * 0.16;
      const amplitude = Math.min(1, Math.max(0.1, wave * envelope));
      bars.push(Number(amplitude.toFixed(3)));
    } else {
      bars.push(0.1);
    }
  }

  return bars;
}
