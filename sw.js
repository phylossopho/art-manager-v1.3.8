// Service Worker para Gestor de Materiales - Deck Heroes
const CACHE_NAME = 'materiales-dh-v1.3';
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
  './manifest.json',
  './images/botas.png',
  './images/espada.png',
  './images/pecho.png',
  './images/casco.png',
  './images/guantes.png',
  './images/cinturon.png',
  './images/whatsapp.png',
  './images/telegram.png',
  './images/decodificando.png',
  './images/icon-192.png',
  './images/icon-144x144.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('SW: Instalando nueva versión:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Cache abierto:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Activar inmediatamente la nueva versión
        return self.skipWaiting();
      })
      .catch(error => {
        console.log('SW: Error al cachear recursos:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('SW: Activando nueva versión:', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tomar control de todas las páginas abiertas
      return self.clients.claim();
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  // Estrategia: Cache First, luego Network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devolverlo
        if (response) {
          console.log('SW: Sirviendo desde cache:', event.request.url);
          return response;
        }

        // Si no está en cache, hacer fetch
        console.log('SW: Haciendo fetch:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Solo cachear respuestas exitosas y del mismo origen
            if (!response || response.status !== 200 || response.type !== 'basic' || 
                !event.request.url.startsWith(self.location.origin)) {
              return response;
            }

            // Clonar la respuesta para cachearla
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('SW: Cacheado nuevo recurso:', event.request.url);
              });

            return response;
          })
          .catch(() => {
            // Si falla el fetch, devolver página offline
            if (event.request.destination === 'document') {
              console.log('SW: Sirviendo página offline');
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Escuchar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Verificar actualizaciones periódicamente
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Verificar si hay una nueva versión del service worker
    const response = await fetch('./sw.js', { cache: 'no-cache' });
    if (response.ok) {
      console.log('SW: Verificación de actualización completada');
    }
  } catch (error) {
    console.log('SW: Error en background sync:', error);
  }
} 