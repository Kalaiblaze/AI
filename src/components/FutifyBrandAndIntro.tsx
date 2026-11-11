import React, { useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { playFutifyTaDumSonic } from '../engine/futifyEngine';

interface FutifyLogoMarkProps {
  size?: 'sm' | 'md' | 'lg';
  animatedStroke?: boolean;
}

export const FutifyLogoMark: React.FC<FutifyLogoMarkProps> = ({
  size = 'md',
  animatedStroke = false
}) => {
  const dimClass =
    size === 'lg'
      ? 'w-24 h-24 sm:w-28 sm:h-28'
      : size === 'sm'
      ? 'w-7 h-7'
      : 'w-9 h-9';

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FUTIFY Quantum Prism Logo"
      className={`${dimClass} shrink-0 overflow-visible`}
    >
      <defs>
        <linearGradient
          id="futifyPrismStroke"
          x1="12"
          y1="14"
          x2="108"
          y2="106"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="48%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>

        <linearGradient
          id="futifyCoreFill"
          x1="34"
          y1="26"
          x2="88"
          y2="94"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.16" />
        </linearGradient>

        <filter
          id="futifyNeonGlow"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
        >
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Future-Horizon Eclipse Ring */}
      <circle
        cx="60"
        cy="60"
        r="48"
        stroke="url(#futifyPrismStroke)"
        strokeWidth="2.5"
        strokeOpacity="0.7"
        className={animatedStroke ? 'animate-futify-prism' : ''}
      />

      {/* Illuminated Quantum Prism Geometry */}
      <polygon
        points="60,16 100,86 20,86"
        fill="url(#futifyCoreFill)"
        stroke="url(#futifyPrismStroke)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        filter="url(#futifyNeonGlow)"
        className={animatedStroke ? 'animate-futify-prism' : ''}
      />

      {/* Inner Horizon Vector Refraction Lines */}
      <path
        d="M60 16 L60 86 M37 56 L83 56 M28 72 L92 72"
        stroke="url(#futifyPrismStroke)"
        strokeWidth="2"
        strokeLinecap="round"
        className={animatedStroke ? 'animate-futify-prism' : ''}
      />

      {/* Singular Apex Core Node */}
      <circle cx="60" cy="44" r="4" fill="#FFFFFF" />
    </svg>
  );
};

interface FutifySonicIntroOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const FutifySonicIntroOverlay: React.FC<
  FutifySonicIntroOverlayProps
> = ({ isOpen, onComplete }) => {
  useEffect(() => {
    if (!isOpen) return;
    playFutifyTaDumSonic();

    const timer = setTimeout(() => {
      onComplete();
    }, 2650);

    return () => clearTimeout(timer);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="FUTIFY Cinema Sonic Intro"
      data-testid="futify-sonic-intro-overlay"
      className="fixed inset-0 z-[90] bg-[#030306] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Ambient Crimson-to-Cyan Cinema Radial Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(244,63,94,0.24),rgba(34,211,238,0.12)_42%,rgba(3,3,6,0.98)_76%)]"
      />

      {/* Animated Light-Sweep Flare */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-64 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-futify-flare"
      />

      {/* Center Prism & Monumental Wordmark */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <FutifyLogoMark size="lg" animatedStroke={true} />

        <div className="space-y-2">
          <div className="font-display text-5xl sm:text-7xl font-extrabold tracking-[-0.04em] bg-gradient-to-r from-white via-rose-100 to-cyan-200 bg-clip-text text-transparent">
            FUTIFY
          </div>
          <div className="font-mono text-xs sm:text-sm tracking-[0.38em] uppercase text-rose-400/90 font-semibold">
            SEE TOMORROW FIRST
          </div>
        </div>

        {/* Sonic Signature Indicator + Instant Skip / Enter Control */}
        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => playFutifyTaDumSonic()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] font-mono text-slate-300 cursor-pointer transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>SONIC SIGNATURE ACTIVE</span>
          </button>

          <button
            type="button"
            data-testid="skip-intro-btn"
            onClick={onComplete}
            className="px-3.5 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/35 border border-rose-400/50 text-[11px] font-mono font-bold text-rose-100 cursor-pointer transition-colors"
          >
            ENTER TERMINAL ➔
          </button>
        </div>
      </div>
    </div>
  );
};
