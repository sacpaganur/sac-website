const CACHE_NAME = 'sac-pwa-cache-v55';

// Minimal pre-cache list: Just the offline fallback and core shell assets
const PRECACHE_ASSETS = [
  './',
  './offline.html',
  './css/style.css',
  './js/common.js',
  './images/church_logo.webp'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing smart offline cache...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // Strategy 1: Network-First for HTML documents (pages)
  // Ensures users always see the latest content if online, falls back to cache if offline
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If valid response, clone and cache it
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed (offline), try to serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If the specific page isn't in cache, return the generic offline fallback page
            return caches.match('./offline.html');
          });
        })
    );
    return;
  }

  // Strategy 2: Cache-First for static assets (Images, Fonts)
  const isStatic = url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|woff2|woff)$/i);
  if (isStatic) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy 3: Stale-While-Revalidate for CSS and Javascript
  // Instantly serves cached file, but fetches update in the background for the NEXT load
  const isScriptOrStyle = url.pathname.endsWith('.js') || url.pathname.endsWith('.css');
  if (isScriptOrStyle) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        }).catch(() => null);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
