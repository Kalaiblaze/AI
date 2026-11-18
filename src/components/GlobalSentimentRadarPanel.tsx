import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import {
  Activity,
  ArrowUpRight,
  Flame,
  Globe2,
  Layers
} from 'lucide-react';
import { NeatPillarId } from '../engine/nexusNeatEngine';
import {
  GlobalSentimentSnapshot,
  SentimentRadarAxisDatum
} from '../engine/globalSentimentRadarEngine';

interface GlobalSentimentRadarPanelProps {
  snapshot: GlobalSentimentSnapshot;
  activePillar: NeatPillarId;
  onSelectPillar: (pillarId: NeatPillarId) => void;
}

const SVG_WIDTH = 500;
const SVG_HEIGHT = 420;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = 212;
const MAX_RADIUS = 128;
const GRID_LEVELS = [20, 40, 60, 80, 100];

const ALERT_STATE_META: Record<
  GlobalSentimentSnapshot['globalAlertState'],
  { label: string; badgeClass: string }
> = {
  CRITICAL_TURBULENCE: {
    label: 'CRITICAL GLOBAL VOLATILITY',
    badgeClass: 'bg-rose-500/15 text-rose-200 border-rose-400/50'
  },
  ELEVATED_STRESS: {
    label: 'ELEVATED MULTI-PILLAR STRESS',
    badgeClass: 'bg-amber-500/15 text-amber-200 border-amber-400/50'
  },
  STEADY_PULSE: {
    label: 'CONTAINED SIGNAL PULSE',
    badgeClass: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/45'
  }
};

export const GlobalSentimentRadarPanel: React.FC<
  GlobalSentimentRadarPanelProps
> = ({ snapshot, activePillar, onSelectPillar }) => {
  const [inspectedPillarId, setInspectedPillarId] =
    useState<NeatPillarId | null>(null);
  const [showBaseline, setShowBaseline] = useState<boolean>(true);

  const focusedAxis: SentimentRadarAxisDatum = useMemo(() => {
    if (inspectedPillarId) {
      const found = snapshot.axes.find(
        (a) => a.pillarId === inspectedPillarId
      );
      if (found) return found;
    }
    return snapshot.mostVolatileAxis;
  }, [inspectedPillarId, snapshot]);

  // D3 radial geometry, scaleLinear, and lineRadial path generators
  const radarGeometry = useMemo(() => {
    const axes = snapshot.axes;
    const total = axes.length;
    const angleSlice = (Math.PI * 2) / total;

    const radiusScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, MAX_RADIUS]);

    const currentLineGen = d3
      .lineRadial<SentimentRadarAxisDatum>()
      .angle((_, i) => i * angleSlice)
      .radius((d) => radiusScale(d.intensity))
      .curve(d3.curveLinearClosed);

    const baselineLineGen = d3
      .lineRadial<SentimentRadarAxisDatum>()
      .angle((_, i) => i * angleSlice)
      .radius((d) => radiusScale(d.baselineIntensity))
      .curve(d3.curveLinearClosed);

    const currentPolygonPath = currentLineGen(axes) || '';
    const baselinePolygonPath = baselineLineGen(axes) || '';

    const peakIntensity = d3.max(axes, (d) => d.intensity) ?? 90;
    const meanIntensity = Math.round(d3.mean(axes, (d) => d.intensity) ?? 85);

    const vertexNodes = axes.map((axis, idx) => {
      // Shift by -PI/2 so axis 0 points straight up (12 o'clock) matching d3.lineRadial angle=0
      const theta = idx * angleSlice - Math.PI / 2;
      const r = radiusScale(axis.intensity);
      const rBase = radiusScale(axis.baselineIntensity);
      const outerR = MAX_RADIUS;
      const labelR = MAX_RADIUS + 34;

      return {
        axis,
        idx,
        x: CENTER_X + r * Math.cos(theta),
        y: CENTER_Y + r * Math.sin(theta),
        baseX: CENTER_X + rBase * Math.cos(theta),
        baseY: CENTER_Y + rBase * Math.sin(theta),
        outerX: CENTER_X + outerR * Math.cos(theta),
        outerY: CENTER_Y + outerR * Math.sin(theta),
        labelX: CENTER_X + labelR * Math.cos(theta),
        labelY: CENTER_Y + labelR * Math.sin(theta)
      };
    });

    const gridPolygons = GRID_LEVELS.map((level) => {
      const r = radiusScale(level);
      const points = axes
        .map((_, idx) => {
          const theta = idx * angleSlice - Math.PI / 2;
          return `${(CENTER_X + r * Math.cos(theta)).toFixed(1)},${(
            CENTER_Y +
            r * Math.sin(theta)
          ).toFixed(1)}`;
        })
        .join(' ');
      return { level, r, points };
    });

    return {
      radiusScale,
      currentPolygonPath,
      baselinePolygonPath,
      vertexNodes,
      gridPolygons,
      peakIntensity,
      meanIntensity
    };
  }, [snapshot.axes]);

  const alertMeta = ALERT_STATE_META[snapshot.globalAlertState];

  return (
    <section
      id="global-sentiment-radar"
      aria-label="Global Sentiment Analysis D3 Radar Chart"
      data-testid="global-sentiment-radar-section"
      className="rounded-3xl bg-[#090C15]/85 backdrop-blur-2xl border border-white/10 shadow-2xl p-6 space-y-5"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-rose-300">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>D3 RADAR TELEMETRY // 5-PILLAR PULSE</span>
            </span>
            <span
              data-testid="global-volatility-status-badge"
              className={`px-2 py-0.5 rounded border font-mono text-[10px] font-bold uppercase ${alertMeta.badgeClass}`}
            >
              {alertMeta.label}
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Global Sentiment Analysis</span>
            <span className="font-serif-italic font-normal text-2xl sm:text-3xl text-rose-300">
              Volatility Radar
            </span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Aggregate emotional intensity across all 5 global intelligence
            pillars — click any radar node or region to inspect active stress
            corridors and volatile hotspots.
          </p>
        </div>

        {/* Aggregate Index + Baseline Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            data-testid="toggle-radar-baseline-btn"
            onClick={() => setShowBaseline((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold cursor-pointer transition-colors ${
              showBaseline
                ? 'bg-white/10 border-white/25 text-slate-100'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-300" />
            <span>{showBaseline ? 'Baseline Ring: On' : 'Baseline Ring: Off'}</span>
          </button>

          <div
            data-testid="global-volatility-index-card"
            className="rounded-xl bg-black/60 border border-rose-400/35 px-3.5 py-2 text-right"
          >
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Global Volatility Index
            </div>
            <div className="font-display text-2xl font-extrabold tabular-nums text-white leading-tight">
              {snapshot.globalVolatilityIndex}
              <span className="text-xs font-mono font-semibold text-rose-300 ml-1">
                / 100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Column Radar + Hotspot Ranking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 Columns: D3 Pentagonal Radar Chart SVG */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-2xl bg-[#05070D]/90 border border-white/[0.08] p-3 relative">
          <svg
            data-testid="global-sentiment-d3-svg"
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            role="img"
            aria-label="5-pillar emotional intensity D3 radar chart"
            className="w-full max-w-[520px] h-auto select-none overflow-visible"
          >
            <defs>
              <radialGradient
                id="sentiment-radar-fill"
                cx="50%"
                cy="50%"
                r="55%"
              >
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.48" />
                <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.16" />
              </radialGradient>
              <linearGradient
                id="sentiment-radar-stroke"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>

            {/* Concentric D3 Spiderweb Grid Polygons (20..100) */}
            <g aria-hidden="true">
              {radarGeometry.gridPolygons.map(({ level, r, points }) => (
                <g key={level}>
                  <polygon
                    points={points}
                    fill={
                      level === 100
                        ? 'rgba(255,255,255,0.015)'
                        : 'none'
                    }
                    stroke={
                      level === 80
                        ? 'rgba(251, 113, 133, 0.22)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }
                    strokeWidth={level === 80 ? 1.25 : 1}
                    strokeDasharray={level === 100 ? undefined : '3 3'}
                  />
                  <text
                    x={CENTER_X + 6}
                    y={CENTER_Y - r + 3}
                    fill="#94A3B8"
                    fontSize="10"
                    fontFamily="ui-monospace, SFMono-Regular, monospace"
                  >
                    {level}
                  </text>
                </g>
              ))}

              {/* Radial Axis Spokes */}
              {radarGeometry.vertexNodes.map(({ axis, outerX, outerY }) => (
                <line
                  key={`spoke-${axis.pillarId}`}
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={outerX}
                  y2={outerY}
                  stroke={
                    focusedAxis.pillarId === axis.pillarId
                      ? 'rgba(255,255,255,0.38)'
                      : 'rgba(255,255,255,0.12)'
                  }
                  strokeWidth={focusedAxis.pillarId === axis.pillarId ? 1.5 : 1}
                />
              ))}
            </g>

            {/* D3 lineRadial Baseline Polygon (7-Day Normal Benchmark) */}
            {showBaseline && (
              <g transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
                <path
                  data-testid="sentiment-radar-baseline-path"
                  d={radarGeometry.baselinePolygonPath}
                  fill="rgba(148, 163, 184, 0.08)"
                  stroke="#94A3B8"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                />
              </g>
            )}

            {/* D3 lineRadial Current Aggregate Emotional Intensity Polygon */}
            <g transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
              <path
                data-testid="sentiment-radar-intensity-path"
                d={radarGeometry.currentPolygonPath}
                fill="url(#sentiment-radar-fill)"
                stroke="url(#sentiment-radar-stroke)"
                strokeWidth={2.5}
              />
            </g>

            {/* Interactive Axis Vertices + Labels */}
            {radarGeometry.vertexNodes.map(
              ({ axis, x, y, labelX, labelY }) => {
                const isFocused = focusedAxis.pillarId === axis.pillarId;
                const isPeak =
                  snapshot.mostVolatileAxis.pillarId === axis.pillarId;
                const isHeroActive = activePillar === axis.pillarId;

                return (
                  <g
                    key={`node-${axis.pillarId}`}
                    data-testid={`sentiment-radar-axis-${axis.pillarId}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${axis.shortLabel}: ${axis.intensity}% emotional intensity in ${axis.hotspotRegion}`}
                    onClick={() => setInspectedPillarId(axis.pillarId)}
                    onMouseEnter={() => setInspectedPillarId(axis.pillarId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setInspectedPillarId(axis.pillarId);
                      }
                    }}
                    className="cursor-pointer focus:outline-none"
                  >
                    {/* Outer Focus / Peak Ring */}
                    {(isFocused || isPeak) && (
                      <circle
                        cx={x}
                        cy={y}
                        r={isFocused ? 11 : 9}
                        fill="none"
                        stroke={axis.emotionTheme.accentHex}
                        strokeOpacity={isFocused ? 0.85 : 0.45}
                        strokeWidth={1.5}
                      />
                    )}

                    {/* Main Interactive Vertex Dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isFocused ? 6.5 : 5}
                      fill={axis.emotionTheme.accentHex}
                      stroke="#05070D"
                      strokeWidth={2}
                    />

                    {/* Explicit Clickable Vertex Target */}
                    <circle
                      data-testid={`sentiment-radar-vertex-${axis.pillarId}`}
                      cx={x}
                      cy={y}
                      r={20}
                      fill="rgba(0,0,0,0)"
                    />

                    {/* Axis Title + Numeric Score Label */}
                    <text
                      x={labelX}
                      y={labelY - 5}
                      textAnchor="middle"
                      fill={isFocused ? '#FFFFFF' : '#CBD5E1'}
                      fontSize="12"
                      fontWeight={isFocused ? '700' : '600'}
                      fontFamily="system-ui, sans-serif"
                    >
                      {axis.shortLabel}
                    </text>
                    <text
                      x={labelX}
                      y={labelY + 11}
                      textAnchor="middle"
                      fill={axis.emotionTheme.accentHex}
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="ui-monospace, SFMono-Regular, monospace"
                    >
                      {axis.intensity}%{isHeroActive ? ' ★' : ''}
                    </text>
                  </g>
                );
              }
            )}
          </svg>

          {/* Compact Legend Footer */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-slate-200">
                <span className="w-3 h-0.5 bg-gradient-to-r from-rose-400 to-cyan-300 inline-block" />
                Live Emotional Intensity
              </span>
              {showBaseline && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 border-t border-dashed border-slate-400 inline-block" />
                  7-Day Baseline
                </span>
              )}
            </div>
            <span className="tabular-nums">
              Mean: <strong className="text-white">{radarGeometry.meanIntensity}%</strong> · Peak:{' '}
              <strong className="text-rose-300">{radarGeometry.peakIntensity}%</strong>
            </span>
          </div>
        </div>

        {/* Right 5 Columns: Volatile Spotlight Card + Ranked Global Hotspots */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Active / Most Volatile Global Region Spotlight */}
          <div
            data-testid="most-volatile-region-card"
            className="rounded-2xl bg-black/55 border border-white/15 p-4 space-y-2.5"
            style={{
              borderColor: `${focusedAxis.emotionTheme.accentHex}66`
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-rose-300">
                  <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>
                    {focusedAxis.pillarId === snapshot.mostVolatileAxis.pillarId
                      ? 'MOST VOLATILE REGION NOW'
                      : 'INSPECTED CORRIDOR'}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-white truncate">
                  {focusedAxis.fullName}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <div
                  className="font-display text-2xl font-extrabold tabular-nums leading-none"
                  style={{ color: focusedAxis.emotionTheme.accentHex }}
                >
                  {focusedAxis.intensity}%
                </div>
                <div className="font-mono text-[10px] tabular-nums text-slate-400 mt-0.5">
                  {focusedAxis.deltaVsBaseline >= 0
                    ? `+${focusedAxis.deltaVsBaseline}`
                    : focusedAxis.deltaVsBaseline}{' '}
                  vs 7d base
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <span className="truncate">{focusedAxis.hotspotRegion}</span>
            </div>

            <p className="text-xs text-slate-300 leading-snug line-clamp-2">
              {focusedAxis.headline}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-white/10">
              <span
                className={`px-2 py-0.5 rounded border font-mono text-[10px] font-bold ${focusedAxis.emotionTheme.badgeClass}`}
              >
                {focusedAxis.emotionTheme.shortLabel}
              </span>

              <div className="flex items-center gap-2">
                {inspectedPillarId &&
                  inspectedPillarId !== snapshot.mostVolatileAxis.pillarId && (
                    <button
                      type="button"
                      onClick={() => setInspectedPillarId(null)}
                      className="font-mono text-[11px] text-slate-400 hover:text-white cursor-pointer"
                    >
                      Peak (#1)
                    </button>
                  )}
                <button
                  type="button"
                  data-testid="sentiment-pivot-pillar-btn"
                  onClick={() => onSelectPillar(focusedAxis.pillarId)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 font-mono text-[11px] font-bold text-white cursor-pointer transition-colors"
                >
                  <span>Focus {focusedAxis.shortLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 5-Pillar Volatile Regions Ranking */}
          <div
            data-testid="sentiment-volatility-ranking"
            className="rounded-2xl bg-black/45 border border-white/10 p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1 border-b border-white/[0.07]">
              <span className="uppercase tracking-wider font-semibold">
                Volatility Rank Across 5 Pillars
              </span>
              <span>Intensity</span>
            </div>

            <div className="space-y-1.5">
              {snapshot.volatileRanking.map((item, rankIdx) => {
                const isSelected = focusedAxis.pillarId === item.pillarId;
                return (
                  <button
                    key={item.pillarId}
                    type="button"
                    data-testid={`sentiment-ranking-row-${item.pillarId}`}
                    onClick={() => setInspectedPillarId(item.pillarId)}
                    className={`w-full rounded-xl px-2.5 py-2 text-left border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/30'
                        : 'bg-black/35 border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-slate-400 tabular-nums w-4 shrink-0">
                          #{rankIdx + 1}
                        </span>
                        <span className="font-display font-bold text-white truncate">
                          {item.shortLabel}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 truncate hidden sm:inline">
                          · {item.hotspotRegion.split('·')[0].trim()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums">
                        {item.hasMomentumSurge && (
                          <span className="text-[10px] font-bold text-amber-300">
                            SURGE
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {item.deltaVsBaseline >= 0
                            ? `+${item.deltaVsBaseline}`
                            : item.deltaVsBaseline}
                        </span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: item.emotionTheme.accentHex }}
                        >
                          {item.intensity}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.intensity}%`,
                          backgroundColor: item.emotionTheme.accentHex
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
