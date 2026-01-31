const CACHE_NAME = 'pwa-wrapper-cache-v1';
const OFFLINE_URL = '/app1/offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['/app1/', OFFLINE_URL, '/app1/manifest.json', '/app1/icons/icon-192.png', '/app1/icons/icon-512.png']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then(r => r || caches.match(OFFLINE_URL)))
  );
});
