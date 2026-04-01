var cacheName = 'narvarodv-cache-v1';
//var cacheAssets = [
//    'css/loading.css',
//    'css/print.css',
//    'css/styles.css',
//    'js/EditTab.js',
//    'js/fullscreen.js',
//    'js/indexedDB.js',
//    'js/main.js',
//    'js/print.js',
//    'index.html'
//];


self.addEventListener('install', e => {
    console.log('Service Worker: installing');
//    e.waitUntil(
//        caches.open(cacheName)
//        .then(cache => {
//            console.log(`Service Worker: Caching Files: ${cache}`);
//            cache.addAll(cacheAssets)
//                // When everything is set
//                .then(() => self.skipWaiting())
//        })
//    );
});

// Call Activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(
                    cache => {
                        if (cache !== cacheName) {
                            console.log('Service Worker: Clearing Old Cache');
                            return caches.delete(cache);
                        }
                    }
                )
            )
        })
    );
});


self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
        .then(res => {
            const resColne = res.clone();
            caches.open(cacheName).then(cache => {
                cache.put(e.request, resColne);
            });
            return res;
        }).catch(err => caches.match(e.request).then(res => res))
    );
});