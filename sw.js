const CACHE='aiden-world-quest-v2';
const CORE=['./','index.html','style.css','fonts.css','data.js','game.js','lucide.min.js','favicon.svg','manifest.webmanifest','assets/icons/icon-192.png','assets/icons/icon-512.png','assets/icons/maskable-512.png','assets/world.webp','assets/victory.webp','assets/char-me.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    try{const res=await fetch(r);if(res&&res.ok)c.put(r,res.clone());return res}
    catch{const hit=await c.match(r,{ignoreSearch:true});if(hit)return hit;throw new Error('offline')}
  }));
});
