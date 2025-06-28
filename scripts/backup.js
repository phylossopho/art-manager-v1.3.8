// scripts/backup.js

// Utilidad para obtener el estado global de la app
function getEstadoApp() {
    // Intentar obtener la referencia global
    let estado = window.estadoApp;
    if (!estado) {
        // Buscar en módulos conocidos
        if (window.app && window.app.estadoApp) return window.app.estadoApp;
        // Fallback: crear objeto vacío
        return {};
    }
    return estado;
}

// Utilidad para obtener simulaciones (equiposSimulados)
function getSimulaciones() {
    if (window.equiposSimulados && Array.isArray(window.equiposSimulados)) {
        return window.equiposSimulados;
    }
    // Buscar en arte.js si está como export
    if (window.arte && Array.isArray(window.arte.equiposSimulados)) {
        return window.arte.equiposSimulados;
    }
    return [];
}

// Utilidad para refrescar la UI
function refrescarUI() {
    if (window.ui && window.ui.actualizarUI && window.estadoApp) {
        window.ui.actualizarUI(window.estadoApp);
    } else {
        location.reload();
    }
}

// Crear el FAB y el menú flotante
function crearFABBackup() {
    const container = document.getElementById('fab-save-menu-container');
    if (!container) return;
    container.innerHTML = `
        <button id="fab-save" title="Opciones de datos" style="position: absolute; top: 60px; right: 0; z-index: 100; width: 48px; height: 48px; border-radius: 50%; background: #2196F3; box-shadow: 0 4px 12px rgba(0,0,0,0.18); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="#fff" stroke="#1976d2" stroke-width="2"/>
                <path d="M7 3V7H17V3" stroke="#1976d2" stroke-width="2"/>
                <rect x="7" y="13" width="10" height="5" rx="1" fill="#1976d2"/>
                <rect x="9" y="15" width="6" height="1.5" rx="0.75" fill="#fff"/>
            </svg>
        </button>
        <div id="fab-save-menu" style="display: none; position: absolute; top: 115%; right: 0; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.18); min-width: 140px; overflow: hidden; border: 1px solid #e0e0e0;">
            <button id="fab-save-download" style="width: 100%; padding: 10px 16px; background: none; border: none; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="18" width="16" height="2" rx="1" fill="#1976d2"/></svg> Guardar</button>
            <button id="fab-save-upload" style="width: 100%; padding: 10px 16px; background: none; border: none; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 20V8m0 0l-4 4m4-4l4 4" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="4" width="16" height="2" rx="1" fill="#1976d2"/></svg> Abrir</button>
        </div>
    `;

    // Referencias
    const fabSave = container.querySelector('#fab-save');
    const fabMenu = container.querySelector('#fab-save-menu');
    const fabDownload = container.querySelector('#fab-save-download');
    const fabUpload = container.querySelector('#fab-save-upload');

    // Mostrar/ocultar menú
    fabSave.addEventListener('click', (e) => {
        e.stopPropagation();
        fabMenu.style.display = fabMenu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
        if (fabMenu.style.display === 'block') {
            fabMenu.style.display = 'none';
        }
    });
    fabMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Guardar datos (descargar JSON)
    fabDownload.addEventListener('click', function() {
        try {
            const estado = getEstadoApp();
            const equiposSimulados = getSimulaciones();
            const data = {
                materiales: estado.almacenMateriales || {},
                galeria: estado.imagenesGaleria || [],
                simulaciones: equiposSimulados || []
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup-art-manager-' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            URL.revokeObjectURL(url);
            alert('¡Datos guardados exitosamente!');
        } catch (e) {
            alert('Error al guardar los datos: ' + e.message);
        }
        fabMenu.style.display = 'none';
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
                        // Restaurar cantidades de materiales
                        const estado = getEstadoApp();
                        if (estado) {
                            estado.almacenMateriales = data.materiales || {};
                            estado.imagenesGaleria = data.galeria || [];
                        }
                        // Restaurar simulaciones
                        if (window.equiposSimulados && Array.isArray(data.simulaciones)) {
                            window.equiposSimulados.length = 0;
                            window.equiposSimulados.push(...data.simulaciones);
                        }
                        refrescarUI();
                        alert('¡Datos cargados exitosamente!');
                    } catch (error) {
                        alert('Error al cargar los datos: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
        fabMenu.style.display = 'none';
    });
}

// Ejecutar al cargar el módulo
crearFABBackup(); 