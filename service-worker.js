var cacheName    = 'weather-PWA-v0.0.3';
var dataCacheName = 'weatherData-v2';
var filesToCache = [
  './',
  './index.html',
  './scripts/app.js',
  './styles/inline.css',
  './images/clear.png',
  './images/cloudy.png',
  './images/partly-cloudy.png',
  './images/cloudy-scattered-showers.png',
  './images/scattered-showers.png',
  './images/fog.png',
  './images/rain.png',
  './images/sleet.png',
  './images/snow.png',
  './images/wind.png',
  './images/thunderstorm.png',
  './images/ic_add_white_24px.svg',
  './images/ic_refresh_white_24px.svg'
];

self.addEventListener('install', function(e) {
  console.log('[service-worker] Installing');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[service-worker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log('[service-worker] Activating');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName){
          console.log('[service-worker] Removing old caches', key);
          return caches.delete(key);
        }
      }))
    })
  );
  return self.clients.claim();
})

self.addEventListener('fetch', function(e){
  console.log('[service-worker] Fetch', e.request.url);
  var dataURL = 'https://query.yahooapis.com/v1/public/yql';
  if(e.request.url.indexOf(dataURL) > -1){
    caches.open(dataCacheName).then(function(cache) {
      return fetch(e.request).then(function(response) {
        cache.put(e.request.url, response.clone());
        return response;
      })
    })
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    )
  }
})
