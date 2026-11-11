import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveRealWebsiteImage,
  getUniqueStoryImage,
  extractDirectNewsWebsitePhoto,
  detectWikipediaEntityForStory,
  hashString,
  VERIFIED_FALLBACK_UNSPLASH_IDS,
  PRE_SEEDED_WIKIPEDIA_PHOTOS
} from './uniqueImageEngine';

test('resolveRealWebsiteImage resolves Tier 1 direct news website photo when present', () => {
  const directImg = 'https://media.reuters.com/markets/gold-vault-2026.jpg';
  const resolved = resolveRealWebsiteImage({
    headline: 'Central Bank Gold Reserves Surge in 2026',
    pillar: 'MONEY',
    directFeedImageUrl: directImg
  });

  assert.equal(resolved.tierUsed, 'tier1_direct_feed');
  assert.equal(resolved.primaryUrl, directImg);
  assert.ok(resolved.fallbackUnsplashUrl.includes('images.unsplash.com'));
});

test('resolveRealWebsiteImage extracts direct photo from enclosure or HTML content', () => {
  const feedItem = {
    enclosure: { link: 'https://images.wsj.net/im-991283/social' }
  };
  assert.equal(
    extractDirectNewsWebsitePhoto(feedItem),
    'https://images.wsj.net/im-991283/social'
  );

  const htmlItem = {
    description: '<p>Breaking news</p><img src="https://bloomberg.com/news/markets.jpg" alt="photo" />'
  };
  assert.equal(
    extractDirectNewsWebsitePhoto(htmlItem),
    'https://bloomberg.com/news/markets.jpg'
  );
});

test('resolveRealWebsiteImage resolves Tier 2 official Wikipedia real photo for entity matches', () => {
  const resolved = resolveRealWebsiteImage({
    headline: 'Sovereign Gold Repo Corridors & The $9.8 Trillion Debt Wall',
    pillar: 'MONEY'
  });

  assert.equal(resolved.tierUsed, 'tier2_wikipedia_entity');
  assert.ok(
    resolved.primaryUrl.includes('wikimedia.org') ||
      resolved.primaryUrl.includes('wikipedia.org')
  );
  assert.ok(resolved.fallbackUnsplashUrl.includes('images.unsplash.com'));
});

test('detectWikipediaEntityForStory accurately maps subjects across pillars', () => {
  assert.equal(
    detectWikipediaEntityForStory("Fed's Goolsbee calls inflation report borderline disturbing", 'MONEY'),
    'Federal_Reserve'
  );
  assert.equal(
    detectWikipediaEntityForStory('US-Dutch ASML Chip Ban vs. China Gallium Lock', 'GEOPOLITICS'),
    'ASML_Holding'
  );
  assert.equal(
    detectWikipediaEntityForStory('Unjammable Fiber-Optic Drone Swarms', 'DEFENCE'),
    'Autonomous_aircraft'
  );
  assert.equal(
    detectWikipediaEntityForStory('Orbital Cryo-Refueling Depots for Starship', 'AEROSPACE'),
    'SpaceX_Starship'
  );
  assert.equal(
    detectWikipediaEntityForStory('Embedded Linux V4L2 Zero-Copy DMA-BUF', 'TECH'),
    'Linux_kernel'
  );
});

test('getUniqueStoryImage produces 100% real website photographs without AI generators', () => {
  const story1 = getUniqueStoryImage(
    'Sovereign Gold Repo Corridors & The $9.8 Trillion Debt Wall',
    'MONEY'
  );
  const story2 = getUniqueStoryImage(
    'US-Dutch ASML Chip Ban vs. China Gallium Lock',
    'GEOPOLITICS'
  );

  assert.notEqual(story1.primaryUrl, story2.primaryUrl);
  assert.notEqual(story1.uniqueHash, story2.uniqueHash);

  // Must NEVER contain any AI generation strings
  assert.ok(!story1.primaryUrl.includes('pollinations'));
  assert.ok(!story2.primaryUrl.includes('pollinations'));

  // Must be verified Wikimedia or Unsplash real photo
  assert.ok(
    story1.primaryUrl.includes('wikimedia.org') ||
      story1.primaryUrl.includes('unsplash.com')
  );
});

test('VERIFIED_FALLBACK_UNSPLASH_IDS has 25+ distinct valid photos', () => {
  assert.ok(VERIFIED_FALLBACK_UNSPLASH_IDS.length >= 25);
  const uniqueSet = new Set(VERIFIED_FALLBACK_UNSPLASH_IDS);
  assert.equal(uniqueSet.size, VERIFIED_FALLBACK_UNSPLASH_IDS.length);
});

test('hashString produces stable non-negative 32-bit integer', () => {
  const h1 = hashString('FUTIFY_TEST_1');
  const h2 = hashString('FUTIFY_TEST_1');
  assert.equal(h1, h2);
  assert.ok(h1 >= 0);
});
