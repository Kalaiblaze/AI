import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Sparkles,
  BrainCircuit,
  RefreshCw,
  Pause,
  Volume2,
  Share2,
  PlusCircle,
  Search,
  Trophy,
  AlertOctagon,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
  ExternalLink,
  Code2,
  Crosshair
} from 'lucide-react';
import {
  NEAT_PILLARS,
  PILLAR_ROTATION_ORDER,
  NeatPillarId,
  NeatPillarData,
  IncomingWireItem,
  ActorBreakdownItem,
  formatCountdown,
  formatISTTimestamp,
  getInitialIncomingWire,
  synthesizeLiveWireDispatch
} from './engine/nexusNeatEngine';
import {
  formatWhatsAppBriefing,
  buildTeamsAdaptiveCardPayload
} from './engine/broadcastFormatter';
import { PILLAR_MEDIA_CATALOG } from './engine/newsMediaCatalog';
import { playThunglishVoiceover } from './engine/thunglishVoicePlayer';
import {
  detectNewsEmotion,
  NEWS_EMOTION_THEMES,
  EMOTION_ORDER,
  NewsEmotionId,
  resolveStoryAmbientBackdrop
} from './engine/newsEmotionTheme';
import {
  HERO_CONFIDENCE_BY_PILLAR,
  buildFutifySwimlanes,
  FutifyPosterCard,
  playSpatialReticleChime
} from './engine/futifyEngine';
import {
  FutifyLogoMark,
  FutifySonicIntroOverlay
} from './components/FutifyBrandAndIntro';
import { SpatialXRayOverlay } from './components/SpatialXRayOverlay';
import { DynamicTheaterStage } from './components/DynamicTheaterStage';
import { MetricSparklineCard } from './components/MetricSparklineCard';
import { PasteCustomTopicModal } from './components/PasteCustomTopicModal';
import { GeminiMentorDrawer } from './components/GeminiMentorDrawer';
import { StandaloneHtmlModal } from './components/StandaloneHtmlModal';
import {
  BroadcastIntegrationModal,
  AutoBroadcastConfig
} from './components/BroadcastIntegrationModal';

const ACTOR_STANCE_STYLES: Record<
  ActorBreakdownItem['stance'],
  { badge: string; border: string }
> = {
  INITIATOR: {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-400/35',
    border: 'border-amber-500/25'
  },
  'COUNTER-MOVE': {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-400/35',
    border: 'border-rose-500/25'
  },
  'BRIDGE / WINNER': {
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/35',
    border: 'border-emerald-500/25'
  }
};

const NAV_CATEGORIES: { id: 'HOME' | NeatPillarId; label: string }[] = [
  { id: 'HOME', label: 'Home' },
  { id: 'MONEY', label: '💰 Money' },
  { id: 'GEOPOLITICS', label: '🌍 Geopolitics' },
  { id: 'DEFENCE', label: '🛡️ Defence' },
  { id: 'AEROSPACE', label: '🚀 Aerospace' },
  { id: 'TECH', label: '💻 Embedded & Tech' }
];

export default function App() {
  const [pillarsMap, setPillarsMap] =
    useState<Record<NeatPillarId, NeatPillarData>>(NEAT_PILLARS);
  const [activePillar, setActivePillar] = useState<NeatPillarId>('MONEY');
  const [activeNavFilter, setActiveNavFilter] = useState<'HOME' | NeatPillarId>(
    'HOME'
  );
  const [incomingWire, setIncomingWire] = useState<IncomingWireItem[]>(() =>
    getInitialIncomingWire()
  );
  const [selectedWireId, setSelectedWireId] = useState<string>('seed-MONEY-0');

  // FUTIFY Cinema Sonic Intro Overlay State
  const [isSonicIntroOpen, setIsSonicIntroOpen] = useState<boolean>(true);

  // 60-Second Real-Time Auto-Sync Polling State
  const [secondsRemaining, setSecondsRemaining] = useState<number>(59);
  const [isAutoSyncActive, setIsAutoSyncActive] = useState<boolean>(true);
  const [isSyncingNow, setIsSyncingNow] = useState<boolean>(false);
  const [isStagePulsing, setIsStagePulsing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() =>
    formatISTTimestamp()
  );

  // Dynamic Emotion & Theater Mode State
  const [emotionOverride, setEmotionOverride] = useState<NewsEmotionId | null>(
    null
  );
  const [isVideoTheaterMode, setIsVideoTheaterMode] = useState<boolean>(false);
  const [theaterChapterIdx, setTheaterChapterIdx] = useState<number>(0);
  const [isAmbientTransitioning, setIsAmbientTransitioning] =
    useState<boolean>(false);

  // Modals & Drawers
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isMentorDrawerOpen, setIsMentorDrawerOpen] = useState(false);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastConfig, setBroadcastConfig] = useState<AutoBroadcastConfig>({
    teamsWebhookUrl: '',
    teamsAutoSync: false,
    whatsappWebhookUrl: '',
    whatsappAutoSync: false
  });
  const [rssImageMap, setRssImageMap] = useState<
    Partial<Record<NeatPillarId, string>>
  >({});
  const [trustedSourceMap, setTrustedSourceMap] = useState<
    Partial<
      Record<
        NeatPillarId,
        { articleUrl?: string; trustedOutlet?: string; publishedAt?: string }
      >
    >
  >({});

  const rotationStepRef = useRef<number>(0);
  const syncLockRef = useRef<boolean>(false);
  const broadcastConfigRef = useRef<AutoBroadcastConfig>(broadcastConfig);
  const xraySectionRef = useRef<HTMLDivElement | null>(null);
  const dojoSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    broadcastConfigRef.current = broadcastConfig;
  }, [broadcastConfig]);

  const currentData = pillarsMap[activePillar];
  const detectedEmotion = detectNewsEmotion(currentData);
  const activeEmotion = emotionOverride
    ? NEWS_EMOTION_THEMES[emotionOverride]
    : detectedEmotion;
  const ambientBackdrop = resolveStoryAmbientBackdrop(
    currentData,
    rssImageMap[activePillar]
  );
  const heroConfidence = HERO_CONFIDENCE_BY_PILLAR[activePillar];
  const swimlaneRows = buildFutifySwimlanes(
    pillarsMap,
    incomingWire,
    rssImageMap
  );

  const triggerAmbientCrossfade = useCallback(() => {
    setIsAmbientTransitioning(true);
    const t = setTimeout(() => setIsAmbientTransitioning(false), 650);
    return () => clearTimeout(t);
  }, []);

  // 60-Second Live Trusted News Update Engine
  const triggerLiveMinuteUpdate = useCallback(
    async (explicitPillar?: NeatPillarId) => {
      if (syncLockRef.current) return;
      syncLockRef.current = true;
      setIsSyncingNow(true);

      const stepIndex = rotationStepRef.current;
      rotationStepRef.current += 1;

      const targetPillar: NeatPillarId =
        explicitPillar ||
        PILLAR_ROTATION_ORDER[stepIndex % PILLAR_ROTATION_ORDER.length];

      const pillarConfig = NEAT_PILLARS[targetPillar];
      let fetchedHeadline = '';
      let fetchedRssThumb = '';
      let fetchedArticleUrl = '';
      let fetchedOutlet = '';
      let fetchedPubDate = '';
      let sourceBadge = 'JUST IN · LIVE WIRE';

      try {
        const aiRes = await fetch('/api/live-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pillarId: targetPillar,
            pillarName: pillarConfig.shortName,
            stepIndex
          }),
          signal: AbortSignal.timeout(2200)
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          if (aiData?.headline && String(aiData.headline).trim().length > 15) {
            fetchedHeadline = String(aiData.headline).trim();
            sourceBadge = aiData.sourceBadge || 'JUST IN · VERIFIED';
          }
          if (
            aiData?.thumbnailUrl &&
            /^https?:\/\/.+/i.test(aiData.thumbnailUrl)
          ) {
            fetchedRssThumb = String(aiData.thumbnailUrl).trim();
          }
          if (aiData?.articleUrl) {
            fetchedArticleUrl = String(aiData.articleUrl).trim();
          }
          if (aiData?.trustedOutlet) {
            fetchedOutlet = String(aiData.trustedOutlet).trim();
          }
          if (aiData?.publishedAt) {
            fetchedPubDate = String(aiData.publishedAt).trim();
          }
        }
      } catch {
        // Deterministic fallback handled by synthesizeLiveWireDispatch
      }

      const { updatedPillar, wireItem } = synthesizeLiveWireDispatch(
        targetPillar,
        stepIndex,
        fetchedHeadline,
        sourceBadge
      );

      setPillarsMap((prev) => ({
        ...prev,
        [targetPillar]: updatedPillar
      }));
      if (fetchedRssThumb) {
        setRssImageMap((prev) => ({
          ...prev,
          [targetPillar]: fetchedRssThumb
        }));
      }
      if (fetchedArticleUrl || fetchedOutlet) {
        setTrustedSourceMap((prev) => ({
          ...prev,
          [targetPillar]: {
            articleUrl: fetchedArticleUrl,
            trustedOutlet: fetchedOutlet,
            publishedAt: fetchedPubDate
          }
        }));
      }
      setActivePillar(targetPillar);
      setEmotionOverride(null);
      setIncomingWire((prev) => [wireItem, ...prev.slice(0, 19)]);
      setSelectedWireId(wireItem.id);
      setLastSyncedAt(wireItem.timestampIST);
      setSecondsRemaining(60);
      setIsSyncingNow(false);
      syncLockRef.current = false;

      // Optional Auto-Broadcast to Microsoft Teams or WhatsApp Webhook Bridge
      const activeBroadcast = broadcastConfigRef.current;
      if (
        activeBroadcast.teamsAutoSync &&
        activeBroadcast.teamsWebhookUrl.trim().startsWith('http')
      ) {
        void fetch('/api/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: 'teams',
            webhookUrl: activeBroadcast.teamsWebhookUrl.trim(),
            teamsPayload: buildTeamsAdaptiveCardPayload(updatedPillar)
          })
        }).catch(() => {});
      }

      if (
        activeBroadcast.whatsappAutoSync &&
        activeBroadcast.whatsappWebhookUrl.trim().startsWith('http')
      ) {
        void fetch('/api/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: 'whatsapp',
            webhookUrl: activeBroadcast.whatsappWebhookUrl.trim(),
            whatsappText: formatWhatsAppBriefing(updatedPillar),
            pillarMeta: {
              id: updatedPillar.id,
              chipLabel: updatedPillar.chipLabel,
              headline: updatedPillar.headline,
              updatedAt: updatedPillar.updatedAt
            }
          })
        }).catch(() => {});
      }

      triggerAmbientCrossfade();
      setIsStagePulsing(true);
      setTimeout(() => setIsStagePulsing(false), 1100);
    },
    [triggerAmbientCrossfade]
  );

  // 1-Second Real-Time Countdown Timer Effect
  useEffect(() => {
    if (!isAutoSyncActive) return;

    const intervalId = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          void triggerLiveMinuteUpdate();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isAutoSyncActive, triggerLiveMinuteUpdate]);

  const handleSelectPillar = (pid: NeatPillarId) => {
    setActivePillar(pid);
    setEmotionOverride(null);
    setTheaterChapterIdx(0);
    triggerAmbientCrossfade();
    playSpatialReticleChime();
  };

  const handleSelectPosterCard = (card: FutifyPosterCard) => {
    setPillarsMap((prev) => ({
      ...prev,
      [card.pillarId]: card.pillarSnapshot
    }));
    setActivePillar(card.pillarId);
    setEmotionOverride(null);
    setSelectedWireId(card.id);
    setTheaterChapterIdx(0);
    triggerAmbientCrossfade();
    playSpatialReticleChime();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyCustomTopic = (
    pillarId: NeatPillarId,
    updatedData: NeatPillarData
  ) => {
    const nowIST = formatISTTimestamp();
    const customWireItem: IncomingWireItem = {
      id: `custom-${pillarId}-${Date.now()}`,
      pillarId,
      chipLabel: updatedData.chipLabel,
      timestampIST: nowIST,
      sourceBadge: 'JUST IN · CUSTOM SIGNAL',
      headline: updatedData.headline,
      keyMetricBadge: `${updatedData.telemetry[0].value} · ${updatedData.telemetry[0].label}`,
      pillarSnapshot: updatedData
    };

    setPillarsMap((prev) => ({
      ...prev,
      [pillarId]: updatedData
    }));
    setActivePillar(pillarId);
    setEmotionOverride(null);
    setIncomingWire((prev) => [customWireItem, ...prev.slice(0, 19)]);
    setSelectedWireId(customWireItem.id);
    setLastSyncedAt(nowIST);
    triggerAmbientCrossfade();
  };

  const dominoChainChips: { pillar: NeatPillarId; label: string }[] = [
    {
      pillar: currentData.connectedSteps[0].fromPillar,
      label: currentData.connectedSteps[0].fromChip
    },
    ...currentData.connectedSteps.map((s) => ({
      pillar: s.toPillar,
      label: s.toChip
    }))
  ];

  const progressPercentage = Math.max(
    0,
    Math.min(100, ((60 - secondsRemaining) / 60) * 100)
  );

  return (
    <div
      id="top"
      data-emotion-theme={activeEmotion.id}
      data-ambient-pillar={activePillar}
      className="relative z-0 min-h-screen text-slate-100 selection:bg-rose-500/30 selection:text-rose-100 transition-colors duration-700"
    >
      {/* NETFLIX / APPLE TV+ SONIC INTRO SEQUENCE OVERLAY */}
      <FutifySonicIntroOverlay
        isOpen={isSonicIntroOpen}
        onComplete={() => setIsSonicIntroOpen(false)}
      />

      {/* 0. FIXED FULL-SCREEN DYNAMIC AMBIENT BACKGROUND ENGINE (ON NEWS TOUCH / SELECT) */}
      <div
        aria-hidden="true"
        data-testid="ambient-background-layer"
        className="fixed inset-0 -z-10 overflow-hidden bg-[#050508]"
      >
        <img
          key={`${activePillar}-${selectedWireId}-${ambientBackdrop.bgImage}`}
          src={ambientBackdrop.bgImage}
          alt={ambientBackdrop.atmosphereLabel}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== ambientBackdrop.unsplashBgUrl) {
              target.src = ambientBackdrop.unsplashBgUrl;
            }
          }}
          className={`w-full h-full object-cover transition-all duration-700 ease-out scale-105 ${
            isAmbientTransitioning
              ? 'opacity-25 scale-110 blur-[2px]'
              : 'opacity-40 scale-105 blur-0'
          }`}
        />

        {/* Emotion-Tinted Radial Ambient Aura */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            backgroundImage: activeEmotion.topAuraGradient
          }}
        />

        {/* CRITICAL READABILITY GUARD: Multi-Stop Dark Radial & Linear Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/75 via-[#050508]/88 to-[#050508]" />
      </div>

      {/* 1. FIXED TRANSLUCENT STREAMING NAVBAR (FUTIFY // SEE TOMORROW FIRST) */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-black/95 via-black/80 to-black/40 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Custom FUTIFY SVG Prism Logo + Category Links */}
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  setIsVideoTheaterMode(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-3 group cursor-pointer shrink-0"
              >
                <FutifyLogoMark size="md" />
                <div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold tracking-[-0.04em] text-white flex items-center gap-2">
                    <span>FUTIFY</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 font-mono text-[9px] font-bold text-rose-300 tracking-widest uppercase">
                      OS 4.0
                    </span>
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.28em] uppercase text-slate-400">
                    SEE TOMORROW FIRST
                  </div>
                </div>
              </a>

              {/* Streaming Category Navigation Links */}
              <nav
                aria-label="FUTIFY Category Navigation"
                className="flex items-center gap-1.5 overflow-x-auto pb-0.5"
              >
                {NAV_CATEGORIES.map((cat) => {
                  const isSelected =
                    cat.id === 'HOME'
                      ? activeNavFilter === 'HOME'
                      : activePillar === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveNavFilter(cat.id);
                        if (cat.id !== 'HOME') {
                          handleSelectPillar(cat.id);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-display font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                        isSelected
                          ? `bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.35)]`
                          : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right: 🟢 60s Live Auto-Sync Pill + Replay Intro + Broadcast + Ask Futify AI */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* 60s Live Auto-Sync Countdown Pill */}
              <div
                role="region"
                aria-label="Live 60-Second Auto-Sync Telemetry Bar"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 border border-white/15 font-mono text-xs"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAutoSyncActive
                      ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="text-emerald-300 font-semibold hidden sm:inline">
                  60s Live Sync:
                </span>
                <span
                  data-testid="live-countdown-timer"
                  className="text-cyan-300 font-bold tabular-nums"
                >
                  {isSyncingNow ? 'SYNCING' : formatCountdown(secondsRemaining)}
                </span>
                <button
                  type="button"
                  title="Sync Live Wire Now"
                  onClick={() => void triggerLiveMinuteUpdate(activePillar)}
                  disabled={isSyncingNow}
                  className="p-1 rounded-full hover:bg-white/10 text-cyan-300 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isSyncingNow ? 'animate-spin' : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  title={
                    isAutoSyncActive ? 'Pause 60s Sync' : 'Resume 60s Sync'
                  }
                  onClick={() => setIsAutoSyncActive((prev) => !prev)}
                  className="p-1 rounded-full hover:bg-white/10 text-amber-300 cursor-pointer"
                >
                  {isAutoSyncActive ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-emerald-300" />
                  )}
                </button>
              </div>

              {/* [✦ Replay Intro] Button */}
              <button
                type="button"
                data-testid="replay-intro-btn"
                onClick={() => setIsSonicIntroOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/40 font-mono text-xs font-semibold text-rose-200 cursor-pointer whitespace-nowrap transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>✦ Replay Intro</span>
              </button>

              {/* WhatsApp / Teams Broadcast */}
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 font-mono text-xs font-semibold text-emerald-200 cursor-pointer whitespace-nowrap transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden md:inline">📲 WhatsApp / Teams</span>
              </button>

              {/* + Custom Signal */}
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/15 font-mono text-xs font-medium text-slate-200 cursor-pointer whitespace-nowrap transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">+ Custom Signal</span>
              </button>

              {/* [🔍 Ask Futify AI] */}
              <button
                type="button"
                onClick={() => setIsMentorDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-cyan-500 hover:from-rose-400 hover:to-cyan-400 text-white font-display text-xs font-bold shadow-[0_0_25px_-5px_rgba(244,63,94,0.65)] cursor-pointer whitespace-nowrap transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>🔍 Ask Futify AI</span>
              </button>
            </div>
          </div>

          {/* Compact Emotion Aura Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/[0.06] text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono uppercase tracking-wider text-slate-400">
                🎨 Live Emotion Aura:
              </span>
              <span
                data-testid="active-emotion-badge"
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[11px] font-bold transition-all duration-500 ${activeEmotion.badgeClass}`}
              >
                <span>{activeEmotion.badgeLabel}</span>
                <span className="opacity-75">
                  · {activeEmotion.intensityScore}%
                </span>
              </span>
              <span className="text-slate-400 hidden lg:inline">
                {activeEmotion.emotionSummary}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setEmotionOverride(null)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  emotionOverride === null
                    ? 'bg-white/15 border-white/40 text-white'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Auto ({detectedEmotion.shortLabel})
              </button>
              {EMOTION_ORDER.map((emoId) => {
                const emo = NEWS_EMOTION_THEMES[emoId];
                const isSelected = activeEmotion.id === emoId;
                return (
                  <button
                    key={emoId}
                    type="button"
                    onClick={() => setEmotionOverride(emoId)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? emo.badgeClass
                        : 'bg-black/30 border-white/[0.07] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {emo.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Animated 60s Progress Line */}
        <div className="w-full h-[2px] bg-white/[0.04] overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${activeEmotion.progressBarGradient} transition-all duration-700 ease-linear`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* 2. HERO BILLBOARD STAGE (TOP 80VH FULL-BLEED NETFLIX / APPLE TV+ STAGE OR DYNAMIC THEATER MODE) */}
      <main className="space-y-12 pb-16">
        {isVideoTheaterMode ? (
          <div className="max-w-[1440px] mx-auto px-6 pt-6 space-y-8">
            <DynamicTheaterStage
              pillarData={currentData}
              activeEmotion={activeEmotion}
              liveRssImageUrl={rssImageMap[activePillar]}
              liveTrustedArticle={trustedSourceMap[activePillar]}
              activeChapterIdx={theaterChapterIdx}
              onChangeChapter={setTheaterChapterIdx}
              onSelectPillar={handleSelectPillar}
              onExitTheater={() => setIsVideoTheaterMode(false)}
            />
          </div>
        ) : (
          <section
            aria-label="FUTIFY Hero Billboard Stage"
            data-testid="futify-hero-billboard"
            className={`relative w-full min-h-[78vh] flex items-center overflow-hidden border-b border-white/10 transition-all duration-700 ${
              isStagePulsing ? 'ring-2 ring-rose-500/60' : ''
            }`}
          >
            {/* Full-Bleed High-Resolution Hero Backdrop Image */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <img
                key={`hero-${activePillar}-${selectedWireId}-${ambientBackdrop.bgImage}`}
                src={ambientBackdrop.bgImage}
                alt={currentData.headline}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== ambientBackdrop.unsplashBgUrl) {
                    target.src = ambientBackdrop.unsplashBgUrl;
                  }
                }}
                className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out opacity-65"
              />
              {/* Multi-Stop Cinematic Vignettes (Left-to-Right & Bottom-to-Top) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/35 to-transparent" />
            </div>

            {/* Hero Billboard Foreground Content */}
            <div className="max-w-[1440px] mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              {/* Left 8 Columns: Monumental Cinema Headline, Prediction Badge, Thunglish Hook & 3 Primary Action Buttons */}
              <div className="lg:col-span-8 space-y-6">
                {/* Top Prediction & Verified Source Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    data-testid="futify-prediction-badge"
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/60 font-mono text-xs font-bold text-rose-200 shadow-[0_0_25px_-4px_rgba(244,63,94,0.65)]"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    <span>{heroConfidence.confidenceBadge}</span>
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full border font-mono text-xs font-semibold ${activeEmotion.badgeClass}`}
                  >
                    {currentData.chipLabel} · {activeEmotion.shortLabel}
                  </span>

                  <a
                    href={
                      trustedSourceMap[activePillar]?.articleUrl ||
                      PILLAR_MEDIA_CATALOG[activePillar].trustedCitations[0].url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 font-mono text-xs font-semibold text-emerald-300"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {trustedSourceMap[activePillar]?.trustedOutlet ||
                        PILLAR_MEDIA_CATALOG[activePillar].trustedCitations[0]
                          .domain}
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <span className="font-mono text-xs text-slate-400">
                    Updated {lastSyncedAt}
                  </span>
                </div>

                {/* Monumental Outfit Headline + Instrument Serif Italic Accent */}
                <div className="space-y-2">
                  <div className="font-serif-italic text-xl sm:text-2xl text-rose-300/95 tracking-normal">
                    {heroConfidence.serifHighlight} —
                  </div>
                  <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-[-0.03em] drop-shadow-2xl">
                    {currentData.headline}
                  </h1>
                </div>

                {/* 2-Line Punchy Street-Smart Thunglish Hook */}
                <div
                  className={`rounded-2xl bg-[#090C15]/80 backdrop-blur-2xl border border-white/15 border-l-4 ${activeEmotion.decodeLeftBorderClass} p-5 space-y-3 max-w-3xl shadow-2xl`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                      ⚡ STREET-SMART THUNGLISH DECODE
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        void playThunglishVoiceover(
                          `${currentData.thunglishAnalogy[0]} ${currentData.thunglishAnalogy[1]}`,
                          `hero-voice-${currentData.id}`
                        );
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 font-mono text-xs font-semibold text-cyan-200 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                      <span>🔊 Listen in Thunglish</span>
                    </button>
                  </div>

                  <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                    {currentData.thunglishAnalogy[0]}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentData.thunglishAnalogy[1]}
                  </p>

                  {/* Explicit Country / Actor Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                    {currentData.actorsBreakdown.map((act, i) => {
                      const st = ACTOR_STANCE_STYLES[act.stance];
                      return (
                        <div
                          key={i}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border ${st.border} text-xs`}
                        >
                          <span className="font-display font-bold text-white">
                            {act.actor}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${st.badge}`}
                          >
                            {act.stance}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Primary Action Buttons: [▶ Play Visual Briefing], [✦ X-Ray Breakdown], [🧠 Titan vs. Failure Dojo] */}
                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  <button
                    type="button"
                    data-testid="toggle-visual-briefing-btn"
                    onClick={() => {
                      setTheaterChapterIdx(0);
                      setIsVideoTheaterMode(true);
                    }}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-display text-sm font-extrabold tracking-tight shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer transition-all"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>▶ Play Visual Briefing</span>
                  </button>

                  <button
                    type="button"
                    data-testid="hero-xray-btn"
                    onClick={() => {
                      xraySectionRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                      });
                      playSpatialReticleChime();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white border border-rose-400/50 font-display text-sm font-bold shadow-[0_0_25px_-5px_rgba(244,63,94,0.65)] cursor-pointer transition-all"
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>✦ X-Ray Breakdown</span>
                  </button>

                  <button
                    type="button"
                    data-testid="hero-dojo-btn"
                    onClick={() => {
                      dojoSectionRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-display text-sm font-bold cursor-pointer transition-all"
                  >
                    <BrainCircuit className="w-4 h-4 text-cyan-300" />
                    <span>🧠 Titan vs. Failure Dojo</span>
                  </button>
                </div>
              </div>

              {/* Right 4 Columns: Live 7-Day Telemetry Sparkline Stack */}
              <div
                aria-label="Key Numeric Metrics"
                className="lg:col-span-4 space-y-3"
              >
                {currentData.telemetry.map((stat, idx) => (
                  <MetricSparklineCard key={idx} stat={stat} index={idx} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. HORIZONTAL NETFLIX / APPLE TV+ SWIMLANE POSTER CAROUSELS */}
        <section
          aria-label="FUTIFY Horizontal Intelligence Swimlanes"
          data-testid="futify-netflix-swimlanes"
          className="max-w-[1440px] mx-auto px-6 space-y-10"
        >
          {swimlaneRows.map((row) => (
            <div key={row.id} className="space-y-3.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                    <span>{row.title}</span>
                    <span className="font-serif-italic text-2xl sm:text-3xl font-normal text-rose-300">
                      {row.serifAccent}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {row.subtitle}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  Select any 16:9 poster to shift Hero Stage &amp; X-Ray HUD ➔
                </span>
              </div>

              {/* Horizontal 16:9 Poster Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {row.cards.slice(0, 4).map((card) => {
                  const isCurrent =
                    card.id === selectedWireId ||
                    (card.pillarId === activePillar &&
                      card.id.endsWith('-primary'));
                  const cardEmotion = detectNewsEmotion(card.pillarSnapshot);

                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleSelectPosterCard(card)}
                      className={`group relative aspect-video w-full rounded-2xl overflow-hidden text-left cursor-pointer border transition-all duration-300 hover:scale-105 hover:z-20 shadow-2xl ${
                        isCurrent
                          ? 'border-rose-400 ring-2 ring-rose-500/50'
                          : 'border-white/10 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={card.posterImageUrl}
                        alt={card.headline}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== card.fallbackUnsplashUrl) {
                            target.src = card.fallbackUnsplashUrl;
                          }
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Multi-Stop Poster Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#04050A] via-[#04050A]/65 to-black/25" />

                      {/* Top Poster Badges: JUST IN + Category + Probability */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          {card.isJustIn && (
                            <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                              JUST IN
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded backdrop-blur-md border font-mono text-[10px] font-bold ${cardEmotion.badgeClass}`}
                          >
                            {card.categoryTag}
                          </span>
                        </div>

                        <span className="px-2 py-0.5 rounded bg-black/75 border border-white/15 font-mono text-[10px] font-bold text-emerald-300">
                          {card.probabilityBadge}
                        </span>
                      </div>

                      {/* Bottom Poster Headline & Telemetry */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 space-y-1.5">
                        <p className="font-display text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-rose-200 transition-colors">
                          {card.headline}
                        </p>
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                          <span className="text-cyan-300 font-semibold truncate">
                            {card.keyMetricBadge}
                          </span>
                          <span className="text-slate-400 shrink-0">
                            {card.timestampBadge}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* 4. AMAZON PRIME "X-RAY" & APPLE VISION PRO SPATIAL HUD SECTION */}
        <div
          ref={xraySectionRef}
          className="max-w-[1440px] mx-auto px-6 scroll-mt-24"
        >
          <SpatialXRayOverlay
            pillarData={currentData}
            liveRssImageUrl={rssImageMap[activePillar]}
            liveTrustedArticle={trustedSourceMap[activePillar]}
            onPlayVideoBriefing={() => {
              setTheaterChapterIdx(0);
              setIsVideoTheaterMode(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

        {/* 5. DEEP INTELLIGENCE DOJO: PAST ➔ PRESENT ➔ FUTURE, DOMINO CHAIN, TITAN AUTOPSY & SIMPLE TERMS */}
        <div
          ref={dojoSectionRef}
          className="max-w-[1440px] mx-auto px-6 space-y-6 scroll-mt-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* CARD 1: ⏳ Past ➔ Present ➔ Future Prediction Trajectory */}
            <section
              aria-label="Past Present Future Trajectory"
              className="rounded-2xl bg-[#090C15]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-6 flex flex-col justify-between space-y-4"
            >
              <div className="border-b border-white/10 pb-3">
                <h2 className="font-display text-lg font-bold text-white">
                  ⏳ Pattern Trajectory
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ⏪ Past Root Cause ➔ ⏺️ Present Trigger ➔ ⏩ 24M Horizon
                </p>
              </div>

              <div className="relative pl-6 space-y-4 flex-1 flex flex-col justify-between">
                <div
                  aria-hidden="true"
                  className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-amber-400 via-cyan-400 to-emerald-400"
                />

                <div className="relative space-y-1">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-amber-400/20"
                  />
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300">
                    ⏪ PAST · Root Cause
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentData.timeline.pastRootCause}
                  </p>
                </div>

                <div className="relative space-y-1">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-400/25"
                  />
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                    ⏺️ PRESENT · Active Trigger
                  </div>
                  <p className="text-xs text-white font-medium leading-relaxed">
                    {currentData.timeline.presentNews}
                  </p>
                </div>

                <div className="relative space-y-1">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"
                  />
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                    ⏩ FUTURE · 24M Prediction
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentData.timeline.futureImpact}
                  </p>
                </div>
              </div>
            </section>

            {/* CARD 2: 🔗 Cross-Pillar Domino Chain */}
            <section
              aria-label="Cross-Pillar Domino Chain"
              className="rounded-2xl bg-[#090C15]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-6 flex flex-col justify-between space-y-4"
            >
              <div className="border-b border-white/10 pb-3 space-y-2.5">
                <div>
                  <h2 className="font-display text-lg font-bold text-white">
                    🔗 Cross-Pillar Domino Chain
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Second-order ripple across global sectors
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  {dominoChainChips.map((chip, idx) => (
                    <React.Fragment key={`${chip.pillar}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => handleSelectPillar(chip.pillar)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer border whitespace-nowrap ${
                          chip.pillar === activePillar
                            ? 'bg-rose-500/20 border-rose-400/50 text-rose-200'
                            : 'bg-black/50 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {chip.label}
                      </button>
                      {idx < dominoChainChips.length - 1 && (
                        <ArrowRight className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                {currentData.connectedSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="rounded-xl bg-black/45 border border-white/10 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
                      <span className="text-slate-300 font-semibold">
                        {step.fromChip}
                      </span>
                      <ArrowRight className="w-3 h-3 text-rose-400 shrink-0" />
                      <button
                        type="button"
                        onClick={() => handleSelectPillar(step.toPillar)}
                        className="text-cyan-300 hover:text-cyan-200 font-semibold underline cursor-pointer"
                      >
                        {step.toChip}
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.thunglishLine}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CARD 3: 🧠 Titan Winner vs. Legacy Failure & Book Mental Model */}
            <section
              aria-label="Winner vs Failure Autopsy and Book Mental Model"
              className="rounded-2xl bg-[#090C15]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-6 flex flex-col justify-between space-y-4"
            >
              <div className="border-b border-white/10 pb-3">
                <h2 className="font-display text-lg font-bold text-white">
                  🧠 Titan vs. Failure Dojo
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  First-principles execution &amp; Book Mental Model
                </p>
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="rounded-xl bg-black/45 border border-emerald-500/25 p-3.5 space-y-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-mono font-bold uppercase text-emerald-300">
                    <Trophy className="w-3 h-3" />
                    <span>TITAN WINNER</span>
                  </span>
                  <h3 className="font-display text-xs sm:text-sm font-bold text-white">
                    {currentData.eliteBrain.winnerTitle}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 inline mr-1.5 -mt-0.5" />
                    {currentData.eliteBrain.winnerPoints[0]}
                  </p>
                </div>

                <div className="rounded-xl bg-black/45 border border-rose-500/25 p-3.5 space-y-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/15 border border-rose-400/30 text-[10px] font-mono font-bold uppercase text-rose-300">
                    <AlertOctagon className="w-3 h-3" />
                    <span>LEGACY CRASH</span>
                  </span>
                  <h3 className="font-display text-xs sm:text-sm font-bold text-white">
                    {currentData.eliteBrain.failureTitle}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <AlertOctagon className="w-3 h-3 text-rose-400 inline mr-1.5 -mt-0.5" />
                    {currentData.eliteBrain.failurePoints[0]}
                  </p>
                </div>

                <blockquote className="rounded-xl bg-amber-500/[0.08] border border-amber-400/30 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-amber-300">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <BookOpen className="w-3 h-3" />
                      <span>{currentData.eliteBrain.charismaBook}</span>
                    </span>
                    <span className="text-slate-400">
                      {currentData.eliteBrain.charismaAuthor}
                    </span>
                  </div>
                  <p className="font-display text-xs font-bold text-white">
                    “{currentData.eliteBrain.mentalModelTitle}”
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentData.eliteBrain.mentalModelRule}
                  </p>
                </blockquote>
              </div>
            </section>
          </div>

          {/* ZERO-JARGON EVERYDAY GLOSSARY STRIP */}
          <section
            aria-label="Easy Everyday Breakdown of Complex Terms"
            className="rounded-2xl bg-[#090C15]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-display font-bold text-amber-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>
                  💡 Complex Terms Made Simple (Easy for Anyone to Understand)
                </span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                Zero-Jargon Everyday Guide
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PILLAR_MEDIA_CATALOG[activePillar].simpleEverydayTerms.map(
                (termItem, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-black/45 border border-amber-400/20 p-4 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="font-display text-sm font-bold text-amber-200">
                        {termItem.term}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {termItem.everydayMeaning}
                      </p>
                    </div>
                    <p className="text-xs text-emerald-300 font-medium pt-2 border-t border-white/10 leading-snug">
                      👉 {termItem.whyItMattersToYou}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        </div>

        {/* STREAMING PLATFORM FOOTER */}
        <footer className="max-w-[1440px] mx-auto px-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <FutifyLogoMark size="sm" />
            <span className="font-mono">
              FUTIFY // SEE TOMORROW FIRST · Real-Time 60s Prediction &amp;
              Spatial X-Ray Intelligence
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsHtmlModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer font-mono"
          >
            <Code2 className="w-4 h-4 text-rose-400" />
            <span>Export Single-File HTML</span>
          </button>
        </footer>
      </main>

      {/* Paste Custom Topic Modal */}
      <PasteCustomTopicModal
        isOpen={isCustomModalOpen}
        activePillar={activePillar}
        onClose={() => setIsCustomModalOpen(false)}
        onApplyCustomTopic={handleApplyCustomTopic}
      />

      {/* Multi-Turn Futify AI / Gemini Mentor Drawer */}
      <GeminiMentorDrawer
        isOpen={isMentorDrawerOpen}
        onClose={() => setIsMentorDrawerOpen(false)}
        activePillarData={currentData}
      />

      {/* Single-File HTML Export Modal */}
      <StandaloneHtmlModal
        isOpen={isHtmlModalOpen}
        onClose={() => setIsHtmlModalOpen(false)}
      />

      {/* WhatsApp Group & Microsoft Teams Channel Integration Modal */}
      <BroadcastIntegrationModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        activePillarData={currentData}
        config={broadcastConfig}
        onUpdateConfig={setBroadcastConfig}
      />
    </div>
  );
}
