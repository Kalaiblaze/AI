import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PILLARS,
  INTELLIGENCE_BATCHES,
  detectPrimaryPillar,
  synthesizeRawNews
} from './intelligenceEngine';

test('all 5 pillars have complete Success vs Failure case studies', () => {
  const pillarKeys = Object.keys(PILLARS);
  assert.equal(pillarKeys.length, 5);
  for (const key of pillarKeys) {
    const pillar = PILLARS[key as keyof typeof PILLARS];
    assert.ok(pillar.caseStudy.successCase.title.length > 5);
    assert.ok(pillar.caseStudy.failureCase.title.length > 5);
    assert.ok(pillar.caseStudy.thunglishTakeaway.length > 10);
  }
});

test('3 pre-loaded intelligence batches cover all 5 pillars with 3D Matrix and Dot-Connector Web', () => {
  assert.equal(INTELLIGENCE_BATCHES.length, 3);
  for (const batch of INTELLIGENCE_BATCHES) {
    assert.equal(batch.items.length, 5);
    assert.ok(batch.dotConnectorWeb.steps.length >= 3);
    assert.ok(batch.charismaDojo.modelName.length > 0);
    assert.ok(batch.charismaDojo.bookReference.length > 0);

    for (const item of batch.items) {
      assert.ok(item.matrix3D.pastRootCause.length > 10);
      assert.ok(item.matrix3D.presentTrigger.length > 10);
      assert.ok(item.matrix3D.futurePrediction.length > 10);
      assert.ok(item.thunglishBriefing.length > 20);
      assert.ok(item.everydayAnalogy.length > 15);
    }
  }
});

test('detectPrimaryPillar and synthesizeRawNews generate structured Thunglish briefing from raw text', () => {
  const rawInput =
    'Central banks increase physical gold reserves as sovereign debt yields rise and dollar liquidity tightens across Asian bond markets.';
  const detected = detectPrimaryPillar(rawInput);
  assert.equal(detected, 'MONEY');

  const result = synthesizeRawNews(rawInput);
  assert.equal(result.item.pillar, 'MONEY');
  assert.ok(result.item.thunglishBriefing.includes('Boss'));
  assert.ok(result.item.matrix3D.pastRootCause.length > 10);
  assert.ok(result.item.matrix3D.presentTrigger.length > 10);
  assert.ok(result.item.matrix3D.futurePrediction.length > 10);
  assert.equal(result.dotWeb.steps.length, 3);
  assert.ok(result.charisma.bookReference.includes('48 Laws of Power'));
});
