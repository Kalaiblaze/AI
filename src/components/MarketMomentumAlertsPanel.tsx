import React from 'react';
import { TrendingUp, RefreshCw, X, ArrowUpRight } from 'lucide-react';
import { NEAT_PILLARS, PILLAR_ROTATION_ORDER, NeatPillarId } from '../engine/nexusNeatEngine';
import {
  MOMENTUM_SURGE_THRESHOLD,
  MomentumAlertItem,
  PillarProbabilityMap
} from '../engine/momentumAlertsEngine';

interface MarketMomentumAlertsPanelProps {
  alerts: MomentumAlertItem[];
  pillarProbabilities: PillarProbabilityMap;
  activePillar: NeatPillarId;
  isSyncing: boolean;
  lastSyncedAt: string;
  onTriggerSyncCheck: () => void;
  onSelectPillar: (pillarId: NeatPillarId) => void;
  onDismissAlert: (alertId: string) => void;
  onClearAllAlerts?: () => void;
}

const PILLAR_CODES: Record<NeatPillarId, string> = {
  MONEY: 'MNY',
  GEOPOLITICS: 'GEO',
  DEFENCE: 'DEF',
  AEROSPACE: 'AERO',
  TECH: 'TECH'
};

export const MarketMomentumAlertsPanel: React.FC<MarketMomentumAlertsPanelProps> = ({
  alerts,
  pillarProbabilities,
  activePillar,
  isSyncing,
  lastSyncedAt,
  onTriggerSyncCheck,
  onSelectPillar,
  onDismissAlert,
  onClearAllAlerts
}) => {
  const hasAlerts = alerts.length > 0;
  const alertedPillars = new Set(alerts.map((a) => a.pillarId));

  return (
    <div
      data-testid="market-momentum-alerts-panel"
      aria-label="Market Momentum Alerts"
      className={`rounded-2xl backdrop-blur-2xl border p-3 space-y-2 transition-colors duration-300 ${
        hasAlerts
          ? 'bg-[#120C06]/92 border-amber-400/55 shadow-[0_0_28px_-8px_rgba(245,158,11,0.45)]'
          : 'bg-[#080B12]/90 border-white/[0.12]'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <TrendingUp
              className={`w-4 h-4 shrink-0 ${
                hasAlerts ? 'text-amber-400' : 'text-cyan-300'
              }`}
            />
            <h2 className="font-display text-sm font-bold tracking-tight text-white truncate">
              Market Momentum Alerts
            </h2>
            {hasAlerts && (
              <span
                data-testid="momentum-alert-count"
                className="font-mono text-[11px] font-bold tabular-nums text-amber-300"
              >
                ({alerts.length})
              </span>
            )}
          </div>
          <p className="font-mono text-[10px] text-slate-400 truncate">
            &gt;+{MOMENTUM_SURGE_THRESHOLD}% surge · {lastSyncedAt}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {hasAlerts && onClearAllAlerts && alerts.length > 1 && (
            <button
              type="button"
              data-testid="clear-all-momentum-alerts-btn"
              onClick={onClearAllAlerts}
              className="px-1.5 py-1 rounded-lg font-mono text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            data-testid="momentum-sync-check-btn"
            onClick={onTriggerSyncCheck}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 font-mono text-[11px] font-semibold text-slate-100 cursor-pointer disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3 h-3 text-cyan-300 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing…' : 'Sync Check'}</span>
          </button>
        </div>
      </div>

      {/* Surge Alerts List or Quiet Monitoring Summary */}
      {hasAlerts ? (
        <div
          data-testid="momentum-alerts-list"
          className="space-y-1.5 max-h-[126px] overflow-y-auto pr-0.5"
        >
          {alerts.map((alert) => (
            <div
              key={alert.id}
              data-testid="momentum-alert-card"
              data-pillar={alert.pillarId}
              className="group flex items-start justify-between gap-2 rounded-xl bg-black/55 border border-amber-400/35 hover:border-amber-300/65 p-2 transition-colors"
            >
              <button
                type="button"
                onClick={() => onSelectPillar(alert.pillarId)}
                className="flex-1 min-w-0 text-left space-y-0.5 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-amber-200 truncate">
                      {alert.pillarName}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-amber-300/80 opacity-75 group-hover:opacity-100 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] tabular-nums">
                    <span className="text-slate-400">
                      {alert.previousProbability}% ➔{' '}
                      <strong className="text-white font-bold">
                        {alert.currentProbability}%
                      </strong>
                    </span>
                    <span
                      data-testid="momentum-alert-delta"
                      className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-200 font-bold"
                    >
                      +{alert.deltaPoints}%
                    </span>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-100 line-clamp-1">
                  {alert.headline}
                </p>
                <p className="font-mono text-[10px] text-amber-200/75 truncate">
                  {alert.catalystReason}
                </p>
              </button>

              <button
                type="button"
                data-testid="dismiss-momentum-alert-btn"
                aria-label={`Dismiss momentum alert for ${alert.pillarName}`}
                onClick={() => onDismissAlert(alert.id)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer shrink-0 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          data-testid="momentum-empty-state"
          className="rounded-xl bg-black/45 border border-white/[0.08] px-2.5 py-2 text-[11px] text-slate-300 leading-snug"
        >
          Monitoring all 5 pillars. Run <span className="text-cyan-300 font-semibold">Sync Check</span> to detect single-sync jumps above +{MOMENTUM_SURGE_THRESHOLD}%.
        </div>
      )}

      {/* 5-Pillar Live Probability Strip */}
      <div
        aria-label="Live Pillar Probability Scores"
        className="grid grid-cols-5 gap-1.5 pt-0.5"
      >
        {PILLAR_ROTATION_ORDER.map((pid) => {
          const score = pillarProbabilities[pid] ?? 74;
          const isSelected = activePillar === pid;
          const isSurging = alertedPillars.has(pid);

          return (
            <button
              key={pid}
              type="button"
              data-testid={`momentum-pillar-score-${pid}`}
              title={`${NEAT_PILLARS[pid].shortName}: ${score}% probability`}
              onClick={() => onSelectPillar(pid)}
              className={`rounded-lg px-1.5 py-1 border text-center cursor-pointer transition-colors ${
                isSurging
                  ? 'bg-amber-500/15 border-amber-400/55 text-amber-200'
                  : isSelected
                  ? 'bg-white/[0.12] border-white/35 text-white'
                  : 'bg-black/45 border-white/[0.08] text-slate-300 hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="font-mono text-[9px] font-semibold tracking-wider opacity-80">
                {PILLAR_CODES[pid]}
              </div>
              <div className="font-mono text-xs font-bold tabular-nums">
                {score}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
