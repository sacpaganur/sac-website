const CACHE_NAME = 'sac-pwa-cache-v7';
const ASSETS_TO_CACHE = [
  './',
  './bible',
  './calendar',
  './contact',
  './devotion',
  './gallery',
  './liturgy',
  './notices',
  './schedule',
  './sac-admin-portal',
  './css/style.css',
  './css/bible-page.css',
  './css/calendar.css',
  './css/contact-page.css',
  './css/devotion-page.css',
  './css/gallery-page.css',
  './css/liturgy-page.css',
  './css/schedule-page.css',
  './css/a11y.css',
  './css/ai-chat.css',
  './css/modal.css',
  './css/hero-home.css',
  './js/common.js',
  './js/navbar.js',
  './js/footer.js',
  './js/database.js',
  './js/a11y.js',
  './js/ai-chat-ui.js',
  './js/ai-service.js',
  './js/bible-data.js',
  './js/calendar-links.js',
  './js/calendar.js',
  './js/hero-home.js',
  './js/liturgical_data.js',
  './js/services.js',
  './js/messaging.js',
  './images/church_logo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all static assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
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
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and HTTP/HTTPS schemes (bypass chrome-extension, data: URIs, etc.)
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const requestUrl = new URL(event.request.url);
  
  // Define clean URL by stripping .html extensions
  let cleanUrl = event.request.url;
  if (requestUrl.pathname.endsWith('.html')) {
    const cleanPath = requestUrl.pathname.slice(0, -5);
    cleanUrl = requestUrl.origin + cleanPath + requestUrl.search;
  }

  // --- Strategy 1: Network-First for Page Navigations (HTML pages) ---
  // This avoids any potential redirect conflicts or ERR_FAILED blocks from cleanUrls when online,
  // while ensuring robust offline fallback loading.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If successful and not redirected, cache the response under the clean URL
          if (networkResponse && networkResponse.status === 200 && !networkResponse.redirected) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(cleanUrl, responseToCache).catch(err => {
                console.warn('[Service Worker] Navigation cache put failed:', err);
              });
            });
          }
          return networkResponse;
        })
        .catch((error) => {
          console.warn('[Service Worker] Navigation fetch failed. Attempting offline cache fallback...', error);
          // Network failed (offline), try to serve the clean URL from cache
          return caches.match(cleanUrl, { ignoreSearch: true }).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Ultimate fallback to cached clean home page
            return caches.match('./', { ignoreSearch: true });
          });
        })
    );
    return;
  }

  // --- Strategy 2: Stale-While-Revalidate for Static Assets (CSS, JS, Images, etc.) ---
  event.respondWith(
    caches.match(cleanUrl, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors') &&
            !networkResponse.redirected
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(cleanUrl, responseToCache).catch(err => {
                console.warn('[Service Worker] Asset cache put failed:', err);
              });
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
