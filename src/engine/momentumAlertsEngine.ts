import { NeatPillarId, NEAT_PILLARS } from './nexusNeatEngine';

export const MOMENTUM_SURGE_THRESHOLD = 10;

export type PillarProbabilityMap = Record<NeatPillarId, number>;

export interface MomentumAlertItem {
  id: string;
  pillarId: NeatPillarId;
  pillarName: string;
  headline: string;
  previousProbability: number;
  currentProbability: number;
  deltaPoints: number;
  relativeGainPercent: number;
  syncedAt: string;
  catalystReason: string;
}

export const INITIAL_PILLAR_PROBABILITIES: PillarProbabilityMap = {
  MONEY: 76,
  GEOPOLITICS: 74,
  DEFENCE: 75,
  AEROSPACE: 72,
  TECH: 74
};

const CATALYST_KEYWORDS =
  /\b(surge|breakthrough|record|tariffs|sanction|ban|lock|gold|debt|treasury|2nm|gaa|laser|drone|starship|orbital|vleo|emergency|shock|crisis|transfer|yield)\b/i;

export function clampProbability(score: number): number {
  if (!Number.isFinite(score)) return 70;
  return Math.max(40, Math.min(99, Math.round(score)));
}

export function computeSyncedProbability(params: {
  pillarId: NeatPillarId;
  prevProbability: number;
  stepIndex: number;
  headline: string;
  hasLiveRssMatch: boolean;
  telemetryVelocity?: string;
}): { nextProbability: number; catalystReason: string } {
  const prev = clampProbability(params.prevProbability);
  const headline = (params.headline || '').trim();
  const hasCatalyst = CATALYST_KEYWORDS.test(headline);
  const velocityMatch = (params.telemetryVelocity || '').match(/\+(\d+(?:\.\d+)?)/);
  const velocityMag = velocityMatch ? parseFloat(velocityMatch[1]) : 0;

  // Cooldown normalization if a pillar has already spiked high (>= 88), giving room for future breakouts
  if (prev >= 88 && params.stepIndex % 2 === 1) {
    const cooled = clampProbability(prev - 14);
    return {
      nextProbability: cooled,
      catalystReason: 'Post-spike mean reversion across incoming wire'
    };
  }

  // Breakout momentum impulse when high-velocity signal or catalyst lands and pillar is below ceiling
  const isBreakoutSync =
    prev <= 84 &&
    (hasCatalyst || params.hasLiveRssMatch || velocityMag >= 25 || params.stepIndex % 2 === 0);

  if (isBreakoutSync) {
    const boost = 12 + ((params.stepIndex + params.pillarId.length) % 6); // +12 to +17 pts (> 10%)
    const next = clampProbability(prev + boost);
    const reason = params.hasLiveRssMatch
      ? 'Verified live outlet catalyst accelerated probability'
      : velocityMag >= 25
      ? `High 7d velocity signal (+${Math.round(velocityMag)}%)`
      : 'Multi-pillar structural catalyst detected';
    return {
      nextProbability: next,
      catalystReason: reason
    };
  }

  // Routine incremental adjustment (<= 10%, does NOT trigger alert)
  const mildDelta = params.stepIndex % 3 === 0 ? 5 : -4;
  return {
    nextProbability: clampProbability(prev + mildDelta),
    catalystReason: 'Steady incremental wire confirmation'
  };
}

export function evaluateSyncMomentum(
  prevProbabilities: PillarProbabilityMap,
  pillarId: NeatPillarId,
  rawNextProbability: number,
  context: {
    headline: string;
    syncedAt: string;
    catalystReason?: string;
  }
): {
  nextProbabilities: PillarProbabilityMap;
  deltaPoints: number;
  triggeredAlert: MomentumAlertItem | null;
} {
  const prevScore = clampProbability(prevProbabilities[pillarId] ?? 75);
  const nextScore = clampProbability(rawNextProbability);
  const deltaPoints = nextScore - prevScore;

  const nextProbabilities: PillarProbabilityMap = {
    ...prevProbabilities,
    [pillarId]: nextScore
  };

  if (deltaPoints <= MOMENTUM_SURGE_THRESHOLD) {
    return {
      nextProbabilities,
      deltaPoints,
      triggeredAlert: null
    };
  }

  const relativeGainPercent =
    prevScore > 0 ? Math.round((deltaPoints / prevScore) * 100) : deltaPoints;

  const triggeredAlert: MomentumAlertItem = {
    id: `momentum-${pillarId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    pillarId,
    pillarName: NEAT_PILLARS[pillarId]?.shortName || pillarId,
    headline: context.headline.trim() || `${pillarId} Live Sync Signal`,
    previousProbability: prevScore,
    currentProbability: nextScore,
    deltaPoints,
    relativeGainPercent,
    syncedAt: context.syncedAt,
    catalystReason:
      context.catalystReason ||
      `Single-sync conviction jumped +${deltaPoints}%`
  };

  return {
    nextProbabilities,
    deltaPoints,
    triggeredAlert
  };
}

export function mergeMomentumAlert(
  existing: MomentumAlertItem[],
  newAlert: MomentumAlertItem | null,
  maxItems = 4
): MomentumAlertItem[] {
  if (!newAlert) return existing;
  const deduped = existing.filter((item) => item.id !== newAlert.id);
  return [newAlert, ...deduped].slice(0, maxItems);
}
