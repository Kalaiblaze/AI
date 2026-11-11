import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRE_SEEDED_WIKIPEDIA_PHOTOS,
  upgradeTo4kUhdResolution,
  resolveRealWebsiteImage
} from './uniqueImageEngine';
import { AMBIENT_BACKDROP_CATALOG } from './newsEmotionTheme';

test('PRE_SEEDED_WIKIPEDIA_PHOTOS uses 2560px or original resolution URLs', () => {
  assert.ok(PRE_SEEDED_WIKIPEDIA_PHOTOS.United_States_Treasury.includes('2560px'));
  assert.ok(PRE_SEEDED_WIKIPEDIA_PHOTOS.Federal_Reserve.includes('2560px'));
  assert.ok(PRE_SEEDED_WIKIPEDIA_PHOTOS.TSMC.includes('2560px'));
  assert.ok(PRE_SEEDED_WIKIPEDIA_PHOTOS.SpaceX_Starship.includes('upload.wikimedia.org'));
});

test('upgradeTo4kUhdResolution converts Unsplash URLs to 3840px Q90', () => {
  const unsplashOriginal = 'https://images.unsplash.com/photo-123456?auto=format&fit=crop&w=1600&q=85';
  const uhd = upgradeTo4kUhdResolution(unsplashOriginal);
  assert.ok(uhd.includes('w=3840&q=90&fit=crop'));
});

test('upgradeTo4kUhdResolution upgrades Wikimedia thumbnails to 2560px', () => {
  const wikiOriginal = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/b/photo.jpg/1280px-photo.jpg';
  const uhd = upgradeTo4kUhdResolution(wikiOriginal);
  assert.ok(uhd.includes('/2560px-'));
});

test('AMBIENT_BACKDROP_CATALOG has 4K (3840px, Q90) Unsplash backdrops across all pillars', () => {
  for (const pillar of ['MONEY', 'GEOPOLITICS', 'DEFENCE', 'AEROSPACE', 'TECH'] as const) {
    const config = AMBIENT_BACKDROP_CATALOG[pillar];
    assert.ok(config.unsplashBgUrl.includes('w=3840&q=90'), `Pillar ${pillar} must use 4K Unsplash url`);
  }
});

test('resolveRealWebsiteImage fallback Unsplash URLs are 4K (3840px, Q90)', () => {
  const resolved = resolveRealWebsiteImage({
    headline: 'Autonomous Drone Swarm Intercepts Hypersonic Target',
    pillar: 'DEFENCE'
  });
  assert.ok(resolved.fallbackUnsplashUrl.includes('w=3840&q=90'));
});
