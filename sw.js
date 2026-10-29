const CACHE = '1in8b-mobile-v2';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/data.js',
  './manifest.json'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(ASSETS)).then(()=> self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=> k!==CACHE).map(k=> caches.delete(k)))).then(()=> self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached=> cached || fetch(e.request).then(res=>{
      // cache GET successful
      if(e.request.method==='GET' && res.ok){
        const clone=res.clone();
        caches.open(CACHE).then(c=> c.put(e.request, clone));
      }
      return res;
    }).catch(()=> cached))
  );
});
