import React, { useState, useMemo } from 'react';
import {
  Network,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  Flame,
  Zap,
  Lock,
  Unlock
} from 'lucide-react';
import { NeatPillarData, NeatPillarId, ConnectedDotStep } from '../engine/nexusNeatEngine';
import { startOrSwitchStoryVoice, hardStopVoiceEngine } from '../services/voiceAnchor';

interface InteractivePatternLabProps {
  currentData: NeatPillarData;
  activePillar: NeatPillarId;
  onSelectPillar: (pillarId: NeatPillarId) => void;
}

interface NodePosition {
  id: NeatPillarId;
  label: string;
  chip: string;
  x: number;
  y: number;
  accent: string;
  border: string;
  badge: string;
}

const PILLAR_META_CONFIG: Record<
  NeatPillarId,
  { label: string; accent: string; border: string; badge: string }
> = {
  MONEY: {
    label: '💰 Money',
    accent: '#F59E0B',
    border: 'border-amber-400/50',
    badge: 'bg-amber-500/15 text-amber-200'
  },
  GEOPOLITICS: {
    label: '🌍 Geopolitics',
    accent: '#A855F7',
    border: 'border-purple-400/50',
    badge: 'bg-purple-500/15 text-purple-200'
  },
  DEFENCE: {
    label: '🛡️ Defence',
    accent: '#F43F5E',
    border: 'border-rose-400/50',
    badge: 'bg-rose-500/15 text-rose-200'
  },
  AEROSPACE: {
    label: '🚀 Aerospace',
    accent: '#10B981',
    border: 'border-emerald-400/50',
    badge: 'bg-emerald-500/15 text-emerald-200'
  },
  TECH: {
    label: '💻 Tech',
    accent: '#22D3EE',
    border: 'border-cyan-400/50',
    badge: 'bg-cyan-500/15 text-cyan-200'
  }
};

export const InteractivePatternLab: React.FC<InteractivePatternLabProps> = ({
  currentData,
  activePillar,
  onSelectPillar
}) => {
  // Steps available for current story
  const steps: ConnectedDotStep[] = currentData.connectedSteps || [];

  // Track discovered connection indices (defaults to step 0 discovered)
  const [discoveredIndices, setDiscoveredIndices] = useState<number[]>([0]);
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);
  const [isSpeakingStep, setIsSpeakingStep] = useState<boolean>(false);
  const [activeSourceNode, setActiveSourceNode] = useState<NeatPillarId>(activePillar);

  // Sync active source node when activePillar changes
  React.useEffect(() => {
    setActiveSourceNode(activePillar);
    setDiscoveredIndices([0]);
    setSelectedStepIdx(0);
    hardStopVoiceEngine();
    setIsSpeakingStep(false);
  }, [activePillar, currentData.id]);

  const allDiscovered = discoveredIndices.length >= steps.length;
  const progressPercent = Math.round((discoveredIndices.length / Math.max(1, steps.length)) * 100);

  // Discover a step by index
  const handleDiscoverStep = (stepIdx: number) => {
    if (!discoveredIndices.includes(stepIdx)) {
      setDiscoveredIndices((prev) => [...prev, stepIdx].sort((a, b) => a - b));
    }
    setSelectedStepIdx(stepIdx);
  };

  // Auto-trace full contagion chain
  const handleAutoTraceAll = () => {
    const all = steps.map((_, i) => i);
    setDiscoveredIndices(all);
    setSelectedStepIdx(0);
  };

  // Reset lab
  const handleResetLab = () => {
    setDiscoveredIndices([0]);
    setSelectedStepIdx(0);
    hardStopVoiceEngine();
    setIsSpeakingStep(false);
  };

  // Active highlighted step
  const activeStep = steps[selectedStepIdx] || steps[0];

  // Speak the active step using token-locked audio engine
  const handleToggleSpeakStep = () => {
    if (isSpeakingStep) {
      hardStopVoiceEngine();
      setIsSpeakingStep(false);
      return;
    }

    if (!activeStep) return;

    setIsSpeakingStep(true);
    startOrSwitchStoryVoice(
      {
        pillar: activeStep.fromChip,
        title: `Contagion link from ${activeStep.fromChip} to ${activeStep.toChip}`,
        emotion: 'CRISIS',
        analogy: activeStep.thunglishLine,
        failureAutopsy: `Notice how a disturbance in ${activeStep.fromChip} cascades into ${activeStep.toChip} with compounding leverage.`,
        futureImpact: `Decision makers must hedge both domains simultaneously to insulate their capital.`
      },
      0.78,
      undefined,
      (speaking) => setIsSpeakingStep(speaking)
    );
  };

  return (
    <section
      aria-label="Interactive Connect-the-Dots Pattern Lab"
      data-testid="interactive-pattern-lab"
      className="rounded-2xl bg-[#090C15]/90 backdrop-blur-2xl border border-white/15 shadow-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all"
    >
      {/* Header & Mode Controls */}
      <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 font-mono text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>PATTERN LAB // CONNECT-THE-DOTS</span>
            </span>
            <span className="font-mono text-xs text-slate-400">
              Active Cross-Sector Contagion
            </span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-white">
            🔗 Link Sector Nodes to Uncover Hidden Causal Chains
          </h2>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoTraceAll}
            data-testid="pattern-lab-auto-trace"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 font-mono text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-950/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>✦ Auto-Trace All</span>
          </button>

          <button
            type="button"
            onClick={handleResetLab}
            data-testid="pattern-lab-reset"
            title="Reset Discovered Links"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress & Contagion Meter */}
      <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Contagion Discovery:</span>
          <span className="font-bold text-cyan-300">
            {discoveredIndices.length} / {steps.length} Chains Unlocked
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-200 font-bold">
            {progressPercent}%
          </span>
        </div>

        {allDiscovered ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 font-mono text-[11px] font-bold text-emerald-300 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>🏆 MASTER PATTERN RECOGNITION: FULL CONTAGION UNCOVERED</span>
          </span>
        ) : (
          <span className="font-mono text-[11px] text-amber-300/90 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Click any locked chain below to draw the laser link</span>
          </span>
        )}
      </div>

      {/* Interactive Vector Linking Surface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {steps.map((step, idx) => {
          const isUnlocked = discoveredIndices.includes(idx);
          const isSelected = selectedStepIdx === idx;
          const fromMeta = PILLAR_META_CONFIG[step.fromPillar];
          const toMeta = PILLAR_META_CONFIG[step.toPillar];

          return (
            <div
              key={step.stepNumber}
              onClick={() => handleDiscoverStep(idx)}
              data-testid={`pattern-node-${idx}`}
              className={`rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-950/60 scale-[1.02]'
                  : isUnlocked
                  ? 'bg-black/50 border-white/15 hover:border-cyan-400/50 hover:bg-black/70'
                  : 'bg-black/30 border-white/10 opacity-70 hover:opacity-100 hover:border-amber-400/40'
              }`}
            >
              {/* Top Link Indicators */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300 uppercase">
                  LINK 0{step.stepNumber}
                </span>

                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-400">
                    <Unlock className="w-3 h-3" />
                    <span>ACTIVE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-400">
                    <Lock className="w-3 h-3" />
                    <span>CONNECT</span>
                  </span>
                )}
              </div>

              {/* Node Pair Visual */}
              <div className="flex items-center justify-between gap-2 py-2 border-y border-white/10 my-2">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    ORIGIN
                  </span>
                  <div
                    className={`font-display text-xs font-bold text-white px-2 py-0.5 rounded ${fromMeta.badge} border ${fromMeta.border}`}
                  >
                    {step.fromChip}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center px-1">
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isUnlocked
                        ? 'text-cyan-400 animate-pulse translate-x-0.5'
                        : 'text-slate-600'
                    }`}
                  />
                  <span className="font-mono text-[8px] text-slate-400 mt-0.5">
                    TRIGGERS
                  </span>
                </div>

                <div className="space-y-0.5 text-right">
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    RIPPLE TARGET
                  </span>
                  <div
                    className={`font-display text-xs font-bold text-white px-2 py-0.5 rounded ${toMeta.badge} border ${toMeta.border}`}
                  >
                    {step.toChip}
                  </div>
                </div>
              </div>

              <p className="font-sans text-xs text-slate-200 line-clamp-2 leading-relaxed mt-2">
                {step.thunglishLine}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Selected Causal Chain Spotlight Card */}
      {activeStep && (
        <div
          data-testid="pattern-active-spotlight"
          className="rounded-2xl p-5 bg-[#070B14]/95 border border-cyan-400/40 shadow-2xl space-y-3.5 relative overflow-hidden"
        >
          {/* Subtle Ambient Laser Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-white/10 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 font-mono text-xs font-bold text-cyan-300">
                CHAIN 0{activeStep.stepNumber} SPOTLIGHT
              </span>
              <span className="font-mono text-xs text-slate-300">
                {activeStep.fromChip} ➔ {activeStep.toChip}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleSpeakStep}
                data-testid="pattern-speak-step-btn"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  isSpeakingStep
                    ? 'bg-rose-500/25 border border-rose-400 text-rose-200 animate-pulse shadow-lg shadow-rose-950/40'
                    : 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200'
                }`}
              >
                {isSpeakingStep ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                    <span>⏹ Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                    <span>🔊 Listen Chain Decode</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onSelectPillar(activeStep.toPillar)}
                data-testid="pattern-pivot-pillar-btn"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-mono text-xs font-extrabold shadow-lg transition-colors cursor-pointer"
              >
                <span>Pivot to {activeStep.toChip}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE UNBROKEN THUNGLISH DOMINO MECHANISM</span>
            </div>
            <p className="font-sans text-sm sm:text-base font-medium text-white leading-relaxed">
              {activeStep.thunglishLine}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
