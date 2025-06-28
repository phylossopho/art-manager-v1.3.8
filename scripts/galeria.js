// scripts/galeria.js
import * as modales from './modales.js';

// Función para verificar si localStorage está disponible
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.warn('localStorage no está disponible:', e);
        return false;
    }
}

// Función para verificar si sessionStorage está disponible
function isSessionStorageAvailable() {
    try {
        const test = '__sessionStorage_test__';
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
    } catch (e) {
        console.warn('sessionStorage no está disponible:', e);
        return false;
    }
}

// Función para detectar si es un dispositivo móvil
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

export function cargarImagenesGuardadas(estado) {
    try {
        // En móviles, intentar cargar desde localStorage primero, luego sessionStorage
        let imagenesGuardadas = null;
        if (isMobileDevice()) {
            console.log('Dispositivo móvil detectado, verificando ambos storages para imágenes...');
            
            if (isLocalStorageAvailable()) {
                imagenesGuardadas = localStorage.getItem('imagenesGaleria');
                console.log('localStorage para imágenes en móvil:', imagenesGuardadas ? 'datos encontrados' : 'sin datos');
            }
            
            if (!imagenesGuardadas && isSessionStorageAvailable()) {
                imagenesGuardadas = sessionStorage.getItem('imagenesGaleria');
                console.log('sessionStorage para imágenes en móvil:', imagenesGuardadas ? 'datos encontrados' : 'sin datos');
            }
        } else {
            if (isLocalStorageAvailable()) {
                imagenesGuardadas = localStorage.getItem('imagenesGaleria');
            }
        }
        
        console.log('Intentando cargar imágenes desde storage:', imagenesGuardadas ? 'datos encontrados' : 'sin datos');
        
        if (imagenesGuardadas) {
            const parsed = JSON.parse(imagenesGuardadas);
            if (Array.isArray(parsed)) {
                estado.imagenesGaleria = parsed;
                console.log('Imágenes cargadas exitosamente:', estado.imagenesGaleria.length, 'imágenes');
            } else {
                console.warn('Datos de imágenes en storage no son válidos, usando array vacío');
                estado.imagenesGaleria = [];
            }
        } else {
            console.log('No se encontraron imágenes guardadas, usando array vacío');
            estado.imagenesGaleria = [];
        }
    } catch (e) {
        console.error('Error al cargar imágenes desde storage:', e);
        estado.imagenesGaleria = [];
    }
}

export function guardarImagenesEnLocalStorage(estado) {
    try {
        const datosParaGuardar = JSON.stringify(estado.imagenesGaleria);
        
        // En móviles, guardar en ambos storages para mayor seguridad
        if (isMobileDevice()) {
            console.log('Dispositivo móvil detectado, guardando imágenes en ambos storages...');
            
            if (isLocalStorageAvailable()) {
                localStorage.setItem('imagenesGaleria', datosParaGuardar);
                console.log('Imágenes guardadas en localStorage (móvil)');
            }
            
            if (isSessionStorageAvailable()) {
                sessionStorage.setItem('imagenesGaleria', datosParaGuardar);
                console.log('Imágenes guardadas en sessionStorage (móvil)');
            }
        } else {
            if (isLocalStorageAvailable()) {
                localStorage.setItem('imagenesGaleria', datosParaGuardar);
                console.log('Imágenes guardadas exitosamente:', estado.imagenesGaleria.length, 'imágenes');
            }
        }
    } catch (e) {
        console.error('Error al guardar imágenes en storage:', e);
    }
}

export function eliminarImagen(index, estado) {
    try {
        if (index >= 0 && index < estado.imagenesGaleria.length) {
            estado.imagenesGaleria.splice(index, 1);
            guardarImagenesEnLocalStorage(estado);
            console.log('Imagen eliminada exitosamente del storage');
        }
    } catch (e) {
        console.error('Error al eliminar imagen:', e);
    }
}

export function abrirGaleria(estado) {
    const modal = document.getElementById('gallery-modal');
    const contenedor = document.getElementById('gallery-container');
    contenedor.innerHTML = '';

    estado.imagenesGaleria.forEach((imagen, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = imagen;
        img.alt = `Imagen ${index + 1}`;
        img.addEventListener('click', () => {
            estado.indiceCarruselActual = index;
            mostrarImagenCarrusel(estado);
        });

        const controles = document.createElement('div');
        controles.className = 'gallery-item-controls';

        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'delete-image-button';
        botonEliminar.innerHTML = '×';
        botonEliminar.addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarImagen(index, estado);
        });

        controles.appendChild(botonEliminar);
        item.appendChild(img);
        item.appendChild(controles);
        contenedor.appendChild(item);
    });

    modal.style.display = 'block';
}

export function agregarImagenAGaleria(archivo, estado) {
    const lector = new FileReader();

    lector.onload = function(e) {
        estado.imagenesGaleria.push(e.target.result);
        guardarImagenesEnLocalStorage(estado);
        abrirGaleria(estado);
    };

    lector.readAsDataURL(archivo);
}

export function mostrarImagenCarrusel(estado) {
    const modal = document.getElementById('carousel-modal');
    const imagen = document.getElementById('carousel-image');
    const contador = document.getElementById('carousel-counter');

    if (estado.imagenesGaleria.length > 0) {
        imagen.src = estado.imagenesGaleria[estado.indiceCarruselActual];
        contador.textContent = `${estado.indiceCarruselActual + 1} / ${estado.imagenesGaleria.length}`;
        modal.style.display = 'block';
    }
}

export function mostrarImagenAnteriorCarrusel(estado) {
    if (estado.imagenesGaleria.length === 0) return;

    estado.indiceCarruselActual = (estado.indiceCarruselActual - 1 + estado.imagenesGaleria.length) % estado.imagenesGaleria.length;
    mostrarImagenCarrusel(estado);
}

export function mostrarImagenSiguienteCarrusel(estado) {
    if (estado.imagenesGaleria.length === 0) return;

    estado.indiceCarruselActual = (estado.indiceCarruselActual + 1) % estado.imagenesGaleria.length;
    mostrarImagenCarrusel(estado);
}