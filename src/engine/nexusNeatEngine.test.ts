import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NEAT_PILLARS,
  NeatPillarId,
  createCustomTopicPillarData,
  formatCountdown,
  formatISTTimestamp,
  synthesizeLiveWireDispatch,
  getInitialIncomingWire
} from './nexusNeatEngine';

test('all 5 pillars have complete 7-day sparkline telemetry, explicit country/actor breakdowns, trajectory, domino steps, and titan case study data', () => {
  const keys = Object.keys(NEAT_PILLARS) as NeatPillarId[];
  assert.equal(keys.length, 5);

  for (const key of keys) {
    const p = NEAT_PILLARS[key];
    assert.equal(p.telemetry.length, 3);
    for (const metric of p.telemetry) {
      assert.equal(metric.trend7d.length, 7);
      assert.ok(metric.velocity.length > 3);
    }
    assert.equal(p.actorsBreakdown.length, 3);
    assert.equal(p.thunglishAnalogy.length, 2);
    assert.ok(p.timeline.pastRootCause.length > 20);
    assert.ok(p.timeline.presentNews.length > 20);
    assert.ok(p.timeline.futureImpact.length > 20);
    assert.equal(p.connectedSteps.length, 3);
    assert.ok(p.connectedSteps[0].fromChip.length > 2);
    assert.ok(p.connectedSteps[0].toChip.length > 2);
    assert.equal(p.eliteBrain.winnerPoints.length, 2);
    assert.equal(p.eliteBrain.failurePoints.length, 2);
    assert.ok(p.eliteBrain.charismaBook.length > 3);
    assert.ok(p.eliteBrain.speakingTip.length > 10);
  }
});

test('GEOPOLITICS street-smart decode explicitly identifies US/Netherlands ASML, China Gallium, and India/UAE/Saudi IMEC', () => {
  const geo = NEAT_PILLARS.GEOPOLITICS;
  assert.ok(geo.thunglishAnalogy[0].includes('America'));
  assert.ok(geo.thunglishAnalogy[0].includes('Netherlands'));
  assert.ok(geo.thunglishAnalogy[0].includes('China'));
  assert.ok(geo.thunglishAnalogy[1].includes('India'));
  assert.equal(geo.actorsBreakdown.length, 3);
});

test('formatCountdown and formatISTTimestamp format 60s polling telemetry accurately', () => {
  assert.equal(formatCountdown(59), '00:59');
  assert.equal(formatCountdown(5), '00:05');
  assert.equal(formatCountdown(0), '00:00');
  const ist = formatISTTimestamp(new Date('2026-11-11T10:08:00Z'));
  assert.ok(ist.endsWith('IST'));
});

test('synthesizeLiveWireDispatch and getInitialIncomingWire produce valid live wire items with 7d sparklines', () => {
  const initialWire = getInitialIncomingWire();
  assert.equal(initialWire.length, 5);
  assert.equal(initialWire[0].pillarId, 'MONEY');

  const { updatedPillar, wireItem } = synthesizeLiveWireDispatch(
    'DEFENCE',
    0,
    'Mach 6 Hypersonic Glide Interceptor & 300kW Naval Laser Mesh',
    'GOOGLE SEARCH + RSS'
  );
  assert.equal(updatedPillar.id, 'DEFENCE');
  assert.ok(updatedPillar.headline.includes('Mach 6'));
  assert.equal(updatedPillar.telemetry[0].trend7d.length, 7);
  assert.equal(wireItem.pillarId, 'DEFENCE');
  assert.equal(wireItem.sourceBadge, 'GOOGLE SEARCH + RSS');
});

test('createCustomTopicPillarData updates the selected pillar cleanly with 7d sparkline telemetry', () => {
  const updated = createCustomTopicPillarData(
    'Zero-copy Rust V4L2 driver for MIPI CSI-2 sensors on Edge AI drones',
    'TECH'
  );
  assert.equal(updated.id, 'TECH');
  assert.ok(updated.headline.includes('Zero-copy Rust V4L2'));
  assert.equal(updated.telemetry.length, 3);
  assert.equal(updated.telemetry[0].trend7d.length, 7);
  assert.equal(updated.thunglishAnalogy.length, 2);
});
