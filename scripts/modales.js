// scripts/modales.js
export function mostrarMensaje(titulo, mensaje, tipo = "info") {
    const container = document.getElementById('toast-container');
    const template = document.getElementById('toast-template');
    
    // Clonar la plantilla
    const toast = template.cloneNode(true);
    toast.id = ''; // Eliminar el id para no duplicar
    toast.classList.add('show', `toast-${tipo}`);
    
    // Configurar título y cuerpo
    toast.querySelector('.toast-title').textContent = titulo;
    toast.querySelector('.toast-body').textContent = mensaje;
    
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
    
    // Eliminar después de 3 segundos (3000ms) + 300ms de animación
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 1890);
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
        floatingIconsContainer.style.display = 'none';
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
            floatingIconsContainer.style.display = 'block';
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