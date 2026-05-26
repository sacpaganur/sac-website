const CACHE_NAME = 'sac-pwa-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './bible.html',
  './calendar.html',
  './contact.html',
  './devotion.html',
  './gallery.html',
  './liturgy.html',
  './notices.html',
  './schedule.html',
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

  // Stale-while-revalidate strategy with query-ignored cache matching
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      // Create a fetch request to get the latest version from network
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Cache successful responses from our origin or CORS resources
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((error) => {
          // If the network request fails and it's a page navigation request,
          // return the cached home page (index.html) as a fallback.
          if (event.request.mode === 'navigate') {
            console.warn('[Service Worker] Network failed for navigation. Serving index.html fallback.', error);
            return caches.match('./index.html', { ignoreSearch: true });
          }
          
          // Return the cached response (even if undefined) for other resources
          return cachedResponse;
        });

      // Return the cached response immediately if we have it, otherwise wait for the network
      return cachedResponse || fetchPromise;
    })
  );
});
