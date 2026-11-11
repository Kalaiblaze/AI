import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NEAT_PILLARS,
  NeatPillarId,
  getInitialIncomingWire
} from './nexusNeatEngine';
import {
  SPATIAL_XRAY_CATALOG,
  HERO_CONFIDENCE_BY_PILLAR,
  buildFutifySwimlanes
} from './futifyEngine';

test('SPATIAL_XRAY_CATALOG provides 3 precision reticles (01, 02, 03) with probability scores and zero emoji sticker pins for all 5 pillars', () => {
  const pillarIds: NeatPillarId[] = [
    'MONEY',
    'GEOPOLITICS',
    'DEFENCE',
    'AEROSPACE',
    'TECH'
  ];

  for (const pid of pillarIds) {
    const reticles = SPATIAL_XRAY_CATALOG[pid];
    assert.equal(reticles.length, 3);
    assert.equal(reticles[0].code, '01');
    assert.equal(reticles[1].code, '02');
    assert.equal(reticles[2].code, '03');

    for (const r of reticles) {
      assert.ok(r.reticleLabel.startsWith(`${r.code} // `));
      assert.ok(r.probabilityScore.includes('%'));
      assert.ok(r.thunglishExplain.length > 25);
      assert.ok(r.simpleEverydayMeaning.length > 25);
      assert.ok(r.xPercent > 10 && r.xPercent < 90);
      assert.ok(r.yPercent > 10 && r.yPercent < 90);
    }

    const heroMeta = HERO_CONFIDENCE_BY_PILLAR[pid];
    assert.ok(heroMeta.confidenceBadge.includes('FUTIFY PREDICTION'));
    assert.ok(heroMeta.confidencePercent >= 90);
  }
});

test('buildFutifySwimlanes generates 4 Netflix-style horizontal poster rows with 16:9 imagery and JUST IN badges', () => {
  const wire = getInitialIncomingWire();
  const rows = buildFutifySwimlanes(NEAT_PILLARS, wire);
  assert.equal(rows.length, 4);
  assert.equal(rows[0].id, 'row-live-shifts');
  assert.ok(rows[0].cards.length >= 5);
  assert.equal(rows[0].cards[0].isJustIn, true);

  for (const row of rows) {
    assert.ok(row.title.length > 3);
    assert.ok(row.serifAccent.length > 2);
    assert.ok(row.cards.length >= 4);
    for (const card of row.cards) {
      assert.ok(card.posterImageUrl.length > 5);
      assert.ok(card.fallbackUnsplashUrl.startsWith('https://images.unsplash.com/'));
      assert.ok(card.probabilityBadge.includes('%'));
    }
  }
});
