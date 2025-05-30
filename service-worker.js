const CACHE_NAME = 'my-pwa-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',      // adjust path if needed
  '/style.css',       // your CSS file(s)
  '/app.js',          // your JS file(s)
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/service-worker.js',
  '/screenshot-desktop.png',
  '/screenshot-mobile.png',
  // Add any other assets, images, fonts, etc. your app needs
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing and caching...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached asset
          return cachedResponse;
        }
        // Fetch from network & cache it dynamically if needed
        return fetch(event.request).then(response => {
          // Optional: cache new requests dynamically
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        }).catch(() => {
          // Optional: fallback if fetch fails (e.g., offline page)
        });
      })
  );
});
