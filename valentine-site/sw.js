const CACHE_NAME = 'aot-valentine-v3';
const ASSETS = [
  './',
  './index.html',
  './css/base.css',
  './css/themes.css',
  './css/animations.css',
  './js/boot.js',
  './js/config.js',
  './js/sound.js',
  './js/events.js',
  './js/sequences.js',
  './js/main.js',
  './js/legacy.js',
  './assets/images/placeholder.png',
  './assets/images/YesImage1.png',
  './assets/images/YesImage2.png',
  './assets/images/YesImage3.png',
  './assets/sounds/yes-song-placeholder.mp4',
  './assets/videos/YesVid.mp4',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
