import React from 'react';
import { AreaChart, Area, YAxis } from 'recharts';
import { TelemetryStat } from '../engine/nexusNeatEngine';

const TONE_CONFIG: Record<
  TelemetryStat['tone'],
  {
    valueText: string;
    velocityBadge: string;
    stroke: string;
    fillId: string;
    dot: string;
  }
> = {
  cyan: {
    valueText: 'text-cyan-300',
    velocityBadge: 'bg-cyan-500/10 border-cyan-400/25 text-cyan-300',
    stroke: '#22d3ee',
    fillId: 'spark-cyan',
    dot: 'bg-cyan-400'
  },
  emerald: {
    valueText: 'text-emerald-300',
    velocityBadge: 'bg-emerald-500/10 border-emerald-400/25 text-emerald-300',
    stroke: '#34d399',
    fillId: 'spark-emerald',
    dot: 'bg-emerald-400'
  },
  amber: {
    valueText: 'text-amber-300',
    velocityBadge: 'bg-amber-500/10 border-amber-400/25 text-amber-300',
    stroke: '#fbbf24',
    fillId: 'spark-amber',
    dot: 'bg-amber-400'
  },
  rose: {
    valueText: 'text-rose-300',
    velocityBadge: 'bg-rose-500/10 border-rose-400/25 text-rose-300',
    stroke: '#fb7185',
    fillId: 'spark-rose',
    dot: 'bg-rose-400'
  },
  purple: {
    valueText: 'text-purple-300',
    velocityBadge: 'bg-purple-500/10 border-purple-400/25 text-purple-300',
    stroke: '#c084fc',
    fillId: 'spark-purple',
    dot: 'bg-purple-400'
  }
};

interface MetricSparklineCardProps {
  stat: TelemetryStat;
  index: number;
}

export const MetricSparklineCard: React.FC<MetricSparklineCardProps> = ({
  stat,
  index
}) => {
  const cfg = TONE_CONFIG[stat.tone];
  const gradientId = `${cfg.fillId}-${index}`;

  return (
    <div
      data-testid={`metric-sparkline-card-${index}`}
      className="rounded-xl bg-[#06070A] border border-white/[0.07] p-4 flex flex-col justify-between space-y-2.5"
    >
      {/* Top Row: Label + Dot */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider truncate">
          {stat.label}
        </span>
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      </div>

      {/* Middle Row: Big Numeric Value + Mini Recharts 7-Day SVG Sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div
            className={`font-display text-xl sm:text-2xl font-bold tracking-tight tabular-nums whitespace-nowrap ${cfg.valueText}`}
          >
            {stat.value}
          </div>
          <span
            className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-mono font-semibold whitespace-nowrap ${cfg.velocityBadge}`}
          >
            {stat.velocity}
          </span>
        </div>

        {/* Mini 7-Day Historical Trend SVG Sparkline (Recharts) */}
        <div
          aria-label={`7-day historical trend sparkline for ${stat.label}`}
          className="shrink-0 flex flex-col items-end"
        >
          <AreaChart
            width={92}
            height={38}
            data={stat.trend7d}
            margin={{ top: 3, right: 2, left: 2, bottom: 2 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cfg.stroke} stopOpacity={0.38} />
                <stop offset="95%" stopColor={cfg.stroke} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <Area
              type="monotone"
              dataKey="value"
              stroke={cfg.stroke}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
            7D Trend
          </span>
        </div>
      </div>

      {/* Bottom Subtext */}
      <p className="text-xs text-slate-400 leading-snug">{stat.subtext}</p>
    </div>
  );
};
