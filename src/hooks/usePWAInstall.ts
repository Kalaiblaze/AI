import { useCallback, useEffect, useState } from 'react';
import {
  ClientPlatformInfo,
  detectClientPlatform
} from '../engine/pwaPlatformEngine';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platformInfo, setPlatformInfo] = useState<ClientPlatformInfo>(() =>
    typeof navigator !== 'undefined'
      ? detectClientPlatform(
          navigator.userAgent,
          navigator.maxTouchPoints || 0
        )
      : detectClientPlatform('')
  );

  useEffect(() => {
    setPlatformInfo(
      detectClientPlatform(
        window.navigator.userAgent,
        window.navigator.maxTouchPoints || 0
      )
    );

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS: platformInfo.isIOS,
    isAndroid: platformInfo.isAndroid,
    isLinux: platformInfo.isLinux,
    platformInfo,
    install
  };
}
