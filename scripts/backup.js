// scripts/backup.js

// Utilidad para obtener el estado global de la app
function getEstadoApp() {
    // Intentar obtener la referencia global
    let estado = window.estadoApp;
    if (!estado) {
        console.warn('No se pudo encontrar estadoApp global');
        return {};
    }
    console.log('EstadoApp encontrado:', estado);
    console.log('Materiales en estadoApp:', Object.keys(estado.almacenMateriales || {}).length);
    console.log('Galería en estadoApp:', (estado.imagenesGaleria || []).length);
    return estado;
}

// Utilidad para obtener simulaciones
function getSimulaciones() {
    let simulaciones = window.equiposSimulados;
    if (!simulaciones) {
        console.warn('No se encontraron simulaciones');
        return [];
    }
    console.log('Simulaciones encontradas:', simulaciones.length);
    return simulaciones;
}

// Utilidad para refrescar la UI
function refrescarUI() {
    if (window.ui && window.ui.actualizarUI && window.estadoApp) {
        window.ui.actualizarUI(window.estadoApp);
    } else {
        location.reload();
    }
}

// Exponer funciones globalmente para reconstrucción
window.construirMapaMaterialAEquipo = window.construirMapaMaterialAEquipo || function() {};
window.inicializarAlmacenamientoMateriales = window.inicializarAlmacenamientoMateriales || function() {};

// Crear el FAB y el menú flotante
function crearFABBackup() {
    const container = document.getElementById('fab-save-menu-container');
    if (!container) return;
    container.innerHTML = `
        <button id="fab-save" title="Opciones de datos" style="position: absolute; top: 60px; right: 0; z-index: 100; width: 48px; height: 48px; border-radius: 50%; background: #2196F3; box-shadow: 0 4px 12px rgba(0,0,0,0.18); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
        </button>
        
        <div id="fab-menu" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; background: white; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); padding: 20px; display: none; min-width: 300px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #333;">Gestión de Datos</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="fab-download" style="padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    💾 Guardar Datos
                </button>
                <button id="fab-upload" style="padding: 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    📂 Abrir Datos
                </button>
                <button id="fab-clear" style="padding: 12px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    🗑️ Limpiar Datos
                </button>
                <button id="fab-close" style="padding: 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    ❌ Cerrar
                </button>
            </div>
        </div>
    `;

    const fabButton = document.getElementById('fab-save');
    const fabMenu = document.getElementById('fab-menu');
    const fabDownload = document.getElementById('fab-download');
    const fabUpload = document.getElementById('fab-upload');
    const fabClear = document.getElementById('fab-clear');
    const fabClose = document.getElementById('fab-close');

    // Abrir/cerrar menú
    fabButton.addEventListener('click', function() {
        fabMenu.style.display = fabMenu.style.display === 'none' ? 'block' : 'none';
    });

    fabClose.addEventListener('click', function() {
        fabMenu.style.display = 'none';
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', function(e) {
        if (!fabButton.contains(e.target) && !fabMenu.contains(e.target)) {
            fabMenu.style.display = 'none';
        }
    });

    // Guardar datos (descargar JSON)
    fabDownload.addEventListener('click', function() {
        try {
            console.log('=== INICIANDO BACKUP ===');
            
            // Usar el sistema robusto de guardado
            if (window.guardarDatosCompletos) {
                window.guardarDatosCompletos();
            }
            
            // Obtener datos del localStorage (que ya fueron guardados)
            const datosGuardados = localStorage.getItem('artManagerData');
            if (!datosGuardados) {
                alert('No hay datos para guardar. Primero agrega algunos materiales o simulaciones.');
                return;
            }
            
            const datos = JSON.parse(datosGuardados);
            
            console.log('Datos a guardar:');
            console.log('- Materiales:', Object.keys(datos.materiales || {}).length);
            console.log('- Galería:', (datos.galeria || []).length);
            console.log('- Simulaciones:', (datos.simulaciones || []).length);

            // Verificar que hay datos para guardar
            if (Object.keys(datos.materiales || {}).length === 0 && 
                (datos.galeria || []).length === 0 && 
                (datos.simulaciones || []).length === 0) {
                alert('No hay datos para guardar. Primero agrega algunos materiales o simulaciones.');
                return;
            }

            // Pedir nombre del archivo
            const nombreArchivo = prompt('Nombre del archivo de backup:', 
                `backup-art-manager-${new Date().toISOString().split('T')[0]}`);
            
            if (!nombreArchivo) {
                console.log('Backup cancelado por el usuario');
                return;
            }

            // Crear y descargar el archivo
            const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = nombreArchivo.endsWith('.json') ? nombreArchivo : nombreArchivo + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('Backup creado exitosamente:', a.download);
            alert(`✅ Backup guardado como: ${a.download}\n\nContenido:\n- ${Object.keys(datos.materiales || {}).length} materiales\n- ${(datos.galeria || []).length} imágenes en galería\n- ${(datos.simulaciones || []).length} simulaciones`);
            
            fabMenu.style.display = 'none';
        } catch (error) {
            console.error('Error al crear backup:', error);
            alert('❌ Error al crear el backup: ' + error.message);
        }
    });

    // Abrir datos (importar JSON)
    fabUpload.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // Restaurar datos usando el sistema robusto
                        const estado = getEstadoApp();
                        if (estado) {
                            // Restaurar materiales
                            if (data.materiales && typeof data.materiales === 'object') {
                                estado.almacenMateriales = data.materiales;
                            }
                            
                            // Restaurar galería
                            if (data.galeria && Array.isArray(data.galeria)) {
                                estado.imagenesGaleria = data.galeria;
                            }
                            
                            // Restaurar configuración
                            if (data.configuracion) {
                                estado.equipoActual = data.configuracion.equipoActual || 'Espada';
                                estado.claseActual = data.configuracion.claseActual || 'Normal';
                                estado.nivelActual = data.configuracion.nivelActual || '1';
                                estado.colorActual = data.configuracion.colorActual || 'blanco';
                            }
                            
                            // Marcar cambios como pendientes
                            estado.cambiosPendientes = true;
                        }
                        
                        // Restaurar simulaciones
                        if (data.simulaciones && Array.isArray(data.simulaciones)) {
                            if (window.equiposSimulados) {
                                window.equiposSimulados.length = 0;
                                window.equiposSimulados.push(...data.simulaciones);
                            }
                        }
                        
                        // Guardar en localStorage usando el sistema robusto
                        if (window.guardarDatosCompletos) {
                            window.guardarDatosCompletos();
                        }
                        
                        // Reconstruir estructuras internas
                        if (window.construirMapaMaterialAEquipo) {
                            window.construirMapaMaterialAEquipo(estado);
                        }
                        if (window.inicializarAlmacenamientoMateriales) {
                            window.inicializarAlmacenamientoMateriales(estado);
                        }
                        
                        // Actualizar UI
                        if (window.actualizarUI) {
                            window.actualizarUI(estado);
                        }
                        
                        console.log('✅ Datos importados exitosamente:', {
                            materiales: Object.keys(data.materiales || {}).length,
                            galeria: (data.galeria || []).length,
                            simulaciones: (data.simulaciones || []).length
                        });
                        
                        alert(`✅ Datos importados exitosamente!\n\nContenido restaurado:\n- ${Object.keys(data.materiales || {}).length} materiales\n- ${(data.galeria || []).length} imágenes en galería\n- ${(data.simulaciones || []).length} simulaciones\n\nLos datos se han guardado automáticamente y persistirán entre sesiones.`);
                        
                        fabMenu.style.display = 'none';
                    } catch (error) {
                        console.error('Error al importar datos:', error);
                        alert('❌ Error al importar datos: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    });

    // Limpiar datos
    fabClear.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres limpiar todos los datos? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('artManagerData');
            if (window.equiposSimulados) {
                window.equiposSimulados.length = 0;
            }
            if (window.estadoApp) {
                window.estadoApp.almacenMateriales = {};
                window.estadoApp.imagenesGaleria = [];
                window.estadoApp.cambiosPendientes = true;
            }
            if (window.guardarDatosCompletos) {
                window.guardarDatosCompletos();
            }
            if (window.actualizarUI) {
                window.actualizarUI(window.estadoApp);
            }
            alert('✅ Datos limpios exitosamente.');
            fabMenu.style.display = 'none';
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', crearFABBackup); 