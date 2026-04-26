// Bump CACHE_VERSION on each deploy to invalidate old caches.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `bibelsok-${CACHE_VERSION}`;

const PRECACHE = [
  '/',
  '/static/css/main.css',
  '/static/js/app.js',
  '/static/favicon.ico',
  '/static/manifest.json',
  '/static/images/icon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  // Take over immediately — don't wait for old SW to finish.
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => {
        // Tell pages that a new version has activated so they can prompt a reload.
        clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Pass through non-GET and all API requests unchanged.
  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) return;

  // Network-first for the HTML shell so new deploys are picked up.
  if (url.pathname === '/' || url.pathname === '') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for all other static assets.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
