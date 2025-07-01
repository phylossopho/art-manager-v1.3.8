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
    // Crear el FAB directamente en el body para que esté fijo
    const fabHTML = `
        <div id="floating-icons-container" style="position: fixed; top: 8vh; right: 2rem; z-index: 1001; display: flex; flex-direction: column; gap: 1rem;">
            <button id="fab-save" class="floating-icon" title="Opciones de datos">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
            </button>
            <div id="show-materials" class="floating-icon" title="Mostrar materiales">
                <span style="font-size: 22px;">📋</span>
            </div>
            <button id="fab-recetas" class="floating-icon" title="Gestor de Recetas" style="background: linear-gradient(135deg, #ffb347 0%, #ffcc33 100%) !important; color: #fff; font-size: 1.3rem; display: flex; align-items: center; justify-content: center; padding: 0;">
                <span style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 1.4rem;">📖</span>
            </button>
        </div>
        
        <div id="fab-menu" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1001; background: rgba(255, 255, 255, 0.95); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); padding: 30px; display: none; min-width: 350px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);">
            <div style="text-align: center; margin-bottom: 25px;">
                <h3 style="margin: 0; color: #333; font-size: 1.5rem; font-weight: 600;">Gestión de Datos</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button id="fab-download" style="padding: 15px 20px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">
                    💾 Guardar Datos
                </button>
                <button id="fab-upload" style="padding: 15px 20px; background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);">
                    📂 Abrir Datos
                </button>
                <button id="fab-clear" style="padding: 15px 20px; background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);">
                    🗑️ Limpiar Datos
                </button>
                <button id="fab-close" style="padding: 15px 20px; background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);">
                    ❌ Cerrar
                </button>
            </div>
        </div>
    `;
    
    // Insertar el FAB directamente en el body
    document.body.insertAdjacentHTML('beforeend', fabHTML);

    const fabButton = document.getElementById('fab-save');
    const fabMenu = document.getElementById('fab-menu');
    const fabDownload = document.getElementById('fab-download');
    const fabUpload = document.getElementById('fab-upload');
    const fabClear = document.getElementById('fab-clear');
    const fabClose = document.getElementById('fab-close');
    const showMaterialsButton = document.getElementById('show-materials');
    const fabRecetas = document.getElementById('fab-recetas');

    // Efectos hover para el FAB
    fabButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
    });

    fabButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
    });

    // Efectos hover para los botones del menú
    [fabDownload, fabUpload, fabClear, fabClose].forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
    });

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
    fabDownload.addEventListener('click', async function() {
        try {
            console.log('=== INICIANDO BACKUP ===');
            // Obtener datos directamente de la memoria
            const datosCompletos = window.guardarDatosCompletos();
            if (!datosCompletos) {
                alert('Error al preparar los datos para guardar.');
                return;
            }
            console.log('Datos a guardar:');
            console.log('- Materiales:', Object.keys(datosCompletos.materiales || {}).length);
            console.log('- Galería:', (datosCompletos.galeria || []).length);
            console.log('- Simulaciones:', (datosCompletos.simulaciones || []).length);
            if (Object.keys(datosCompletos.materiales || {}).length === 0 && 
                (datosCompletos.galeria || []).length === 0 && 
                (datosCompletos.simulaciones || []).length === 0) {
                alert('No hay datos para guardar. Primero agrega algunos materiales o simulaciones.');
                return;
            }
            const nombreSugerido = `backup-art-manager-${new Date().toISOString().split('T')[0]}.json`;
            let guardadoExitoso = false;
            // Intentar usar el selector moderno si está disponible
            if (window.showSaveFilePicker) {
                try {
                    alert(`Elige dónde quieres guardar tu archivo de datos.\n\nEl nombre sugerido es: ${nombreSugerido}\n(Puedes cambiarlo si lo deseas)`);
                    const options = {
                        suggestedName: nombreSugerido,
                        types: [
                            {
                                description: 'Archivo JSON',
                                accept: { 'application/json': ['.json'] }
                            }
                        ]
                    };
                    const handle = await window.showSaveFilePicker(options);
                    const writable = await handle.createWritable();
                    await writable.write(JSON.stringify(datosCompletos, null, 2));
                    await writable.close();
                    guardadoExitoso = true;
                    alert(`✅ Backup guardado correctamente.\n\nRecuerda dónde lo guardaste.\n\nContenido:\n- ${Object.keys(datosCompletos.materiales || {}).length} materiales\n- ${(datosCompletos.galeria || []).length} imágenes en galería (base64)\n- ${(datosCompletos.simulaciones || []).length} simulaciones`);
                } catch (e) {
                    if (e.name !== 'AbortError') {
                        alert('❌ Error al guardar el archivo: ' + (e.message || e));
                    } else {
                        alert('Guardado cancelado.');
                    }
                }
            }
            if (!guardadoExitoso) {
                // Fallback tradicional
                alert(`Elige dónde quieres guardar tu archivo de datos.\n\nEl nombre sugerido es: ${nombreSugerido}\n(Puedes cambiarlo si lo deseas en el diálogo de descarga)`);
                const blob = new Blob([JSON.stringify(datosCompletos, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = nombreSugerido;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                alert(`✅ Backup guardado como: ${nombreSugerido}\n\nContenido:\n- ${Object.keys(datosCompletos.materiales || {}).length} materiales\n- ${(datosCompletos.galeria || []).length} imágenes en galería (base64)\n- ${(datosCompletos.simulaciones || []).length} simulaciones`);
            }
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
                        
                        // Cargar datos usando el sistema manual
                        const exito = window.cargarDatosCompletos(data);
                        
                        if (exito) {
                            // Obtener el estado actual
                            const estado = getEstadoApp();
                            
                            // Reconstruir estructuras internas
                            if (window.construirMapaMaterialAEquipo) {
                                window.construirMapaMaterialAEquipo(estado);
                            }
                            if (window.inicializarAlmacenamientoMateriales) {
                                window.inicializarAlmacenamientoMateriales(estado);
                            }
                            
                            // Actualizar selectores principales
                            const equipmentSelect = document.getElementById('equipment-select');
                            const classSelect = document.getElementById('class-select');
                            const levelSelect = document.getElementById('level-select');
                            const colorSelect = document.getElementById('color-select');
                            
                            if (equipmentSelect) equipmentSelect.value = estado.equipoActual || 'Botas';
                            if (classSelect) classSelect.value = estado.claseActual || 'Normal';
                            if (levelSelect) levelSelect.value = estado.nivelActual || '1';
                            if (colorSelect) colorSelect.value = estado.colorActual || 'blanco';
                            
                            // Forzar actualización completa de la UI
                            if (window.actualizarUI) {
                                window.actualizarUI(estado);
                            }
                            
                            console.log('✅ Datos importados exitosamente:', {
                                materiales: Object.keys(data.materiales || {}).length,
                                galeria: (data.galeria || []).length,
                                simulaciones: (data.simulaciones || []).length
                            });
                            
                            alert(`✅ Datos importados exitosamente!\n\nContenido restaurado:\n- ${Object.keys(data.materiales || {}).length} materiales\n- ${(data.galeria || []).length} imágenes en galería\n- ${(data.simulaciones || []).length} simulaciones\n\nRecuerda guardar manualmente cuando hagas cambios.`);
                            
                            fabMenu.style.display = 'none';
                        } else {
                            alert('❌ Error al cargar los datos. Verifica que el archivo sea válido.');
                        }
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
            if (window.limpiarDatosCompletos) {
                window.limpiarDatosCompletos();
            }
            if (window.actualizarUI) {
                window.actualizarUI(window.estadoApp);
            }
            alert('✅ Datos limpios exitosamente.');
            fabMenu.style.display = 'none';
        }
    });

    // Event listener para el botón "Mostrar materiales"
    if (showMaterialsButton) {
        showMaterialsButton.addEventListener('click', function() {
            // Importar la función desde materiales.js
            if (window.abrirListaMateriales) {
                window.abrirListaMateriales(window.estadoApp);
            } else {
                console.error('Función abrirListaMateriales no encontrada');
                alert('Error: Función de mostrar materiales no disponible');
            }
        });

        // Efectos hover para el botón de mostrar materiales
        showMaterialsButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
        });

        showMaterialsButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
        });
    }

    // Asignar evento al FAB de recetas
    if (fabRecetas) {
        fabRecetas.addEventListener('click', function() {
            import('./recetas2.js').then(m => m.mostrarGestorRecetas());
        });
        fabRecetas.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 12px 32px rgba(255, 204, 51, 0.5)';
        });
        fabRecetas.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 24px rgba(255, 204, 51, 0.4)';
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', crearFABBackup); 