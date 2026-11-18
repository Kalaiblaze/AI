import test from 'node:test';
import assert from 'node:assert/strict';
import { NEAT_PILLARS, PILLAR_ROTATION_ORDER } from './nexusNeatEngine';
import { getInitialFutifyStories } from './futifyEngine';
import { INITIAL_PILLAR_PROBABILITIES, MomentumAlertItem } from './momentumAlertsEngine';
import {
  buildGlobalSentimentSnapshot,
  classifyVolatilityTier
} from './globalSentimentRadarEngine';

test('buildGlobalSentimentSnapshot computes bounded scores across all 5 pillars and ranks most volatile region first', () => {
  const snapshot = buildGlobalSentimentSnapshot({
    pillarsMap: NEAT_PILLARS,
    pillarProbabilities: { ...INITIAL_PILLAR_PROBABILITIES },
    stories: getInitialFutifyStories(),
    momentumAlerts: []
  });

  assert.equal(snapshot.axes.length, 5);
  assert.deepEqual(
    snapshot.axes.map((a) => a.pillarId),
    PILLAR_ROTATION_ORDER
  );

  for (const axis of snapshot.axes) {
    assert.ok(axis.intensity >= 30 && axis.intensity <= 99);
    assert.ok(axis.baselineIntensity >= 30 && axis.baselineIntensity <= 92);
    assert.ok(axis.hotspotRegion.length > 5);
    assert.ok(axis.headline.length > 10);
  }

  // DEFENCE baseline theme is CRITICAL_ALERT (94), so it ranks #1 volatile by default
  assert.equal(snapshot.mostVolatileAxis.pillarId, 'DEFENCE');
  assert.equal(snapshot.mostVolatileAxis.volatilityTier, 'EXTREME VOLATILITY');
  assert.ok(snapshot.globalVolatilityIndex >= 75 && snapshot.globalVolatilityIndex <= 99);
});

test('momentum surge alerts and probability spikes dynamically elevate pillar intensity on the radar', () => {
  const base = buildGlobalSentimentSnapshot({
    pillarsMap: NEAT_PILLARS,
    pillarProbabilities: { ...INITIAL_PILLAR_PROBABILITIES },
    stories: getInitialFutifyStories(),
    momentumAlerts: []
  });

  const surgeAlert: MomentumAlertItem = {
    id: 'mom-money-surge',
    pillarId: 'MONEY',
    pillarName: 'Economics & Money',
    headline: 'Emergency Sovereign Debt Yield Shock & Currency Intervention',
    previousProbability: 76,
    currentProbability: 94,
    deltaPoints: 18,
    relativeGainPercent: 24,
    syncedAt: '12:00:00 IST',
    catalystReason: 'Verified catalyst surge'
  };

  const surged = buildGlobalSentimentSnapshot({
    pillarsMap: NEAT_PILLARS,
    pillarProbabilities: {
      ...INITIAL_PILLAR_PROBABILITIES,
      MONEY: 94
    },
    stories: getInitialFutifyStories(),
    momentumAlerts: [surgeAlert]
  });

  const baseMoney = base.axes.find((a) => a.pillarId === 'MONEY')!;
  const surgedMoney = surged.axes.find((a) => a.pillarId === 'MONEY')!;

  assert.ok(surgedMoney.intensity > baseMoney.intensity);
  assert.equal(surgedMoney.hasMomentumSurge, true);
  assert.equal(surgedMoney.probability, 94);
});

test('classifyVolatilityTier separates Extreme, High, and Elevated bands cleanly', () => {
  assert.equal(classifyVolatilityTier(92), 'EXTREME VOLATILITY');
  assert.equal(classifyVolatilityTier(90), 'EXTREME VOLATILITY');
  assert.equal(classifyVolatilityTier(85), 'HIGH VOLATILITY');
  assert.equal(classifyVolatilityTier(82), 'HIGH VOLATILITY');
  assert.equal(classifyVolatilityTier(79), 'ELEVATED WATCH');
});
