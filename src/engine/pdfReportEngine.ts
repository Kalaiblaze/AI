import {
  ActorBreakdownItem,
  ConnectedDotStep,
  NeatPillarData,
  NeatPillarId,
  TelemetryStat
} from './nexusNeatEngine';
import { FutifyStoryItem } from './futifyEngine';

export interface StructuredPillarReport {
  reportId: string;
  fileName: string;
  pillarId: NeatPillarId;
  pillarName: string;
  chipLabel: string;
  accentColor: string;
  headline: string;
  probabilityScore: number;
  confidenceBadge: string;
  updatedAt: string;
  generatedAtIST: string;
  thunglishAnalogy: [string, string];
  timeline: {
    pastRootCause: string;
    presentNews: string;
    futureImpact24Month: string;
  };
  telemetry: [TelemetryStat, TelemetryStat, TelemetryStat];
  actorsBreakdown: [ActorBreakdownItem, ActorBreakdownItem, ActorBreakdownItem];
  connectedSteps: ConnectedDotStep[];
  eliteBrain: NeatPillarData['eliteBrain'];
}

/**
 * Normalizes Unicode symbols, arrows, smart quotes, and emojis into clean
 * printable ASCII for standard PDF Type1 fonts (Helvetica / Courier).
 */
export function sanitizePdfText(input: string): string {
  if (!input) return '';
  return input
    .replace(/➔|→|⟶|➜|➡/g, '->')
    .replace(/⏪|⏺️|⏺|⏩/g, '')
    .replace(/—|–/g, ' - ')
    .replace(/“|”/g, '"')
    .replace(/‘|’/g, "'")
    .replace(/•|·/g, '-')
    .replace(/₹/g, 'INR ')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Escapes parentheses and backslashes for PDF literal strings: (...)
 */
function escapePdfLiteral(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Wraps a single paragraph into lines of at most `maxChars` characters.
 */
export function wrapPdfText(text: string, maxChars: number): string[] {
  const clean = sanitizePdfText(text);
  if (!clean) return [''];
  const words = clean.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxChars) {
      currentLine += ` ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Builds the structured intelligence report model from the current pillar data.
 */
export function buildStructuredPillarReport(
  pillarData: NeatPillarData,
  activeStory?: FutifyStoryItem | null,
  probabilityScore: number = 78,
  generatedAtIST: string = 'Live Sync IST'
): StructuredPillarReport {
  const headline = activeStory?.headline || pillarData.headline;
  const confidenceBadge = activeStory?.probabilityBadge || '98% PROBABILITY';
  const safePillarSlug = pillarData.id.toUpperCase();

  return {
    reportId: `FUTIFY-RPT-${safePillarSlug}-2026`,
    fileName: `FUTIFY-${safePillarSlug}-Intelligence-Report.pdf`,
    pillarId: pillarData.id,
    pillarName: pillarData.tabLabel,
    chipLabel: pillarData.chipLabel,
    accentColor: pillarData.accentColor,
    headline,
    probabilityScore: Math.round(probabilityScore),
    confidenceBadge,
    updatedAt: pillarData.updatedAt,
    generatedAtIST,
    thunglishAnalogy: [
      pillarData.thunglishAnalogy[0],
      pillarData.thunglishAnalogy[1]
    ],
    timeline: {
      pastRootCause: pillarData.timeline.pastRootCause,
      presentNews: pillarData.timeline.presentNews,
      futureImpact24Month: pillarData.timeline.futureImpact
    },
    telemetry: pillarData.telemetry,
    actorsBreakdown: pillarData.actorsBreakdown,
    connectedSteps: pillarData.connectedSteps,
    eliteBrain: pillarData.eliteBrain
  };
}

function hexToRgbFloats(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length !== 6) return [0.06, 0.72, 0.5];
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  return [
    Number.isFinite(r) ? Number(r.toFixed(3)) : 0.1,
    Number.isFinite(g) ? Number(g.toFixed(3)) : 0.7,
    Number.isFinite(b) ? Number(b.toFixed(3)) : 0.8
  ];
}

/**
 * Generates a valid, multi-page %PDF-1.4 binary document containing the
 * structured pillar intelligence report, Thunglish analogy, and 24-month
 * timeline impact.
 */
export function generatePillarReportPdfBytes(
  report: StructuredPillarReport
): Uint8Array {
  const PAGE_WIDTH = 595.28; // A4 width in pt
  const PAGE_HEIGHT = 841.89; // A4 height in pt
  const MARGIN_X = 40;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
  const BOTTOM_LIMIT = 54;

  const pagesOps: string[][] = [[]];
  let currentPageIdx = 0;
  let cursorY = PAGE_HEIGHT - 40;

  const [accR, accG, accB] = hexToRgbFloats(report.accentColor);

  const pushOp = (op: string) => {
    pagesOps[currentPageIdx].push(op);
  };

  const ensureSpace = (neededPt: number) => {
    if (cursorY - neededPt < BOTTOM_LIMIT) {
      pagesOps.push([]);
      currentPageIdx += 1;
      cursorY = PAGE_HEIGHT - 44;

      // Top continuation bar on subsequent pages
      pushOp('0.04 0.06 0.10 rg');
      pushOp(`${MARGIN_X} ${cursorY - 18} ${CONTENT_WIDTH} 22 re f`);
      pushOp(`${accR} ${accG} ${accB} rg`);
      pushOp(`${MARGIN_X} ${cursorY - 18} 4 22 re f`);
      drawTextLine(
        `FUTIFY // ${sanitizePdfText(report.pillarName).toUpperCase()} - CONTINUATION`,
        MARGIN_X + 12,
        cursorY - 10,
        'F2',
        8.5,
        [0.85, 0.9, 0.96]
      );
      drawTextLine(
        report.reportId,
        PAGE_WIDTH - MARGIN_X - 135,
        cursorY - 10,
        'F3',
        8,
        [0.55, 0.65, 0.78]
      );
      cursorY -= 32;
    }
  };

  const drawTextLine = (
    rawText: string,
    x: number,
    y: number,
    fontRef: 'F1' | 'F2' | 'F3',
    fontSize: number,
    rgb: [number, number, number] = [0.1, 0.12, 0.16]
  ) => {
    const safe = escapePdfLiteral(sanitizePdfText(rawText));
    pushOp(
      `BT /${fontRef} ${fontSize} Tf ${rgb[0]} ${rgb[1]} ${rgb[2]} rg ${x.toFixed(
        2
      )} ${y.toFixed(2)} Td (${safe}) Tj ET`
    );
  };

  const drawSectionHeader = (code: string, title: string) => {
    ensureSpace(34);
    cursorY -= 6;
    pushOp('0.06 0.09 0.15 rg');
    pushOp(`${MARGIN_X} ${(cursorY - 18).toFixed(2)} ${CONTENT_WIDTH} 20 re f`);
    pushOp(`${accR} ${accG} ${accB} rg`);
    pushOp(`${MARGIN_X} ${(cursorY - 18).toFixed(2)} 4 20 re f`);
    drawTextLine(
      `${code} // ${title.toUpperCase()}`,
      MARGIN_X + 10,
      cursorY - 11,
      'F2',
      9,
      [0.95, 0.97, 1.0]
    );
    cursorY -= 28;
  };

  const drawWrappedParagraph = (
    text: string,
    options: {
      x?: number;
      maxChars?: number;
      fontRef?: 'F1' | 'F2' | 'F3';
      fontSize?: number;
      lineHeight?: number;
      rgb?: [number, number, number];
      bulletPrefix?: string;
    } = {}
  ) => {
    const x = options.x ?? MARGIN_X + 6;
    const maxChars = options.maxChars ?? 88;
    const fontRef = options.fontRef ?? 'F1';
    const fontSize = options.fontSize ?? 9.5;
    const lineHeight = options.lineHeight ?? 13.5;
    const rgb = options.rgb ?? [0.15, 0.18, 0.24];

    const lines = wrapPdfText(text, maxChars);
    ensureSpace(lines.length * lineHeight + 6);

    lines.forEach((line, idx) => {
      const prefix =
        idx === 0 && options.bulletPrefix ? `${options.bulletPrefix} ` : '';
      drawTextLine(`${prefix}${line}`, x, cursorY, fontRef, fontSize, rgb);
      cursorY -= lineHeight;
    });
  };

  // --- EXECUTIVE BANNER HEADER ---
  pushOp('0.03 0.05 0.09 rg');
  pushOp(`${MARGIN_X} ${(cursorY - 68).toFixed(2)} ${CONTENT_WIDTH} 72 re f`);
  pushOp(`${accR} ${accG} ${accB} rg`);
  pushOp(`${MARGIN_X} ${(cursorY - 68).toFixed(2)} 5 72 re f`);

  drawTextLine(
    'FUTIFY // OS 4.0 STRUCTURED INTELLIGENCE REPORT',
    MARGIN_X + 14,
    cursorY - 16,
    'F3',
    8.5,
    [0.25, 0.85, 0.95]
  );
  drawTextLine(
    `PILLAR: ${sanitizePdfText(report.pillarName).toUpperCase()} (${report.pillarId})`,
    MARGIN_X + 14,
    cursorY - 31,
    'F2',
    11,
    [1, 1, 1]
  );
  drawTextLine(
    `PROBABILITY SCORE: ${report.probabilityScore}%  |  CONFIDENCE: ${sanitizePdfText(
      report.confidenceBadge
    )}  |  GENERATED: ${sanitizePdfText(report.generatedAtIST)}`,
    MARGIN_X + 14,
    cursorY - 46,
    'F3',
    8,
    [0.75, 0.82, 0.9]
  );
  drawTextLine(
    `DESK SOURCE: ${sanitizePdfText(report.updatedAt)}  |  ID: ${report.reportId}`,
    MARGIN_X + 14,
    cursorY - 59,
    'F3',
    7.5,
    [0.58, 0.65, 0.76]
  );
  cursorY -= 82;

  // --- ACTIVE PILLAR HEADLINE ---
  const headlineLines = wrapPdfText(report.headline, 66);
  ensureSpace(headlineLines.length * 16 + 14);
  headlineLines.forEach((line) => {
    drawTextLine(line, MARGIN_X + 2, cursorY, 'F2', 13, [0.05, 0.08, 0.14]);
    cursorY -= 16;
  });
  cursorY -= 4;

  // --- SECTION 01: KEY QUANTITATIVE TELEMETRY ---
  drawSectionHeader('SECTION 01', 'Key Quantitative Pillar Telemetry');
  report.telemetry.forEach((stat, index) => {
    ensureSpace(30);
    pushOp('0.95 0.96 0.98 rg');
    pushOp(`${MARGIN_X} ${(cursorY - 20).toFixed(2)} ${CONTENT_WIDTH} 24 re f`);
    drawTextLine(
      `0${index + 1}. ${sanitizePdfText(stat.label)}: ${sanitizePdfText(
        stat.value
      )} (${sanitizePdfText(stat.velocity)})`,
      MARGIN_X + 8,
      cursorY - 7,
      'F2',
      9.5,
      [0.06, 0.1, 0.18]
    );
    drawTextLine(
      sanitizePdfText(stat.subtext),
      MARGIN_X + 24,
      cursorY - 17,
      'F1',
      8.5,
      [0.3, 0.35, 0.44]
    );
    cursorY -= 28;
  });

  // --- SECTION 02: STREET-SMART THUNGLISH ANALOGY & ACTOR STANCE ---
  drawSectionHeader(
    'SECTION 02',
    'Street-Smart Thunglish Analogy & Strategic Actors'
  );

  const analogy1Lines = wrapPdfText(report.thunglishAnalogy[0], 84);
  const analogy2Lines = wrapPdfText(report.thunglishAnalogy[1], 84);
  const analogyBoxHeight =
    (analogy1Lines.length + analogy2Lines.length) * 13.5 + 24;
  ensureSpace(analogyBoxHeight + 10);

  pushOp('0.94 0.98 0.99 rg');
  pushOp(
    `${MARGIN_X} ${(cursorY - analogyBoxHeight + 6).toFixed(
      2
    )} ${CONTENT_WIDTH} ${analogyBoxHeight.toFixed(2)} re f`
  );
  pushOp('0.08 0.65 0.78 rg');
  pushOp(
    `${MARGIN_X} ${(cursorY - analogyBoxHeight + 6).toFixed(
      2
    )} 3.5 ${analogyBoxHeight.toFixed(2)} re f`
  );

  cursorY -= 8;
  analogy1Lines.forEach((line) => {
    drawTextLine(
      line,
      MARGIN_X + 10,
      cursorY,
      'F2',
      9.5,
      [0.05, 0.12, 0.2]
    );
    cursorY -= 13.5;
  });
  cursorY -= 4;
  analogy2Lines.forEach((line) => {
    drawTextLine(
      line,
      MARGIN_X + 10,
      cursorY,
      'F1',
      9.2,
      [0.14, 0.22, 0.32]
    );
    cursorY -= 13.5;
  });
  cursorY -= 10;

  // Actors Breakdown
  report.actorsBreakdown.forEach((actor) => {
    ensureSpace(16);
    drawTextLine(
      `[${sanitizePdfText(actor.stance)}] ${sanitizePdfText(
        actor.actor
      )} - ${sanitizePdfText(actor.role)}`,
      MARGIN_X + 8,
      cursorY,
      'F3',
      8.2,
      [0.2, 0.25, 0.34]
    );
    cursorY -= 13;
  });
  cursorY -= 4;

  // --- SECTION 03: 24-MONTH TIMELINE IMPACT & TEMPORAL TRAJECTORY ---
  drawSectionHeader(
    'SECTION 03',
    'Temporal Trajectory & 24-Month Timeline Impact'
  );

  ensureSpace(20);
  drawTextLine(
    '1) PAST ROOT CAUSE (2-3 YEAR GENESIS):',
    MARGIN_X + 6,
    cursorY,
    'F2',
    9,
    [0.35, 0.4, 0.5]
  );
  cursorY -= 13;
  drawWrappedParagraph(report.timeline.pastRootCause, {
    x: MARGIN_X + 12,
    maxChars: 86,
    fontSize: 9,
    lineHeight: 13
  });
  cursorY -= 4;

  ensureSpace(20);
  drawTextLine(
    '2) PRESENT ACTIVE TRIGGER (LIVE 2026 INFLEXION):',
    MARGIN_X + 6,
    cursorY,
    'F2',
    9,
    [0.08, 0.45, 0.65]
  );
  cursorY -= 13;
  drawWrappedParagraph(report.timeline.presentNews, {
    x: MARGIN_X + 12,
    maxChars: 86,
    fontSize: 9,
    lineHeight: 13
  });
  cursorY -= 6;

  // Highlighted 24-Month Timeline Impact Box
  const futureLines = wrapPdfText(report.timeline.futureImpact24Month, 84);
  const futureBoxHeight = futureLines.length * 13.5 + 26;
  ensureSpace(futureBoxHeight + 8);

  pushOp('0.99 0.95 0.96 rg');
  pushOp(
    `${MARGIN_X} ${(cursorY - futureBoxHeight + 8).toFixed(
      2
    )} ${CONTENT_WIDTH} ${futureBoxHeight.toFixed(2)} re f`
  );
  pushOp('0.88 0.18 0.35 rg');
  pushOp(
    `${MARGIN_X} ${(cursorY - futureBoxHeight + 8).toFixed(
      2
    )} 4 ${futureBoxHeight.toFixed(2)} re f`
  );

  cursorY -= 6;
  drawTextLine(
    '3) 24-MONTH TIMELINE IMPACT (FORWARD HORIZON PREDICTION):',
    MARGIN_X + 10,
    cursorY,
    'F2',
    9.5,
    [0.72, 0.08, 0.24]
  );
  cursorY -= 14;
  futureLines.forEach((line) => {
    drawTextLine(
      line,
      MARGIN_X + 10,
      cursorY,
      'F2',
      9.2,
      [0.12, 0.08, 0.14]
    );
    cursorY -= 13.5;
  });
  cursorY -= 10;

  // --- SECTION 04: CROSS-PILLAR CAUSAL DOMINOES ---
  drawSectionHeader('SECTION 04', 'Cross-Pillar Contagion Dominoes');
  report.connectedSteps.forEach((step) => {
    ensureSpace(32);
    drawTextLine(
      `CHAIN 0${step.stepNumber}: ${sanitizePdfText(
        step.fromPillar
      )} (${sanitizePdfText(step.fromLabel)}) -> ${sanitizePdfText(
        step.toPillar
      )} (${sanitizePdfText(step.toLabel)})`,
      MARGIN_X + 6,
      cursorY,
      'F2',
      8.8,
      [0.1, 0.15, 0.25]
    );
    cursorY -= 12.5;
    drawWrappedParagraph(step.thunglishLine, {
      x: MARGIN_X + 14,
      maxChars: 85,
      fontSize: 8.8,
      lineHeight: 12.5,
      rgb: [0.22, 0.28, 0.36]
    });
    cursorY -= 3;
  });

  // --- SECTION 05: TITAN WINNER VS. FAILURE AUTOPSY & MENTAL MODEL ---
  drawSectionHeader(
    'SECTION 05',
    'Titan Winner vs. Failure Autopsy & Book Mental Model'
  );

  ensureSpace(28);
  drawTextLine(
    `TITAN WINNER: ${sanitizePdfText(report.eliteBrain.winnerTitle)}`,
    MARGIN_X + 6,
    cursorY,
    'F2',
    9.2,
    [0.04, 0.48, 0.32]
  );
  cursorY -= 13;
  report.eliteBrain.winnerPoints.forEach((pt) => {
    drawWrappedParagraph(pt, {
      x: MARGIN_X + 12,
      maxChars: 84,
      fontSize: 8.8,
      lineHeight: 12.5,
      bulletPrefix: '+'
    });
  });
  cursorY -= 4;

  ensureSpace(28);
  drawTextLine(
    `FAILURE AUTOPSY: ${sanitizePdfText(report.eliteBrain.failureTitle)}`,
    MARGIN_X + 6,
    cursorY,
    'F2',
    9.2,
    [0.75, 0.12, 0.22]
  );
  cursorY -= 13;
  report.eliteBrain.failurePoints.forEach((pt) => {
    drawWrappedParagraph(pt, {
      x: MARGIN_X + 12,
      maxChars: 84,
      fontSize: 8.8,
      lineHeight: 12.5,
      bulletPrefix: '-'
    });
  });
  cursorY -= 4;

  ensureSpace(34);
  drawTextLine(
    `BOOK MENTAL MODEL: "${sanitizePdfText(
      report.eliteBrain.charismaBook
    )}" (${sanitizePdfText(report.eliteBrain.charismaAuthor)}) - ${sanitizePdfText(
      report.eliteBrain.mentalModelTitle
    )}`,
    MARGIN_X + 6,
    cursorY,
    'F2',
    8.8,
    [0.18, 0.2, 0.35]
  );
  cursorY -= 12.5;
  drawWrappedParagraph(report.eliteBrain.mentalModelRule, {
    x: MARGIN_X + 12,
    maxChars: 84,
    fontSize: 8.8,
    lineHeight: 12.5
  });

  // --- ADD FOOTER TO ALL PAGES ---
  const totalPages = pagesOps.length;
  for (let p = 0; p < totalPages; p++) {
    const f1 = escapePdfLiteral(
      `FUTIFY // SEE TOMORROW FIRST - ${sanitizePdfText(
        report.pillarName
      )} Intelligence Report`
    );
    const f2 = escapePdfLiteral(`Page ${p + 1} of ${totalPages}`);
    pagesOps[p].push('0.82 0.85 0.90 RG 0.5 w');
    pagesOps[p].push(`${MARGIN_X} 38 ${ PAGE_WIDTH - MARGIN_X } 38 l S`);
    pagesOps[p].push(
      `BT /F3 7.5 Tf 0.45 0.50 0.58 rg ${MARGIN_X} 26 Td (${f1}) Tj ET`
    );
    pagesOps[p].push(
      `BT /F3 7.5 Tf 0.45 0.50 0.58 rg ${
        PAGE_WIDTH - MARGIN_X - 55
      } 26 Td (${f2}) Tj ET`
    );
  }

  // --- ASSEMBLE PDF 1.4 OBJECTS ---
  // Object IDs:
  // 1: Catalog
  // 2: Pages
  // 3: Font F1 (Helvetica)
  // 4: Font F2 (Helvetica-Bold)
  // 5: Font F3 (Courier)
  // For each page i (0..totalPages-1):
  //   pageObjId = 6 + i * 2
  //   contentObjId = 7 + i * 2
  const objects: string[] = [];
  const pageObjIds: number[] = [];

  for (let i = 0; i < totalPages; i++) {
    pageObjIds.push(6 + i * 2);
  }

  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push(
    `2 0 obj\n<< /Type /Pages /Kids [${pageObjIds
      .map((id) => `${id} 0 R`)
      .join(' ')}] /Count ${totalPages} >>\nendobj\n`
  );
  objects.push(
    '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n'
  );
  objects.push(
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n'
  );
  objects.push(
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>\nendobj\n'
  );

  for (let i = 0; i < totalPages; i++) {
    const pageObjId = 6 + i * 2;
    const contentObjId = 7 + i * 2;
    const streamBody = pagesOps[i].join('\n');
    const streamByteLen = new TextEncoder().encode(streamBody).byteLength;

    objects.push(
      `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
    );
    objects.push(
      `${contentObjId} 0 obj\n<< /Length ${streamByteLen} >>\nstream\n${streamBody}\nendstream\nendobj\n`
    );
  }

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let byteOffset = 0;

  const pushStr = (s: string) => {
    const bytes = encoder.encode(s);
    chunks.push(bytes);
    byteOffset += bytes.byteLength;
  };

  pushStr('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  for (const objStr of objects) {
    offsets.push(byteOffset);
    pushStr(objStr);
  }

  const xrefOffset = byteOffset;
  const totalObjectsCount = objects.length + 1;
  let xref = `xref\n0 ${totalObjectsCount}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    xref += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${totalObjectsCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  pushStr(xref);

  const output = new Uint8Array(byteOffset);
  let pos = 0;
  for (const chunk of chunks) {
    output.set(chunk, pos);
    pos += chunk.byteLength;
  }
  return output;
}

/**
 * Triggers a browser download of the generated PDF report bytes.
 */
export function triggerPdfReportDownload(report: StructuredPillarReport): {
  fileName: string;
  byteLength: number;
} {
  const pdfBytes = generatePillarReportPdfBytes(report);
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const ab = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;
    const blob = new Blob([ab], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = url;
      link.download = report.fileName;
      link.rel = 'noopener';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 4000);
    }, 60);
  }
  return {
    fileName: report.fileName,
    byteLength: pdfBytes.byteLength
  };
}
