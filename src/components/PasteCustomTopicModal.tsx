import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import {
  NEAT_PILLARS,
  NeatPillarId,
  NeatPillarData,
  createCustomTopicPillarData
} from '../engine/nexusNeatEngine';

interface PasteCustomTopicModalProps {
  isOpen: boolean;
  activePillar: NeatPillarId;
  onClose: () => void;
  onApplyCustomTopic: (pillar: NeatPillarId, updatedData: NeatPillarData) => void;
}

const SAMPLE_TOPICS: { pillar: NeatPillarId; text: string }[] = [
  {
    pillar: 'TECH',
    text: 'Linux Kernel 6.13 V4L2 Zero-Copy DMA-BUF Fence Sync for 4-Lane MIPI CSI-2 Edge NPU Cameras'
  },
  {
    pillar: 'MONEY',
    text: 'Central Banks Expand Physical Gold-Settled mBridge Repo Lines as G7 Debt Refinancing Hits $9.8T'
  },
  {
    pillar: 'DEFENCE',
    text: 'Autonomous Fiber-Optic Drone Swarms Paired with Shipboard 300kW Directed-Energy Laser Shields'
  }
];

export const PasteCustomTopicModal: React.FC<PasteCustomTopicModalProps> = ({
  isOpen,
  activePillar,
  onClose,
  onApplyCustomTopic
}) => {
  const [selectedPillar, setSelectedPillar] = useState<NeatPillarId>(activePillar);
  const [topicText, setTopicText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = topicText.trim();
    if (cleaned.length < 8) {
      setErrorMsg('Please paste at least 8 characters of news or a custom topic.');
      return;
    }

    const updated = createCustomTopicPillarData(cleaned, selectedPillar);
    onApplyCustomTopic(selectedPillar, updated);
    setTopicText('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paste-topic-modal-title"
    >
      <div className="w-full max-w-xl rounded-2xl bg-[#0D1017] border border-white/[0.07] p-7 shadow-2xl space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] pb-4">
          <div>
            <h2
              id="paste-topic-modal-title"
              className="font-display text-xl font-bold text-white"
            >
              + Paste Custom Topic
            </h2>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Synthesize any news headline or technical bottleneck into the 12-column Bento Intelligence Grid.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Paste Custom Topic Modal"
            className="p-2 rounded-lg bg-[#06070A] border border-white/[0.07] text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-2">
              SELECT TARGET SECTOR:
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(NEAT_PILLARS) as NeatPillarId[]).map((pid) => {
                const p = NEAT_PILLARS[pid];
                const isSel = selectedPillar === pid;
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => setSelectedPillar(pid)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isSel
                        ? 'bg-cyan-400 text-slate-950 font-semibold'
                        : 'bg-[#06070A] text-slate-300 border border-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    {p.tabLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="neat-custom-topic-input"
              className="block text-xs font-mono text-slate-300 mb-2"
            >
              PASTE NEWS HEADLINE OR TECHNICAL TOPIC:
            </label>
            <textarea
              id="neat-custom-topic-input"
              rows={4}
              value={topicText}
              onChange={(e) => {
                setTopicText(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g., Embedded Linux V4L2 zero-copy DMA-BUF camera pipeline or Sovereign Gold Repo..."
              className="w-full rounded-xl bg-[#06070A] border border-white/[0.07] p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
            {errorMsg && (
              <p role="alert" className="text-xs text-rose-400 mt-2">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-mono text-slate-400">
              QUICK SAMPLE TOPICS:
            </span>
            <div className="space-y-1.5">
              {SAMPLE_TOPICS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPillar(sample.pillar);
                    setTopicText(sample.text);
                    setErrorMsg('');
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#06070A] hover:bg-white/[0.04] border border-white/[0.07] text-xs text-slate-300 transition-colors cursor-pointer"
                >
                  {sample.text}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#06070A] border border-white/[0.07] hover:bg-white/[0.06] text-sm text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Update Sector Intelligence</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
