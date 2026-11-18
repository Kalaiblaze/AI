import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  const isEmbeddedIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  if (isEmbeddedIframe) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => {
          regs.forEach((reg) => {
            void reg.unregister();
          });
        })
        .catch(() => {});
    }
    if ('caches' in window) {
      caches
        .keys()
        .then((keys) => {
          keys.forEach((key) => {
            if (key.includes('workbox') || key.includes('precache')) {
              void caches.delete(key);
            }
          });
        })
        .catch(() => {});
    }
  } else if ('serviceWorker' in navigator) {
    registerSW({ immediate: true });
  }
}

createRoot(document.getElementById('root')!).render(<App />);
