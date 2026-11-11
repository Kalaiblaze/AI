import React, { useState, useMemo } from 'react';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  Brain,
  ShieldAlert,
  Trophy,
  Clock,
  X,
  Sparkles,
  Link2,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { NeatPillarData } from '../engine/nexusNeatEngine';
import { NewsEmotionTheme } from '../engine/newsEmotionTheme';
import {
  playLiveNewsAnchorBriefing,
  stopNewsAnchorSpeech
} from '../services/voiceAnchor';

export interface MindMapInspectionNode {
  id: string;
  branchType: 'HUB' | 'TEMPORAL' | 'DOMINO' | 'WINNER' | 'FAILURE';
  branchLabel: string;
  title: string;
  tag: string;
  thunglishDecode: string;
  firstPrinciplesRule: string;
  spokenScript: string;
  colorClass: string;
  borderClass: string;
}

interface InteractiveMindMapViewProps {
  activeStory: NeatPillarData;
  activeEmotion: NewsEmotionTheme;
  onOpenMentor?: (initialPrompt?: string) => void;
  onPlayVideoBriefing?: () => void;
}

export const InteractiveMindMapView: React.FC<InteractiveMindMapViewProps> = ({
  activeStory,
  activeEmotion,
  onOpenMentor,
  onPlayVideoBriefing
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [activeNode, setActiveNode] = useState<MindMapInspectionNode | null>(
    null
  );
  const [isSpeakingNode, setIsSpeakingNode] = useState<boolean>(false);

  // Derive the 4 Branches dynamically bound 100% to activeStory
  const branchData = useMemo(() => {
    const hubNode: MindMapInspectionNode = {
      id: `hub-${activeStory.id}`,
      branchType: 'HUB',
      branchLabel: 'CENTRAL INTELLIGENCE HUB',
      title: activeStory.headline,
      tag: `${activeStory.chipLabel} · ${activeEmotion.shortLabel}`,
      thunglishDecode: activeStory.thunglishAnalogy[0],
      firstPrinciplesRule: activeStory.thunglishAnalogy[1],
      spokenScript: `${activeStory.headline}. ${activeStory.thunglishAnalogy[0]} ${activeStory.thunglishAnalogy[1]}`,
      colorClass: 'text-white',
      borderClass: 'border-cyan-400/60'
    };

    const pastNode: MindMapInspectionNode = {
      id: `temporal-past-${activeStory.id}`,
      branchType: 'TEMPORAL',
      branchLabel: '⏳ TEMPORAL // ⏪ PAST ROOT CAUSE',
      title: 'Historical Foundation & Root Inversion',
      tag: '⏪ 2-3 Yr Past Genesis',
      thunglishDecode: activeStory.timeline.pastRootCause,
      firstPrinciplesRule:
        'Always look 2-3 years back: what cheap assumption was made that became today’s structural crisis?',
      spokenScript: `Past Root Cause: ${activeStory.timeline.pastRootCause}`,
      colorClass: 'text-amber-300',
      borderClass: 'border-amber-400/40'
    };

    const presentNode: MindMapInspectionNode = {
      id: `temporal-present-${activeStory.id}`,
      branchType: 'TEMPORAL',
      branchLabel: '⏳ TEMPORAL // ⏺️ PRESENT TRIGGER',
      title: 'Active Immediate Catalyst',
      tag: '⏺️ Live 2026 Inflexion',
      thunglishDecode: activeStory.timeline.presentNews,
      firstPrinciplesRule:
        'The tipping point where latent structural friction turns into acute public pricing.',
      spokenScript: `Present Trigger: ${activeStory.timeline.presentNews}`,
      colorClass: 'text-cyan-300',
      borderClass: 'border-cyan-400/40'
    };

    const futureNode: MindMapInspectionNode = {
      id: `temporal-future-${activeStory.id}`,
      branchType: 'TEMPORAL',
      branchLabel: '⏳ TEMPORAL // ⏩ 24M PREDICTION',
      title: 'Second-Order Trajectory Shift',
      tag: '⏩ 24–60 Month Shift',
      thunglishDecode: activeStory.timeline.futureImpact,
      firstPrinciplesRule:
        'Never predict the first obvious step; anticipate where scarce capacity shifts when competitors crowd the exit.',
      spokenScript: `Future Prediction: ${activeStory.timeline.futureImpact}`,
      colorClass: 'text-emerald-300',
      borderClass: 'border-emerald-400/40'
    };

    const dominoNodes: MindMapInspectionNode[] = activeStory.connectedSteps.map(
      (step, idx) => ({
        id: `domino-step-${idx}-${activeStory.id}`,
        branchType: 'DOMINO',
        branchLabel: `🔗 DOMINO CHAIN // STEP ${step.stepNumber}`,
        title: `${step.fromChip} ➔ ${step.toChip}`,
        tag: `Ripple Phase ${idx + 1}`,
        thunglishDecode: step.thunglishLine,
        firstPrinciplesRule:
          'A shift in one sovereign resource inevitably forces a counter-action in adjacent technology and defense budgets.',
        spokenScript: `Domino Step ${step.stepNumber}: ${step.fromChip} to ${step.toChip}. ${step.thunglishLine}`,
        colorClass: 'text-purple-300',
        borderClass: 'border-purple-400/40'
      })
    );

    const winnerNode: MindMapInspectionNode = {
      id: `winner-${activeStory.id}`,
      branchType: 'WINNER',
      branchLabel: '🏆 TITAN WINNER ARCHITECTURE',
      title: activeStory.eliteBrain.winnerTitle,
      tag: 'First-Principles Execution',
      thunglishDecode: `${activeStory.eliteBrain.winnerPoints[0]} ${activeStory.eliteBrain.winnerPoints[1]}`,
      firstPrinciplesRule: activeStory.eliteBrain.speakingTip,
      spokenScript: `Titan Winner: ${activeStory.eliteBrain.winnerTitle}. ${activeStory.eliteBrain.winnerPoints[0]} ${activeStory.eliteBrain.winnerPoints[1]}`,
      colorClass: 'text-emerald-300',
      borderClass: 'border-emerald-400/40'
    };

    const failureNode: MindMapInspectionNode = {
      id: `failure-${activeStory.id}`,
      branchType: 'FAILURE',
      branchLabel: '💥 FAILURE AUTOPSY & 🧠 BOOK RULE',
      title: activeStory.eliteBrain.failureTitle,
      tag: `${activeStory.eliteBrain.charismaBook} (${activeStory.eliteBrain.charismaAuthor})`,
      thunglishDecode: `${activeStory.eliteBrain.failurePoints[0]} ${activeStory.eliteBrain.failurePoints[1]}`,
      firstPrinciplesRule: `Book Model: "${activeStory.eliteBrain.mentalModelTitle}" — ${activeStory.eliteBrain.mentalModelRule}`,
      spokenScript: `Failure Autopsy: ${activeStory.eliteBrain.failureTitle}. Fatal flaw: ${activeStory.eliteBrain.failurePoints[0]}. Mental Model from ${activeStory.eliteBrain.charismaBook}: ${activeStory.eliteBrain.mentalModelRule}`,
      colorClass: 'text-rose-300',
      borderClass: 'border-rose-400/40'
    };

    return {
      hub: hubNode,
      temporal: [pastNode, presentNode, futureNode],
      dominoes: dominoNodes,
      winner: winnerNode,
      failure: failureNode
    };
  }, [activeStory, activeEmotion]);

  const handleSpeakNode = (node: MindMapInspectionNode) => {
    if (isSpeakingNode) {
      stopNewsAnchorSpeech();
      setIsSpeakingNode(false);
      return;
    }

    setIsSpeakingNode(true);
    void playLiveNewsAnchorBriefing(
      {
        headline: node.title,
        emotion: activeEmotion.id === 'CRITICAL_ALERT' ? 'CRISIS' : 'TENSION',
        sourceBadge: node.branchLabel,
        summary: node.spokenScript,
        thunglishAnalogy: node.thunglishDecode,
        titanTakeaway: node.firstPrinciplesRule,
        pillarId: activeStory.id
      },
      {
        onStart: () => setIsSpeakingNode(true),
        onEnd: () => setIsSpeakingNode(false)
      }
    );
  };

  const handleAskMentor = (node: MindMapInspectionNode) => {
    if (onOpenMentor) {
      onOpenMentor(
        `Explain this Mind Map branch in detail: "${node.title}" (${node.branchLabel}) for the story: "${activeStory.headline}". Give me the first-principles strategic lesson.`
      );
    }
  };

  return (
    <section
      id="mind-map-view"
      aria-label="FUTIFY Interactive Visual Mind Map View"
      data-testid="interactive-mind-map"
      className="w-full min-h-[580px] relative bg-[#070A12]/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-5 sm:p-8 overflow-hidden shadow-2xl transition-all duration-500"
    >
      {/* Top Header & Zoom Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Network className="w-3.5 h-3.5" />
              <span>INTERACTIVE MIND MAP // CAUSAL NEXUS</span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded font-mono text-xs font-semibold border ${activeEmotion.badgeClass}`}
            >
              {activeEmotion.shortLabel}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300">
              100% Synced to Active Story
            </span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-white">
            {activeStory.headline}
          </h2>
          <p className="font-mono text-xs text-slate-400">
            Click any branch node to inspect deep Thunglish decode & trigger
            crystal-clear voice briefing
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-xl bg-black/60 border border-white/15 p-1 text-slate-300 font-mono text-xs">
            <button
              type="button"
              title="Zoom Out"
              onClick={() => setZoomLevel((prev) => Math.max(0.85, prev - 0.1))}
              className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold select-none text-[11px]">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              title="Zoom In"
              onClick={() => setZoomLevel((prev) => Math.min(1.25, prev + 0.1))}
              className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Reset Zoom"
              onClick={() => setZoomLevel(1.0)}
              className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer text-slate-400 hover:text-white border-l border-white/10 ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {onPlayVideoBriefing && (
            <button
              type="button"
              onClick={onPlayVideoBriefing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-mono text-xs font-bold text-white shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Video Briefing</span>
            </button>
          )}
        </div>
      </div>

      {/* Mind Map Canvas with Scaling */}
      <div
        className="relative min-h-[580px] w-full mt-6 flex flex-col justify-between transition-transform duration-300 origin-top"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Dynamic Curved SVG Connector Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={activeEmotion.accentHex} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Center Hub to Branch 1 (Top-Left: Temporal) */}
          <path
            d="M 500 290 C 400 270, 310 180, 240 130"
            fill="none"
            stroke={activeEmotion.accentHex}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="animate-pulse"
            filter="url(#glowFilter)"
          />

          {/* Center Hub to Branch 2 (Top-Right: Dominoes) */}
          <path
            d="M 500 290 C 600 270, 690 180, 760 130"
            fill="none"
            stroke={activeEmotion.accentHex}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="animate-pulse"
            filter="url(#glowFilter)"
          />

          {/* Center Hub to Branch 3 (Bottom-Left: Titan Winner) */}
          <path
            d="M 500 370 C 400 390, 310 470, 240 500"
            fill="none"
            stroke={activeEmotion.accentHex}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="animate-pulse"
            filter="url(#glowFilter)"
          />

          {/* Center Hub to Branch 4 (Bottom-Right: Failure Autopsy) */}
          <path
            d="M 500 370 C 600 390, 690 470, 760 500"
            fill="none"
            stroke={activeEmotion.accentHex}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="animate-pulse"
            filter="url(#glowFilter)"
          />
        </svg>

        {/* 2x2 Radial Grid Structure with Centered Hub */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          {/* Top Row: Branch 1 (Temporal Chain) + Branch 2 (Domino Ripple) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>BRANCH 1 // ⏳ TEMPORAL TRAJECTORY</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                3 Sub-Nodes
              </span>
            </div>

            <div className="space-y-2.5">
              {branchData.temporal.map((node) => {
                const isSelected = activeNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNode(node)}
                    data-testid={`mind-map-node-${node.id}`}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer backdrop-blur-xl ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-amber-400/50 hover:bg-black/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-amber-300">
                        {node.tag}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {node.thunglishDecode}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spacer / Center Alignment on desktop */}
          <div className="md:col-span-2 hidden md:flex items-center justify-center" />

          {/* Branch 2: Cross-Pillar Domino Cascade */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-purple-300">
                <Link2 className="w-3.5 h-3.5" />
                <span>BRANCH 2 // 🔗 CROSS-PILLAR DOMINOES</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Causal Cascade
              </span>
            </div>

            <div className="space-y-2.5">
              {branchData.dominoes.map((node) => {
                const isSelected = activeNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNode(node)}
                    data-testid={`mind-map-node-${node.id}`}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer backdrop-blur-xl ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-purple-400/50 hover:bg-black/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-purple-300">
                        {node.title}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {node.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {node.thunglishDecode}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER HUB NODE (The Core Event) */}
        <div className="my-8 flex items-center justify-center relative z-20">
          <button
            type="button"
            onClick={() => setActiveNode(branchData.hub)}
            data-testid="mind-map-center-hub"
            className={`max-w-xl w-full p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer backdrop-blur-2xl shadow-2xl text-center group ${
              activeNode?.id === branchData.hub.id
                ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/50 scale-[1.02]'
                : 'bg-[#0A0E1A]/95 border-white/20 hover:border-cyan-400/70 hover:scale-[1.01]'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 font-mono text-[11px] font-bold text-cyan-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>CORE EVENT // {activeStory.chipLabel}</span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-extrabold text-white group-hover:text-cyan-200 transition-colors leading-snug">
              {activeStory.headline}
            </h3>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded bg-black/60 border border-white/15 text-emerald-300 font-bold">
                {activeStory.telemetry[0].value} · {activeStory.telemetry[0].label}
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-400/30 text-rose-300">
                {activeStory.telemetry[0].velocity}
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed font-sans line-clamp-2 italic">
              “{activeStory.thunglishAnalogy[0]}”
            </p>
          </button>
        </div>

        {/* Bottom Row: Branch 3 (Titan Winner) + Branch 4 (Failure Autopsy) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          {/* Branch 3: Titan Winner Execution */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-300">
                <Trophy className="w-3.5 h-3.5" />
                <span>BRANCH 3 // 🏆 TITAN WINNER ARCHITECTURE</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Execution Model
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveNode(branchData.winner)}
              data-testid="mind-map-node-winner"
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer backdrop-blur-xl ${
                activeNode?.id === branchData.winner.id
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-black/50 border-white/10 hover:border-emerald-400/50 hover:bg-black/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-extrabold text-emerald-300">
                  {branchData.winner.title}
                </span>
                <span className="font-mono text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/30">
                  WINNER
                </span>
              </div>
              <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                {branchData.winner.thunglishDecode}
              </p>
            </button>
          </div>

          {/* Spacer / Center Alignment on desktop */}
          <div className="md:col-span-2 hidden md:flex items-center justify-center" />

          {/* Branch 4: Failure Autopsy & Book Mental Model */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-rose-300">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>BRANCH 4 // 💥 FAILURE AUTOPSY & 🧠 BOOK RULE</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Inversion Flaw
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveNode(branchData.failure)}
              data-testid="mind-map-node-failure"
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer backdrop-blur-xl ${
                activeNode?.id === branchData.failure.id
                  ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-500/20 scale-[1.02]'
                  : 'bg-black/50 border-white/10 hover:border-rose-400/50 hover:bg-black/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-extrabold text-rose-300">
                  {branchData.failure.title}
                </span>
                <span className="font-mono text-[10px] text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-400/30">
                  CRASH
                </span>
              </div>
              <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                {branchData.failure.thunglishDecode}
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Frosted Glass Inspection Drawer */}
      {activeNode && (
        <div
          data-testid="mind-map-inspection-drawer"
          className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#090D18]/95 backdrop-blur-2xl border border-white/20 shadow-2xl relative z-30 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded bg-white/10 font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                {activeNode.branchLabel}
              </span>
              <h4 className="font-display text-base sm:text-lg font-bold text-white">
                {activeNode.title}
              </h4>
            </div>

            <button
              type="button"
              title="Close Inspection Drawer"
              onClick={() => {
                stopNewsAnchorSpeech();
                setIsSpeakingNode(false);
                setActiveNode(null);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4">
            <div className="lg:col-span-8 space-y-3">
              <div className="space-y-1">
                <span className="font-mono text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>THUNGLISH STORY-MODE EXPLANATION</span>
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {activeNode.thunglishDecode}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <span className="font-mono text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>FIRST-PRINCIPLES STRATEGIC RULE</span>
                </span>
                <p className="text-xs text-slate-300 font-mono">
                  {activeNode.firstPrinciplesRule}
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-end space-y-2.5">
              <button
                type="button"
                onClick={() => handleSpeakNode(activeNode)}
                data-testid="mind-map-speak-btn"
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  isSpeakingNode
                    ? 'bg-rose-500/20 border border-rose-400 text-rose-200 animate-pulse'
                    : 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {isSpeakingNode ? 'Stop Briefing' : '🔊 Speak This Node'}
                </span>
              </button>

              {onOpenMentor && (
                <button
                  type="button"
                  onClick={() => handleAskMentor(activeNode)}
                  data-testid="mind-map-mentor-btn"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 font-mono text-xs font-bold text-purple-200 cursor-pointer transition-all"
                >
                  <Brain className="w-4 h-4" />
                  <span>🧠 Ask Mentor About Branch</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
