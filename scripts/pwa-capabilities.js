// scripts/pwa-capabilities.js
// ============= INICIO DE pwa-capabilities.js =============

// Configuración para capacidades avanzadas de PWA
class PWACapabilities {
    constructor(estadoApp) {
        this.estadoApp = estadoApp;
        this.init();
    }

    init() {
        this.configurarServiceWorker();
        this.configurarFileHandlers();
        this.configurarShareTarget();
        this.configurarProtocolHandlers();
        this.configurarShortcuts();
        this.configurarBackgroundSync();
        this.configurarPeriodicSync();
        this.configurarPushNotifications();
        this.configurarEdgeSidePanel();
    }

    // Service Worker para capacidades offline
    configurarServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registrado:', registration);
                    this.registration = registration;
                })
                .catch(error => {
                    console.error('Error al registrar Service Worker:', error);
                });
        }
    }

    // Manejo de archivos (CSV, JSON)
    configurarFileHandlers() {
        if ('launchQueue' in window) {
            window.launchQueue.setConsumer(async (launchParams) => {
                if (!launchParams.files.length) return;
                
                for (const fileHandle of launchParams.files) {
                    const file = await fileHandle.getFile();
                    await this.procesarArchivo(file);
                }
            });
        }
    }

    async procesarArchivo(file) {
        try {
            const contenido = await file.text();
            
            if (file.name.endsWith('.csv')) {
                await this.procesarCSV(contenido);
            } else if (file.name.endsWith('.json')) {
                await this.procesarJSON(contenido);
            }
        } catch (error) {
            console.error('Error al procesar archivo:', error);
            this.mostrarNotificacion('Error', 'No se pudo procesar el archivo');
        }
    }

    async procesarCSV(contenido) {
        // Importar dinámicamente el módulo CSV
        const { procesarCSV } = await import('./csv.js');
        const materiales = procesarCSV(contenido);
        
        // Actualizar el estado con los nuevos materiales
        this.estadoApp.almacenMateriales = {
            ...this.estadoApp.almacenMateriales,
            ...materiales
        };
        
        this.estadoApp.cambiosPendientes = true;
        this.mostrarNotificacion('Éxito', 'Materiales importados desde CSV');
    }

    async procesarJSON(contenido) {
        try {
            const datos = JSON.parse(contenido);
            
            if (datos.materiales) {
                this.estadoApp.almacenMateriales = {
                    ...this.estadoApp.almacenMateriales,
                    ...datos.materiales
                };
            }
            
            if (datos.equipos) {
                // Importar dinámicamente el módulo de arte
                const { guardarEquiposEnLocalStorage } = await import('./arte.js');
                guardarEquiposEnLocalStorage(datos.equipos);
            }
            
            this.estadoApp.cambiosPendientes = true;
            this.mostrarNotificacion('Éxito', 'Datos importados desde JSON');
        } catch (error) {
            console.error('Error al procesar JSON:', error);
            this.mostrarNotificacion('Error', 'Formato JSON inválido');
        }
    }

    // Share Target - Recibir contenido compartido
    configurarShareTarget() {
        // Verificar si la app fue abierta por share target
        const urlParams = new URLSearchParams(window.location.search);
        const titulo = urlParams.get('title');
        const texto = urlParams.get('text');
        const url = urlParams.get('url');

        if (titulo || texto || url) {
            this.procesarContenidoCompartido({ titulo, texto, url });
        }
    }

    procesarContenidoCompartido(datos) {
        // Crear un nuevo material basado en el contenido compartido
        const nuevoMaterial = {
            nombre: datos.titulo || 'Material Compartido',
            descripcion: datos.texto || '',
            cantidad: 1,
            color: 'blanco',
            clase: 'Normal',
            nivel: '1'
        };

        // Agregar al almacén de materiales
        const id = Date.now().toString();
        this.estadoApp.almacenMateriales[id] = nuevoMaterial;
        this.estadoApp.cambiosPendientes = true;

        this.mostrarNotificacion('Material Agregado', 
            `Se agregó "${nuevoMaterial.nombre}" desde contenido compartido`);
    }

    // Protocol Handlers - Manejar protocolo personalizado
    configurarProtocolHandlers() {
        // Verificar si la app fue abierta por protocolo personalizado
        const urlParams = new URLSearchParams(window.location.search);
        const protocol = urlParams.get('protocol');

        if (protocol && protocol.startsWith('web+materiales://')) {
            this.procesarProtocolo(protocol);
        }
    }

    procesarProtocolo(protocol) {
        // Extraer datos del protocolo personalizado
        const datos = protocol.replace('web+materiales://', '');
        
        try {
            const material = JSON.parse(decodeURIComponent(datos));
            const id = Date.now().toString();
            this.estadoApp.almacenMateriales[id] = material;
            this.estadoApp.cambiosPendientes = true;
            
            this.mostrarNotificacion('Material Importado', 
                `Se importó "${material.nombre}" vía protocolo`);
        } catch (error) {
            console.error('Error al procesar protocolo:', error);
        }
    }

    // Shortcuts - Accesos directos
    configurarShortcuts() {
        // Verificar si la app fue abierta por shortcut
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');

        if (action) {
            this.ejecutarAccion(action);
        }
    }

    ejecutarAccion(action) {
        switch (action) {
            case 'nuevo':
                this.abrirModalNuevoMaterial();
                break;
            case 'galeria':
                this.abrirGaleria();
                break;
            default:
                console.log('Acción no reconocida:', action);
        }
    }

    async abrirModalNuevoMaterial() {
        // Importar dinámicamente el módulo de modales
        const { mostrarModalNuevoMaterial } = await import('./modales.js');
        mostrarModalNuevoMaterial(this.estadoApp);
    }

    async abrirGaleria() {
        // Importar dinámicamente el módulo de galería
        const { mostrarGaleria } = await import('./galeria.js');
        mostrarGaleria(this.estadoApp);
    }

    // Background Sync
    configurarBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('background-sync')
                    .then(() => {
                        console.log('Background sync registrado');
                    })
                    .catch(error => {
                        console.error('Error al registrar background sync:', error);
                    });
            });
        }
    }

    // Periodic Sync
    configurarPeriodicSync() {
        if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                registration.periodicSync.register('periodic-sync', {
                    minInterval: 24 * 60 * 60 * 1000 // 24 horas
                }).then(() => {
                    console.log('Periodic sync registrado');
                }).catch(error => {
                    console.error('Error al registrar periodic sync:', error);
                });
            });
        }
    }

    // Push Notifications
    configurarPushNotifications() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            this.solicitarPermisosNotificacion();
        }
    }

    async solicitarPermisosNotificacion() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Permisos de notificación concedidos');
                this.suscribirPushNotifications();
            }
        } catch (error) {
            console.error('Error al solicitar permisos de notificación:', error);
        }
    }

    async suscribirPushNotifications() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('TU_VAPID_PUBLIC_KEY')
            });
            
            console.log('Suscripción push creada:', subscription);
        } catch (error) {
            console.error('Error al suscribir push notifications:', error);
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Edge Side Panel
    configurarEdgeSidePanel() {
        if ('sidePanel' in window) {
            window.sidePanel.setPanelBehavior({ openPanelOnAction: true });
        }
    }

    // Utilidades
    mostrarNotificacion(titulo, mensaje) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(titulo, {
                body: mensaje,
                icon: './images/icon-192.png'
            });
        } else {
            // Fallback: mostrar mensaje en la UI
            console.log(`${titulo}: ${mensaje}`);
        }
    }

    // Exportar datos
    exportarDatos() {
        const datos = {
            materiales: this.estadoApp.almacenMateriales,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(datos, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `materiales-deck-heroes-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Compartir datos
    async compartirDatos() {
        if ('share' in navigator) {
            const datos = {
                materiales: this.estadoApp.almacenMateriales,
                timestamp: new Date().toISOString()
            };

            const texto = `Mis materiales de Deck Heroes: ${Object.keys(datos.materiales).length} materiales`;
            
            try {
                await navigator.share({
                    title: 'Materiales Deck Heroes',
                    text: texto,
                    url: window.location.href
                });
            } catch (error) {
                console.error('Error al compartir:', error);
            }
        }
    }
}

export default PWACapabilities;
// ============= FIN DE pwa-capabilities.js ============= 