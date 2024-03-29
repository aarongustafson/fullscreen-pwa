"use strict";

const staticCacheName = 'staticfiles';

self.addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open(staticCacheName)
    .then( staticCache => {
      return staticCache.addAll([
        'j/main.js',
        'c/default.css'
      ]);
    })
  );
});

self.addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;

  if ( /^chrome\-extension/.test(request.url) ) { return; }
  
  fetchEvent.respondWith(
    caches.open(staticCacheName).then(function(cache) {
      return fetch(fetchEvent.request)
              .then(function(response) {
                cache.put(fetchEvent.request, response.clone());
                return response;
              })
              .catch(function() {
                return caches.match(fetchEvent.request);
              });
    })
  ); // end respondWith
}); // end addEventListener
