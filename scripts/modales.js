// scripts/modales.js
export function mostrarMensaje(titulo, mensaje, tipo = "info", codigo = null) {
    const container = document.getElementById('toast-container');
    const template = document.getElementById('toast-template');
    
    // Clonar la plantilla
    const toast = template.cloneNode(true);
    toast.id = ''; // Eliminar el id para no duplicar
    toast.classList.add('show', `toast-${tipo}`);
    
    // Sombreado solo para error y éxito
    if (tipo === 'error' || tipo === 'success') {
        toast.style.textShadow = '1px 1px 4px #000, 0 0 2px #000';
    } else {
        toast.style.textShadow = 'none';
    }
    
    // Configurar título y cuerpo
    toast.querySelector('.toast-title').textContent = titulo;
    let mensajeFinal = mensaje;
    if (codigo) {
        mensajeFinal += `\nCódigo de error: ${codigo}`;
        registrarErrorConCodigo(mensaje, codigo);
    }
    toast.querySelector('.toast-body').textContent = mensajeFinal;
    
    // Configurar el botón de cerrar
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Agregar al contenedor
    container.appendChild(toast);
    
    // Mostrar el toast
    setTimeout(() => {
        toast.style.display = 'block';
    }, 10);
    
    // Animación de aparición (500ms)
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Eliminar después de 4 segundos + 500ms de animación de salida
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4000);
}

export function mostrarMensajeHTML(titulo, mensajeHTML, tipo = "info", codigo = null) {
    const container = document.getElementById('toast-container');
    const template = document.getElementById('toast-template');
    // Clonar la plantilla
    const toast = template.cloneNode(true);
    toast.id = '';
    toast.classList.add('show', `toast-${tipo}`);
    // Sombreado solo para error y éxito
    if (tipo === 'error' || tipo === 'success') {
        toast.style.textShadow = '1px 1px 4px #000, 0 0 2px #000';
    } else {
        toast.style.textShadow = 'none';
    }
    // Configurar título y cuerpo
    toast.querySelector('.toast-title').textContent = titulo;
    let mensajeFinal = mensajeHTML;
    if (codigo) {
        mensajeFinal += `<br><b>Código de error: ${codigo}</b>`;
        registrarErrorConCodigo(mensajeHTML, codigo);
    }
    toast.querySelector('.toast-body').innerHTML = mensajeFinal;
    // Configurar el botón de cerrar
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    // Agregar al contenedor
    container.appendChild(toast);
    // Mostrar el toast
    setTimeout(() => {
        toast.style.display = 'block';
    }, 10);

    // Animación de aparición (500ms)
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Eliminar después de 4 segundos + 500ms de animación de salida
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4000);
}

export function alternarMenuCSVMovil() {
    const menu = document.getElementById('mobile-csv-menu');
    menu.classList.toggle('visible');
}

export function ocultarMenuCSVMovil() {
    const menu = document.getElementById('mobile-csv-menu');
    menu.classList.remove('visible');
}

export function cerrarModales() {
    cerrarModalConTransicion('materials-modal');
    cerrarModalConTransicion('gallery-modal');
    cerrarModalConTransicion('carousel-modal');
}

export function cerrarModalMateriales() {
    cerrarModalConTransicion('materials-modal');
}

// Función para ocultar iconos flotantes
export function ocultarIconosFlotantes() {
    const floatingIconsContainer = document.getElementById('floating-icons-container');
    if (floatingIconsContainer) {
        floatingIconsContainer.classList.add('hidden');
    }
}

// Función para mostrar iconos flotantes
export function mostrarIconosFlotantes() {
    const floatingIconsContainer = document.getElementById('floating-icons-container');
    if (floatingIconsContainer) {
        // Solo mostrar si no estamos en pestañas especiales
        const esLeyenda = document.querySelector('[data-tab="conversionlegend"]')?.classList.contains('active');
        const esAyuda = document.querySelector('[data-tab="ayuda"]')?.classList.contains('active');
        
        if (!esLeyenda && !esAyuda) {
            floatingIconsContainer.classList.remove('hidden');
        }
    }
}

// Función para abrir modal con transición
export function abrirModalConTransicion(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        // Forzar reflow para que la animación funcione
        modal.offsetHeight;
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
        
        // Ocultar iconos flotantes cuando se abre un modal
        ocultarIconosFlotantes();
    }
}

// Función para cerrar modal con transición
export function cerrarModalConTransicion(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        modal.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.transition = '';
            
            // Mostrar iconos flotantes cuando se cierra un modal
            mostrarIconosFlotantes();
        }, 300);
    }
}

export function mostrarBotonErroresSiHay() {
    // Verifica si ya existe el botón
    if (document.getElementById('boton-ver-errores')) return;
    let log = window._erroresLog || [];
    if (log.length === 0) return;
    // Crear botón flotante
    const btn = document.createElement('button');
    btn.id = 'boton-ver-errores';
    btn.textContent = 'Ver errores';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.background = '#f44336';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '50px';
    btn.style.padding = '12px 20px';
    btn.style.fontWeight = 'bold';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    btn.onclick = mostrarModalErrores;
    document.body.appendChild(btn);
}

export function ocultarBotonErrores() {
    const btn = document.getElementById('boton-ver-errores');
    if (btn) btn.remove();
}

export function mostrarModalErrores() {
    let log = window._erroresLog || [];
    if (log.length === 0) return;
    // Crear modal simple
    let modal = document.getElementById('modal-log-errores');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-log-errores';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.6)';
        modal.style.zIndex = '10000';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        // Contenido
        const contenido = document.createElement('div');
        contenido.style.background = '#fff';
        contenido.style.borderRadius = '10px';
        contenido.style.padding = '24px';
        contenido.style.maxWidth = '90vw';
        contenido.style.maxHeight = '80vh';
        contenido.style.overflowY = 'auto';
        contenido.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
        contenido.innerHTML = `<h2 style='color:#f44336;'>Log de errores</h2>`;
        // Tabla de errores
        let tabla = `<table style='width:100%;font-size:1rem;border-collapse:collapse;'>`;
        tabla += `<thead><tr><th style='border-bottom:1px solid #ccc;padding:6px;'>Código</th><th style='border-bottom:1px solid #ccc;padding:6px;'>Mensaje</th><th style='border-bottom:1px solid #ccc;padding:6px;'>Fecha</th></tr></thead><tbody>`;
        for (const err of log) {
            tabla += `<tr><td style='padding:6px;border-bottom:1px solid #eee;'>${err.codigo}</td><td style='padding:6px;border-bottom:1px solid #eee;'>${err.mensaje}</td><td style='padding:6px;border-bottom:1px solid #eee;'>${err.fecha}</td></tr>`;
        }
        tabla += `</tbody></table>`;
        contenido.innerHTML += tabla;
        // Botón cerrar
        const btnCerrar = document.createElement('button');
        btnCerrar.textContent = 'Cerrar';
        btnCerrar.style.marginTop = '18px';
        btnCerrar.style.background = '#f44336';
        btnCerrar.style.color = '#fff';
        btnCerrar.style.border = 'none';
        btnCerrar.style.borderRadius = '6px';
        btnCerrar.style.padding = '10px 24px';
        btnCerrar.style.fontWeight = 'bold';
        btnCerrar.onclick = () => modal.remove();
        contenido.appendChild(btnCerrar);
        modal.appendChild(contenido);
        document.body.appendChild(modal);
    }
}

function registrarErrorConCodigo(mensaje, codigo) {
    // Guardar solo en memoria
    window._erroresLog = window._erroresLog || [];
    window._erroresLog.push({ codigo, mensaje, fecha: new Date().toISOString() });
    // Mostrar el botón si hay errores
    setTimeout(() => {
        window.modales && window.modales.mostrarBotonErroresSiHay && window.modales.mostrarBotonErroresSiHay();
    }, 100);
}