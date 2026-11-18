import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseVoiceCommand,
  getNextStoryId,
  computeWaveformBars,
  VoiceStoryCandidate
} from './voiceCommandEngine';

const SAMPLE_STORIES: VoiceStoryCandidate[] = [
  {
    id: 'story-money',
    headline: 'Sovereign Gold Repo Corridors & Debt Wall',
    pillarId: 'MONEY'
  },
  {
    id: 'story-aero',
    headline: 'Starship Orbital Cryo Refueling & LEO Constellations',
    pillarId: 'AEROSPACE'
  },
  {
    id: 'story-tech',
    headline: 'TSMC 2nm GAA Yield & Linux V4L2 Pipelines',
    pillarId: 'TECH'
  }
];

test('parseVoiceCommand routes pillar names cleanly', () => {
  const aero = parseVoiceCommand('Switch to Aerospace please', SAMPLE_STORIES);
  assert.equal(aero.type, 'NAVIGATE_PILLAR');
  if (aero.type === 'NAVIGATE_PILLAR') assert.equal(aero.pillarId, 'AEROSPACE');

  const money = parseVoiceCommand('Show money pillar', SAMPLE_STORIES);
  assert.equal(money.type, 'NAVIGATE_PILLAR');
  if (money.type === 'NAVIGATE_PILLAR') assert.equal(money.pillarId, 'MONEY');

  const tech = parseVoiceCommand('Open Tech', SAMPLE_STORIES);
  assert.equal(tech.type, 'NAVIGATE_PILLAR');
  if (tech.type === 'NAVIGATE_PILLAR') assert.equal(tech.pillarId, 'TECH');

  const def = parseVoiceCommand('Go to defence', SAMPLE_STORIES);
  assert.equal(def.type, 'NAVIGATE_PILLAR');
  if (def.type === 'NAVIGATE_PILLAR') assert.equal(def.pillarId, 'DEFENCE');

  const geo = parseVoiceCommand('Open geopolitics', SAMPLE_STORIES);
  assert.equal(geo.type, 'NAVIGATE_PILLAR');
  if (geo.type === 'NAVIGATE_PILLAR') assert.equal(geo.pillarId, 'GEOPOLITICS');
});

test('parseVoiceCommand handles next/previous story and ordinal jumps', () => {
  const next = parseVoiceCommand('Next story', SAMPLE_STORIES);
  assert.equal(next.type, 'NEXT_STORY');

  const prev = parseVoiceCommand('Go to previous story', SAMPLE_STORIES);
  assert.equal(prev.type, 'PREVIOUS_STORY');

  const ord = parseVoiceCommand('Open story 2', SAMPLE_STORIES);
  assert.equal(ord.type, 'SELECT_STORY_INDEX');
  if (ord.type === 'SELECT_STORY_INDEX') assert.equal(ord.index, 1);
});

test('parseVoiceCommand matches story headlines by keyword', () => {
  const res = parseVoiceCommand('Open the Starship refueling story', SAMPLE_STORIES);
  assert.equal(res.type, 'SELECT_STORY_BY_KEYWORD');
  if (res.type === 'SELECT_STORY_BY_KEYWORD') {
    assert.equal(res.storyId, 'story-aero');
  }
});

test('parseVoiceCommand detects view and home navigation commands', () => {
  const xray = parseVoiceCommand('Open X-Ray view', SAMPLE_STORIES);
  assert.equal(xray.type, 'OPEN_VIEW');
  if (xray.type === 'OPEN_VIEW') assert.equal(xray.view, 'XRAY');

  const home = parseVoiceCommand('Go home', SAMPLE_STORIES);
  assert.equal(home.type, 'NAVIGATE_HOME');

  const unknown = parseVoiceCommand('make me a sandwich', SAMPLE_STORIES);
  assert.equal(unknown.type, 'UNKNOWN');
});

test('getNextStoryId wraps around cleanly in both directions', () => {
  assert.equal(getNextStoryId(SAMPLE_STORIES, 'story-money', 'next'), 'story-aero');
  assert.equal(getNextStoryId(SAMPLE_STORIES, 'story-tech', 'next'), 'story-money');
  assert.equal(getNextStoryId(SAMPLE_STORIES, 'story-money', 'prev'), 'story-tech');
  assert.equal(getNextStoryId([], 'x', 'next'), null);
});

test('computeWaveformBars returns bounded amplitudes across mic FFT and fallback modes', () => {
  const fft = new Uint8Array([180, 220, 255, 140, 90, 60, 200, 120]);
  const activeBars = computeWaveformBars(fft, 24, 10, true, 0.4);
  assert.equal(activeBars.length, 24);
  assert.ok(activeBars.every((v) => v >= 0.08 && v <= 1));

  const fallbackBars = computeWaveformBars(null, 24, 15, true, 0.5);
  assert.equal(fallbackBars.length, 24);
  assert.ok(fallbackBars.some((v) => v > 0.25));

  const idleBars = computeWaveformBars(null, 16, 0, false, 0);
  assert.equal(idleBars.length, 16);
  assert.ok(idleBars.every((v) => v === 0.1));
});
