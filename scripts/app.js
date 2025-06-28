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
import { cargarEquiposDesdeLocalStorage } from './arte.js';
import { crearBaseSelector, actualizarEstadoBase } from './baselogic.js';
import { 
    cargarMaterialesRobustos, 
    guardarMaterialesRobustos,
    cargarImagenesRobustas,
    guardarImagenesRobustas,
    cargarEquiposRobustos,
    guardarEquiposRobustos
} from './storage-fallback.js';

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

async function iniciarApp() {
    try {
        // Asignar datos importantes al estado
        estadoApp.materialesData = datos.datosMateriales;
        estadoApp.mapaColores = datos.mapaColores;

        // Construir estructuras de datos necesarias
        construirMapaMaterialAEquipo(estadoApp);
        inicializarAlmacenamientoMateriales(estadoApp);

        // Cargar datos persistentes usando sistema robusto
        await cargarMaterialesRobustos(estadoApp);
        await cargarImagenesRobustas(estadoApp);
        const equipos = await cargarEquiposRobustos();
        if (equipos.length > 0) {
            // Actualizar el array de equipos simulados en arte.js
            const { equiposSimulados } = await import('./arte.js');
            equiposSimulados.length = 0;
            equiposSimulados.push(...equipos);
        }

        // Configurar todos los event listeners
        configurarEventListeners(estadoApp);

        // Inicializar la interfaz de usuario
        ui.actualizarUI(estadoApp);

        // Configurar el intervalo de autoguardado usando sistema robusto
        estadoApp.intervaloAutoguardado = setInterval(async () => {
            if (estadoApp.cambiosPendientes) {
                await guardarMaterialesRobustos(estadoApp);
                console.log('Autoguardado robusto realizado');
                estadoApp.cambiosPendientes = false;
            }
        }, 30000); // 30 segundos

        // Asignar la función de simulación al estado
        estadoApp.simularUso = simularUso;
        
        console.log('✅ Aplicación iniciada con sistema de almacenamiento robusto');
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        modales.mostrarMensaje('Error Crítico', 
            'No se pudo iniciar la aplicación. Por favor, recarga la página.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp);

window.addEventListener('beforeunload', (e) => {
    if (estadoApp.cambiosPendientes) {
        const message = 'Hay cambios sin guardar. ¿Seguro que deseas salir?';
        e.returnValue = message;
        return message;
    }
});

window.addEventListener('unload', async () => {
    try {
        if (estadoApp.cambiosPendientes) {
            await guardarMaterialesRobustos(estadoApp);
        }
        
        // Limpiar el intervalo de autoguardado
        if (estadoApp.intervaloAutoguardado) {
            clearInterval(estadoApp.intervaloAutoguardado);
        }
    } catch (error) {
        console.error('Error al cerrar la aplicación:', error);
    }
});

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