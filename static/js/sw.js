// Self-destruct stub. The PWA service worker was removed because it caused
// asset-version mismatches (FOUC, wrong icons) on revisits. Existing clients
// hit this file on update check; it clears old caches, unregisters itself,
// and reloads open tabs so the unregistered state takes effect.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('bibelsok-')).map(k => caches.delete(k))
    );
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(c => c.navigate(c.url));
  })());
});
