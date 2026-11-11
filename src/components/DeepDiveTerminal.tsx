import React from 'react';
import {
  Rewind,
  Radio,
  FastForward,
  Flame,
  BookOpen,
  Lightbulb,
  Compass,
  FolderOpen
} from 'lucide-react';
import {
  CharismaLesson,
  IntelligenceItem,
  PILLARS,
  PillarId
} from '../engine/intelligenceEngine';

interface DeepDiveTerminalProps {
  item: IntelligenceItem;
  charisma: CharismaLesson;
  isProcessing: boolean;
  processingLabel: string;
  onOpenCaseStudy: (pillar: PillarId) => void;
}

export const DeepDiveTerminal: React.FC<DeepDiveTerminalProps> = ({
  item,
  charisma,
  isProcessing,
  processingLabel,
  onOpenCaseStudy
}) => {
  const pillarMeta = PILLARS[item.pillar];

  if (isProcessing) {
    return (
      <section
        aria-live="polite"
        className="rounded-xl bg-white/[0.03] backdrop-blur-md border border-cyan-500/40 p-8 min-h-[540px] flex flex-col items-center justify-center text-center space-y-5"
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center">
          <Radio className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
        <div className="space-y-2 max-w-md">
          <p className="font-mono text-xs tracking-widest text-cyan-400 uppercase">
            NEXUS-9 NEURAL DECRYPTION ENGINE
          </p>
          <h2 className="font-display text-2xl font-bold text-white">
            Processing Pattern...
          </h2>
          <p className="text-sm font-mono text-slate-400">
            {processingLabel}
          </p>
        </div>
        <div className="w-full max-w-sm bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
          <div className="bg-cyan-400 h-full w-3/4 animate-scanline" />
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {/* Main Deep-Dive Intelligence Briefing Card */}
      <section
        aria-label="Deep-Dive Intelligence Terminal"
        className={`rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 space-y-6 ${pillarMeta.glowClass}`}
      >
        {/* Top Metadata Row (Clean unboxed separators per Zero-Pill rule) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className={`font-semibold ${pillarMeta.textClass}`}>
              {pillarMeta.name}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">{item.code}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">{item.region}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-rose-400 font-semibold">
              {item.severity} ({item.signalScore}/100)
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenCaseStudy(item.pillar)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-cyan-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Open {pillarMeta.shortLabel} Case Study</span>
          </button>
        </div>

        {/* Primary Signal Headline */}
        <div className="space-y-2">
          <h2 className="font-display text-xl md:text-2xl font-bold text-white leading-snug tracking-tight">
            {item.headline}
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Intercept Timestamp: {item.timestamp} · Decoded in Street-Smart Thunglish Mode
          </p>
        </div>

        {/* High-Energy Street-Smart Thunglish Briefing */}
        <div className="rounded-xl bg-[#080D16] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              THUNGLISH INTELLIGENCE DECODE (STREET-SMART BRIEFING)
            </span>
            <span className="text-xs font-mono text-slate-400">
              PERSONA // WAR-ROOM COMMANDER
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-100 leading-relaxed">
            {item.thunglishBriefing}
          </p>

          {/* Relatable Everyday Analogy */}
          <div className="pt-3 border-t border-white/10 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-amber-200/90 leading-relaxed">
              <span className="font-mono font-semibold text-amber-300 uppercase mr-1.5">
                Everyday Analogy:
              </span>
              {item.everydayAnalogy}
            </div>
          </div>
        </div>

        {/* Quantitative Key Telemetry Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {item.keyMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="rounded-lg bg-white/[0.02] border border-white/10 p-3.5 flex flex-col justify-between"
            >
              <span className="text-xs font-mono text-slate-400">
                {metric.label}
              </span>
              <div className="flex items-baseline justify-between gap-2 mt-1.5">
                <span className="font-mono text-base font-bold text-white tabular-nums">
                  {metric.value}
                </span>
                <span className={`font-mono text-xs tabular-nums ${pillarMeta.textClass}`}>
                  {metric.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* THE 3D MATRIX: [⏪ PAST: Root Cause] -> [⏺️ PRESENT: Trigger] -> [⏩ FUTURE: 2-Year Prediction] */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>THE 3D TEMPORAL MATRIX // CAUSAL TRAJECTORY</span>
            </h3>
            <span className="font-mono text-xs text-slate-400">
              [⏪ PAST] ➔ [⏺️ PRESENT] ➔ [⏩ FUTURE]
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {/* PAST */}
            <div className="rounded-xl bg-[#070A10] border border-amber-500/30 p-4 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Rewind className="w-3.5 h-3.5" />
                  <span>[⏪ PAST: Root Cause]</span>
                </span>
                <span>T - 36M</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                {item.matrix3D.pastRootCause}
              </p>
            </div>

            {/* PRESENT */}
            <div className="rounded-xl bg-[#070A10] border border-cyan-500/40 p-4 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>[⏺️ PRESENT: Trigger]</span>
                </span>
                <span>NOW // ACTIVE</span>
              </div>
              <p className="text-xs md:text-sm text-white font-medium leading-relaxed">
                {item.matrix3D.presentTrigger}
              </p>
            </div>

            {/* FUTURE */}
            <div className="rounded-xl bg-[#070A10] border border-emerald-500/40 p-4 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <FastForward className="w-3.5 h-3.5" />
                  <span>[⏩ FUTURE: 2-Year Prediction]</span>
                </span>
                <span>2028 HORIZON</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                {item.matrix3D.futurePrediction}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE CHARISMA DOJO: Glowing Footer Card */}
      <section
        aria-label="The Charisma Dojo Mental Model"
        className="rounded-xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-purple-500/10 backdrop-blur-md border border-amber-400/40 p-6 shadow-[0_0_30px_-8px_rgba(245,158,11,0.3)] space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="font-display text-sm font-bold tracking-wider uppercase text-amber-300">
              THE CHARISMA DOJO // MENTAL MODEL & POWER DYNAMICS
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-200">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{charisma.bookReference}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-white">
              {charisma.modelName}
            </h3>
            <span className="text-xs font-mono text-cyan-300">
              {charisma.lawOrConcept} ({charisma.author})
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            {charisma.thunglishBreakdown}
          </p>
        </div>

        <div className="rounded-lg bg-black/40 border border-amber-400/30 p-3.5 flex items-start gap-2.5">
          <span className="font-mono text-xs font-bold uppercase text-amber-400 shrink-0 mt-0.5">
            COMMANDER ACTION:
          </span>
          <p className="text-xs md:text-sm text-amber-100 font-medium">
            {charisma.tacticalAction}
          </p>
        </div>
      </section>
    </div>
  );
};
