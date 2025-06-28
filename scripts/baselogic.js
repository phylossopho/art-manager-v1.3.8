// scripts/baseLogic.js
import * as modales from './modales.js';

export function crearBaseSelector(estado, contenedor) {
    try {
        // Crear contenedor principal
        const baseSelector = document.createElement('div');
        baseSelector.className = 'base-selector';
        baseSelector.style.backgroundColor = estado.colorNoSeleccionado || '#808080';
        baseSelector.dataset.testid = 'base-selector';

        // Título (depende de la clase y nivel)
        const titulo = document.createElement('div');
        titulo.className = 'base-title';
        let textoTitulo = '';
        if (estado.claseActual === "Campeón") {
            textoTitulo = "Equipo normal de nivel 4";
        } else if (estado.claseActual === "Planewalker") {
            textoTitulo = "Equipo normal de nivel 5";
        } else if (estado.claseActual === "Lord") {
            textoTitulo = "Equipo de nivel 5 o menor";
        } else if (estado.claseActual === "Noble Lord") {
            textoTitulo = "Equipo Lord de nivel 5";
        } else if (estado.claseActual === "Normal") {
            if (estado.nivelActual === "1") {
                textoTitulo = "Equipo de nivel 1";
            } else {
                textoTitulo = `Equipo de nivel ${estado.nivelActual} o menor`;
            }
        } else {
            textoTitulo = "Base";
        }
        titulo.textContent = textoTitulo;
        baseSelector.appendChild(titulo);

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

        // Agregar texto superpuesto
        const baseText = document.createElement('div');
        baseText.className = 'base-text';
        baseText.textContent = textoTitulo;
        baseSelector.appendChild(baseText);

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

        // Agregar funcionalidad de clic
        baseSelector.addEventListener('click', () => {
            mostrarDropdownColorBase(estado, baseSelector, textoTitulo);
        });

        // Cerrar selector al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!baseSelector.contains(e.target)) {
                baseSelector.classList.remove('active');
            }
        });

        contenedor.appendChild(baseSelector);

        // Actualizar estado inicial
        actualizarEstadoBase(estado);

        return {
            element: baseSelector,
            selector,
            deniedImage,
            title: titulo,
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
        const title = baseSelector.querySelector('.base-title');
        const equipoImg = baseSelector.querySelector('.base-equipo-img');

        if (!selector || !deniedImage || !title) {
            console.warn('Elementos internos del selector base no encontrados');
            return;
        }

        // Para clases especiales, mostrar imagen y texto
        if (["Campeón", "Planewalker", "Lord", "Noble Lord"].includes(estado.claseActual)) {
            deniedImage.style.display = 'none';
            selector.style.display = 'block';
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
            title.textContent = texto;
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
            title.textContent = 'NO DISPONIBLE';
            baseSelector.style.backgroundColor = '#f8d7da'; // Color de error
            estado.colorBaseSeleccionado = null; // Resetear selección
            // Resetear el selector
            if (selector.value) {
                selector.value = '';
            }
            if (equipoImg) equipoImg.style.display = 'none';
        } else {
            deniedImage.style.display = 'none';
            selector.style.display = 'block';
            // Para clase Normal, mostrar texto según el nivel
            if (estado.claseActual === "Normal") {
                if (estado.nivelActual === "1") {
                    title.textContent = "Equipo de nivel 1";
                } else {
                    title.textContent = `Equipo de nivel ${estado.nivelActual} o menor`;
                }
            } else {
                title.textContent = "Base";
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

// Función para mostrar dropdown de color para el selector base
function mostrarDropdownColorBase(estado, elementoOrigen, titulo) {
    try {
        // Remover dropdown existente si hay uno
        const dropdownExistente = document.querySelector('.color-dropdown');
        if (dropdownExistente) {
            dropdownExistente.remove();
        }
        
        const overlayExistente = document.querySelector('.dropdown-overlay');
        if (overlayExistente) {
            overlayExistente.remove();
        }

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'dropdown-overlay';
        document.body.appendChild(overlay);

        // Crear dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'color-dropdown';
        
        const colorActual = estado.colorBaseSeleccionado;
        
        dropdown.innerHTML = `
            <div class="color-dropdown-header">
                Seleccionar color para ${titulo}
            </div>
            <div class="color-dropdown-content">
                <select id="dropdown-color-select">
                    <option value="">- Sin seleccionar -</option>
                    <option value="blanco" ${colorActual === 'blanco' ? 'selected' : ''}>Blanco</option>
                    <option value="verde" ${colorActual === 'verde' ? 'selected' : ''}>Verde</option>
                    <option value="azul" ${colorActual === 'azul' ? 'selected' : ''}>Azul</option>
                    <option value="morado" ${colorActual === 'morado' ? 'selected' : ''}>Morado</option>
                    <option value="dorado" ${colorActual === 'dorado' ? 'selected' : ''}>Dorado</option>
                </select>
                <div class="color-dropdown-buttons">
                    <button class="color-dropdown-btn cancel">Cancelar</button>
                    <button class="color-dropdown-btn apply">Aplicar</button>
                </div>
            </div>
        `;

        document.body.appendChild(dropdown);

        // Event listeners
        const selectElement = dropdown.querySelector('#dropdown-color-select');
        const cancelBtn = dropdown.querySelector('.cancel');
        const applyBtn = dropdown.querySelector('.apply');

        // Cerrar con Cancelar
        cancelBtn.addEventListener('click', () => {
            cerrarDropdown();
        });

        // Aplicar selección
        applyBtn.addEventListener('click', () => {
            const colorSeleccionado = selectElement.value;
            if (colorSeleccionado) {
                estado.colorBaseSeleccionado = colorSeleccionado;
                if (estado.mapaColores[colorSeleccionado]) {
                    elementoOrigen.style.backgroundColor = estado.mapaColores[colorSeleccionado];
                }
            } else {
                estado.colorBaseSeleccionado = null;
                elementoOrigen.style.backgroundColor = estado.colorNoSeleccionado || '#808080';
            }
            cerrarDropdown();
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                cerrarDropdown();
            }
        });

        // Cerrar con clic en overlay
        overlay.addEventListener('click', () => {
            cerrarDropdown();
        });

        function cerrarDropdown() {
            dropdown.remove();
            overlay.remove();
        }

        // Focus en el select
        setTimeout(() => {
            selectElement.focus();
        }, 100);

    } catch (error) {
        console.error('Error mostrando dropdown de color base:', error);
    }
}