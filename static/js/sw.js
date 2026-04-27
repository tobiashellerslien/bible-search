// Bump CACHE_VERSION on each deploy to invalidate old caches.
const CACHE_VERSION = 'v4';
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
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // {cache: 'reload'} bypasses the browser HTTP cache so a SW version bump
    // can't accidentally re-cache stale assets from a still-valid max-age entry.
    const requests = PRECACHE.map(u => new Request(u, { cache: 'reload' }));
    await cache.addAll(requests);
  })());
  // Take over immediately — don't wait for old SW to finish.
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const oldKeys = keys.filter(k => k !== CACHE_NAME && k.startsWith('bibelsok-'));
    await Promise.all(oldKeys.map(k => caches.delete(k)));
    await self.clients.claim();
    // Only notify pages on a real update (we replaced an older cache).
    // First install has no old caches to delete — skip the banner then.
    if (oldKeys.length > 0) {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
    }
  })());
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
