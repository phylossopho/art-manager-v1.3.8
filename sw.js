// Service Worker para Gestor de Materiales - Deck Heroes
const CACHE_NAME = 'materiales-dh-v1.4';
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
  './scripts/pwa-capabilities.js',
  './widgets/materiales-widget.html',
  './widgets/materiales-data.json',
  './widgets/widget-config.json',
  './widgets/widget-manager.js',
  './images/botas.png',
  './images/espada.png',
  './images/pecho.png',
  './images/casco.png',
  './images/guantes.png',
  './images/cinturon.png',
  './images/icon-192.png',
  './images/icon-144x144.png',
  './images/icon-512.png',
  './images/widget-screenshot.png'
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

// Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      this.performBackgroundSync()
    );
  }
});

// Periodic Sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'periodic-sync') {
    event.waitUntil(
      this.performPeriodicSync()
    );
  }
});

// Push Notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: './images/icon-192.png',
    badge: './images/icon-144x144.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Materiales',
        icon: './images/icon-144x144.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: './images/icon-144x144.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Gestor de Materiales DH', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./index.html')
    );
  }
});

// Funciones de sincronización
async function performBackgroundSync() {
  try {
    console.log('Ejecutando background sync...');
    
    // Aquí puedes agregar lógica para sincronizar datos
    // Por ejemplo, enviar datos al servidor si hay conexión
    
    // Simular sincronización
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Background sync completado');
  } catch (error) {
    console.error('Error en background sync:', error);
  }
}

async function performPeriodicSync() {
  try {
    console.log('Ejecutando periodic sync...');
    
    // Aquí puedes agregar lógica para actualizaciones periódicas
    // Por ejemplo, verificar nuevas versiones, actualizar datos, etc.
    
    // Simular actualización periódica
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Periodic sync completado');
  } catch (error) {
    console.error('Error en periodic sync:', error);
  }
}

// Message handling para comunicación con la app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
}); 