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
            estado.cambiosPendientes = true;
            guardarImagenesEnLocalStorage(estado);
            
            // Forzar guardado inmediato
            if (window.guardarDatosCompletos) {
                window.guardarDatosCompletos();
            }
            
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

    estado.imagenesGaleria.forEach((rutaImagen, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        
        // Manejar tanto rutas como datos base64
        if (typeof rutaImagen === 'string') {
            if (rutaImagen.startsWith('data:')) {
                // Es una imagen base64 existente
                img.src = rutaImagen;
            } else {
                // Es una ruta de archivo
                img.src = rutaImagen;
            }
        } else if (rutaImagen && typeof rutaImagen === 'object') {
            // Es un objeto con ruta o url
            img.src = rutaImagen.ruta || rutaImagen.url || '';
        } else {
            img.src = '';
        }
        
        img.alt = `Guía visual ${index + 1}`;
        img.onerror = function() {
            // Si la imagen no se puede cargar, mostrar un placeholder
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'width: 100%; height: 150px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px; border-radius: 4px;';
            placeholder.textContent = 'Imagen no encontrada';
            item.appendChild(placeholder);
        };
        
        img.onload = function() {
            // Imagen cargada correctamente
            this.style.display = 'block';
        };

        // Hacer la imagen clickeable para abrir el carrusel
        img.addEventListener('click', () => {
            estado.indiceCarruselActual = index;
            mostrarImagenCarrusel(estado);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-image';
        deleteButton.innerHTML = '×';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            eliminarImagen(index, estado);
        };

        item.appendChild(img);
        item.appendChild(deleteButton);
        contenedor.appendChild(item);
    });

    modal.style.display = 'block';
}

export function agregarImagenAGaleria(archivo, estado) {
    // Guardar la imagen completa en base64 para que funcione correctamente
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagenBase64 = e.target.result;
        estado.imagenesGaleria.push(imagenBase64);
        estado.cambiosPendientes = true;
        guardarImagenesEnLocalStorage(estado);
        
        abrirGaleria(estado);
        console.log('Imagen agregada a galería (base64):', archivo.name);
    };
    reader.readAsDataURL(archivo);
}

export function mostrarImagenCarrusel(estado) {
    const modal = document.getElementById('carousel-modal');
    const imagen = document.getElementById('carousel-image');
    const contador = document.getElementById('carousel-counter');

    if (estado.imagenesGaleria.length > 0) {
        const rutaImagen = estado.imagenesGaleria[estado.indiceCarruselActual];
        
        // Manejar tanto rutas como datos base64
        if (typeof rutaImagen === 'string') {
            if (rutaImagen.startsWith('data:')) {
                // Es una imagen base64 existente
                imagen.src = rutaImagen;
            } else {
                // Es una ruta de archivo
                imagen.src = rutaImagen;
            }
        } else if (rutaImagen && typeof rutaImagen === 'object') {
            // Es un objeto con ruta o url
            imagen.src = rutaImagen.ruta || rutaImagen.url || '';
        } else {
            imagen.src = '';
        }
        
        imagen.onerror = function() {
            // Si la imagen no se puede cargar, mostrar un mensaje
            this.style.display = 'none';
            const mensaje = document.createElement('div');
            mensaje.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 16px; background: #f5f5f5; border-radius: 8px;';
            mensaje.textContent = 'Imagen de guía no encontrada';
            this.parentNode.appendChild(mensaje);
        };
        
        imagen.onload = function() {
            // Imagen cargada correctamente
            this.style.display = 'block';
            // Remover mensaje de error si existe
            const mensaje = this.parentNode.querySelector('div');
            if (mensaje) mensaje.remove();
        };
        
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