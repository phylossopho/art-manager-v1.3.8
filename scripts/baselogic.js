// scripts/baseLogic.js
import * as modales from './modales.js';

export function crearBaseSelector(estado, contenedor) {
    try {
        // Crear contenedor principal
        const baseSelector = document.createElement('div');
        baseSelector.className = 'base-selector';
        baseSelector.style.backgroundColor = estado.colorNoSeleccionado || '#808080';
        baseSelector.dataset.testid = 'base-selector';

        // Título (vacío por defecto)
        // const titulo = document.createElement('div');
        // titulo.className = 'base-title';
        // titulo.textContent = ''; // Sin texto inicial
        // baseSelector.appendChild(titulo);

        // Contenedor para elementos dinámicos
        const dynamicContainer = document.createElement('div');
        dynamicContainer.className = 'base-dynamic-content';

        // Imagen del equipo (solo para clases especiales, no Normal)
        if (["Campeón", "Planewalker", "Lord", "Noble Lord"].includes(estado.claseActual)) {
            const imgEquipo = document.createElement('img');
            imgEquipo.className = 'base-equipo-img';
            imgEquipo.src = `images/${estado.equipoActual.toLowerCase()}.png`;
            imgEquipo.alt = estado.equipoActual;
            imgEquipo.style.maxWidth = '50px';
            imgEquipo.style.maxHeight = '50px';
            imgEquipo.style.marginBottom = '10px';
            imgEquipo.style.display = 'block';
            imgEquipo.onerror = function() {
                this.style.display = 'none';
                const span = document.createElement('span');
                span.textContent = estado.equipoActual;
                dynamicContainer.appendChild(span);
            };
            dynamicContainer.appendChild(imgEquipo);
        }
        // Para clase Normal, no se agrega imagen

        // Selector de color
        const selector = document.createElement('select');
        selector.innerHTML = `
            <option value="">-</option>
            <option value="blanco">Blanco</option>
            <option value="verde">Verde</option>
            <option value="azul">Azul</option>
            <option value="morado">Morado</option>
            <option value="dorado">Dorado</option>
        `;
        selector.dataset.testid = 'base-color-selector';

        // Establecer selección actual si existe
        if (estado.colorBaseSeleccionado) {
            selector.value = estado.colorBaseSeleccionado;
        } else {
            selector.value = ""; // Asegurar que esté en "-"
        }

        // Evento de cambio
        selector.addEventListener('change', (e) => {
            try {
                const colorSeleccionado = e.target.value;
                estado.colorBaseSeleccionado = colorSeleccionado;

                if (colorSeleccionado && estado.mapaColores[colorSeleccionado]) {
                    baseSelector.style.backgroundColor = estado.mapaColores[colorSeleccionado];
                } else {
                    baseSelector.style.backgroundColor = estado.colorNoSeleccionado || '#808080';
                }
            } catch (error) {
                console.error('Error al cambiar color base:', error);
                modales.mostrarMensaje('Error', 'Error al seleccionar color base', 'error');
            }
        });

        // Imagen de denegado
        const deniedImage = document.createElement('img');
        deniedImage.src = './images/denied.png';
        deniedImage.alt = 'Acción no permitida';
        deniedImage.style.display = 'none';
        deniedImage.style.maxWidth = '100%';
        deniedImage.style.marginTop = '10px';
        deniedImage.dataset.testid = 'base-denied-image';

        // Añadir elementos al contenedor
        dynamicContainer.appendChild(selector);
        dynamicContainer.appendChild(deniedImage);
        baseSelector.appendChild(dynamicContainer);

        // Agregar texto superpuesto para restricciones (al final para que aparezca encima)
        const baseText = document.createElement('div');
        baseText.className = 'base-text';
        baseText.textContent = ''; // Sin texto inicial
        baseSelector.appendChild(baseText);

        // Ocultar selector por defecto
        selector.style.display = 'none';

        // Mostrar selector al hacer clic en el base
        baseSelector.addEventListener('click', () => {
            selector.style.display = selector.style.display === 'none' ? 'block' : 'none';
        });

        // Cerrar selector al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!baseSelector.contains(e.target)) {
                selector.style.display = 'none';
            }
        });

        contenedor.appendChild(baseSelector);

        // Actualizar estado inicial
        actualizarEstadoBase(estado);

        return {
            element: baseSelector,
            selector,
            deniedImage,
            equipoImg: baseSelector.querySelector('.base-equipo-img')
        };
    } catch (error) {
        console.error('Error creando selector base:', error);
        modales.mostrarMensaje('Error', 'Error al crear selector base', 'error');
        return null;
    }
}

export function actualizarEstadoBase(estado) {
    try {
        const baseSelector = document.querySelector('.base-selector');
        if (!baseSelector) {
            console.warn('Selector base no encontrado');
            return;
        }

        const selector = baseSelector.querySelector('select');
        const deniedImage = baseSelector.querySelector('img[data-testid="base-denied-image"]');
        const baseText = baseSelector.querySelector('.base-text');
        const equipoImg = baseSelector.querySelector('.base-equipo-img');

        if (!selector || !deniedImage || !baseText) {
            console.warn('Elementos internos del selector base no encontrados');
            return;
        }

        // Para clases especiales, mostrar imagen y texto superpuesto
        if (["Campeón", "Planewalker", "Lord", "Noble Lord"].includes(estado.claseActual)) {
            deniedImage.style.display = 'none';
            selector.style.display = 'none'; // Oculto por defecto
            let texto = '';
            if (estado.claseActual === "Campeón") {
                texto = "Equipo normal de nivel 4";
            } else if (estado.claseActual === "Planewalker") {
                texto = "Equipo normal de nivel 5";
            } else if (estado.claseActual === "Lord") {
                texto = "Equipo de nivel 5 o menor";
            } else if (estado.claseActual === "Noble Lord") {
                texto = "Equipo Lord de nivel 5";
            }
            baseText.textContent = texto;
            // Actualizar imagen del equipo si existe
            if (equipoImg) {
                equipoImg.src = `images/${estado.equipoActual.toLowerCase()}.png`;
                equipoImg.alt = estado.equipoActual;
                equipoImg.onerror = () => {
                    equipoImg.style.display = 'none';
                    const span = baseSelector.querySelector('span');
                    if (span) span.textContent = estado.equipoActual;
                };
                equipoImg.style.display = 'block';
            }
            // Restaurar color de fondo según selección actual
            if (estado.colorBaseSeleccionado && estado.mapaColores[estado.colorBaseSeleccionado]) {
                baseSelector.style.backgroundColor = estado.mapaColores[estado.colorBaseSeleccionado];
            } else {
                baseSelector.style.backgroundColor = estado.colorNoSeleccionado || '#808080';
            }
            return;
        }

        // Condición de restricción: Solo disponible si no es Normal nivel 1 blanco
        const condicionDenied = 
            estado.claseActual === "Normal" &&
            estado.nivelActual === "1" &&
            estado.colorActual === "blanco";

        if (condicionDenied) {
            deniedImage.style.display = 'block';
            selector.style.display = 'none';
            baseText.textContent = 'NO DISPONIBLE';
            baseSelector.style.backgroundColor = '#f8d7da'; // Color de error
            estado.colorBaseSeleccionado = null; // Resetear selección
            // Resetear el selector
            if (selector.value) {
                selector.value = '';
            }
            if (equipoImg) equipoImg.style.display = 'none';
        } else {
            deniedImage.style.display = 'none';
            selector.style.display = 'none'; // Oculto por defecto
            // Para clase Normal, mostrar texto según el nivel
            if (estado.claseActual === "Normal") {
                if (estado.nivelActual === "1") {
                    baseText.textContent = "Equipo de nivel 1";
                } else {
                    baseText.textContent = `Equipo de nivel ${estado.nivelActual} o menor`;
                }
            } else {
                baseText.textContent = ''; // No mostrar texto superpuesto para otras clases
            }
            // Ocultar imagen si existe
            if (equipoImg) equipoImg.style.display = 'none';
            // Restaurar color de fondo según selección actual
            if (estado.colorBaseSeleccionado && estado.mapaColores[estado.colorBaseSeleccionado]) {
                baseSelector.style.backgroundColor = estado.mapaColores[estado.colorBaseSeleccionado];
            } else {
                baseSelector.style.backgroundColor = estado.colorNoSeleccionado || '#808080';
                if (selector) selector.value = '';
            }
        }
    } catch (error) {
        console.error('Error actualizando estado base:', error);
        modales.mostrarMensaje('Error', 'Error al actualizar selector base', 'error');
    }
}

export function reiniciarSelectorBase(estado) {
    try {
        estado.colorBaseSeleccionado = null;
        actualizarEstadoBase(estado);
    } catch (error) {
        console.error('Error reiniciando selector base:', error);
        modales.mostrarMensaje('Error', 'Error al reiniciar selector base', 'error');
    }
}