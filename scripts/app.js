// scripts/app.js
// ============= INICIO DE app.js =============
import * as datos from './datos.js';
import * as ui from './ui.js';
import configurarEventListeners from './eventos.js';
import {
    construirMapaMaterialAEquipo,
    inicializarAlmacenamientoMateriales,
    cargarMaterialesDesdeLocalStorage,
    guardarMaterialesEnLocalStorage
} from './materiales.js';
import * as galeria from './galeria.js';
import * as conversiones from './conversiones.js';
import { simularUso } from './simulacion.js';
import * as modales from './modales.js';
import { crearBaseSelector, actualizarEstadoBase } from './baselogic.js';

const estadoApp = {
    equipoActual: 'Espada',
    claseActual: 'Normal',
    nivelActual: '1',
    colorActual: 'blanco',
    colorPorMaterialSeleccionado: {},
    almacenMateriales: {},
    cambiosPendientes: false,
    colorNoSeleccionado: '#808080',
    imagenesGaleria: [],
    indiceCarruselActual: 0,
    colorBaseSeleccionado: null,
    mapaColores: datos.mapaColores,
    materialesData: datos.datosMateriales,
    intervaloAutoguardado: null
};

// Exponer globalmente para que backup.js pueda acceder
window.estadoApp = estadoApp;

// Sistema de almacenamiento robusto
function guardarDatosCompletos() {
    try {
        const datosCompletos = {
            materiales: estadoApp.almacenMateriales,
            galeria: estadoApp.imagenesGaleria,
            simulaciones: window.equiposSimulados || [],
            configuracion: {
                equipoActual: estadoApp.equipoActual,
                claseActual: estadoApp.claseActual,
                nivelActual: estadoApp.nivelActual,
                colorActual: estadoApp.colorActual
            },
            timestamp: new Date().toISOString()
        };

        const datosJSON = JSON.stringify(datosCompletos);
        
        // Guardar en localStorage
        localStorage.setItem('artManagerData', datosJSON);
        
        // Backup en sessionStorage
        sessionStorage.setItem('artManagerData', datosJSON);
        
        console.log('💾 Datos guardados automáticamente:', {
            materiales: Object.keys(estadoApp.almacenMateriales).length,
            galeria: estadoApp.imagenesGaleria.length,
            simulaciones: (window.equiposSimulados || []).length
        });
        
        estadoApp.cambiosPendientes = false;
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

function cargarDatosCompletos() {
    try {
        // Intentar cargar desde localStorage primero
        let datosGuardados = localStorage.getItem('artManagerData');
        
        // Si no hay datos en localStorage, intentar sessionStorage
        if (!datosGuardados) {
            datosGuardados = sessionStorage.getItem('artManagerData');
        }
        
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            
            // Restaurar materiales
            if (datos.materiales && typeof datos.materiales === 'object') {
                estadoApp.almacenMateriales = datos.materiales;
            }
            
            // Restaurar galería
            if (datos.galeria && Array.isArray(datos.galeria)) {
                estadoApp.imagenesGaleria = datos.galeria;
            }
            
            // Restaurar simulaciones
            if (datos.simulaciones && Array.isArray(datos.simulaciones)) {
                if (window.equiposSimulados) {
                    window.equiposSimulados.length = 0;
                    window.equiposSimulados.push(...datos.simulaciones);
                }
            }
            
            // Restaurar configuración
            if (datos.configuracion) {
                estadoApp.equipoActual = datos.configuracion.equipoActual || 'Espada';
                estadoApp.claseActual = datos.configuracion.claseActual || 'Normal';
                estadoApp.nivelActual = datos.configuracion.nivelActual || '1';
                estadoApp.colorActual = datos.configuracion.colorActual || 'blanco';
            }
            
            console.log('📥 Datos cargados exitosamente:', {
                materiales: Object.keys(estadoApp.almacenMateriales).length,
                galeria: estadoApp.imagenesGaleria.length,
                simulaciones: (window.equiposSimulados || []).length,
                timestamp: datos.timestamp
            });
            
            return true;
        }
        
        console.log('No se encontraron datos guardados, usando valores por defecto');
        return false;
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return false;
    }
}

function configurarAutoguardado() {
    // Guardar automáticamente cada 30 segundos si hay cambios
    estadoApp.intervaloAutoguardado = setInterval(() => {
        if (estadoApp.cambiosPendientes) {
            guardarDatosCompletos();
        }
    }, 30000);
    
    // Guardar antes de cerrar la página
    window.addEventListener('beforeunload', () => {
        guardarDatosCompletos();
    });
}

function limpiarDatosCompletos() {
    try {
        // Limpiar localStorage y sessionStorage
        localStorage.removeItem('artManagerData');
        sessionStorage.removeItem('artManagerData');
        
        // Limpiar datos en memoria
        estadoApp.almacenMateriales = {};
        estadoApp.imagenesGaleria = [];
        estadoApp.cambiosPendientes = false;
        
        // Limpiar simulaciones
        if (window.equiposSimulados) {
            window.equiposSimulados.length = 0;
        }
        
        // Reinicializar estructuras
        inicializarAlmacenamientoMateriales(estadoApp);
        
        console.log('🗑️ Todos los datos han sido limpiados');
        return true;
    } catch (error) {
        console.error('Error al limpiar datos:', error);
        return false;
    }
}

function iniciarApp() {
    try {
        // Asignar datos importantes al estado
        estadoApp.materialesData = datos.datosMateriales;
        estadoApp.mapaColores = datos.mapaColores;

        // Construir estructuras de datos necesarias
        construirMapaMaterialAEquipo(estadoApp);
        inicializarAlmacenamientoMateriales(estadoApp);

        // CARGAR DATOS GUARDADOS
        const datosCargados = cargarDatosCompletos();
        
        // Configurar todos los event listeners
        configurarEventListeners(estadoApp);

        // Inicializar la interfaz de usuario
        ui.actualizarUI(estadoApp);

        // Asignar la función de simulación al estado
        estadoApp.simularUso = simularUso;
        
        // Configurar autoguardado
        configurarAutoguardado();
        
        // Exponer funciones de guardado globalmente
        window.guardarDatosCompletos = guardarDatosCompletos;
        window.cargarDatosCompletos = cargarDatosCompletos;
        window.limpiarDatosCompletos = limpiarDatosCompletos;
        
        if (datosCargados) {
            console.log('✅ Aplicación iniciada con datos restaurados');
        } else {
            console.log('✅ Aplicación iniciada con valores por defecto');
        }
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        modales.mostrarMensaje('Error Crítico', 
            'No se pudo iniciar la aplicación. Por favor, recarga la página.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp);

// Manejo de errores global no controlados
window.addEventListener('error', (event) => {
    console.error('Error no controlado:', event.error);
    modales.mostrarMensaje('Error Inesperado', 
        'Se produjo un error inesperado. Por favor, recarga la aplicación.', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no controlada:', event.reason);
    modales.mostrarMensaje('Error en Promesa', 
        'Se produjo un error al procesar una operación. Por favor, inténtalo de nuevo.', 'error');
});
// ============= FIN DE app.js =============