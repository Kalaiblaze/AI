import test from 'node:test';
import assert from 'node:assert/strict';
import { NEAT_PILLARS } from './nexusNeatEngine';
import {
  formatWhatsAppBriefing,
  buildTeamsAdaptiveCardPayload
} from './broadcastFormatter';

test('formatWhatsAppBriefing formats headline, telemetry, country actors, and Thunglish decode using WhatsApp markdown', () => {
  const msg = formatWhatsAppBriefing(NEAT_PILLARS.GEOPOLITICS);
  assert.ok(msg.includes('*🚨 NEXUS LIVE INTELLIGENCE · GEOPOLITICS*'));
  assert.ok(msg.includes('*86% Share*'));
  assert.ok(msg.includes('🇺🇸 USA & 🇳🇱 Netherlands (ASML)'));
  assert.ok(msg.includes('🇨🇳 China (Ministry of Commerce)'));
  assert.ok(msg.includes('⚡ Street-Smart Thunglish Decode:'));
});

test('buildTeamsAdaptiveCardPayload builds a valid AdaptiveCard v1.4 message attachment', () => {
  const card = buildTeamsAdaptiveCardPayload(NEAT_PILLARS.MONEY);
  assert.equal(card.type, 'message');
  assert.equal(card.attachments.length, 1);
  assert.equal(
    card.attachments[0].contentType,
    'application/vnd.microsoft.card.adaptive'
  );
  assert.equal(card.attachments[0].content.type, 'AdaptiveCard');
  assert.equal(card.attachments[0].content.version, '1.4');
  assert.ok(card.attachments[0].content.body.length >= 6);
});
