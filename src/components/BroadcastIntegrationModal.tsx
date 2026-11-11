import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { NeatPillarData } from '../engine/nexusNeatEngine';
import {
  formatWhatsAppBriefing,
  buildTeamsAdaptiveCardPayload
} from '../engine/broadcastFormatter';

export interface AutoBroadcastConfig {
  teamsWebhookUrl: string;
  teamsAutoSync: boolean;
  whatsappWebhookUrl: string;
  whatsappAutoSync: boolean;
}

interface BroadcastIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePillarData: NeatPillarData;
  config: AutoBroadcastConfig;
  onUpdateConfig: (next: AutoBroadcastConfig) => void;
}

export const BroadcastIntegrationModal: React.FC<
  BroadcastIntegrationModalProps
> = ({ isOpen, onClose, activePillarData, config, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'WHATSAPP' | 'TEAMS'>('WHATSAPP');
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedTeamsJson, setCopiedTeamsJson] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const whatsappMessage = formatWhatsAppBriefing(activePillarData);
  const teamsCardPayload = buildTeamsAdaptiveCardPayload(activePillarData);
  const whatsappDeepLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handleCopyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2200);
    } catch {
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2200);
    }
  };

  const handleCopyTeamsJson = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(teamsCardPayload, null, 2)
      );
      setCopiedTeamsJson(true);
      setTimeout(() => setCopiedTeamsJson(false), 2200);
    } catch {
      setCopiedTeamsJson(true);
      setTimeout(() => setCopiedTeamsJson(false), 2200);
    }
  };

  const handleDispatchWebhook = async (platform: 'TEAMS' | 'WHATSAPP') => {
    const targetUrl =
      platform === 'TEAMS'
        ? config.teamsWebhookUrl.trim()
        : config.whatsappWebhookUrl.trim();

    if (!targetUrl.startsWith('https://')) {
      setStatusBanner({
        type: 'error',
        text: `Please enter a valid https:// ${
          platform === 'TEAMS' ? 'Microsoft Teams Incoming Webhook' : 'WhatsApp Bridge Webhook'
        } URL first.`
      });
      return;
    }

    setIsSending(true);
    setStatusBanner(null);

    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          webhookUrl: targetUrl,
          textPayload: whatsappMessage,
          adaptiveCardPayload: teamsCardPayload
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Webhook delivery failed');
      }

      setStatusBanner({
        type: 'success',
        text: `Delivered "${activePillarData.shortName}" briefing to ${
          platform === 'TEAMS' ? 'Microsoft Teams channel' : 'WhatsApp Group webhook'
        } (HTTP ${data.status}).`
      });
    } catch (err: unknown) {
      setStatusBanner({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Unable to reach webhook endpoint.'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="broadcast-modal-title"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-[#0D1017] border border-white/[0.08] p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] pb-4">
          <div>
            <h2
              id="broadcast-modal-title"
              className="font-display text-xl font-bold text-white flex items-center gap-2"
            >
              <Share2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>WhatsApp Group &amp; Microsoft Teams Integration</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Push live 60-second Thunglish briefings &amp; 7D telemetry directly to your WhatsApp Group or Teams channel.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Integration Modal"
            className="p-2 rounded-lg bg-[#06070A] border border-white/[0.07] text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Broadcast Platform Tabs"
          className="grid grid-cols-2 gap-2.5 bg-[#06070A] p-1.5 rounded-xl border border-white/[0.07]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'WHATSAPP'}
            onClick={() => {
              setActiveTab('WHATSAPP');
              setStatusBanner(null);
            }}
            className={`px-4 py-2.5 rounded-lg font-display text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'WHATSAPP'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🟢 WhatsApp Group</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'TEAMS'}
            onClick={() => {
              setActiveTab('TEAMS');
              setStatusBanner(null);
            }}
            className={`px-4 py-2.5 rounded-lg font-display text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'TEAMS'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🟣 Microsoft Teams Channel</span>
          </button>
        </div>

        {statusBanner && (
          <div
            role="alert"
            className={`rounded-xl p-3.5 border text-xs flex items-start gap-2.5 ${
              statusBanner.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200'
                : 'bg-rose-500/10 border-rose-400/30 text-rose-200'
            }`}
          >
            {statusBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{statusBanner.text}</span>
          </div>
        )}

        {/* TAB 1: WHATSAPP GROUP */}
        {activeTab === 'WHATSAPP' && (
          <div className="space-y-5">
            {/* Instant 1-Click Share & Copy */}
            <div className="rounded-xl bg-[#06070A] border border-white/[0.07] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-bold text-white">
                    1. Instant WhatsApp Group Share (Zero Setup)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formatted with native WhatsApp <code className="text-emerald-300">*bold*</code> &amp; <code className="text-emerald-300">_italic_</code> syntax, country flags, and 7D metrics.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyWhatsApp}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copiedWhatsApp ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied for WhatsApp!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy WhatsApp Brief</span>
                      </>
                    )}
                  </button>

                  <a
                    href={whatsappDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </a>
                </div>
              </div>

              <pre className="rounded-lg bg-[#0D1017] border border-white/[0.06] p-3.5 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {whatsappMessage}
              </pre>
            </div>

            {/* Automated WhatsApp Group Webhook Bridge (n8n / Make / Evolution / Wati / Meta Cloud API) */}
            <div className="rounded-xl bg-[#06070A] border border-white/[0.07] p-4 space-y-3.5">
              <div>
                <h3 className="font-display text-sm font-bold text-white">
                  2. Automated 60s WhatsApp Group Bot Bridge (Webhook)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connect an n8n, Make, Zapier, Wati, or Evolution API webhook URL to auto-post every 60-second sync to your WhatsApp Group.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="whatsapp-webhook-input" className="sr-only">
                  WhatsApp Webhook Bridge URL
                </label>
                <input
                  id="whatsapp-webhook-input"
                  type="url"
                  value={config.whatsappWebhookUrl}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      whatsappWebhookUrl: e.target.value
                    })
                  }
                  placeholder="https://hook.eu1.make.com/... or https://your-whatsapp-bridge.com/webhook"
                  className="flex-1 rounded-lg bg-[#0D1017] border border-white/[0.08] px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  disabled={isSending}
                  onClick={() => void handleDispatchWebhook('WHATSAPP')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Push to WhatsApp Webhook</span>
                </button>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={config.whatsappAutoSync}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      whatsappAutoSync: e.target.checked
                    })
                  }
                  className="rounded border-white/20 bg-[#0D1017] text-emerald-400 focus:ring-emerald-400"
                />
                <span>
                  Automatically push new dispatches to this WhatsApp webhook every 60 seconds
                </span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: MICROSOFT TEAMS CHANNEL */}
        {activeTab === 'TEAMS' && (
          <div className="space-y-5">
            {/* Step-by-Step Teams Webhook Dispatcher */}
            <div className="rounded-xl bg-[#06070A] border border-white/[0.07] p-4 space-y-3.5">
              <div>
                <h3 className="font-display text-sm font-bold text-white">
                  1. Connect Microsoft Teams Incoming Webhook / Workflow
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  In Microsoft Teams: Click <strong className="text-slate-200">•••</strong> next to your channel ➔ <strong className="text-slate-200">Workflows</strong> (or <strong className="text-slate-200">Connectors</strong>) ➔ choose <strong className="text-indigo-300">&ldquo;Post to a channel when a webhook request is received&rdquo;</strong> ➔ paste the URL below.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="teams-webhook-input" className="sr-only">
                  Microsoft Teams Incoming Webhook URL
                </label>
                <input
                  id="teams-webhook-input"
                  type="url"
                  value={config.teamsWebhookUrl}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      teamsWebhookUrl: e.target.value
                    })
                  }
                  placeholder="https://your-org.webhook.office.com/webhookb2/... or Power Automate URL"
                  className="flex-1 rounded-lg bg-[#0D1017] border border-white/[0.08] px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="button"
                  disabled={isSending}
                  onClick={() => void handleDispatchWebhook('TEAMS')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-400 hover:bg-indigo-300 disabled:opacity-50 text-slate-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Adaptive Card to Teams</span>
                </button>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={config.teamsAutoSync}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      teamsAutoSync: e.target.checked
                    })
                  }
                  className="rounded border-white/20 bg-[#0D1017] text-indigo-400 focus:ring-indigo-400"
                />
                <span>
                  Automatically broadcast Adaptive Cards to this Teams channel every 60 seconds
                </span>
              </label>
            </div>

            {/* Adaptive Card Payload Preview */}
            <div className="rounded-xl bg-[#06070A] border border-white/[0.07] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-bold text-white">
                    2. Microsoft Teams Adaptive Card v1.4 Payload
                  </h3>
                  <p className="text-xs text-slate-400">
                    Includes FactSets for 7D Telemetry, Country Actor Map, Thunglish Decode, and Trajectory.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyTeamsJson}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedTeamsJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Copied JSON!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Adaptive Card JSON</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="rounded-lg bg-[#0D1017] border border-white/[0.06] p-3.5 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed">
                {JSON.stringify(teamsCardPayload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
