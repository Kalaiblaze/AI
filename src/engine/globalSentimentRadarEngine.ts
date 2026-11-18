import {
  NEAT_PILLARS,
  NeatPillarData,
  NeatPillarId,
  PILLAR_ROTATION_ORDER
} from './nexusNeatEngine';
import {
  NewsEmotionTheme,
  detectNewsEmotion
} from './newsEmotionTheme';
import { PILLAR_MEDIA_CATALOG } from './newsMediaCatalog';
import {
  INITIAL_PILLAR_PROBABILITIES,
  MomentumAlertItem,
  PillarProbabilityMap
} from './momentumAlertsEngine';
import { FutifyStoryItem } from './futifyEngine';

export type VolatilityTier =
  | 'EXTREME VOLATILITY'
  | 'HIGH VOLATILITY'
  | 'ELEVATED WATCH';

export type GlobalAlertState =
  | 'CRITICAL_TURBULENCE'
  | 'ELEVATED_STRESS'
  | 'STEADY_PULSE';

export interface SentimentRadarAxisDatum {
  pillarId: NeatPillarId;
  shortLabel: string;
  axisCode: string;
  fullName: string;
  intensity: number;
  baselineIntensity: number;
  deltaVsBaseline: number;
  emotionTheme: NewsEmotionTheme;
  volatilityTier: VolatilityTier;
  hotspotRegion: string;
  headline: string;
  probability: number;
  activeStoryCount: number;
  hasMomentumSurge: boolean;
}

export interface GlobalSentimentSnapshot {
  axes: SentimentRadarAxisDatum[];
  volatileRanking: SentimentRadarAxisDatum[];
  mostVolatileAxis: SentimentRadarAxisDatum;
  globalVolatilityIndex: number;
  globalAlertState: GlobalAlertState;
}

export interface GlobalSentimentBuildInput {
  pillarsMap: Record<NeatPillarId, NeatPillarData>;
  pillarProbabilities: PillarProbabilityMap;
  stories: FutifyStoryItem[];
  momentumAlerts: MomentumAlertItem[];
}

const AXIS_LABELS: Record<NeatPillarId, { shortLabel: string; axisCode: string }> = {
  MONEY: { shortLabel: 'Money', axisCode: 'MNY' },
  GEOPOLITICS: { shortLabel: 'Geopolitics', axisCode: 'GEO' },
  DEFENCE: { shortLabel: 'Defence', axisCode: 'DEF' },
  AEROSPACE: { shortLabel: 'Aerospace', axisCode: 'AERO' },
  TECH: { shortLabel: 'Tech', axisCode: 'TECH' }
};

function clampScore(value: number, min = 30, max = 99): number {
  if (!Number.isFinite(value)) return 75;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function extractMaxVelocityBoost(pillarData: NeatPillarData): number {
  let maxPct = 0;
  for (const stat of pillarData.telemetry) {
    const matches = stat.velocity.match(/(\d+(?:\.\d+)?)/g);
    if (!matches) continue;
    for (const raw of matches) {
      const num = parseFloat(raw);
      if (Number.isFinite(num) && num < 500) {
        maxPct = Math.max(maxPct, num);
      }
    }
  }
  if (maxPct >= 60) return 4;
  if (maxPct >= 30) return 2;
  if (maxPct >= 15) return 1;
  return 0;
}

export function classifyVolatilityTier(intensity: number): VolatilityTier {
  if (intensity >= 90) return 'EXTREME VOLATILITY';
  if (intensity >= 82) return 'HIGH VOLATILITY';
  return 'ELEVATED WATCH';
}

export function buildGlobalSentimentSnapshot(
  input: GlobalSentimentBuildInput
): GlobalSentimentSnapshot {
  const axes: SentimentRadarAxisDatum[] = PILLAR_ROTATION_ORDER.map((pid) => {
    const pillarData = input.pillarsMap[pid] || NEAT_PILLARS[pid];
    const emotionTheme = detectNewsEmotion(pillarData);
    const meta = AXIS_LABELS[pid];

    const matchingStories = input.stories.filter((s) => s.pillarId === pid);
    const justInStories = matchingStories.filter((s) => s.isJustIn).length;
    const latestStory = matchingStories[0];
    const activeHeadline = latestStory?.headline || pillarData.headline;

    const latestEmotion = latestStory
      ? detectNewsEmotion(latestStory.pillarSnapshot)
      : emotionTheme;
    const effectiveEmotion =
      latestEmotion.intensityScore >= emotionTheme.intensityScore
        ? latestEmotion
        : emotionTheme;

    const baseIntensity = effectiveEmotion.intensityScore;
    const velocityBoost = extractMaxVelocityBoost(pillarData);

    const activeAlert = input.momentumAlerts.find((a) => a.pillarId === pid);
    const surgeBoost = activeAlert
      ? Math.min(6, Math.max(2, Math.round(activeAlert.deltaPoints / 3)))
      : 0;

    const currentProb =
      input.pillarProbabilities[pid] ?? INITIAL_PILLAR_PROBABILITIES[pid];
    const initialProb = INITIAL_PILLAR_PROBABILITIES[pid];
    const probDeltaBoost = Math.max(
      -4,
      Math.min(4, Math.round((currentProb - initialProb) * 0.25))
    );

    const densityBoost = Math.min(3, Math.max(0, justInStories - 1));

    const intensity = clampScore(
      baseIntensity + velocityBoost + surgeBoost + probDeltaBoost + densityBoost
    );
    const baselineIntensity = clampScore(baseIntensity - 7, 35, 92);
    const deltaVsBaseline = intensity - baselineIntensity;

    const rawRegion =
      PILLAR_MEDIA_CATALOG[pid]?.locationBadge || 'Global Strategic Sector';
    const hotspotRegion = rawRegion.replace(/^📍\s*/, '').trim();

    return {
      pillarId: pid,
      shortLabel: meta.shortLabel,
      axisCode: meta.axisCode,
      fullName: pillarData.shortName || NEAT_PILLARS[pid].shortName,
      intensity,
      baselineIntensity,
      deltaVsBaseline,
      emotionTheme: effectiveEmotion,
      volatilityTier: classifyVolatilityTier(intensity),
      hotspotRegion,
      headline: activeHeadline,
      probability: currentProb,
      activeStoryCount: matchingStories.length,
      hasMomentumSurge: Boolean(activeAlert)
    };
  });

  const volatileRanking = [...axes].sort(
    (a, b) =>
      b.intensity - a.intensity ||
      b.deltaVsBaseline - a.deltaVsBaseline ||
      b.probability - a.probability
  );

  const mostVolatileAxis = volatileRanking[0];
  const globalVolatilityIndex = Math.round(
    axes.reduce((acc, item) => acc + item.intensity, 0) / axes.length
  );

  const globalAlertState: GlobalAlertState =
    globalVolatilityIndex >= 89
      ? 'CRITICAL_TURBULENCE'
      : globalVolatilityIndex >= 82
      ? 'ELEVATED_STRESS'
      : 'STEADY_PULSE';

  return {
    axes,
    volatileRanking,
    mostVolatileAxis,
    globalVolatilityIndex,
    globalAlertState
  };
}
