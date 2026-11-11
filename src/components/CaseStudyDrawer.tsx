import React from 'react';
import { X, CheckCircle2, AlertOctagon, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { PILLARS, PillarId } from '../engine/intelligenceEngine';

interface CaseStudyDrawerProps {
  activePillar: PillarId | null;
  onSelectPillar: (pillar: PillarId) => void;
  onClose: () => void;
}

export const CaseStudyDrawer: React.FC<CaseStudyDrawerProps> = ({
  activePillar,
  onSelectPillar,
  onClose
}) => {
  if (!activePillar) return null;

  const meta = PILLARS[activePillar];
  const { caseStudy } = meta;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-drawer-title"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="relative z-10 w-full max-w-2xl bg-[#070A0F] border-l border-white/15 h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>{meta.code}</span>
                <span aria-hidden="true">·</span>
                <span className={meta.textClass}>{caseStudy.codename}</span>
                <span aria-hidden="true">·</span>
                <span>CLASSIFIED DOSSIER</span>
              </div>
              <h2
                id="case-study-drawer-title"
                className="font-display text-2xl font-bold text-white mt-1 tracking-tight"
              >
                {meta.name}: Success vs. Failure Autopsy
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {caseStudy.sectorSummary}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Case Study Drawer"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pillar Switcher inside Drawer */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-lg border border-white/10">
            {(Object.keys(PILLARS) as PillarId[]).map((pid) => {
              const p = PILLARS[pid];
              const isSelected = pid === activePillar;
              return (
                <button
                  key={pid}
                  type="button"
                  onClick={() => onSelectPillar(pid)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white/15 text-white font-semibold border border-white/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {p.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Street-Smart Thunglish Executive Synthesis */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THUNGLISH WAR-ROOM AXIOM</span>
            </div>
            <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
              “{caseStudy.thunglishTakeaway}”
            </p>
          </div>

          {/* Success Case Study */}
          <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>APEX SUCCESS BLUEPRINT</span>
                <span aria-hidden="true">·</span>
                <span>{caseStudy.successCase.year}</span>
              </div>
              <span className="font-mono text-xs text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded border border-emerald-500/30">
                {caseStudy.successCase.metric}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-white">
              {caseStudy.successCase.title}
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Entity: {caseStudy.successCase.entity}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {caseStudy.successCase.breakdown}
            </p>

            <div className="pt-3 border-t border-emerald-500/20 flex items-start gap-2 text-xs text-emerald-200">
              <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="font-semibold">Strategic Lesson:</strong>{' '}
                {caseStudy.successCase.strategicLesson}
              </span>
            </div>
          </div>

          {/* Failure Case Study */}
          <div className="rounded-xl bg-rose-950/20 border border-rose-500/30 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>STRATEGIC FAILURE AUTOPSY</span>
                <span aria-hidden="true">·</span>
                <span>{caseStudy.failureCase.year}</span>
              </div>
              <span className="font-mono text-xs text-rose-300 bg-rose-500/15 px-2.5 py-1 rounded border border-rose-500/30">
                {caseStudy.failureCase.metric}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-white">
              {caseStudy.failureCase.title}
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Entity: {caseStudy.failureCase.entity}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {caseStudy.failureCase.breakdown}
            </p>

            <div className="pt-3 border-t border-rose-500/20 flex items-start gap-2 text-xs text-rose-200">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong className="font-semibold">Autopsy Verdict:</strong>{' '}
                {caseStudy.failureCase.autopsyLesson}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>NEXUS-9 ARCHIVE // {meta.code}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            Return to War Room
          </button>
        </div>
      </aside>
    </div>
  );
};
