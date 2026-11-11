import React, { useState, useEffect } from 'react';
import {
  Volume2,
  ShieldCheck,
  ExternalLink,
  Lightbulb,
  Crosshair,
  Play
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
import { playThunglishVoiceover } from '../engine/thunglishVoicePlayer';

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

  useEffect(() => {
    setSelectedReticleId(reticles[0].id);
    setImageAngleIdx(0);
  }, [pillarData.id, reticles]);

  const activeReticle: SpatialXRayReticle =
    reticles.find((r) => r.id === selectedReticleId) || reticles[0];

  const displayImageUrl =
    imageAngleIdx === 0 ? media.activeDisplayImageUrl : media.secondaryImageUrl;

  const verifiedUrl =
    liveTrustedArticle?.articleUrl ||
    PILLAR_MEDIA_CATALOG[pillarData.id].trustedCitations[0].url;
  const verifiedOutlet =
    liveTrustedArticle?.trustedOutlet ||
    PILLAR_MEDIA_CATALOG[pillarData.id].trustedCitations[0].outlet;

  const handleSelectReticle = (reticle: SpatialXRayReticle) => {
    setSelectedReticleId(reticle.id);
    playSpatialReticleChime();
  };

  return (
    <section
      aria-label="Amazon Prime X-Ray and Apple Vision Pro Spatial HUD"
      data-testid="spatial-xray-hud"
      className="rounded-2xl bg-[#070910]/85 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden"
    >
      {/* Top Spatial HUD Telemetry Header */}
      <div className="px-5 py-3.5 border-b border-white/10 bg-black/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/50 font-mono text-[11px] font-bold tracking-wider text-rose-200 uppercase">
            <Crosshair className="w-3.5 h-3.5 text-rose-400" />
            <span>PRIME X-RAY // SPATIAL HUD</span>
          </span>
          <span className="font-mono text-xs text-slate-300">
            Select any 1px optical reticle (01–03) to inspect probability &amp; Thunglish decode
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

      {/* Main Spatial X-Ray Viewport: Left Translucent X-Ray Frosted Drawer + Right Precision Reticle Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* LEFT 5 COLUMNS: Amazon Prime "X-Ray" Frosted Glass Drawer */}
        <div
          data-testid="xray-frosted-drawer"
          className="lg:col-span-5 backdrop-blur-2xl bg-black/65 border-b lg:border-b-0 lg:border-r border-white/10 border-l-2 border-l-red-500/80 p-5 sm:p-6 flex flex-col justify-between space-y-5"
        >
          {/* Reticle Switcher Tabs (01, 02, 03) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-rose-400 font-bold">
                X-RAY TARGET TELEMETRY
              </span>
              <span
                data-testid="xray-probability-badge"
                className="px-2.5 py-0.5 rounded bg-rose-500/20 border border-rose-400/50 font-mono text-xs font-bold text-rose-200"
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
                    className={`px-2.5 py-2 rounded-lg border text-left font-mono transition-all cursor-pointer ${
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
              <div className="font-display text-lg sm:text-xl font-bold text-white">
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
                  onClick={() => {
                    void playThunglishVoiceover(
                      `${activeReticle.reticleLabel}. ${activeReticle.thunglishExplain}`,
                      `xray-voice-${activeReticle.id}`
                    );
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 font-mono text-[10px] font-semibold text-cyan-200 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>🔊 Listen</span>
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
              <span className="text-slate-400">FUTIFY PREDICTION CONFIDENCE</span>
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

        {/* RIGHT 7 COLUMNS: High-Resolution Optical Viewport with 1px Precision Target Reticles & 45-Degree SVG Leader Lines */}
        <div className="lg:col-span-7 relative min-h-[360px] sm:min-h-[440px] bg-[#04060A] overflow-hidden select-none">
          <img
            src={displayImageUrl}
            alt={pillarData.headline}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== backdrop.unsplashBgUrl) {
                target.src = backdrop.unsplashBgUrl;
              }
            }}
            className="w-full h-full object-cover opacity-85 transition-all duration-700"
          />

          {/* Subtle Vision Pro Spatial Vignette (Never blocks the image) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508]/90 via-transparent to-black/35"
          />

          {/* Ultra-Thin 1px Precision Reticles + 45-Degree SVG Leader Lines (──⌖) */}
          {reticles.map((reticle) => {
            const isSelected = reticle.id === activeReticle.id;
            const isLeft = reticle.leaderDir === 'up-left';

            return (
              <div
                key={reticle.id}
                style={{
                  left: `${reticle.xPercent}%`,
                  top: `${reticle.yPercent}%`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  type="button"
                  data-testid={`xray-reticle-${reticle.code}`}
                  aria-label={`Inspect reticle ${reticle.reticleLabel}`}
                  onClick={() => handleSelectReticle(reticle)}
                  className="group relative flex items-center cursor-pointer focus:outline-none"
                >
                  {/* 1px Precision Target Reticle Ring + Pulsing Center Dot */}
                  <span
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                      isSelected
                        ? 'border-rose-400 bg-rose-500/15 scale-110 shadow-[0_0_20px_rgba(244,63,94,0.8)]'
                        : 'border-cyan-300/75 bg-black/30 hover:border-white hover:scale-105'
                    }`}
                  >
                    {/* Outer Crosshair Ticks */}
                    <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-current opacity-70" />
                    <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-current opacity-70" />
                    <span className="pointer-events-none absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-current opacity-70" />
                    <span className="pointer-events-none absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-current opacity-70" />

                    {/* Tiny Pulsing Center Dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected
                          ? 'bg-rose-400 animate-ping'
                          : 'bg-cyan-300'
                      }`}
                    />
                    <span
                      className={`absolute w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-cyan-300'
                      }`}
                    />
                  </span>

                  {/* Sleek 45-Degree SVG Leader Line (──⌖) + Minimal HUD Callout Tag */}
                  <div
                    className={`hidden sm:flex items-center pointer-events-none ${
                      isLeft
                        ? 'flex-row-reverse mr-2 -translate-y-4'
                        : 'ml-2 -translate-y-4'
                    }`}
                  >
                    <svg
                      width="38"
                      height="22"
                      viewBox="0 0 38 22"
                      fill="none"
                      className="shrink-0 overflow-visible"
                    >
                      <path
                        d={
                          isLeft
                            ? 'M36 20 L22 4 L2 4'
                            : 'M2 20 L16 4 L36 4'
                        }
                        stroke={isSelected ? '#FB7185' : '#67E8F9'}
                        strokeWidth="1"
                        strokeOpacity="0.85"
                      />
                      <circle
                        cx={isLeft ? '2' : '36'}
                        cy="4"
                        r="2"
                        fill={isSelected ? '#FB7185' : '#67E8F9'}
                      />
                    </svg>

                    <div
                      className={`px-2 py-0.5 rounded backdrop-blur-md border font-mono text-[10px] tracking-wider whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-black/80 border-rose-400/70 text-white font-bold'
                          : 'bg-black/60 border-white/20 text-slate-200'
                      }`}
                    >
                      <span>{reticle.reticleLabel}</span>
                      <span className="ml-1.5 text-rose-300 font-bold">
                        {reticle.confidencePercent}%
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}

          {/* Bottom Optical HUD Caption Strip */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 text-[11px] font-mono text-slate-300">
            <span>{media.photoCredit}</span>
            <span className="text-cyan-300">{media.locationBadge}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
