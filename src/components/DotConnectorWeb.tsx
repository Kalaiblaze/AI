import React from 'react';
import { GitCommitHorizontal, ArrowRight, Network } from 'lucide-react';
import { DotConnectionStep, PILLARS, PillarId } from '../engine/intelligenceEngine';

interface DotConnectorWebProps {
  title: string;
  patternSummary: string;
  steps: DotConnectionStep[];
  activePillar: PillarId;
  onSelectPillarFeed: (pillar: PillarId) => void;
}

export const DotConnectorWeb: React.FC<DotConnectorWebProps> = ({
  title,
  patternSummary,
  steps,
  activePillar,
  onSelectPillarFeed
}) => {
  return (
    <section
      aria-label="Dot-Connector Causal Web"
      className="rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-5 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Network className="w-3.5 h-3.5" />
            <span>THE DOT-CONNECTOR WEB // CROSS-DOMAIN CONTAGION</span>
          </div>
          <h3 className="font-display text-base font-bold text-white mt-0.5">
            {title}
          </h3>
        </div>
        <span className="font-mono text-xs text-slate-400">
          Click any node to inspect signal
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {patternSummary}
      </p>

      {/* Interactive Visual Chain */}
      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const fromMeta = PILLARS[step.fromPillar];
          const toMeta = PILLARS[step.toPillar];
          const isHighlighted =
            activePillar === step.fromPillar || activePillar === step.toPillar;

          return (
            <div
              key={`${step.fromPillar}-${step.toPillar}-${index}`}
              className={`rounded-lg p-3.5 border transition-colors ${
                isHighlighted
                  ? 'bg-white/[0.06] border-cyan-500/40'
                  : 'bg-[#070B11]/90 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectPillarFeed(step.fromPillar)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border cursor-pointer transition-transform active:scale-95 ${fromMeta.badgeClass}`}
                  >
                    {fromMeta.shortLabel}: {step.fromNode}
                  </button>

                  <span className="text-slate-400 flex items-center gap-1 font-mono text-xs">
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">triggers</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectPillarFeed(step.toPillar)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border cursor-pointer transition-transform active:scale-95 ${toMeta.badgeClass}`}
                  >
                    {toMeta.shortLabel}: {step.toNode}
                  </button>
                </div>

                <span className="font-mono text-xs text-cyan-300">
                  {step.impactDelta}
                </span>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-300 pl-1">
                <GitCommitHorizontal className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{step.mechanism}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
