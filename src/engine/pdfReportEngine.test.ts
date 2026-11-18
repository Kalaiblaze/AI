import test from 'node:test';
import assert from 'node:assert/strict';
import { NEAT_PILLARS, PILLAR_ROTATION_ORDER } from './nexusNeatEngine';
import {
  buildStructuredPillarReport,
  generatePillarReportPdfBytes,
  sanitizePdfText
} from './pdfReportEngine';

test('buildStructuredPillarReport includes current pillar data, Thunglish analogy, and 24-month timeline impact across all 5 pillars', () => {
  for (const pillarId of PILLAR_ROTATION_ORDER) {
    const pillar = NEAT_PILLARS[pillarId];
    const report = buildStructuredPillarReport(
      pillar,
      null,
      84,
      '14:30:00 IST'
    );

    assert.equal(report.pillarId, pillarId);
    assert.equal(report.fileName, `FUTIFY-${pillarId}-Intelligence-Report.pdf`);
    assert.equal(report.headline, pillar.headline);
    assert.equal(report.probabilityScore, 84);
    assert.equal(report.thunglishAnalogy[0], pillar.thunglishAnalogy[0]);
    assert.equal(report.thunglishAnalogy[1], pillar.thunglishAnalogy[1]);
    assert.equal(
      report.timeline.futureImpact24Month,
      pillar.timeline.futureImpact
    );
    assert.equal(report.telemetry.length, 3);
    assert.equal(report.actorsBreakdown.length, 3);
  }
});

test('sanitizePdfText normalizes arrows, dashes, and emojis into clean ASCII', () => {
  const raw = '💰 Money ➔ 🌍 Geopolitics — “0.5% ➔ 4.8%” · ₹85B';
  const cleaned = sanitizePdfText(raw);
  assert.ok(cleaned.includes('Money -> Geopolitics'));
  assert.ok(cleaned.includes('"0.5% -> 4.8%"'));
  assert.ok(cleaned.includes('INR 85B'));
});

test('generatePillarReportPdfBytes produces valid %PDF-1.4 binary containing Thunglish analogy and 24-month timeline impact', () => {
  const moneyPillar = NEAT_PILLARS.MONEY;
  const report = buildStructuredPillarReport(
    moneyPillar,
    null,
    76,
    '15:00:00 IST'
  );
  const pdfBytes = generatePillarReportPdfBytes(report);

  assert.ok(pdfBytes instanceof Uint8Array);
  assert.ok(pdfBytes.byteLength > 2500);

  const pdfText = new TextDecoder().decode(pdfBytes);
  assert.ok(pdfText.startsWith('%PDF-1.4'));
  assert.ok(pdfText.trimEnd().endsWith('%%EOF'));
  assert.ok(pdfText.includes('/Type /Catalog'));
  assert.ok(pdfText.includes('/Type /Pages'));
  assert.ok(pdfText.includes('STREET-SMART THUNGLISH ANALOGY'));
  assert.ok(pdfText.includes('24-MONTH TIMELINE IMPACT'));
  assert.ok(pdfText.includes('America matrum G7 countries'));
  assert.ok(pdfText.includes('Over the next 24 months'));
});
