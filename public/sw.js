const CACHE_NAME = 'flyola-cache-v1';
const API_CACHE_NAME = 'flyola-api-cache-v1';

// Cache static assets
const STATIC_ASSETS = [
  '/',
  '/logoo-04.png',
  '/manifest.json'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/airport'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (API_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint))) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            // Return cached response and update in background
            fetch(request).then(fetchResponse => {
              if (fetchResponse.ok) {
                cache.put(request, fetchResponse.clone());
              }
            });
            return response;
          }
          
          // Fetch and cache new response
          return fetch(request).then(fetchResponse => {
            if (fetchResponse.ok) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});