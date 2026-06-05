const CACHE_NAME = 'sac-pwa-cache-v41';
const ASSETS_TO_CACHE = [
  './',
  './bible.html',
  './calendar.html',
  './contact.html',
  './devotion.html',
  './gallery.html',
  './liturgy.html',
  './notices.html',
  './schedule.html',
  './sac-admin-portal.html',
  './css/dark-overrides.css',
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
  './images/church_logo.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all static assets while bypassing browser disk cache...');
      // Fetch each asset with cache: 'reload' to ensure we download the fresh deployed versions
      // from the live server instead of reusing stale browser HTTP disk cache entries!
      const cachePromises = ASSETS_TO_CACHE.map((url) => {
        const request = new Request(url, { cache: 'reload' });
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              return cache.put(url, response);
            }
            throw new Error(`Failed to fetch ${url} (Status: ${response.status})`);
          })
          .catch((err) => {
            console.warn(`[Service Worker] Pre-caching reload fetch failed for ${url}, falling back to basic caching:`, err);
            return cache.add(url).catch(fallbackErr => {
              console.error(`[Service Worker] Critical pre-caching failure for ${url}:`, fallbackErr);
            });
          });
      });
      return Promise.all(cachePromises);
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

  // Identify core files (pages, scripts, stylesheets) that need to be served fresh online
  const isDocOrScriptOrStyle = 
    event.request.mode === 'navigate' ||
    event.request.url.endsWith('.js') ||
    event.request.url.endsWith('.css') ||
    event.request.url.includes('/js/') ||
    event.request.url.includes('/css/');

  // --- Strategy 1: Stale-While-Revalidate for HTML, Javascript, and CSS ---
  // Online: Instant load from cache first, then update cache in background.
  // Offline: Instant load from cache, fallback to index if missing.
  if (isDocOrScriptOrStyle) {
    event.respondWith(
      caches.match(cleanUrl, { ignoreSearch: true }).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && !networkResponse.redirected) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(cleanUrl, responseToCache).catch(err => {
                  console.warn('[Service Worker] Cache put failed:', err);
                });
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.warn('[Service Worker] Fetch failed, keeping cached fallback:', error);
          });
          
        return cachedResponse || fetchPromise.then(res => {
            if (!res && event.request.mode === 'navigate') {
              return caches.match('./', { ignoreSearch: true });
            }
            return res;
        });
      })
    );
    return;
  }

  
  const isImage = event.request.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i);

  // --- Strategy 2: Cache-First for Images ---
  // If it's in the cache, return it immediately without hitting the network.
  if (isImage) {
    event.respondWith(
      caches.match(cleanUrl, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(cleanUrl, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // --- Strategy 3: Stale-While-Revalidate for other static media (Fonts, API JSON, etc.) ---
  // Instant load from cache first, then update cache in background.
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
                console.warn('[Service Worker] Media cache put failed:', err);
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

