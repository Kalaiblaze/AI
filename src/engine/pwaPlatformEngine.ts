export type ClientPlatformId =
  | 'android'
  | 'linux'
  | 'ios'
  | 'macos'
  | 'windows'
  | 'unknown';

export interface ClientPlatformInfo {
  platform: ClientPlatformId;
  label: string;
  isAndroid: boolean;
  isLinux: boolean;
  isIOS: boolean;
  isMobile: boolean;
}

export interface PlatformInstallGuide {
  platform: 'android' | 'linux';
  title: string;
  browserHint: string;
  steps: [string, string, string];
}

export function detectClientPlatform(
  userAgent: string,
  maxTouchPoints = 0
): ClientPlatformInfo {
  const ua = (userAgent || '').toLowerCase();

  // Check Android BEFORE Linux because Android User-Agent strings contain "Linux"
  if (/\bandroid\b/.test(ua)) {
    return {
      platform: 'android',
      label: 'Android Mobile / Tablet',
      isAndroid: true,
      isLinux: false,
      isIOS: false,
      isMobile: true
    };
  }

  // Check iOS / iPadOS (including iPad desktop-mode Safari with touch points)
  if (
    /\b(iphone|ipad|ipod)\b/.test(ua) ||
    (/\bmacintosh\b/.test(ua) && maxTouchPoints > 1)
  ) {
    return {
      platform: 'ios',
      label: 'iOS / iPadOS',
      isAndroid: false,
      isLinux: false,
      isIOS: true,
      isMobile: true
    };
  }

  if (/\blinux\b|\bx11\b|\bwayland\b|\bcros\b/.test(ua)) {
    return {
      platform: 'linux',
      label: 'Linux Desktop',
      isAndroid: false,
      isLinux: true,
      isIOS: false,
      isMobile: false
    };
  }

  if (/\bmac os x\b|\bmacintosh\b/.test(ua)) {
    return {
      platform: 'macos',
      label: 'macOS Desktop',
      isAndroid: false,
      isLinux: false,
      isIOS: false,
      isMobile: false
    };
  }

  if (/\bwindows\b/.test(ua)) {
    return {
      platform: 'windows',
      label: 'Windows Desktop',
      isAndroid: false,
      isLinux: false,
      isIOS: false,
      isMobile: false
    };
  }

  return {
    platform: 'unknown',
    label: 'Web Browser',
    isAndroid: false,
    isLinux: false,
    isIOS: false,
    isMobile: false
  };
}

export const LINUX_ANDROID_INSTALL_GUIDES: Record<
  'linux' | 'android',
  PlatformInstallGuide
> = {
  linux: {
    platform: 'linux',
    title: 'Linux Desktop App (PWA)',
    browserHint: 'Chrome · Chromium · Brave · Edge (Wayland / X11)',
    steps: [
      'Open this URL in Chrome, Chromium, or Edge on your Linux workstation.',
      'Click the Install App icon in the address bar (or Menu -> Cast, save, and share -> Install FUTIFY).',
      'Launch FUTIFY as a native standalone window with offline app-shell caching and desktop launcher entry.'
    ]
  },
  android: {
    platform: 'android',
    title: 'Android Phone & Tablet App (PWA)',
    browserHint: 'Chrome · Edge · Brave · Samsung Internet',
    steps: [
      'Open this URL in Chrome or Edge on your Android device (use Copy App URL below).',
      'Tap the browser menu (⋮) and choose "Add to Home screen" -> "Install".',
      'FUTIFY installs onto your Android launcher as a standalone full-screen app with adaptive maskable icon.'
    ]
  }
};
