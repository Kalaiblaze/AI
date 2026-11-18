import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_PILLAR_PROBABILITIES,
  MOMENTUM_SURGE_THRESHOLD,
  computeSyncedProbability,
  evaluateSyncMomentum,
  mergeMomentumAlert
} from './momentumAlertsEngine';

test('evaluateSyncMomentum triggers alert ONLY when probability increases strictly more than 10%', () => {
  assert.equal(MOMENTUM_SURGE_THRESHOLD, 10);

  // Exact +10 boundary should NOT trigger ("more than 10%")
  const exactTen = evaluateSyncMomentum(
    INITIAL_PILLAR_PROBABILITIES,
    'MONEY',
    INITIAL_PILLAR_PROBABILITIES.MONEY + 10,
    { headline: 'Routine Treasury Auction', syncedAt: '10:00:00 IST' }
  );
  assert.equal(exactTen.deltaPoints, 10);
  assert.equal(exactTen.triggeredAlert, null);

  // Decrease should NOT trigger
  const drop = evaluateSyncMomentum(
    INITIAL_PILLAR_PROBABILITIES,
    'TECH',
    INITIAL_PILLAR_PROBABILITIES.TECH - 6,
    { headline: 'Routine Cooling', syncedAt: '10:01:00 IST' }
  );
  assert.equal(drop.deltaPoints, -6);
  assert.equal(drop.triggeredAlert, null);

  // +14 increase (> 10%) MUST trigger with accurate previous/current/delta
  const surge = evaluateSyncMomentum(
    INITIAL_PILLAR_PROBABILITIES,
    'AEROSPACE',
    INITIAL_PILLAR_PROBABILITIES.AEROSPACE + 14,
    {
      headline: 'Starship Orbital Propellant Transfer Milestone',
      syncedAt: '10:02:00 IST',
      catalystReason: 'Verified launch catalyst'
    }
  );
  assert.equal(surge.deltaPoints, 14);
  assert.ok(surge.triggeredAlert);
  assert.equal(surge.triggeredAlert.pillarId, 'AEROSPACE');
  assert.equal(surge.triggeredAlert.previousProbability, 72);
  assert.equal(surge.triggeredAlert.currentProbability, 86);
  assert.equal(surge.nextProbabilities.AEROSPACE, 86);
  assert.equal(surge.triggeredAlert.catalystReason, 'Verified launch catalyst');
});

test('computeSyncedProbability produces breakout jumps > 10% on catalyst syncs and normalizes peaks', () => {
  const breakout = computeSyncedProbability({
    pillarId: 'MONEY',
    prevProbability: 76,
    stepIndex: 0,
    headline: 'Central bank physical gold reserves surge amid debt refinancing shock',
    hasLiveRssMatch: true,
    telemetryVelocity: '+31.2% 7d flow'
  });
  assert.ok(breakout.nextProbability - 76 > 10);

  const cooldown = computeSyncedProbability({
    pillarId: 'MONEY',
    prevProbability: 94,
    stepIndex: 1,
    headline: 'Standard bond desk summary',
    hasLiveRssMatch: false
  });
  assert.ok(cooldown.nextProbability < 94);
});

test('mergeMomentumAlert prepends alerts and bounds list length', () => {
  const first = evaluateSyncMomentum(
    INITIAL_PILLAR_PROBABILITIES,
    'MONEY',
    92,
    { headline: 'Signal 1', syncedAt: '10:00:00 IST' }
  ).triggeredAlert;

  const second = evaluateSyncMomentum(
    INITIAL_PILLAR_PROBABILITIES,
    'DEFENCE',
    90,
    { headline: 'Signal 2', syncedAt: '10:01:00 IST' }
  ).triggeredAlert;

  let list = mergeMomentumAlert([], first, 3);
  list = mergeMomentumAlert(list, second, 3);
  list = mergeMomentumAlert(list, null, 3);

  assert.equal(list.length, 2);
  assert.equal(list[0].pillarId, 'DEFENCE');
  assert.equal(list[1].pillarId, 'MONEY');
});
