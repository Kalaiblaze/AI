import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Tv,
  Film,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  X,
  Lightbulb
} from 'lucide-react';
import { NeatPillarData, NeatPillarId } from '../engine/nexusNeatEngine';
import {
  getMediaForPillar,
  PillarMediaAsset
} from '../engine/newsMediaCatalog';
import { NewsEmotionTheme } from '../engine/newsEmotionTheme';
import {
  playThunglishVoiceover,
  stopActiveThunglishVoice
} from '../engine/thunglishVoicePlayer';

interface DynamicTheaterStageProps {
  pillarData: NeatPillarData;
  activeEmotion: NewsEmotionTheme;
  liveRssImageUrl?: string;
  liveTrustedArticle?: {
    articleUrl?: string;
    trustedOutlet?: string;
    publishedAt?: string;
  };
  activeChapterIdx: number;
  onChangeChapter: (idx: number) => void;
  onSelectPillar: (pillarId: NeatPillarId) => void;
  onExitTheater: () => void;
}

const CHAPTER_MARKERS: {
  idx: number;
  badge: string;
  phaseLabel: string;
  timecode: string;
  colorClass: string;
  dotClass: string;
}[] = [
  {
    idx: 0,
    badge: '[00:00 Past]',
    phaseLabel: '⏪ PAST · Root Cause',
    timecode: '00:00',
    colorClass: 'border-amber-400/50 bg-amber-500/15 text-amber-200',
    dotClass: 'bg-amber-400'
  },
  {
    idx: 1,
    badge: '[00:20 Present]',
    phaseLabel: '⏺️ PRESENT · Active Trigger',
    timecode: '00:20',
    colorClass: 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200',
    dotClass: 'bg-cyan-400'
  },
  {
    idx: 2,
    badge: '[00:40 Future]',
    phaseLabel: '⏩ FUTURE · 24M Horizon',
    timecode: '00:40',
    colorClass: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200',
    dotClass: 'bg-emerald-400'
  }
];

export const DynamicTheaterStage: React.FC<DynamicTheaterStageProps> = ({
  pillarData,
  activeEmotion,
  liveRssImageUrl,
  liveTrustedArticle,
  activeChapterIdx,
  onChangeChapter,
  onSelectPillar,
  onExitTheater
}) => {
  const media = getMediaForPillar(
    pillarData,
    liveRssImageUrl
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [playerSourceMode, setPlayerSourceMode] = useState<
    'HUD_BRIEFING' | 'BROADCAST_STREAM'
  >('HUD_BRIEFING');
  const [elapsedSec, setElapsedSec] = useState<number>(activeChapterIdx * 20);
  const elapsedSecRef = useRef<number>(activeChapterIdx * 20);
  const activeChapterIdxRef = useRef<number>(activeChapterIdx);
  const onChangeChapterRef = useRef(onChangeChapter);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    activeChapterIdxRef.current = activeChapterIdx;
    onChangeChapterRef.current = onChangeChapter;
  });

  // Sync elapsed seconds when user clicks a chapter button externally
  useEffect(() => {
    elapsedSecRef.current = activeChapterIdx * 20;
    setElapsedSec(activeChapterIdx * 20);
  }, [activeChapterIdx, pillarData.id]);

  // Speak active chapter in crisp female Thunglish voiceover when playing
  useEffect(() => {
    if (!isPlaying || !voiceEnabled) {
      stopActiveThunglishVoice();
      setIsSpeaking(false);
      return;
    }

    const chapterObj =
      media.videoChapters[activeChapterIdx] || media.videoChapters[0];
    if (!chapterObj) return;

    const spokenScript = `${chapterObj.title}. ${chapterObj.thunglishCaption}`;
    void playThunglishVoiceover(
      spokenScript,
      `theater-${pillarData.id}-${activeChapterIdx}`,
      {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false)
      }
    );

    return () => {
      stopActiveThunglishVoice();
    };
  }, [
    isPlaying,
    voiceEnabled,
    activeChapterIdx,
    pillarData.id,
    media.videoChapters
  ]);

  // Advance timeline scrubber every second while playing (outside React render updaters)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      const next = (elapsedSecRef.current + 1) % 60;
      elapsedSecRef.current = next;
      setElapsedSec(next);

      const nextChapter = next < 20 ? 0 : next < 40 ? 1 : 2;
      if (nextChapter !== activeChapterIdxRef.current) {
        onChangeChapterRef.current(nextChapter);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Animated HUD Telemetry Radar & Waveform Canvas Overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let tick = 0;

    const renderFrame = () => {
      tick += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle HUD scan grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 48) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Dynamic telemetry sine wave along top-right HUD corner
      ctx.strokeStyle = activeEmotion.accentHex;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 160; i += 4) {
        const x = w - 180 + i;
        const amp = isPlaying ? 9 : 2;
        const y = 38 + Math.sin(tick + i * 0.09) * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, [activeEmotion.accentHex, isPlaying]);

  const activeChapter =
    media.videoChapters[activeChapterIdx] || media.videoChapters[0];
  const activeMarker =
    CHAPTER_MARKERS[activeChapterIdx] || CHAPTER_MARKERS[0];
  const activeStat =
    pillarData.telemetry[activeChapterIdx] || pillarData.telemetry[0];
  const activeBroadcast = media.relatedBroadcasts[0];

  const dominoChainChips: { pillar: NeatPillarId; label: string }[] = [
    {
      pillar: pillarData.connectedSteps[0].fromPillar,
      label: pillarData.connectedSteps[0].fromChip
    },
    ...pillarData.connectedSteps.map((s) => ({
      pillar: s.toPillar,
      label: s.toChip
    }))
  ];

  const progressPercent = Math.min(100, Math.round((elapsedSec / 60) * 100));
  const formattedTime = `00:${String(elapsedSec).padStart(2, '0')} / 01:00`;

  const trajectoryTextByChapter = [
    pillarData.timeline.pastRootCause,
    pillarData.timeline.presentNews,
    pillarData.timeline.futureImpact
  ];

  return (
    <div
      data-testid="dynamic-theater-stage"
      aria-label="Dynamic Video Briefing Theater Stage"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch transition-all duration-500"
    >
      {/* LEFT 8 COLUMNS: 16:9 Interactive Video Player with Animated Canvas/HUD & Chapter Markers */}
      <div
        className={`lg:col-span-8 rounded-2xl bg-[#0B0F19]/80 backdrop-blur-2xl border ${activeEmotion.stageBorderClass} ${activeEmotion.stageGlowClass} shadow-2xl overflow-hidden flex flex-col justify-between`}
      >
        {/* Top Cinema Control Bar */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-400/50 text-[11px] font-mono font-bold text-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>THEATER MODE LIVE</span>
            </span>
            <span
              className={`px-2.5 py-1 rounded-md border text-[11px] font-mono font-semibold ${activeEmotion.badgeClass}`}
            >
              {pillarData.chipLabel} · {activeEmotion.shortLabel}
            </span>
            <span className="text-xs font-mono text-slate-300 hidden sm:inline">
              {formattedTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch between HUD Visual Briefing & Broadcast Stream */}
            <button
              type="button"
              onClick={() => setPlayerSourceMode('HUD_BRIEFING')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border cursor-pointer transition-all ${
                playerSourceMode === 'HUD_BRIEFING'
                  ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>HUD Briefing</span>
            </button>

            <button
              type="button"
              onClick={() => setPlayerSourceMode('BROADCAST_STREAM')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border cursor-pointer transition-all ${
                playerSourceMode === 'BROADCAST_STREAM'
                  ? 'bg-purple-500/20 border-purple-400/60 text-purple-200'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Broadcast Feed</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopActiveThunglishVoice();
                onExitTheater();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-semibold text-white cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit Theater</span>
            </button>
          </div>
        </div>

        {/* 16:9 Interactive Video Stage */}
        <div className="relative aspect-video w-full bg-[#04060A] overflow-hidden select-none">
          {/* Animated Ken Burns Background Visual Matched to Chapter */}
          <img
            src={
              activeChapterIdx === 1
                ? media.secondaryImageUrl
                : media.primaryImageUrl
            }
            alt={pillarData.headline}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (
                target.src !==
                window.location.origin + media.secondaryImageUrl
              ) {
                target.src = media.secondaryImageUrl;
              }
            }}
            className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
              isPlaying ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Animated Canvas/HUD Overlay */}
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="pointer-events-none absolute inset-0 w-full h-full opacity-80"
          />

          {/* Dark Cinema Vignette for 100% Subtitle Readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030509] via-[#030509]/55 to-black/35" />

          {/* Top-Left Live Chapter & Telemetry Callout Overlay */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-md border font-mono text-xs font-bold backdrop-blur-md ${activeMarker.colorClass}`}
              >
                {activeMarker.badge} · {activeMarker.phaseLabel}
              </span>
              {isSpeaking && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-md text-[11px] font-mono font-semibold text-emerald-200">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
                  <span>THUNGLISH VOICE ACTIVE</span>
                </span>
              )}
            </div>

            <div className="px-3 py-1 rounded-md bg-black/75 border border-white/15 backdrop-blur-md font-mono text-xs font-bold text-cyan-300">
              {activeStat.value} · {activeStat.label}
            </div>
          </div>

          {/* Center-Bottom Live Subtitles & Story Context Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10 space-y-3">
            <div className="rounded-xl bg-[#070A12]/90 backdrop-blur-xl border border-white/15 p-4 shadow-2xl space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {playerSourceMode === 'HUD_BRIEFING'
                      ? activeChapter.title
                      : `${activeBroadcast.channel} · ${activeBroadcast.title}`}
                  </span>
                </span>
                <span className="text-[11px] font-mono text-amber-300 font-semibold">
                  {activeChapter.telemetryCallout}
                </span>
              </div>

              {/* Crisp Thunglish Live Subtitle Box */}
              <p
                data-testid="theater-live-subtitle"
                className="font-display text-sm sm:text-base font-semibold text-white leading-relaxed"
              >
                “
                {playerSourceMode === 'HUD_BRIEFING'
                  ? activeChapter.thunglishCaption
                  : activeBroadcast.thunglishSummary}
                ”
              </p>

              {/* English Context Sub-line */}
              <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-2">
                {trajectoryTextByChapter[activeChapterIdx]}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Playable Chapter Markers ([00:00 Past], [00:20 Present], [00:40 Future]) & Scrubber */}
        <div className="p-4 bg-[#070A12]/95 border-t border-white/10 space-y-3">
          {/* Interactive Progress Scrubber Bar */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${activeEmotion.progressBarGradient} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Play/Pause + Restart + Voiceover Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold cursor-pointer transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onChangeChapter(0);
                  elapsedSecRef.current = 0;
                  setElapsedSec(0);
                  setIsPlaying(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = !voiceEnabled;
                  setVoiceEnabled(next);
                  if (!next) stopActiveThunglishVoice();
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold cursor-pointer transition-colors ${
                  voiceEnabled
                    ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
                    : 'bg-white/[0.04] border-white/10 text-slate-400'
                }`}
              >
                {voiceEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>🔊 Thunglish Voice ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Voice Muted</span>
                  </>
                )}
              </button>
            </div>

            {/* Playable Chapter Markers: [00:00 Past], [00:20 Present], [00:40 Future] */}
            <div
              role="group"
              aria-label="Playable Video Chapter Markers"
              className="flex flex-wrap items-center gap-2"
            >
              {CHAPTER_MARKERS.map((marker) => {
                const isCurrent = activeChapterIdx === marker.idx;
                return (
                  <button
                    key={marker.idx}
                    type="button"
                    onClick={() => {
                      onChangeChapter(marker.idx);
                      elapsedSecRef.current = marker.idx * 20;
                      setElapsedSec(marker.idx * 20);
                      setIsPlaying(true);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? marker.colorClass
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/25'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${marker.dotClass}`}
                    />
                    <span>{marker.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT 4 COLUMNS: Synchronized Companion Dock (Matches Exact Height of Video Player) */}
      <aside
        aria-label="Synchronized Video Companion Dock"
        className="lg:col-span-4 h-full rounded-2xl bg-[#0B0F19]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-5 flex flex-col justify-between space-y-4"
      >
        {/* Top Section: Headline + Active Chapter Sync Indicator */}
        <div className="space-y-3 border-b border-white/10 pb-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
              🎯 Synchronized Companion Dock
            </span>
            <a
              href={
                liveTrustedArticle?.articleUrl ||
                media.trustedCitations[0].url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-mono font-semibold text-emerald-300 hover:bg-emerald-500/25"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>
                {liveTrustedArticle?.trustedOutlet ||
                  media.trustedCitations[0].domain}
              </span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <h2 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
            {pillarData.headline}
          </h2>
        </div>

        {/* Middle Section: ⚡ Street-Smart Thunglish Decode + Explicit Country Actors */}
        <div
          className={`rounded-xl bg-black/45 border border-white/10 border-l-4 ${activeEmotion.decodeLeftBorderClass} p-4 space-y-3`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`font-display text-xs font-bold uppercase tracking-wider ${activeEmotion.accentTextClass}`}
            >
              ⚡ Street-Smart Thunglish Decode
            </span>
            <button
              type="button"
              onClick={() => {
                void playThunglishVoiceover(
                  `${pillarData.thunglishAnalogy[0]} ${pillarData.thunglishAnalogy[1]}`,
                  `dock-decode-${pillarData.id}`,
                  {
                    onStart: () => setIsSpeaking(true),
                    onEnd: () => setIsSpeaking(false)
                  }
                );
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-[10px] font-mono font-semibold text-cyan-200 cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>🔊 Listen</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
            {pillarData.thunglishAnalogy[0]}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {pillarData.thunglishAnalogy[1]}
          </p>

          {/* Compact Country Actors Strip */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/10">
            {pillarData.actorsBreakdown.map((act, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/[0.04] border border-white/10 p-2 space-y-0.5"
              >
                <div className="font-display text-[11px] font-bold text-white truncate">
                  {act.actor}
                </div>
                <div className="text-[9px] font-mono text-cyan-300 uppercase">
                  {act.stance}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Synchronized Easy Term Card (Matches Active Chapter Index) */}
        <div className="rounded-xl bg-amber-500/[0.08] border border-amber-400/25 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-amber-300 font-bold">
            <span className="inline-flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>
                💡 {media.simpleEverydayTerms[activeChapterIdx]?.term}
              </span>
            </span>
            <span className="text-[10px] text-slate-400">Simple Meaning</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {media.simpleEverydayTerms[activeChapterIdx]?.everydayMeaning}
          </p>
        </div>

        {/* Bottom Section: Clickable 🔗 Connected Pillar Chips */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>🔗 Connected Pillar Chips</span>
            <span>Click to switch stage</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {dominoChainChips.map((chip, idx) => (
              <React.Fragment key={`${chip.pillar}-${idx}`}>
                <button
                  type="button"
                  onClick={() => onSelectPillar(chip.pillar)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border whitespace-nowrap ${
                    chip.pillar === pillarData.id
                      ? `${activeEmotion.badgeClass}`
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {chip.label}
                </button>
                {idx < dominoChainChips.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
