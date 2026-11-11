import test from 'node:test';
import assert from 'node:assert/strict';
import { NEAT_PILLARS, NeatPillarId } from './nexusNeatEngine';
import { PILLAR_MEDIA_CATALOG, getMediaForPillar } from './newsMediaCatalog';
import { prepareSpokenThunglishText } from './thunglishVoicePlayer';
import {
  detectNewsEmotion,
  resolveStoryAmbientBackdrop,
  AMBIENT_BACKDROP_CATALOG
} from './newsEmotionTheme';

test('detectNewsEmotion assigns distinct emotion color themes based on news sentiment across pillars', () => {
  const moneyTheme = detectNewsEmotion(NEAT_PILLARS.MONEY);
  const geoTheme = detectNewsEmotion(NEAT_PILLARS.GEOPOLITICS);
  const defTheme = detectNewsEmotion(NEAT_PILLARS.DEFENCE);
  const aeroTheme = detectNewsEmotion(NEAT_PILLARS.AEROSPACE);
  const techTheme = detectNewsEmotion(NEAT_PILLARS.TECH);

  assert.equal(moneyTheme.id, 'CAUTION_SHOCK');
  assert.equal(geoTheme.id, 'STRATEGIC_REALIGNMENT');
  assert.equal(defTheme.id, 'CRITICAL_ALERT');
  assert.equal(aeroTheme.id, 'BREAKTHROUGH_GROWTH');
  assert.equal(techTheme.id, 'DEEP_TECH_PRECISION');
});

test('resolveStoryAmbientBackdrop assigns topic-matched high-res bgImage, unsplashBgUrl, and themeColor for all 5 pillars', () => {
  const pillarIds: NeatPillarId[] = [
    'MONEY',
    'GEOPOLITICS',
    'DEFENCE',
    'AEROSPACE',
    'TECH'
  ];

  for (const id of pillarIds) {
    const backdrop = resolveStoryAmbientBackdrop(NEAT_PILLARS[id]);
    assert.equal(backdrop.pillarId, id);
    assert.ok(
      backdrop.bgImage.includes('wikimedia.org') ||
        backdrop.bgImage.includes('wikipedia.org') ||
        backdrop.bgImage.includes('unsplash.com') ||
        backdrop.bgImage.startsWith('/images/pillars/')
    );
    assert.ok(backdrop.unsplashBgUrl.startsWith('https://images.unsplash.com/'));
    assert.ok(backdrop.themeColor.startsWith('#'));
    assert.ok(backdrop.atmosphereLabel.length > 10);
    assert.ok(AMBIENT_BACKDROP_CATALOG[id]);
  }
});

test('PILLAR_MEDIA_CATALOG contains valid visual assets, 3 interactive hotspots, 3 video chapters, 3 simpleEverydayTerms, and 2 in-UI broadcast embeds for all 5 pillars', () => {
  const pillarIds: NeatPillarId[] = [
    'MONEY',
    'GEOPOLITICS',
    'DEFENCE',
    'AEROSPACE',
    'TECH'
  ];

  for (const id of pillarIds) {
    const asset = PILLAR_MEDIA_CATALOG[id];
    assert.ok(asset, `Missing media asset for ${id}`);
    assert.ok(asset.primaryImageUrl.startsWith('/images/pillars/'));
    assert.equal(asset.hotspots.length, 3);
    assert.equal(asset.videoChapters.length, 3);
    assert.equal(asset.simpleEverydayTerms.length, 3);
    assert.equal(asset.trustedCitations.length, 2);
    assert.equal(asset.relatedBroadcasts.length, 2);

    for (const term of asset.simpleEverydayTerms) {
      assert.ok(term.term.length > 3);
      assert.ok(term.everydayMeaning.length > 20);
      assert.ok(term.whyItMattersToYou.length > 15);
    }

    for (const clip of asset.relatedBroadcasts) {
      assert.ok(clip.youtubeEmbedId.length >= 8);
      assert.ok(clip.verifiedReportUrl.startsWith('https://'));
      assert.ok(clip.thunglishSummary.length > 15);
    }
  }
});

test('prepareSpokenThunglishText strips emojis and expands financial/technical units cleanly', () => {
  const spoken = prepareSpokenThunglishText(
    '🇺🇸 America $9.8T debt at 0.5% ➔ 4.8% & 2nm EUV chip'
  );
  assert.ok(!spoken.includes('🇺🇸'));
  assert.ok(spoken.includes('9.8 Trillion Dollars'));
  assert.ok(spoken.includes('0.5 percent to 4.8 percent'));
  assert.ok(spoken.includes('2 nanometer'));
});

test('getMediaForPillar resolves live RSS image override when valid HTTP URL is passed', () => {
  const defaultMedia = getMediaForPillar(NEAT_PILLARS.GEOPOLITICS);
  assert.equal(defaultMedia.isLiveRssImage, false);
  assert.equal(
    defaultMedia.activeDisplayImageUrl,
    '/images/pillars/geopolitics.jpg'
  );

  const rssOverride = getMediaForPillar(
    NEAT_PILLARS.GEOPOLITICS,
    'https://images.example.com/breaking-chip-news.jpg'
  );
  assert.equal(rssOverride.isLiveRssImage, true);
  assert.equal(
    rssOverride.activeDisplayImageUrl,
    'https://images.example.com/breaking-chip-news.jpg'
  );
});
