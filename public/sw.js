// Service Worker for Roulette Tracker Pro All in one
const CACHE_NAME = 'roulette-tracker-pro-cache-v2.5.0';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache assets warning:', err);
      });
    })
  );
});

// Activate Event - Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate with offline fallback to cached shell
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip browser-extension or chrome-extension schemes
  if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
    return;
  }

  // Navigation requests (HTML document loading)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Connection lost / offline: return cached index.html
          const cachedDoc = await caches.match(request);
          if (cachedDoc) return cachedDoc;
          const fallback = await caches.match('./index.html') || await caches.match('/');
          if (fallback) return fallback;
          return new Response('Offline - Cache loading', { status: 200, headers: { 'Content-Type': 'text/html' } });
        })
    );
    return;
  }

  // Static assets (scripts, styles, images, fonts)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and not in cache, return undefined so cachedResponse or nothing is used
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for message to skip waiting when user reloads with connection
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
