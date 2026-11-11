import React from 'react';
import { Network, ArrowRight } from 'lucide-react';
import {
  CARBON_PILLARS,
  CarbonBriefingItem,
  CarbonPillarId
} from '../engine/carbonPulseEngine';

interface SvgDotConnectorGraphProps {
  item: CarbonBriefingItem;
  highlightedPillar: CarbonPillarId | null;
  onSelectLinkedPillar: (pillar: CarbonPillarId) => void;
}

export const SvgDotConnectorGraph: React.FC<SvgDotConnectorGraphProps> = ({
  item,
  highlightedPillar,
  onSelectLinkedPillar
}) => {
  const sourcePillar = CARBON_PILLARS[item.pillar];
  const dots = item.connected_dots;
  const targetYPositions = [28, 72, 116];

  return (
    <section
      aria-label="Visual SVG Dot-Connector Graph"
      className="hud-panel rounded-xl p-3.5 space-y-2.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-2">
        <div className="flex items-center gap-1.5">
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
            VISUAL SVG DOT-CONNECTOR GRAPH // CROSS-PILLAR CONTAGION
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-400">
          Click any SVG node or vector card to pivot pillar
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
        {/* Interactive SVG Node Topology (7 cols) */}
        <div className="xl:col-span-7 bg-[#05070B]/90 rounded-lg border border-white/[0.06] px-2 py-1">
          <svg
            viewBox="0 0 580 144"
            className="w-full h-[126px] select-none"
            role="img"
            aria-label={`Causal topology graph connecting ${sourcePillar.label} to linked pillars`}
          >
            <defs>
              <linearGradient id="pulseLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={sourcePillar.accentHex} stopOpacity="0.85" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.45" />
              </linearGradient>
            </defs>

            {dots.slice(0, 3).map((dot, idx) => {
              const targetMeta = CARBON_PILLARS[dot.target_pillar];
              const ty = targetYPositions[idx] || 72;
              const isHighlighted = highlightedPillar === dot.target_pillar;

              return (
                <g
                  key={`${dot.target_pillar}-${idx}`}
                  onClick={() => onSelectLinkedPillar(dot.target_pillar)}
                  className="cursor-pointer"
                >
                  <path
                    d={`M 148 72 C 235 72, 255 ${ty}, 335 ${ty}`}
                    fill="none"
                    stroke={isHighlighted ? targetMeta.accentHex : 'url(#pulseLineGrad)'}
                    strokeWidth={isHighlighted ? 2.4 : 1.5}
                    strokeDasharray={isHighlighted ? 'none' : '4 3'}
                  />

                  <rect
                    x="202"
                    y={(72 + ty) / 2 - 9}
                    width="98"
                    height="17"
                    rx="3"
                    fill="#080C14"
                    stroke={targetMeta.accentHex}
                    strokeOpacity="0.45"
                  />
                  <text
                    x="251"
                    y={(72 + ty) / 2 + 2.5}
                    textAnchor="middle"
                    fill="#E2E8F0"
                    fontSize="8.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {dot.telemetry_delta.slice(0, 15)}
                  </text>

                  <rect
                    x="335"
                    y={ty - 17}
                    width="235"
                    height="34"
                    rx="5"
                    fill={isHighlighted ? 'rgba(255,255,255,0.09)' : '#0B101B'}
                    stroke={targetMeta.accentHex}
                    strokeWidth={isHighlighted ? 1.8 : 1.1}
                  />
                  <circle cx="348" cy={ty} r="4" fill={targetMeta.accentHex} />
                  <text
                    x="358"
                    y={ty - 3}
                    fill={targetMeta.accentHex}
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {targetMeta.label}
                  </text>
                  <text
                    x="358"
                    y={ty + 9}
                    fill="#CBD5E1"
                    fontSize="9"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {dot.node_label.slice(0, 31)}
                  </text>
                </g>
              );
            })}

            <g>
              <rect
                x="8"
                y="46"
                width="140"
                height="52"
                rx="6"
                fill="#0D1422"
                stroke={sourcePillar.accentHex}
                strokeWidth="1.8"
              />
              <text
                x="18"
                y="63"
                fill={sourcePillar.accentHex}
                fontSize="9"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                {sourcePillar.shortTag}
              </text>
              <text
                x="18"
                y="77"
                fill="#FFFFFF"
                fontSize="9.5"
                fontWeight="600"
                fontFamily="Space Grotesk, sans-serif"
              >
                {item.code}
              </text>
              <text
                x="18"
                y="90"
                fill="#94A3B8"
                fontSize="8.5"
                fontFamily="JetBrains Mono, monospace"
              >
                {dots.length} Linked Vectors
              </text>
            </g>
          </svg>
        </div>

        {/* Detailed Causal Chain Cards (5 cols) */}
        <div className="xl:col-span-5 space-y-1.5">
          {dots.map((dot, idx) => {
            const targetMeta = CARBON_PILLARS[dot.target_pillar];
            const isHighlighted = highlightedPillar === dot.target_pillar;

            return (
              <button
                key={`${dot.target_pillar}-card-${idx}`}
                type="button"
                onClick={() => onSelectLinkedPillar(dot.target_pillar)}
                className={`w-full text-left rounded-lg px-3 py-2 border transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-white/[0.08] border-cyan-400/60'
                    : 'bg-[#070A10]/90 border-white/[0.08] hover:border-white/25 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                  <span className={`font-semibold ${targetMeta.textClass}`}>
                    {targetMeta.label}: {dot.node_label}
                  </span>
                  <span className="text-cyan-300 shrink-0">{dot.telemetry_delta}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5 line-clamp-2">
                  {dot.causal_chain}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
