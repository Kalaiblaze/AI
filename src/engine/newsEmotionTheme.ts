import { NeatPillarId, NeatPillarData } from './nexusNeatEngine';

export type NewsEmotionId =
  | 'CAUTION_SHOCK'
  | 'STRATEGIC_REALIGNMENT'
  | 'CRITICAL_ALERT'
  | 'BREAKTHROUGH_GROWTH'
  | 'DEEP_TECH_PRECISION';

export interface NewsEmotionTheme {
  id: NewsEmotionId;
  badgeLabel: string;
  shortLabel: string;
  emoji: string;
  emotionSummary: string;
  intensityScore: number;
  accentHex: string;
  pageBgHex: string;
  topAuraGradient: string;
  stageBorderClass: string;
  stageGlowClass: string;
  decodeLeftBorderClass: string;
  accentTextClass: string;
  badgeClass: string;
  progressBarGradient: string;
  activeTabClass: string;
  orbBgClass: string;
  primaryButtonClass: string;
}

export const NEWS_EMOTION_THEMES: Record<NewsEmotionId, NewsEmotionTheme> = {
  CAUTION_SHOCK: {
    id: 'CAUTION_SHOCK',
    badgeLabel: '🟠 MACRO CAUTION & RATE SHOCK',
    shortLabel: '🟠 Macro Caution',
    emoji: '🟠',
    emotionSummary: 'Sovereign debt pressure, interest rate shock, & gold hedging',
    intensityScore: 82,
    accentHex: '#F59E0B',
    pageBgHex: '#0C0904',
    topAuraGradient:
      'radial-gradient(ellipse 85% 55% at 50% -8%, rgba(245, 158, 11, 0.26), rgba(12, 9, 4, 0) 72%)',
    stageBorderClass: 'border-amber-400/50',
    stageGlowClass: 'shadow-[0_0_50px_-10px_rgba(245,158,11,0.34)]',
    decodeLeftBorderClass: 'border-l-amber-400',
    accentTextClass: 'text-amber-300',
    badgeClass: 'bg-amber-500/15 text-amber-200 border-amber-400/50',
    progressBarGradient: 'from-amber-500 via-yellow-400 to-orange-400',
    activeTabClass:
      'bg-[#181207] border-amber-400/80 text-white shadow-[0_0_26px_-4px_rgba(245,158,11,0.42)]',
    orbBgClass: 'bg-amber-500/[0.16]',
    primaryButtonClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950'
  },

  STRATEGIC_REALIGNMENT: {
    id: 'STRATEGIC_REALIGNMENT',
    badgeLabel: '🟣 STRATEGIC REALIGNMENT & POWER SHIFT',
    shortLabel: '🟣 Power Shift',
    emoji: '🟣',
    emotionSummary: 'Export controls, mineral counter-locks, & new trade corridors',
    intensityScore: 86,
    accentHex: '#A855F7',
    pageBgHex: '#090611',
    topAuraGradient:
      'radial-gradient(ellipse 85% 55% at 50% -8%, rgba(168, 85, 247, 0.26), rgba(9, 6, 17, 0) 72%)',
    stageBorderClass: 'border-purple-400/50',
    stageGlowClass: 'shadow-[0_0_50px_-10px_rgba(168,85,247,0.34)]',
    decodeLeftBorderClass: 'border-l-purple-400',
    accentTextClass: 'text-purple-300',
    badgeClass: 'bg-purple-500/15 text-purple-200 border-purple-400/50',
    progressBarGradient: 'from-purple-500 via-fuchsia-400 to-indigo-400',
    activeTabClass:
      'bg-[#140B20] border-purple-400/80 text-white shadow-[0_0_26px_-4px_rgba(168,85,247,0.42)]',
    orbBgClass: 'bg-purple-500/[0.16]',
    primaryButtonClass: 'bg-purple-400 hover:bg-purple-300 text-slate-950'
  },

  CRITICAL_ALERT: {
    id: 'CRITICAL_ALERT',
    badgeLabel: '🔴 HIGH-TENSION & TACTICAL ALERT',
    shortLabel: '🔴 Tactical Alert',
    emoji: '🔴',
    emotionSummary: 'Autonomous drone warfare, EW jamming, & directed-energy defense',
    intensityScore: 94,
    accentHex: '#F43F5E',
    pageBgHex: '#0D0508',
    topAuraGradient:
      'radial-gradient(ellipse 85% 55% at 50% -8%, rgba(244, 63, 94, 0.28), rgba(13, 5, 8, 0) 72%)',
    stageBorderClass: 'border-rose-500/50',
    stageGlowClass: 'shadow-[0_0_50px_-10px_rgba(244,63,94,0.36)]',
    decodeLeftBorderClass: 'border-l-rose-500',
    accentTextClass: 'text-rose-300',
    badgeClass: 'bg-rose-500/15 text-rose-200 border-rose-400/50',
    progressBarGradient: 'from-rose-500 via-red-400 to-amber-400',
    activeTabClass:
      'bg-[#19090E] border-rose-400/80 text-white shadow-[0_0_26px_-4px_rgba(244,63,94,0.45)]',
    orbBgClass: 'bg-rose-500/[0.16]',
    primaryButtonClass: 'bg-rose-500 hover:bg-rose-400 text-white'
  },

  BREAKTHROUGH_GROWTH: {
    id: 'BREAKTHROUGH_GROWTH',
    badgeLabel: '🟢 BREAKTHROUGH & EXPANSION',
    shortLabel: '🟢 Breakthrough',
    emoji: '🟢',
    emotionSummary: '95% launch cost drop, orbital refueling, & direct-to-phone satellites',
    intensityScore: 90,
    accentHex: '#10B981',
    pageBgHex: '#040C09',
    topAuraGradient:
      'radial-gradient(ellipse 85% 55% at 50% -8%, rgba(16, 185, 129, 0.26), rgba(4, 12, 9, 0) 72%)',
    stageBorderClass: 'border-emerald-400/50',
    stageGlowClass: 'shadow-[0_0_50px_-10px_rgba(16,185,129,0.34)]',
    decodeLeftBorderClass: 'border-l-emerald-400',
    accentTextClass: 'text-emerald-300',
    badgeClass: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/50',
    progressBarGradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    activeTabClass:
      'bg-[#071812] border-emerald-400/80 text-white shadow-[0_0_26px_-4px_rgba(16,185,129,0.42)]',
    orbBgClass: 'bg-emerald-500/[0.16]',
    primaryButtonClass: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
  },

  DEEP_TECH_PRECISION: {
    id: 'DEEP_TECH_PRECISION',
    badgeLabel: '🔵 DEEP-TECH & ARCHITECTURE LEAP',
    shortLabel: '🔵 Deep-Tech Leap',
    emoji: '🔵',
    emotionSummary: 'Sub-2nm silicon photonics, zero-copy kernel pipelines, & edge AI',
    intensityScore: 85,
    accentHex: '#22D3EE',
    pageBgHex: '#050912',
    topAuraGradient:
      'radial-gradient(ellipse 85% 55% at 50% -8%, rgba(34, 211, 238, 0.26), rgba(5, 9, 18, 0) 72%)',
    stageBorderClass: 'border-cyan-400/50',
    stageGlowClass: 'shadow-[0_0_50px_-10px_rgba(34,211,238,0.34)]',
    decodeLeftBorderClass: 'border-l-cyan-400',
    accentTextClass: 'text-cyan-300',
    badgeClass: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/50',
    progressBarGradient: 'from-cyan-400 via-sky-400 to-indigo-400',
    activeTabClass:
      'bg-[#081320] border-cyan-400/80 text-white shadow-[0_0_26px_-4px_rgba(34,211,238,0.42)]',
    orbBgClass: 'bg-cyan-500/[0.16]',
    primaryButtonClass: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
  }
};

export const EMOTION_ORDER: NewsEmotionId[] = [
  'CAUTION_SHOCK',
  'STRATEGIC_REALIGNMENT',
  'CRITICAL_ALERT',
  'BREAKTHROUGH_GROWTH',
  'DEEP_TECH_PRECISION'
];

/**
 * Deterministic, real-time emotion classifier based on headline sentiment,
 * narrative tone, and sector context.
 */
export function detectNewsEmotion(pillarData: NeatPillarData): NewsEmotionTheme {
  const headlineLower = pillarData.headline.toLowerCase();

  // Check if a custom or live headline has strong override keywords
  if (
    /\b(war|missile|drone|swarm|attack|strike|destroy|intercept|weapon|combat|casualt|explosion)\b/.test(
      headlineLower
    )
  ) {
    return NEWS_EMOTION_THEMES.CRITICAL_ALERT;
  }

  if (
    /\b(debt|refinanc|rate shock|inflation|deficit|yield|rollover|recession|default|crash|bankruptcy)\b/.test(
      headlineLower
    )
  ) {
    return NEWS_EMOTION_THEMES.CAUTION_SHOCK;
  }

  if (
    /\b(geopolit|diplomac|corridor|imec|sanction|alliance|summit|gallium|export ban|treaty|bilateral)\b/.test(
      headlineLower
    )
  ) {
    return NEWS_EMOTION_THEMES.STRATEGIC_REALIGNMENT;
  }

  if (
    /\b(orbital|vleo|satellite|rocket|launch|space|breakthrough|record|surge|cheaper|refuel)\b/.test(
      headlineLower
    )
  ) {
    return NEWS_EMOTION_THEMES.BREAKTHROUGH_GROWTH;
  }

  if (
    /\b(photonics|zero-copy|dma-buf|v4l2|kernel|risc-v|2nm|silicon|wafer|npu|chip|ai|compiler)\b/.test(
      headlineLower
    )
  ) {
    return NEWS_EMOTION_THEMES.DEEP_TECH_PRECISION;
  }

  // Default mapping by pillar
  const fallbackByPillar: Record<NeatPillarId, NewsEmotionId> = {
    MONEY: 'CAUTION_SHOCK',
    GEOPOLITICS: 'STRATEGIC_REALIGNMENT',
    DEFENCE: 'CRITICAL_ALERT',
    AEROSPACE: 'BREAKTHROUGH_GROWTH',
    TECH: 'DEEP_TECH_PRECISION'
  };

  return NEWS_EMOTION_THEMES[fallbackByPillar[pillarData.id]];
}

export interface AmbientBackdropConfig {
  pillarId: NeatPillarId;
  bgImage: string;
  unsplashBgUrl: string;
  themeColor: string;
  atmosphereLabel: string;
}

export const AMBIENT_BACKDROP_CATALOG: Record<
  NeatPillarId,
  AmbientBackdropConfig
> = {
  MONEY: {
    pillarId: 'MONEY',
    bgImage: '/images/pillars/money.jpg',
    unsplashBgUrl:
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1920&q=85',
    themeColor: '#F59E0B',
    atmosphereLabel: 'Sovereign Gold Vaults & Global Macro Trading Floor'
  },
  GEOPOLITICS: {
    pillarId: 'GEOPOLITICS',
    bgImage: '/images/pillars/geopolitics.jpg',
    unsplashBgUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85',
    themeColor: '#A855F7',
    atmosphereLabel: 'Global Shipping Straits & Orbital Night-Lights Corridor'
  },
  DEFENCE: {
    pillarId: 'DEFENCE',
    bgImage: '/images/pillars/defence.jpg',
    unsplashBgUrl:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1920&q=85',
    themeColor: '#F43F5E',
    atmosphereLabel: 'Fighter Jet HUD & Autonomous Radar Defence Grid'
  },
  AEROSPACE: {
    pillarId: 'AEROSPACE',
    bgImage: '/images/pillars/aerospace.jpg',
    unsplashBgUrl:
      'https://images.unsplash.com/photo-1517976487468-f20514c44353?auto=format&fit=crop&w=1920&q=85',
    themeColor: '#10B981',
    atmosphereLabel: 'Orbital Rocket Launch & Deep-Space Telemetry Deck'
  },
  TECH: {
    pillarId: 'TECH',
    bgImage: '/images/pillars/tech.jpg',
    unsplashBgUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85',
    themeColor: '#22D3EE',
    atmosphereLabel: 'Sub-2nm Silicon Wafer Lithography & Embedded PCB Macro'
  }
};

/**
 * Resolves the active story's full-screen ambient background image,
 * Unsplash high-res fallback URL, and theme accent color.
 */
export function resolveStoryAmbientBackdrop(
  pillarData: NeatPillarData,
  liveRssImageUrl?: string
): AmbientBackdropConfig {
  const base =
    AMBIENT_BACKDROP_CATALOG[pillarData.id] || AMBIENT_BACKDROP_CATALOG.MONEY;
  const emotion = detectNewsEmotion(pillarData);

  if (liveRssImageUrl && /^https?:\/\/.+/i.test(liveRssImageUrl.trim())) {
    return {
      ...base,
      bgImage: liveRssImageUrl.trim(),
      themeColor: emotion.accentHex
    };
  }

  return {
    ...base,
    themeColor: emotion.accentHex
  };
}

