import { useState, useEffect, useCallback } from 'react';

/**
 * Actively checks whether the device has a working data connection (Wi-Fi or Mobile Data).
 * Prevents false positives from navigator.onLine when connected to router with no internet.
 */
export async function checkDataConnection(timeoutMs: number = 2500): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // HEAD or GET to current origin with cache-buster
    const pingUrl = `${window.location.origin}${window.location.pathname}?_net_ping=${Date.now()}`;
    const response = await fetch(pingUrl, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok || response.status < 400 || response.type === 'opaque';
  } catch (e) {
    // If HEAD failed or blocked, try fallback check with tiny favicon or online flag
    return false;
  }
}

/**
 * React hook to track data connectivity and react to offline/online events.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const verifyConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const active = await checkDataConnection();
      setIsOnline(active);
      return active;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      // Re-verify actual data throughput
      checkDataConnection().then((active) => setIsOnline(active));
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial silent check
    checkDataConnection(1500).then((active) => {
      setIsOnline(active);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isChecking, verifyConnection };
}

/**
 * Register Service Worker for offline PWA native loading.
 */
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Check for service worker updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available once refreshed
                    console.log('New application update ready.');
                  }
                }
              };
            }
          };
        })
        .catch((err) => {
          // Service worker registration error (silently ignored in unsupported sandbox iframe environments)
          console.debug('SW registration notice:', err);
        });
    });
  }
}
