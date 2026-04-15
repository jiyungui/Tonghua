/* sw.js v3 — 更新版本号强制清除旧缓存 */
const CACHE = 'xingxingji-v3';   // ← 版本号改为 v3，旧 v1/v2 自动删除
const ASSETS = [
    './', './index.html', './manifest.json',
    './css/reset.css', './css/phone.css', './css/home.css',
    './css/widgets.css', './css/apps.css',
    './js/main.js', './js/home.js', './js/widgets.js'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});
