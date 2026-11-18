import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileDown,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import {
  StructuredPillarReport,
  triggerPdfReportDownload
} from '../engine/pdfReportEngine';

interface PdfReportModalProps {
  isOpen: boolean;
  report: StructuredPillarReport;
  lastDownloadSize?: number | null;
  onClose: () => void;
  onRedownload: (info: { fileName: string; byteLength: number }) => void;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  report,
  lastDownloadSize,
  onClose,
  onRedownload
}) => {
  const [justDownloaded, setJustDownloaded] = useState(false);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const handleDownloadClick = () => {
    const info = triggerPdfReportDownload(report);
    onRedownload(info);
    setJustDownloaded(true);
    setTimeout(() => setJustDownloaded(false), 2200);
  };

  const formattedKb = lastDownloadSize
    ? `${(lastDownloadSize / 1024).toFixed(1)} KB`
    : 'PDF 1.4';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Structured PDF Intelligence Report for ${report.pillarName}`}
      data-testid="pdf-report-modal"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5"
    >
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090D18] border border-white/15 shadow-2xl overflow-hidden text-slate-100">
        {/* Top Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-[#050811] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-400/40 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-rose-300" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                  {report.reportId}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 font-mono text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>
                    Downloaded {report.fileName} ({formattedKb})
                  </span>
                </span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-extrabold text-white truncate">
                Structured Intelligence Report — {report.pillarName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              data-testid="modal-download-pdf-btn"
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-cyan-500 hover:from-rose-400 hover:to-cyan-400 text-white font-display text-xs font-bold shadow-lg cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {justDownloaded ? 'PDF Downloaded ✓' : 'Download Report as PDF'}
              </span>
            </button>

            <button
              type="button"
              data-testid="close-pdf-report-modal-btn"
              aria-label="Close PDF report preview"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Structured Document Sheet */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Document Executive Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#070A12] border border-white/15 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white font-bold">
                {report.chipLabel} · {report.pillarName}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 font-bold">
                  Pillar Probability: {report.probabilityScore}%
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/40 text-rose-200 font-bold">
                  {report.confidenceBadge}
                </span>
              </div>
            </div>

            <h3
              data-testid="pdf-report-headline"
              className="font-display text-xl sm:text-2xl font-extrabold text-white leading-snug"
            >
              {report.headline}
            </h3>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
              <span>Desk Source: {report.updatedAt}</span>
              <span>Generated: {report.generatedAtIST}</span>
            </div>
          </div>

          {/* SECTION 01: Key Quantitative Telemetry */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Section 01 // Key Quantitative Pillar Telemetry</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.telemetry.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-black/55 border border-white/10 p-3.5 space-y-1"
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-lg font-extrabold text-white">
                      {stat.value}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-300 font-semibold">
                      {stat.velocity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {stat.subtext}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 02: Street-Smart Thunglish Analogy & Strategic Actors */}
          <div
            data-testid="pdf-report-thunglish-section"
            className="rounded-2xl bg-cyan-950/25 border border-cyan-400/35 p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Section 02 // Street-Smart Thunglish Analogy</span>
              </div>
              <span className="font-mono text-[10px] text-cyan-200/80 uppercase">
                Included in PDF
              </span>
            </div>

            <p className="text-sm font-medium text-white leading-relaxed">
              {report.thunglishAnalogy[0]}
            </p>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {report.thunglishAnalogy[1]}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
              {report.actorsBreakdown.map((act, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-black/50 border border-white/10 p-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display text-xs font-bold text-white">
                      {act.actor}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[9px] font-bold text-cyan-300">
                      {act.stance}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {act.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 03: Temporal Trajectory & 24-Month Timeline Impact */}
          <div
            data-testid="pdf-report-timeline-section"
            className="space-y-3"
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-rose-300">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>
                Section 03 // Temporal Trajectory &amp; 24-Month Timeline Impact
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl bg-black/50 border border-white/10 p-4 space-y-1.5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ⏪ Past Root Cause (2–3 Yr Genesis)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.timeline.pastRootCause}
                </p>
              </div>

              <div className="rounded-xl bg-black/50 border border-cyan-500/30 p-4 space-y-1.5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  ⏺️ Present Trigger (Live 2026 Inflexion)
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {report.timeline.presentNews}
                </p>
              </div>

              <div
                data-testid="pdf-report-24m-impact"
                className="rounded-xl bg-rose-950/30 border-2 border-rose-400/50 p-4 space-y-1.5 shadow-[0_0_25px_-8px_rgba(244,63,94,0.45)]"
              >
                <div className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-rose-300">
                  ⏩ 24-Month Timeline Impact (Horizon)
                </div>
                <p className="text-xs text-white font-medium leading-relaxed">
                  {report.timeline.futureImpact24Month}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 04 & 05: Dominoes + Titan Winner vs Failure Autopsy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-black/50 border border-white/10 p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Section 04 // Cross-Pillar Dominoes</span>
              </div>
              <div className="space-y-2">
                {report.connectedSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="rounded-lg bg-white/[0.03] border border-white/10 p-2.5 space-y-1"
                  >
                    <div className="font-mono text-[10px] font-bold text-emerald-300">
                      Chain 0{step.stepNumber}: {step.fromChip} ➔ {step.toChip}
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">
                      {step.thunglishLine}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-black/50 border border-white/10 p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Section 05 // Titan Winner &amp; Book Rule</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg bg-emerald-950/25 border border-emerald-500/30 p-2.5">
                  <div className="font-display font-bold text-emerald-300">
                    🏆 {report.eliteBrain.winnerTitle}
                  </div>
                  <p className="text-slate-300 mt-1 leading-snug">
                    {report.eliteBrain.winnerPoints[0]}
                  </p>
                </div>
                <div className="rounded-lg bg-rose-950/25 border border-rose-500/30 p-2.5">
                  <div className="font-display font-bold text-rose-300">
                    💥 {report.eliteBrain.failureTitle}
                  </div>
                  <p className="text-slate-300 mt-1 leading-snug">
                    {report.eliteBrain.failurePoints[0]}
                  </p>
                </div>
                <div className="rounded-lg bg-amber-950/20 border border-amber-500/30 p-2.5">
                  <div className="font-mono text-[10px] text-amber-300 font-bold">
                    📚 {report.eliteBrain.charismaBook} ({report.eliteBrain.charismaAuthor})
                  </div>
                  <p className="text-slate-200 mt-0.5 leading-snug">
                    “{report.eliteBrain.mentalModelTitle}” —{' '}
                    {report.eliteBrain.mentalModelRule}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#050811] border-t border-white/10 text-xs font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <FileDown className="w-4 h-4 text-cyan-400" />
            <span>
              File: <strong className="text-slate-200">{report.fileName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadClick}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer transition-colors"
            >
              Download PDF Again
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 font-semibold cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
