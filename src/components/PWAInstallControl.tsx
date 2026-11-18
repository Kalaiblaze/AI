import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  Copy,
  Download,
  Monitor,
  Smartphone,
  WifiOff,
  X
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { LINUX_ANDROID_INSTALL_GUIDES } from '../engine/pwaPlatformEngine';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, platformInfo, install } =
    usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'linux' | 'android'>(() =>
    isAndroid ? 'android' : 'linux'
  );
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [swReady, setSwReady] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab(isAndroid ? 'android' : 'linux');
  }, [isAndroid]);

  useEffect(() => {
    if (!isModalOpen || typeof navigator === 'undefined') return;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then((reg) => setSwReady(Boolean(reg)))
        .catch(() => setSwReady(false));
    }
  }, [isModalOpen]);

  // Suppress button when already running as an installed standalone PWA
  if (isInstalled) {
    return null;
  }

  const handlePrimaryClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }
    setIsModalOpen(true);
  };

  const handleCopyUrl = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Fallback ignored cleanly inside restricted contexts
    }
  };

  const guide = LINUX_ANDROID_INSTALL_GUIDES[activeTab];

  const modalNode =
    isModalOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Install FUTIFY on Linux and Android"
            data-testid="pwa-install-modal"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0B0F1A] border border-white/15 shadow-2xl p-5 space-y-4 text-slate-100">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                    CROSS-PLATFORM PWA · {platformInfo.label.toUpperCase()}
                  </div>
                  <h2 className="font-display text-lg font-extrabold text-white">
                    Use FUTIFY on Linux &amp; Android
                  </h2>
                </div>
                <button
                  type="button"
                  data-testid="close-pwa-install-modal-btn"
                  aria-label="Close install dialog"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Platform Selector Tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  data-testid="pwa-tab-linux"
                  onClick={() => setActiveTab('linux')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border font-display text-xs font-bold cursor-pointer transition-colors ${
                    activeTab === 'linux'
                      ? 'bg-indigo-500/20 border-indigo-400/60 text-white'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-indigo-300" />
                  <span>Linux Desktop</span>
                </button>
                <button
                  type="button"
                  data-testid="pwa-tab-android"
                  onClick={() => setActiveTab('android')}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border font-display text-xs font-bold cursor-pointer transition-colors ${
                    activeTab === 'android'
                      ? 'bg-emerald-500/20 border-emerald-400/60 text-white'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-300" />
                  <span>Android Mobile</span>
                </button>
              </div>

              {/* Native One-Click Install CTA when beforeinstallprompt is active */}
              {isInstallable && (
                <button
                  type="button"
                  data-testid="pwa-native-install-trigger"
                  onClick={() => void install()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-display text-sm font-bold cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Standalone App Now</span>
                </button>
              )}

              {/* 3-Step Platform Instructions */}
              <div className="rounded-xl bg-black/55 border border-white/10 p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-white">
                    {guide.title}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {guide.browserHint}
                  </span>
                </div>
                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                  {guide.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                {isIOS && (
                  <p className="text-[11px] font-mono text-amber-300 pt-1 border-t border-white/10">
                    iOS Safari detected: Tap Share -&gt; Add to Home Screen.
                  </p>
                )}
              </div>

              {/* Copy URL + Service Worker Status Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="font-mono text-[11px] text-slate-400">
                  Offline Cache:{' '}
                  <span
                    className={
                      swReady
                        ? 'text-emerald-300 font-semibold'
                        : 'text-slate-300'
                    }
                  >
                    {swReady ? 'Service Worker Active' : 'Manifest & Cache Ready'}
                  </span>
                </div>

                <button
                  type="button"
                  data-testid="pwa-copy-url-btn"
                  onClick={() => void handleCopyUrl()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 font-mono text-xs font-semibold text-white cursor-pointer transition-colors"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied URL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Copy App URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        data-testid="pwa-install-btn"
        onClick={() => void handlePrimaryClick()}
        title="Install FUTIFY App on Linux or Android"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/40 font-mono text-xs font-semibold text-indigo-200 cursor-pointer whitespace-nowrap transition-colors"
      >
        <Download className="w-3.5 h-3.5 text-indigo-300" />
        <span>{isInstallable ? 'Install App' : 'Linux / Android'}</span>
      </button>

      {modalNode}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      data-testid="pwa-offline-banner"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 px-3.5 py-2 text-xs font-mono font-semibold text-slate-950 shadow-xl border border-amber-300"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>Offline Mode — Cached FUTIFY intelligence active</span>
    </div>
  );
};
