const CACHE_NAME = 'myphone-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/base.css',
    './css/screen.css',
    './css/widgets.css',
    './css/dock.css',
    './css/apps.css',
    './js/app.js',
    './js/widgets.js',
    './js/storage.js',
    './js/apps.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
});
