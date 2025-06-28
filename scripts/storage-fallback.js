// scripts/storage-fallback.js
// Sistema de almacenamiento robusto con múltiples fallbacks

class RobustStorage {
    constructor() {
        this.storageType = 'none';
        this.dbName = 'ArtManagerDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    async init() {
        // Intentar localStorage primero
        if (this.testLocalStorage()) {
            this.storageType = 'localStorage';
            console.log('✅ Usando localStorage');
            return;
        }

        // Intentar sessionStorage
        if (this.testSessionStorage()) {
            this.storageType = 'sessionStorage';
            console.log('✅ Usando sessionStorage');
            return;
        }

        // Intentar IndexedDB
        if (await this.initIndexedDB()) {
            this.storageType = 'indexedDB';
            console.log('✅ Usando IndexedDB');
            return;
        }

        // Último recurso: memoria temporal
        this.storageType = 'memory';
        this.memoryStorage = {};
        console.log('⚠️ Usando almacenamiento en memoria (se perderá al recargar)');
    }

    testLocalStorage() {
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    testSessionStorage() {
        try {
            const test = '__test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    async initIndexedDB() {
        return new Promise((resolve) => {
            if (!window.indexedDB) {
                resolve(false);
                return;
            }

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.warn('IndexedDB no disponible');
                resolve(false);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(true);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data', { keyPath: 'key' });
                }
            };
        });
    }

    async setItem(key, value) {
        try {
            switch (this.storageType) {
                case 'localStorage':
                    localStorage.setItem(key, JSON.stringify(value));
                    break;
                case 'sessionStorage':
                    sessionStorage.setItem(key, JSON.stringify(value));
                    break;
                case 'indexedDB':
                    await this.setIndexedDBItem(key, value);
                    break;
                case 'memory':
                    this.memoryStorage[key] = value;
                    break;
            }
            console.log(`💾 Datos guardados en ${this.storageType}:`, key);
        } catch (e) {
            console.error('Error al guardar datos:', e);
            throw e;
        }
    }

    async getItem(key) {
        try {
            switch (this.storageType) {
                case 'localStorage':
                    const localData = localStorage.getItem(key);
                    return localData ? JSON.parse(localData) : null;
                case 'sessionStorage':
                    const sessionData = sessionStorage.getItem(key);
                    return sessionData ? JSON.parse(sessionData) : null;
                case 'indexedDB':
                    return await this.getIndexedDBItem(key);
                case 'memory':
                    return this.memoryStorage[key] || null;
                default:
                    return null;
            }
        } catch (e) {
            console.error('Error al cargar datos:', e);
            return null;
        }
    }

    async setIndexedDBItem(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['data'], 'readwrite');
            const store = transaction.objectStore('data');
            const request = store.put({ key, value });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getIndexedDBItem(key) {
        return new Promise((resolve) => {
            const transaction = this.db.transaction(['data'], 'readonly');
            const store = transaction.objectStore('data');
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : null);
            };
            request.onerror = () => {
                console.error('Error al leer de IndexedDB:', request.error);
                resolve(null);
            };
        });
    }

    async clear() {
        try {
            switch (this.storageType) {
                case 'localStorage':
                    localStorage.clear();
                    break;
                case 'sessionStorage':
                    sessionStorage.clear();
                    break;
                case 'indexedDB':
                    await this.clearIndexedDB();
                    break;
                case 'memory':
                    this.memoryStorage = {};
                    break;
            }
            console.log(`🗑️ Datos limpiados de ${this.storageType}`);
        } catch (e) {
            console.error('Error al limpiar datos:', e);
        }
    }

    async clearIndexedDB() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['data'], 'readwrite');
            const store = transaction.objectStore('data');
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    getStorageInfo() {
        return {
            type: this.storageType,
            available: this.storageType !== 'none',
            localStorage: this.testLocalStorage(),
            sessionStorage: this.testSessionStorage(),
            indexedDB: !!window.indexedDB
        };
    }
}

// Instancia global
const robustStorage = new RobustStorage();

// Funciones de exportación compatibles con el código existente
export async function cargarMaterialesRobustos(estado) {
    try {
        const materiales = await robustStorage.getItem('almacenMateriales');
        if (materiales && typeof materiales === 'object') {
            estado.almacenMateriales = materiales;
            console.log('Materiales cargados exitosamente:', Object.keys(materiales).length, 'materiales');
            estado.cambiosPendientes = false;
        } else {
            console.log('No se encontraron materiales guardados');
        }
    } catch (e) {
        console.error('Error al cargar materiales:', e);
    }
}

export async function guardarMaterialesRobustos(estado) {
    try {
        await robustStorage.setItem('almacenMateriales', estado.almacenMateriales);
        estado.cambiosPendientes = false;
    } catch (e) {
        console.error('Error al guardar materiales:', e);
        throw e;
    }
}

export async function cargarImagenesRobustas(estado) {
    try {
        const imagenes = await robustStorage.getItem('imagenesGaleria');
        if (Array.isArray(imagenes)) {
            estado.imagenesGaleria = imagenes;
            console.log('Imágenes cargadas exitosamente:', imagenes.length, 'imágenes');
        } else {
            estado.imagenesGaleria = [];
        }
    } catch (e) {
        console.error('Error al cargar imágenes:', e);
        estado.imagenesGaleria = [];
    }
}

export async function guardarImagenesRobustas(estado) {
    try {
        await robustStorage.setItem('imagenesGaleria', estado.imagenesGaleria);
    } catch (e) {
        console.error('Error al guardar imágenes:', e);
    }
}

export async function cargarEquiposRobustos() {
    try {
        const equipos = await robustStorage.getItem('equiposSimulados');
        return Array.isArray(equipos) ? equipos : [];
    } catch (e) {
        console.error('Error al cargar equipos:', e);
        return [];
    }
}

export async function guardarEquiposRobustos(equipos) {
    try {
        await robustStorage.setItem('equiposSimulados', equipos);
    } catch (e) {
        console.error('Error al guardar equipos:', e);
    }
}

export function getStorageInfo() {
    return robustStorage.getStorageInfo();
}

export async function clearAllData() {
    await robustStorage.clear();
} 