// 앱 셸은 설치 때 캐시, mp3는 재생한 것부터 캐시(전체를 한 번에 받지 않음)
// 캐시 키는 "sn-" 접두사만 관리한다(같은 도메인의 영어 앱 "sb-" 캐시를 지우지 않기 위함)
const V="sn-v10",SHELL=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("sn-")&&x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  const audio=/\.mp3$/.test(r.url);
  if(audio||/\/icons\//.test(r.url)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(ch=>ch.put(r,c))}return x})));return}
  e.respondWith(fetch(r,{cache:"no-cache"}).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(ch=>ch.put(r,c))}return x}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))))});
