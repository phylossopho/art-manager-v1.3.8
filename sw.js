// Service Worker para Gestor de Materiales - Deck Heroes
const CACHE_NAME = 'materiales-dh-v1.3';
const APP_VERSION = '1.3.0'; // Versión de la aplicación

// Archivos críticos para verificar actualizaciones
const CRITICAL_FILES = [
  './index.html',
  './scripts/app.js',
  './scripts/ui.js',
  './scripts/eventos.js',
  './estilos/principal.css'
];

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

// Función para verificar si hay actualizaciones reales
async function checkForUpdates() {
  try {
    console.log('SW: Verificando actualizaciones...');
    
    // Verificar archivos críticos con cache: 'no-cache'
    for (const file of CRITICAL_FILES) {
      const response = await fetch(file, { 
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const text = await response.text();
        const currentHash = await getFileHash(text);
        const cachedHash = await getCachedFileHash(file);
        
        if (currentHash !== cachedHash) {
          console.log(`SW: Cambio detectado en ${file}`);
          return true; // Hay actualización
        }
      }
    }
    
    console.log('SW: No se detectaron cambios');
    return false;
  } catch (error) {
    console.log('SW: Error verificando actualizaciones:', error);
    return false;
  }
}

// Función simple para generar hash de archivo
async function getFileHash(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Función para obtener hash del archivo cacheado
async function getCachedFileHash(file) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(file);
    if (response) {
      const text = await response.text();
      return await getFileHash(text);
    }
  } catch (error) {
    console.log('SW: Error obteniendo hash cacheado:', error);
  }
  return null;
}

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
  // Estrategia: Network First para archivos críticos, Cache First para el resto
  if (CRITICAL_FILES.includes(event.request.url.split('?')[0])) {
    // Network First para archivos críticos
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            // Cachear la nueva versión
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('SW: Cacheado archivo crítico actualizado:', event.request.url);
              });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, usar cache
          return caches.match(event.request);
        })
    );
  } else {
    // Cache First para archivos no críticos
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('SW: Sirviendo desde cache:', event.request.url);
            return response;
          }

          console.log('SW: Haciendo fetch:', event.request.url);
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200 || response.type !== 'basic' || 
                  !event.request.url.startsWith(self.location.origin)) {
                return response;
              }

              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                  console.log('SW: Cacheado nuevo recurso:', event.request.url);
                });

              return response;
            })
            .catch(() => {
              if (event.request.destination === 'document') {
                console.log('SW: Sirviendo página offline');
                return caches.match('./index.html');
              }
            });
        })
    );
  }
});

// Escuchar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CHECK_UPDATES') {
    checkForUpdates().then(hasUpdates => {
      event.ports[0].postMessage({ hasUpdates });
    });
  }
});

// Verificar actualizaciones cada 5 minutos
setInterval(() => {
  checkForUpdates().then(hasUpdates => {
    if (hasUpdates) {
      console.log('SW: Actualización detectada, notificando cliente');
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'UPDATE_AVAILABLE' });
        });
      });
    }
  });
}, 5 * 60 * 1000); // 5 minutos 