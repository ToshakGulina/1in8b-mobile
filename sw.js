const CACHE='1in8b-adapter-v1';
const SHELL=['./','./index.html','./css/adapter.css','./js/adapter.js','./manifest.json'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(SHELL)).then(()=> self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=> k!==CACHE).map(k=> caches.delete(k)))).then(()=> self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  const url=new URL(e.request.url);
  if(url.origin!==location.origin) return; // не кэшируем оригинал
  e.respondWith(caches.match(e.request).then(c=> c || fetch(e.request).then(r=>{
    if(e.request.method==='GET' && r.ok){ const cl=r.clone(); caches.open(CACHE).then(c=> c.put(e.request,cl)); }
    return r;
  }).catch(()=> c)));
});
