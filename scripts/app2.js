// scripts/app2.js
// ============= INICIO DE app2.js =============

console.log('🔧 Iniciando app2.js...');

// Importaciones con manejo de errores
let datos, ui, configurarEventListeners, materiales, galeria, conversiones, simulacion, modales, baselogic, translations;

async function cargarModulos() {
    try {
        console.log('📦 Cargando módulos...');
        
        datos = await import('./datos.js');
        console.log('✅ datos.js cargado');
        
        ui = await import('./ui.js');
        console.log('✅ ui.js cargado');
        
        const eventosModule = await import('./eventos2.js');
        configurarEventListeners = eventosModule.default;
        console.log('✅ eventos.js cargado');
        
        materiales = await import('./materiales.js');
        console.log('✅ materiales.js cargado');
        
        galeria = await import('./galeria.js');
        console.log('✅ galeria.js cargado');
        
        conversiones = await import('./conversiones.js');
        console.log('✅ conversiones.js cargado');
        
        simulacion = await import('./simulacion.js');
        console.log('✅ simulacion.js cargado');
        
        modales = await import('./modales.js');
        console.log('✅ modales.js cargado');
        
        baselogic = await import('./baselogic.js');
        console.log('✅ baselogic.js cargado');
        
        translations = await import('./translations.js');
        console.log('✅ translations.js cargado');
        
        console.log('✅ Todos los módulos cargados correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error cargando módulos:', error);
        return false;
    }
}

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
    mapaColores: {},
    materialesData: {}
};

// Exponer globalmente para que backup.js pueda acceder
window.estadoApp = estadoApp;

// Sistema de almacenamiento manual (sin localStorage automático)
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

        console.log('💾 Datos preparados para guardado manual:', {
            materiales: Object.keys(estadoApp.almacenMateriales).length,
            galeria: estadoApp.imagenesGaleria.length,
            simulaciones: (window.equiposSimulados || []).length
        });
        
        return datosCompletos;
    } catch (error) {
        console.error('Error al preparar datos:', error);
        return null;
    }
}

function cargarDatosCompletos(datosJSON) {
    try {
        if (!datosJSON) {
            console.log('No se proporcionaron datos para cargar');
            return false;
        }

        const datos = typeof datosJSON === 'string' ? JSON.parse(datosJSON) : datosJSON;
        
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
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return false;
    }
}

function limpiarDatosCompletos() {
    try {
        // Limpiar datos en memoria
        estadoApp.almacenMateriales = {};
        estadoApp.imagenesGaleria = [];
        estadoApp.cambiosPendientes = false;
        
        // Limpiar simulaciones
        if (window.equiposSimulados) {
            window.equiposSimulados.length = 0;
        }
        
        // Reinicializar estructuras
        if (materiales && materiales.inicializarAlmacenamientoMateriales) {
            materiales.inicializarAlmacenamientoMateriales(estadoApp);
        }
        
        console.log('🗑️ Todos los datos han sido limpiados');
        return true;
    } catch (error) {
        console.error('Error al limpiar datos:', error);
        return false;
    }
}

async function iniciarApp() {
    try {
        console.log('🚀 Iniciando aplicación...');
        
        // Cargar módulos primero
        const modulosCargados = await cargarModulos();
        if (!modulosCargados) {
            throw new Error('No se pudieron cargar los módulos');
        }
        
        // Asignar datos importantes al estado
        estadoApp.materialesData = datos.datosMateriales;
        estadoApp.mapaColores = datos.mapaColores;
        window.mapaColores = datos.mapaColores;

        console.log('📊 Datos asignados al estado');

        // Construir estructuras de datos necesarias
        if (materiales.construirMapaMaterialAEquipo) {
            materiales.construirMapaMaterialAEquipo(estadoApp);
        }
        if (materiales.inicializarAlmacenamientoMateriales) {
            materiales.inicializarAlmacenamientoMateriales(estadoApp);
        }
        
        console.log('🏗️ Estructuras de datos construidas');
        
        // Configurar todos los event listeners
        if (configurarEventListeners) {
            configurarEventListeners(estadoApp);
        }

        console.log('🎧 Event listeners configurados');

        // Inicializar la interfaz de usuario
        if (ui.actualizarUI) {
            ui.actualizarUI(estadoApp);
        }
        if (ui.actualizarColorFondoApp) {
            ui.actualizarColorFondoApp(estadoApp);
        }

        console.log('🎨 UI actualizada');

        // Asignar la función de simulación al estado
        if (simulacion.simularUso) {
            estadoApp.simularUso = simulacion.simularUso;
        }
        
        // Exponer funciones de guardado globalmente
        window.guardarDatosCompletos = guardarDatosCompletos;
        window.cargarDatosCompletos = cargarDatosCompletos;
        window.limpiarDatosCompletos = limpiarDatosCompletos;
        
        // Exponer funciones de UI globalmente
        if (ui) {
            window.actualizarUI = ui.actualizarUI;
            window.actualizarImagenEquipo = ui.actualizarImagenEquipo;
            window.actualizarTablaMateriales = ui.actualizarTablaMateriales;
            window.actualizarSelectoresMaterialesInferiores = ui.actualizarSelectoresMaterialesInferiores;
            window.cambiarPestana = ui.cambiarPestana;
        }
        if (materiales) {
            window.construirMapaMaterialAEquipo = materiales.construirMapaMaterialAEquipo;
            window.inicializarAlmacenamientoMateriales = materiales.inicializarAlmacenamientoMateriales;
            window.abrirListaMateriales = materiales.abrirListaMateriales;
        }

        // === ACTUALIZAR AYUDA DINÁMICAMENTE AL INICIAR ===
        if (translations && translations.changeLanguage) {
            translations.changeLanguage('es');
        }

        console.log('✅ Aplicación iniciada correctamente');
        console.log('💡 Usa el botón flotante para guardar/cargar tus datos');
    } catch (error) {
        console.error('❌ Error al iniciar la aplicación:', error);
        if (modales && modales.mostrarMensaje) {
            modales.mostrarMensaje('Error Crítico', 
                'No se pudo iniciar la aplicación. Por favor, recarga la página.', 'error');
        } else {
            alert('Error al iniciar la aplicación: ' + error.message);
        }
    }
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarApp);
} else {
    // DOM ya está listo
    iniciarApp();
}

// Manejo de errores global no controlados
window.addEventListener('error', (event) => {
    console.error('Error no controlado:', event.error);
    if (modales && modales.mostrarMensaje) {
        modales.mostrarMensaje('Error Inesperado', 
            'Se produjo un error inesperado. Por favor, recarga la aplicación.', 'error');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no controlada:', event.reason);
    if (modales && modales.mostrarMensaje) {
        modales.mostrarMensaje('Error en Promesa', 
            'Se produjo un error al procesar una operación. Por favor, inténtalo de nuevo.', 'error');
    }
});

// ============= FIN DE app2.js =============