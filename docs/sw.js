const CACHE_NAME = 'app1-v1';
const PRECACHE = [
  '/app1/',
  '/app1/index.html',
  '/app1/manifest.json',
  '/app1/icons/icon-192.png',
  '/app1/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        return caches.open(CACHE_NAME).then(cache => {
          try { cache.put(event.request, resp.clone()); } catch(e) { /* algunas peticiones no son cacheables */ }
          return resp;
        });
      });
    }).catch(() => caches.match('/app1/index.html'))
  );
});
