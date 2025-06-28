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

export function cargarImagenesGuardadas(estado) {
    try {
        if (!isLocalStorageAvailable()) {
            console.warn('localStorage no disponible para galería, usando array vacío');
            estado.imagenesGaleria = [];
            return;
        }

        const imagenesGuardadas = localStorage.getItem('imagenesGaleria');
        console.log('Intentando cargar imágenes desde localStorage:', imagenesGuardadas ? 'datos encontrados' : 'sin datos');
        
        if (imagenesGuardadas) {
            const parsed = JSON.parse(imagenesGuardadas);
            if (Array.isArray(parsed)) {
                estado.imagenesGaleria = parsed;
                console.log('Imágenes cargadas exitosamente desde localStorage:', estado.imagenesGaleria.length, 'imágenes');
            } else {
                console.warn('Datos de imágenes en localStorage no son válidos, usando array vacío');
                estado.imagenesGaleria = [];
            }
        } else {
            console.log('No se encontraron imágenes guardadas en localStorage, usando array vacío');
            estado.imagenesGaleria = [];
        }
    } catch (e) {
        console.error('Error al cargar imágenes desde localStorage:', e);
        estado.imagenesGaleria = [];
    }
}

export function guardarImagenesEnLocalStorage(estado) {
    try {
        if (!isLocalStorageAvailable()) {
            console.warn('localStorage no disponible para galería, no se pueden guardar las imágenes');
            return;
        }

        localStorage.setItem('imagenesGaleria', JSON.stringify(estado.imagenesGaleria));
        console.log('Imágenes guardadas exitosamente en localStorage:', estado.imagenesGaleria.length, 'imágenes');
    } catch (e) {
        console.error('Error al guardar imágenes en localStorage:', e);
    }
}

export function eliminarImagen(index, estado) {
    try {
        if (index >= 0 && index < estado.imagenesGaleria.length) {
            estado.imagenesGaleria.splice(index, 1);
            guardarImagenesEnLocalStorage(estado);
            console.log('Imagen eliminada exitosamente del localStorage');
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