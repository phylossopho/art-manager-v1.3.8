// scripts/app.js
// ============= INICIO DE app.js =============
import * as datos from './datos.js';
import * as ui from './ui.js';
import configurarEventListeners from './eventos.js';
import {
    construirMapaMaterialAEquipo,
    inicializarAlmacenamientoMateriales
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

function iniciarApp() {
    try {
        // Asignar datos importantes al estado
        estadoApp.materialesData = datos.datosMateriales;
        estadoApp.mapaColores = datos.mapaColores;

        // Construir estructuras de datos necesarias
        construirMapaMaterialAEquipo(estadoApp);
        inicializarAlmacenamientoMateriales(estadoApp);

        // Configurar todos los event listeners
        configurarEventListeners(estadoApp);

        // Inicializar la interfaz de usuario
        ui.actualizarUI(estadoApp);

        // Asignar la función de simulación al estado
        estadoApp.simularUso = simularUso;
        
        console.log('✅ Aplicación iniciada (sin almacenamiento persistente)');
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