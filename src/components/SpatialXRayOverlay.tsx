import React, { useState, useEffect } from 'react';
import {
  Volume2,
  ShieldCheck,
  ExternalLink,
  Lightbulb,
  Crosshair,
  Play,
  Square
} from 'lucide-react';
import { NeatPillarData } from '../engine/nexusNeatEngine';
import {
  SPATIAL_XRAY_CATALOG,
  SpatialXRayReticle,
  playSpatialReticleChime
} from '../engine/futifyEngine';
import {
  getMediaForPillar,
  PILLAR_MEDIA_CATALOG
} from '../engine/newsMediaCatalog';
import { AMBIENT_BACKDROP_CATALOG } from '../engine/newsEmotionTheme';

interface SpatialXRayOverlayProps {
  pillarData: NeatPillarData;
  liveRssImageUrl?: string;
  liveTrustedArticle?: {
    articleUrl?: string;
    trustedOutlet?: string;
    publishedAt?: string;
  };
  onPlayVideoBriefing?: () => void;
}

export const SpatialXRayOverlay: React.FC<SpatialXRayOverlayProps> = ({
  pillarData,
  liveRssImageUrl,
  liveTrustedArticle,
  onPlayVideoBriefing
}) => {
  const reticles =
    SPATIAL_XRAY_CATALOG[pillarData.id] || SPATIAL_XRAY_CATALOG.MONEY;
  const media = getMediaForPillar(pillarData, liveRssImageUrl);
  const backdrop =
    AMBIENT_BACKDROP_CATALOG[pillarData.id] || AMBIENT_BACKDROP_CATALOG.MONEY;

  const [selectedReticleId, setSelectedReticleId] = useState<string>(
    reticles[0].id
  );
  const [imageAngleIdx, setImageAngleIdx] = useState<0 | 1>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    setSelectedReticleId(reticles[0].id);
    setImageAngleIdx(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [pillarData.id, reticles]);

  const activeReticle: SpatialXRayReticle =
    reticles.find((r) => r.id === selectedReticleId) || reticles[0];

  const rawDisplayUrl =
    imageAngleIdx === 0 ? media.activeDisplayImageUrl : media.secondaryImageUrl;
  const displayImageUrl = rawDisplayUrl.includes('?wsdl') || rawDisplayUrl.includes('unsplash.com')
    ? rawDisplayUrl.replace(/w=\d+/, 'w=2000').replace(/q=\d+/, 'q=90')
    : `${rawDisplayUrl}${rawDisplayUrl.includes('?') ? '&' : '?'}auto=format&fit=crop&w=2000&q=90`;

  const verifiedUrl =
    liveTrustedArticle?.articleUrl ||
    PILLAR_MEDIA_CATALOG[pillarData.id].trustedCitations[0].url;
  const verifiedOutlet =
    liveTrustedArticle?.trustedOutlet ||
    PILLAR_MEDIA_CATALOG[pillarData.id].trustedCitations[0].outlet;

  const handleSelectReticle = (reticle: SpatialXRayReticle) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSelectedReticleId(reticle.id);
    playSpatialReticleChime();
  };

  const handleToggleListen = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const rawText = `${activeReticle.reticleLabel}. ${activeReticle.thunglishExplain}`;
    const cleanText = rawText
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\/\/|%|➔|—|\||•|\*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const sentences = cleanText.match(/[^.!?]+[.!?]*/g) || [cleanText];
    let sIdx = 0;
    let sentenceTimer: ReturnType<typeof setTimeout> | null = null;

    function speakNextSentence() {
      if (sIdx >= sentences.length) {
        setIsSpeaking(false);
        return;
      }
      const sentence = sentences[sIdx].trim();
      if (!sentence) {
        sIdx++;
        speakNextSentence();
        return;
      }

      const utter = new SpeechSynthesisUtterance(sentence);
      utter.rate = 0.80;
      utter.pitch = 1.02;
      utter.volume = 1.0;

      utter.onend = () => {
        sIdx++;
        sentenceTimer = setTimeout(speakNextSentence, 450); // 450ms pause between sentences
      };
      utter.onerror = () => {
        sIdx++;
        sentenceTimer = setTimeout(speakNextSentence, 200);
      };

      window.speechSynthesis.speak(utter);
    }

    speakNextSentence();
  };

  return (
    <section
      aria-label="Amazon Prime X-Ray and Apple Vision Pro Spatial HUD"
      data-testid="spatial-xray-hud"
      className="rounded-2xl bg-[#070910]/90 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden"
    >
      {/* Top Spatial HUD Telemetry Header */}
      <div className="px-5 py-3.5 border-b border-white/10 bg-black/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/50 font-mono text-[11px] font-bold tracking-wider text-rose-200 uppercase">
            <Crosshair className="w-3.5 h-3.5 text-rose-400" />
            <span>PRIME X-RAY // SPATIAL HUD</span>
          </span>
          <span className="font-mono text-xs text-slate-300">
            Select any architecture node (01–03) to inspect telemetry &amp; Thunglish decode
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setImageAngleIdx((prev) => (prev === 0 ? 1 : 0))
            }
            className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 font-mono text-[11px] text-slate-200 cursor-pointer transition-colors"
          >
            OPTICAL FEED {imageAngleIdx + 1} / 2
          </button>

          {onPlayVideoBriefing && (
            <button
              type="button"
              onClick={onPlayVideoBriefing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-[11px] font-bold cursor-pointer transition-colors"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>▶ Play Visual Briefing</span>
            </button>
          )}

          <a
            href={verifiedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 font-mono text-[11px] font-semibold text-emerald-300"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified: {verifiedOutlet}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Container Layout with exact requested classes */}
      <div className="w-full max-w-full overflow-x-hidden px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start box-border">
        {/* LEFT X-RAY INSPECTION DRAWER */}
        <div
          data-testid="xray-frosted-drawer"
          className="lg:col-span-4 w-full min-w-0 pl-4 pr-2 flex flex-col gap-4 break-words backdrop-blur-2xl bg-black/65 rounded-xl border border-white/10 border-l-4 border-l-rose-500 p-5"
        >
          {/* Reticle Switcher Tabs (01, 02, 03) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-rose-400 font-bold">
                X-RAY TARGET TELEMETRY
              </span>
              <span
                data-testid="xray-probability-badge"
                className="px-2.5 py-0.5 rounded bg-rose-500/20 border border-rose-400/50 font-mono text-xs font-bold text-rose-200 shrink-0"
              >
                {activeReticle.probabilityScore}
              </span>
            </div>

            <div
              role="tablist"
              aria-label="X-Ray Target Reticle Selector"
              className="grid grid-cols-3 gap-2"
            >
              {reticles.map((r) => {
                const isSelected = r.id === activeReticle.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectReticle(r)}
                    className={`px-2 py-2 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-400/80 text-white shadow-[0_0_20px_-6px_rgba(244,63,94,0.6)]'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/25'
                    }`}
                  >
                    <div className="text-[10px] text-rose-300 font-bold">
                      NODE // {r.code}
                    </div>
                    <div className="text-[11px] font-semibold truncate mt-0.5">
                      {r.reticleLabel.replace(/^0[123]\s*\/\/\s*/, '')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Reticle Deep Breakdown */}
          <div className="space-y-3.5">
            <div className="space-y-1">
              <div className="font-mono text-xs font-bold text-cyan-300 tracking-wide">
                {activeReticle.reticleLabel}
              </div>
              <div className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                {activeReticle.impactMetric}
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                HORIZON: {activeReticle.horizonWindow} · {activeReticle.actorsInvolved}
              </div>
            </div>

            {/* Thunglish Street-Smart Explanation */}
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-rose-300 font-bold">
                  ⚡ THUNGLISH X-RAY DECODE
                </span>
                <button
                  type="button"
                  onClick={handleToggleListen}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono text-[10px] font-semibold cursor-pointer shrink-0 transition-colors ${
                    isSpeaking
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <Square className="w-3 h-3 fill-white" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                {activeReticle.thunglishExplain}
              </p>
            </div>

            {/* Zero-Jargon Everyday Meaning */}
            <div className="rounded-xl bg-amber-500/[0.07] border border-amber-400/25 p-3.5 space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>ZERO-JARGON EVERYDAY MEANING</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeReticle.simpleEverydayMeaning}
              </p>
            </div>
          </div>

          {/* Probability Confidence Meter Bar */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">PROBABILITY</span>
              <span className="text-emerald-300 font-bold">
                {activeReticle.confidencePercent}% VERIFIED
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${activeReticle.confidencePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT 4K VISUAL STAGE (8 columns) */}
        <div className="lg:col-span-8 w-full relative min-h-[420px] sm:min-h-[500px] bg-[#04060A] rounded-2xl overflow-hidden border border-white/15 flex flex-col justify-between select-none">
          {/* High-Resolution 4K Image (with fallback & no-referrer) */}
          <div className="relative flex-1 w-full overflow-hidden min-h-[300px]">
            <img
              src={displayImageUrl}
              alt={pillarData.headline}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== backdrop.unsplashBgUrl) {
                  target.src = backdrop.unsplashBgUrl;
                }
              }}
              className="w-full h-full object-cover opacity-90 transition-all duration-700"
            />

            {/* Subtle Spatial Vignette */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508]/95 via-transparent to-black/40"
            />

            {/* Top Badge Overlay */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-xl border border-white/20 font-mono text-xs text-rose-300 font-bold">
              {media.locationBadge}
            </div>
          </div>

          {/* 3-COLUMN BAR FOR 01 //, 02 //, 03 // (Placed directly below <img> and above Verified Desk) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-black/90 border-t border-white/15">
            {reticles.map((reticle) => {
              const isSelected = reticle.id === activeReticle.id;
              return (
                <button
                  key={reticle.id}
                  type="button"
                  onClick={() => handleSelectReticle(reticle)}
                  className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-500/20 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] text-rose-300 font-bold">
                      {reticle.reticleLabel.split('//')[0]} //
                    </span>
                    <span className="text-xs text-emerald-300 font-bold">
                      {reticle.confidencePercent}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white line-clamp-1">
                    {reticle.reticleLabel.includes('//') ? reticle.reticleLabel.split('//')[1].trim() : reticle.reticleLabel}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {reticle.impactMetric}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Verified Desk Footer Bar */}
          <div className="relative z-20 w-full px-4 py-2.5 bg-[#05070E] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Verified Desk: {media.photoCredit}</span>
            <span className="text-cyan-300">Prime Video X-Ray Spatial Matrix Active</span>
          </div>
        </div>
      </div>
    </section>
  );
};
