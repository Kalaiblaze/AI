import React, { useState } from 'react';
import { X, PlusCircle, Terminal, Sparkles, Trash2 } from 'lucide-react';
import {
  CarbonBriefingItem,
  synthesizeCustomBriefing
} from '../engine/carbonPulseEngine';

interface InjectTopicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectBriefing: (briefing: CarbonBriefingItem) => void;
  onClearSavedBriefings: () => void;
  savedCount: number;
}

const PRESET_TOPICS = [
  'Embedded Linux V4L2 camera driver with MIPI CSI-2 4-lane sensor and zero-copy DMA-BUF into RK3588 / Jetson Orin NPU',
  'Central Banks expand physical gold-settled mBridge repo lines as US Treasury 10-year term premia surge',
  'Reusable VLEO 280km optical laser satellites provide real-time targeting to shipboard 300kW directed-energy lasers'
];

export const InjectTopicDrawer: React.FC<InjectTopicDrawerProps> = ({
  isOpen,
  onClose,
  onInjectBriefing,
  onClearSavedBriefings,
  savedCount
}) => {
  const [rawText, setRawText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = rawText.trim();
    if (cleaned.length < 8) {
      setErrorMsg(
        'Please enter at least 8 characters of breaking news or a technical/macro topic.'
      );
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);

    setTimeout(() => {
      const generated = synthesizeCustomBriefing(
        cleaned,
        'USER INJECTED // LOCALSTORAGE'
      );
      onInjectBriefing(generated);
      setIsGenerating(false);
      setRawText('');
      onClose();
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inject-topic-drawer-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-xl bg-[#070A10] border-l border-white/15 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>LIVE TOPIC PARSER & PATTERN SYNTHESIZER</span>
              </div>
              <h2
                id="inject-topic-drawer-title"
                className="font-display text-xl font-bold text-white mt-1"
              >
                + Inject Custom Topic / Breaking News
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Dynamically synthesizes a complete 5-Pillar Thunglish breakdown, 3D Temporal Matrix, Titan vs. Failure autopsy, and Dot-Connection—persisted automatically to localStorage.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Inject Topic Drawer"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="custom-topic-input"
                className="block text-xs font-mono text-slate-300 mb-2"
              >
                PASTE RAW NEWS HEADLINE, KERNEL LOG, OR MACRO TOPIC:
              </label>
              <textarea
                id="custom-topic-input"
                rows={5}
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="e.g., TSMC 2nm backside power delivery wafer allocation or Embedded Linux V4L2 zero-copy DMA-BUF camera pipeline..."
                className="w-full rounded-xl bg-[#05070B] border border-white/15 p-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {errorMsg && (
                <p role="alert" className="text-xs font-mono text-rose-400 mt-1.5">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Preset Quick-Fill Topics */}
            <div className="space-y-2">
              <span className="block text-xs font-mono text-slate-400">
                OR LOAD A HIGH-DENSITY TEST VECTOR:
              </span>
              <div className="space-y-1.5">
                {PRESET_TOPICS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRawText(preset);
                      setErrorMsg('');
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs text-slate-300 font-mono transition-colors cursor-pointer"
                  >
                    [Preset #{idx + 1}] {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              {savedCount > 0 ? (
                <button
                  type="button"
                  onClick={onClearSavedBriefings}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear {savedCount} Saved LocalStorage Items</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-slate-500">
                  Persists to localStorage[&apos;carbon_pulse_custom_items&apos;]
                </span>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Synthesizing 8-Key Matrix...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Generate & Save Briefing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>CARBON-PULSE // ENGINE V4.2</span>
          <span>AUTO-INDEXED ACROSS 5 PILLARS</span>
        </div>
      </aside>
    </div>
  );
};
