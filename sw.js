// Service Worker para Gestor de Materiales - Deck Heroes
const CACHE_NAME = 'materiales-dh-v1.2';
const urlsToCache = [
  './',
  './index.html',
  './estilos/principal.css',
  './estilos/tablas.css',
  './estilos/modales.css',
  './estilos/galeria.css',
  './estilos/responsive.css',
  './scripts/app.js',
  './scripts/datos.js',
  './scripts/ui.js',
  './scripts/eventos.js',
  './scripts/materiales.js',
  './scripts/conversiones.js',
  './scripts/galeria.js',
  './scripts/modales.js',
  './scripts/csv.js',
  './scripts/simulacion.js',
  './scripts/arte.js',
  './scripts/baselogic.js',
  './images/botas.png',
  './images/espada.png',
  './images/pecho.png',
  './images/casco.png',
  './images/guantes.png',
  './images/cinturon.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('Error al cachear recursos:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devolverlo
        if (response) {
          return response;
        }

        // Si no está en cache, hacer fetch
        return fetch(event.request)
          .then(response => {
            // Solo cachear respuestas exitosas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta para cachearla
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Si falla el fetch, devolver página offline
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
}); 