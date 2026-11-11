import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CARBON_PILLARS,
  INITIAL_CARBON_DATASET,
  classifyCarbonPillar,
  synthesizeCustomBriefing,
  mapRssItemsToBriefings
} from './carbonPulseEngine';

test('INITIAL_CARBON_DATASET contains 6 full briefings covering all 5 pillars + embedded V4L2/MIPI CSI-2', () => {
  assert.equal(INITIAL_CARBON_DATASET.length, 6);

  const coveredPillars = new Set(INITIAL_CARBON_DATASET.map((item) => item.pillar));
  assert.equal(coveredPillars.size, 5);
  for (const pillarKey of Object.keys(CARBON_PILLARS)) {
    assert.ok(coveredPillars.has(pillarKey as keyof typeof CARBON_PILLARS));
  }

  for (const item of INITIAL_CARBON_DATASET) {
    assert.ok(item.headline.length > 25);
    assert.ok(item.thunglish_analogy.length > 80);
    assert.ok(item.past_root_cause.length > 100);
    assert.ok(item.present_reality.length > 100);
    assert.ok(item.future_projection.length > 100);
    assert.ok(item.connected_dots.length >= 2);
    assert.ok(item.titan_vs_failure.titan_name.length > 5);
    assert.ok(item.titan_vs_failure.failure_entity.length > 5);
    assert.ok(item.titan_vs_failure.engineering_root_lesson.length > 20);
    assert.ok(item.charisma_dojo.mental_model.length > 5);
    assert.ok(item.charisma_dojo.book_citation.length > 5);
  }
});

test('synthesizeCustomBriefing and mapRssItemsToBriefings accurately classify and generate all 8 keys', () => {
  const embeddedTopic =
    'Linux kernel 6.12 V4L2 subdev zero-copy DMABUF pipeline for 4-lane MIPI CSI-2 camera sensor into Edge-AI NPU';
  assert.equal(classifyCarbonPillar(embeddedTopic), 'TECH_EMBEDDED');

  const briefing = synthesizeCustomBriefing(embeddedTopic);
  assert.equal(briefing.pillar, 'TECH_EMBEDDED');
  assert.ok(briefing.connected_dots.length >= 2);
  assert.ok(briefing.thunglish_analogy.includes('Boss'));

  const rssMapped = mapRssItemsToBriefings([
    {
      title: 'SpaceX Starship completes orbital cryogenic propellant transfer test in LEO',
      description: 'Orbital refueling unlocks heavy lunar payloads.'
    }
  ]);
  assert.equal(rssMapped.length, 1);
  assert.equal(rssMapped[0].pillar, 'AEROSPACE');
});
