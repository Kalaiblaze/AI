import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Camera,
  Film,
  Tv,
  Play,
  Pause,
  Maximize2,
  X,
  MapPin,
  ExternalLink,
  Sparkles,
  Volume2,
  VolumeX,
  Subtitles,
  ShieldCheck,
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import { NeatPillarData } from '../engine/nexusNeatEngine';
import { getMediaForPillar, MediaHotspot } from '../engine/newsMediaCatalog';
import {
  playThunglishVoiceover,
  stopActiveThunglishVoice
} from '../engine/thunglishVoicePlayer';

interface NewsVisualMediaShowcaseProps {
  pillarData: NeatPillarData;
  liveRssImageUrl?: string;
  liveTrustedArticle?: {
    articleUrl?: string;
    trustedOutlet?: string;
    publishedAt?: string;
  };
}

export const NewsVisualMediaShowcase: React.FC<
  NewsVisualMediaShowcaseProps
> = ({ pillarData, liveRssImageUrl, liveTrustedArticle }) => {
  const media = getMediaForPillar(pillarData, liveRssImageUrl);

  const [activeMode, setActiveMode] = useState<
    'PHOTO' | 'VIDEO' | 'BROADCAST' | 'SIMPLE'
  >('PHOTO');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(
    media.hotspots[0].id
  );
  const [useSecondaryAngle, setUseSecondaryAngle] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Motion Video Briefing & Voiceover State
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isSpeakingNow, setIsSpeakingNow] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [imgFallbackTriggered, setImgFallbackTriggered] =
    useState<boolean>(false);

  // In-UI Documentary Video Clip State (100% Native In-UI Playback — Zero Blocked YouTube Iframes)
  const [selectedBroadcastIdx, setSelectedBroadcastIdx] = useState<number>(0);
  const [isBroadcastPlaying, setIsBroadcastPlaying] = useState<boolean>(false);
  const [broadcastProgress, setBroadcastProgress] = useState<number>(0);

  const broadcastTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset state cleanly when pillar changes
  useEffect(() => {
    stopActiveThunglishVoice();
    setSelectedHotspotId(media.hotspots[0].id);
    setUseSecondaryAngle(false);
    setActiveChapterIdx(0);
    setImgFallbackTriggered(false);
    setSelectedBroadcastIdx(0);
    setIsBroadcastPlaying(false);
    setBroadcastProgress(0);
    setIsSpeakingNow(false);
  }, [pillarData.id, media.hotspots]);

  // Stop voice on unmount
  useEffect(() => {
    return () => {
      stopActiveThunglishVoice();
      if (broadcastTimerRef.current) clearInterval(broadcastTimerRef.current);
    };
  }, []);

  const currentChapter =
    media.videoChapters[activeChapterIdx] || media.videoChapters[0];

  const triggerChapterVoiceAndAdvance = useCallback(
    (chapterIndex: number, muted: boolean, playing: boolean) => {
      const chap =
        media.videoChapters[chapterIndex] || media.videoChapters[0];
      if (!playing) {
        stopActiveThunglishVoice();
        setIsSpeakingNow(false);
        return;
      }

      if (muted) {
        stopActiveThunglishVoice();
        setIsSpeakingNow(false);
        return;
      }

      const cacheKey = `${pillarData.id}-chap-${chapterIndex}`;
      void playThunglishVoiceover(chap.thunglishCaption, cacheKey, {
        onStart: () => setIsSpeakingNow(true),
        onEnd: () => {
          setIsSpeakingNow(false);
          setActiveChapterIdx((prev) => (prev + 1) % media.videoChapters.length);
        }
      });
    },
    [media.videoChapters, pillarData.id]
  );

  // When in VIDEO mode and playing: speak active chapter or advance timer if muted
  useEffect(() => {
    if (activeMode !== 'VIDEO') {
      return;
    }

    if (!isPlayingVideo) {
      stopActiveThunglishVoice();
      setIsSpeakingNow(false);
      return;
    }

    if (!isVoiceMuted) {
      triggerChapterVoiceAndAdvance(activeChapterIdx, false, true);
      const fallbackTimer = setTimeout(() => {
        setActiveChapterIdx((prev) => (prev + 1) % media.videoChapters.length);
      }, 9500);
      return () => clearTimeout(fallbackTimer);
    } else {
      stopActiveThunglishVoice();
      setIsSpeakingNow(false);
      const silentTimer = setTimeout(() => {
        setActiveChapterIdx((prev) => (prev + 1) % media.videoChapters.length);
      }, 5500);
      return () => clearTimeout(silentTimer);
    }
  }, [
    activeMode,
    isPlayingVideo,
    activeChapterIdx,
    isVoiceMuted,
    media.videoChapters.length,
    triggerChapterVoiceAndAdvance
  ]);

  const activeBroadcastClip =
    media.relatedBroadcasts[selectedBroadcastIdx] || media.relatedBroadcasts[0];

  // When in BROADCAST mode and playing: play native in-UI documentary reel + Thunglish voiceover
  useEffect(() => {
    if (activeMode !== 'BROADCAST' || !isBroadcastPlaying) {
      if (broadcastTimerRef.current) clearInterval(broadcastTimerRef.current);
      return;
    }

    if (!isVoiceMuted) {
      void playThunglishVoiceover(
        `${activeBroadcastClip.thunglishSummary} ${activeBroadcastClip.summary}`,
        `${activeBroadcastClip.id}-full-narration`,
        {
          onStart: () => setIsSpeakingNow(true),
          onEnd: () => setIsSpeakingNow(false)
        }
      );
    }

    setBroadcastProgress(8);
    broadcastTimerRef.current = setInterval(() => {
      setBroadcastProgress((prev) => {
        if (prev >= 100) {
          return 10;
        }
        return prev + 4;
      });
    }, 600);

    return () => {
      if (broadcastTimerRef.current) clearInterval(broadcastTimerRef.current);
    };
  }, [activeMode, isBroadcastPlaying, activeBroadcastClip, isVoiceMuted]);

  const activeHotspot: MediaHotspot =
    media.hotspots.find((h) => h.id === selectedHotspotId) || media.hotspots[0];

  const displayedPhotoUrl = useSecondaryAngle
    ? media.secondaryImageUrl
    : imgFallbackTriggered
    ? media.primaryImageUrl
    : media.activeDisplayImageUrl;

  const videoFrameUrl =
    activeChapterIdx === 1 ? media.secondaryImageUrl : media.primaryImageUrl;

  const broadcastFrameUrl =
    selectedBroadcastIdx === 0
      ? media.primaryImageUrl
      : media.secondaryImageUrl;

  const primaryCitation = media.trustedCitations[0];

  return (
    <div
      aria-label="Related News Visuals and Video Briefing"
      className="relative z-10 rounded-xl bg-[#06070A] border border-white/[0.08] overflow-hidden shadow-lg"
    >
      {/* Top Media Mode Switcher Bar + Verified Trusted Source Badge */}
      <div className="px-4 py-2.5 bg-[#090C14] border-b border-white/[0.07] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              stopActiveThunglishVoice();
              setIsPlayingVideo(false);
              setIsBroadcastPlaying(false);
              setActiveMode('PHOTO');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
              activeMode === 'PHOTO'
                ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200 shadow-sm'
                : 'bg-[#0D1017] border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>📸 HD News Visual</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsBroadcastPlaying(false);
              setActiveMode('VIDEO');
              setIsPlayingVideo(true);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
              activeMode === 'VIDEO'
                ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200 shadow-sm'
                : 'bg-[#0D1017] border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-emerald-400" />
            <span>🎬 Thunglish Video Briefing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlayingVideo(false);
              setActiveMode('BROADCAST');
              setIsBroadcastPlaying(true);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
              activeMode === 'BROADCAST'
                ? 'bg-indigo-500/15 border-indigo-400/50 text-indigo-200 shadow-sm'
                : 'bg-[#0D1017] border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-indigo-400" />
            <span>📺 In-App Broadcast Video</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopActiveThunglishVoice();
              setIsPlayingVideo(false);
              setIsBroadcastPlaying(false);
              setActiveMode('SIMPLE');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
              activeMode === 'SIMPLE'
                ? 'bg-amber-500/15 border-amber-400/50 text-amber-200 shadow-sm'
                : 'bg-[#0D1017] border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>💡 Easy Everyday Meaning</span>
          </button>
        </div>

        {/* Verified Source Link */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <a
            href={liveTrustedArticle?.articleUrl || primaryCitation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-semibold transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Verified:{' '}
              {liveTrustedArticle?.trustedOutlet || primaryCitation.outlet}
            </span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </div>

      {/* MODE 1: INTERACTIVE HD NEWS VISUAL & CALLOUT HOTSPOTS */}
      {activeMode === 'PHOTO' && (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 8 Cols: 16:9 Interactive Photo Stage */}
          <div className="lg:col-span-8 relative group bg-[#05070B] overflow-hidden min-h-[320px] h-full w-full">
            <img
              src={displayedPhotoUrl}
              alt={pillarData.headline}
              onError={() => setImgFallbackTriggered(true)}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070A] via-transparent to-black/40" />

            {/* Top-left Photo Credit & Angle Toggle */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-200">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{media.photoCredit}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setUseSecondaryAngle((prev) => !prev)}
                  className="px-2.5 py-1 rounded-md bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/15 text-[11px] font-mono text-cyan-300 cursor-pointer transition-colors"
                >
                  {useSecondaryAngle ? '📷 Angle 2/2' : '📷 Angle 1/2'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Expand Fullscreen Image"
                  className="p-1.5 rounded-md bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white cursor-pointer transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Pulsing Hotspot Pins on Image */}
            {media.hotspots.map((hs, index) => {
              const isSelected = hs.id === activeHotspot.id;
              return (
                <button
                  key={hs.id}
                  type="button"
                  onClick={() => setSelectedHotspotId(hs.id)}
                  style={{
                    left: `${hs.xPercent}%`,
                    top: `${hs.yPercent}%`
                  }}
                  aria-label={`Inspect hotspot ${index + 1}: ${hs.label}`}
                  className={`-translate-x-1/2 -translate-y-1/2 absolute z-20 flex items-center gap-1.5 px-2 py-1 rounded-full font-mono text-[11px] font-bold transition-all cursor-pointer border shadow-lg ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 border-white scale-110 ring-4 ring-cyan-400/35'
                      : 'bg-black/80 text-white border-cyan-400/60 hover:bg-cyan-950/90 hover:scale-105'
                  }`}
                >
                  <span>{index + 1}</span>
                  <span>{hs.actorFlag}</span>
                </button>
              );
            })}

            {/* Bottom Caption Strip over Image */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-black/80 backdrop-blur-md border border-white/10">
              <p className="text-xs text-slate-200 line-clamp-1">
                {media.imageCaption}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('VIDEO');
                  setIsPlayingVideo(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-mono text-[11px] font-semibold whitespace-nowrap cursor-pointer shrink-0"
              >
                <Play className="w-3 h-3 fill-emerald-300" />
                <span>Play Thunglish Video</span>
              </button>
            </div>
          </div>

          {/* Right 4 Cols: Interactive Visual Callout Inspector */}
          <div className="lg:col-span-4 p-4 bg-[#090C12] border-t lg:border-t-0 lg:border-l border-white/[0.07] flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Simple Visual Breakdown</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Click pins 1–3
                </span>
              </div>

              {/* Active Hotspot Detail Card */}
              <div className="rounded-xl bg-[#0D1017] border border-cyan-400/30 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-display font-bold text-white">
                    {activeHotspot.actorFlag} {activeHotspot.label}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeHotspot.detail}
                </p>
              </div>

              {/* All 3 Hotspot Selector Pills */}
              <div className="space-y-1.5 pt-1">
                {media.hotspots.map((hs, idx) => {
                  const isSelected = hs.id === activeHotspot.id;
                  return (
                    <button
                      key={hs.id}
                      type="button"
                      onClick={() => setSelectedHotspotId(hs.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400/40 text-white font-semibold'
                          : 'bg-[#06070A] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/15'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-mono text-cyan-300 mr-1.5">
                          [{idx + 1}]
                        </span>
                        {hs.actorFlag} {hs.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>{media.locationBadge}</span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
              >
                Full HD View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: THUNGLISH VIDEO BRIEFING (SYNCHRONIZED VOICEOVER + SUBTITLES IN-APP) */}
      {activeMode === 'VIDEO' && (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 8 Cols: In-App Motion Video & Audio Stage */}
          <div className="lg:col-span-8 relative bg-[#05070B] overflow-hidden min-h-[320px] h-full w-full">
            <img
              src={videoFrameUrl}
              alt={currentChapter.title}
              className={`w-full h-full object-cover object-center transition-all duration-[4500ms] ease-out ${
                isPlayingVideo
                  ? activeChapterIdx % 2 === 0
                    ? 'scale-110 translate-x-1 -translate-y-1'
                    : 'scale-105 -translate-x-1 translate-y-1'
                  : 'scale-100'
              }`}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/50" />

            {/* Top-Left Live Video & Voice Status HUD */}
            <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-emerald-400/40 text-[11px] font-mono text-emerald-300 font-semibold">
                <span
                  className={`w-2 h-2 rounded-full bg-emerald-400 ${
                    isPlayingVideo ? 'animate-ping' : ''
                  }`}
                />
                <span>
                  {isSpeakingNow
                    ? '🔊 SPEAKING THUNGLISH BRIEFING'
                    : `VIDEO BRIEFING · ${currentChapter.timecode}`}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-cyan-400/30 text-[11px] font-mono text-cyan-200 font-bold">
                <span>{currentChapter.telemetryCallout}</span>
              </div>
            </div>

            {/* Bottom Synchronized Thunglish Subtitle Overlay & Video Controls */}
            <div className="absolute bottom-3 left-3 right-3 space-y-2.5">
              {showSubtitles && (
                <div className="mx-auto max-w-2xl px-4 py-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-cyan-400/30 text-center shadow-lg">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-semibold mb-0.5">
                    {currentChapter.title}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white leading-snug">
                    “{currentChapter.thunglishCaption}”
                  </p>
                </div>
              )}

              {/* Video & Voice Control Bar */}
              <div className="px-3 py-2 rounded-lg bg-[#090C14]/90 backdrop-blur-md border border-white/15 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlayingVideo((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-mono text-xs font-semibold cursor-pointer"
                  >
                    {isPlayingVideo ? (
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
                      const nextMuted = !isVoiceMuted;
                      setIsVoiceMuted(nextMuted);
                      if (nextMuted) {
                        stopActiveThunglishVoice();
                        setIsSpeakingNow(false);
                      } else if (isPlayingVideo) {
                        triggerChapterVoiceAndAdvance(
                          activeChapterIdx,
                          false,
                          true
                        );
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-xs font-semibold cursor-pointer ${
                      !isVoiceMuted
                        ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {!isVoiceMuted ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Thunglish Audio</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                        <span>Muted</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsVoiceMuted(false);
                      setIsPlayingVideo(true);
                      triggerChapterVoiceAndAdvance(
                        activeChapterIdx,
                        false,
                        true
                      );
                    }}
                    title="Replay Current Part Voiceover"
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scrubber Progress Bar */}
                <div className="flex-1 min-w-[80px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${currentChapter.progressPercent}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowSubtitles((prev) => !prev)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono border cursor-pointer ${
                    showSubtitles
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <Subtitles className="w-3.5 h-3.5" />
                  <span>CC</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Video Chapters Playlist */}
          <div className="lg:col-span-4 p-4 bg-[#090C12] border-t lg:border-t-0 lg:border-l border-white/[0.07] flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                  🎬 Click Any Part to Listen
                </span>
                <span className="text-[10px] font-mono text-cyan-300">
                  Clear Thunglish
                </span>
              </div>

              <div className="space-y-2">
                {media.videoChapters.map((chap, idx) => {
                  const isCurrent = idx === activeChapterIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveChapterIdx(idx);
                        setIsPlayingVideo(true);
                        if (!isVoiceMuted) {
                          triggerChapterVoiceAndAdvance(idx, false, true);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isCurrent
                          ? 'bg-emerald-500/10 border-emerald-400/50 text-white'
                          : 'bg-[#06070A] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-emerald-300 font-bold">
                          {chap.timecode}
                        </span>
                        <span className="text-cyan-300">
                          {isCurrent && isPlayingVideo
                            ? '🔊 PLAYING'
                            : '▶ PLAY PART'}
                        </span>
                      </div>
                      <div className="font-display text-xs font-bold text-white">
                        {chap.title}
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {chap.thunglishCaption}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: NATIVE IN-APP DOCUMENTARY VIDEO PLAYER (PLAYS DIRECTLY IN THE UI WITH ZERO EXTERNAL BLOCKS!) */}
      {activeMode === 'BROADCAST' && (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 8 Cols: Native In-App Broadcast Video Player Stage */}
          <div className="lg:col-span-8 bg-[#05070B] relative min-h-[320px] h-full w-full overflow-hidden">
            <img
              src={broadcastFrameUrl}
              alt={activeBroadcastClip.title}
              className={`w-full h-full object-cover object-center transition-all duration-[5000ms] ease-out ${
                isBroadcastPlaying
                  ? 'scale-110 -translate-x-1 translate-y-1'
                  : 'scale-100'
              }`}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/55" />

            {/* Top Documentary Channel & Verified Source Overlay */}
            <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-indigo-400/40 text-[11px] font-mono text-indigo-200 font-semibold">
                <span
                  className={`w-2 h-2 rounded-full bg-indigo-400 ${
                    isBroadcastPlaying ? 'animate-ping' : ''
                  }`}
                />
                <span>{activeBroadcastClip.channel}</span>
              </div>

              <a
                href={activeBroadcastClip.verifiedReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-md border border-emerald-400/40 text-[11px] font-mono text-emerald-200 font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified: {activeBroadcastClip.trustedSourceDomain}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Bottom Documentary Narration Box & Native Video Controls */}
            <div className="absolute bottom-3 left-3 right-3 space-y-2.5">
              <div className="mx-auto max-w-2xl px-4 py-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-indigo-400/35 text-center shadow-lg space-y-1">
                <div className="text-xs font-display font-bold text-white">
                  {activeBroadcastClip.title}
                </div>
                <p className="text-xs text-cyan-200 font-medium leading-snug">
                  “{activeBroadcastClip.thunglishSummary}”
                </p>
              </div>

              {/* Native Broadcast Player Control Strip */}
              <div className="px-3 py-2 rounded-lg bg-[#090C14]/90 backdrop-blur-md border border-white/15 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isBroadcastPlaying;
                      setIsBroadcastPlaying(next);
                      if (!next) {
                        stopActiveThunglishVoice();
                        setIsSpeakingNow(false);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-500/25 hover:bg-indigo-500/35 border border-indigo-400/50 text-indigo-100 font-mono text-xs font-semibold cursor-pointer"
                  >
                    {isBroadcastPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause Video</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Play Video in UI</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsBroadcastPlaying(true);
                      void playThunglishVoiceover(
                        `${activeBroadcastClip.thunglishSummary} ${activeBroadcastClip.summary}`,
                        `${activeBroadcastClip.id}-full-narration`
                      );
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-mono text-xs font-semibold cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>🔊 Thunglish Voice</span>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${broadcastProgress}%` }}
                  />
                </div>

                <span className="text-[11px] font-mono text-slate-300">
                  {activeBroadcastClip.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Broadcast Clip Switcher & Verified Source Links */}
          <div className="lg:col-span-4 p-4 bg-[#090C12] border-t lg:border-t-0 lg:border-l border-white/[0.07] flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-semibold">
                  📺 Select Broadcast Clip
                </span>
                <span className="text-[10px] font-mono text-emerald-300">
                  Plays Directly in UI
                </span>
              </div>

              {media.relatedBroadcasts.map((clip, idx) => {
                const isSelected = idx === selectedBroadcastIdx;
                return (
                  <button
                    key={clip.id}
                    type="button"
                    onClick={() => {
                      setSelectedBroadcastIdx(idx);
                      setIsBroadcastPlaying(true);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-400/50 text-white'
                        : 'bg-[#06070A] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-indigo-300 font-semibold truncate">
                        {clip.channel}
                      </span>
                      <span className="text-emerald-300 shrink-0">
                        {isSelected && isBroadcastPlaying
                          ? '● PLAYING'
                          : `⏱ ${clip.duration}`}
                      </span>
                    </div>
                    <div className="font-display text-xs font-bold text-white leading-snug">
                      {clip.title}
                    </div>
                    <p className="text-[11px] text-cyan-200/90 leading-snug">
                      {clip.thunglishSummary}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                Source: {activeBroadcastClip.trustedSourceDomain}
              </span>
              <a
                href={activeBroadcastClip.verifiedReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 underline"
              >
                <span>Verified Report</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: EASY EVERYDAY MEANING (COMPLEX TECHNICAL TERMS EXPLAINED FOR EVERYONE) */}
      {activeMode === 'SIMPLE' && (
        <div className="p-4 sm:p-5 bg-[#090C12] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-sm font-bold text-amber-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>
                  💡 Complex Technical &amp; Financial Terms Made Simple
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Every hard term in this news explained using everyday real-life
                examples anyone can understand immediately.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {media.simpleEverydayTerms.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#0D1017] border border-amber-400/25 p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/30 font-mono text-[10px] font-bold text-amber-300">
                      TERM #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        void playThunglishVoiceover(
                          `${item.term}. ${item.everydayMeaning} ${item.whyItMattersToYou}`,
                          `${pillarData.id}-term-${idx}`
                        );
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-300 hover:text-cyan-200 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                  </div>

                  <h4 className="font-display text-sm font-bold text-white">
                    {item.term}
                  </h4>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-amber-300">Simple Meaning: </strong>
                    {item.everydayMeaning}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-white/[0.06] text-xs text-emerald-300 leading-snug">
                  <strong className="text-white">Real-Life Impact: </strong>
                  {item.whyItMattersToYou}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULLSCREEN HD LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen News Recon Image"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div className="relative max-w-5xl w-full rounded-2xl bg-[#0D1017] border border-white/15 overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 bg-[#090C12] border-b border-white/10 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-white">
                  {pillarData.headline}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {media.locationBadge} · {media.photoCredit}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative bg-black max-h-[75vh] overflow-hidden flex items-center justify-center">
              <img
                src={displayedPhotoUrl}
                alt={pillarData.headline}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>

            <div className="px-5 py-3.5 bg-[#090C12] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <p className="max-w-3xl">{media.imageCaption}</p>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-mono text-xs font-semibold cursor-pointer"
              >
                Close Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
