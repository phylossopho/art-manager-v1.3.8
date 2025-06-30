// scripts/ui.js
import * as conversiones from './conversiones.js';
import { crearBaseSelector, actualizarEstadoBase } from './baselogic.js';
import { generarTablaArte } from './arte.js';
import * as modales from './modales.js';
import { restriccionesClase, mapaColores } from './datos.js'; // Importamos las restricciones
import { consultaRapidaMateriales, guardarRecetaPersonalizada, obtenerRecetaPersonalizada, cargarRecetasPersonalizadas, eliminarRecetaPersonalizada } from './materiales.js';

export function actualizarImagenEquipo(estado) {
    const elementoImagen = document.getElementById('equipment-img');
    if (elementoImagen) {
        try {
            elementoImagen.src = `images/${estado.equipoActual.toLowerCase()}.png`;
            elementoImagen.onerror = () => {
                elementoImagen.style.display = 'none';
                console.warn(`Imagen no encontrada para equipo: ${estado.equipoActual}`);
            };
            elementoImagen.style.display = 'block';
            // Hacer la imagen clickeable para abrir el selector de equipo
            elementoImagen.style.cursor = 'pointer';
            elementoImagen.onclick = () => {
                const equipmentSelect = document.getElementById('equipment-select');
                if (equipmentSelect) {
                    // Para móvil, forzar el despliegue nativo
                    if (typeof equipmentSelect.showPicker === 'function') {
                        equipmentSelect.showPicker();
                    } else {
                        equipmentSelect.focus();
                        // Simular un evento de teclado para abrir el menú
                        const event = new MouseEvent('mousedown', { bubbles: true });
                        equipmentSelect.dispatchEvent(event);
                    }
                }
            };
        } catch (error) {
            console.error('Error actualizando imagen de equipo:', error);
        }
    }
}

export function actualizarTabla(estado) {
    const contenedorTabla = document.getElementById('materials-table');
    if (!contenedorTabla) return;
    contenedorTabla.innerHTML = '';

    try {
        const tabla = document.createElement('table');
        tabla.className = 'materials-table-table';
        const encabezados = ["", "Material", "Dorado", "Morado", "Azul", "Verde", "Blanco"];
        const filaEncabezados = document.createElement('tr');

        encabezados.forEach((encabezado, index) => {
            const th = document.createElement('th');
            th.textContent = encabezado;
            th.className = 'col-color';
            if (index === 0) th.className = 'col-imagen';
            else if (index === 1) th.className = 'col-nombre';
            filaEncabezados.appendChild(th);
        });

        tabla.appendChild(filaEncabezados);

        let materiales = [];
        const clase = estado.claseActual;
        
        // Determinar la clase de almacenamiento basada en la clase actual
        const claseAlmacen = 
            (clase === "Campeón" || clase === "Planewalker") ? "Campeón y Planewalker" :
            (clase === "Lord" || clase === "Noble Lord") ? "Lord y Noble Lord" :
            clase;

        if (claseAlmacen === "Lord y Noble Lord") {
            if (estado.materialesData[claseAlmacen]?.common) {
                materiales = estado.materialesData[claseAlmacen].common;
            }
        } else {
            if (estado.materialesData[claseAlmacen]?.[estado.equipoActual]) {
                materiales = estado.materialesData[claseAlmacen][estado.equipoActual];
            }
        }

        if (!materiales || materiales.length === 0) {
            contenedorTabla.innerHTML = '<p>No se encontraron materiales para esta configuración</p>';
            return;
        }

        // NUEVO ORDEN: Material 3, Material 1, Material 2, Material 4
        // Crear nuevo arreglo con el orden deseado: material3, material1, material2, material4
        const materialesOrdenados = [];
        const indicesOriginales = [];
        
        if (materiales.length > 2) {
            materialesOrdenados.push(materiales[2]); // Material 3
            indicesOriginales.push(2); // Índice original: 2
        }
        
        if (materiales.length > 0) {
            materialesOrdenados.push(materiales[0]); // Material 1
            indicesOriginales.push(0); // Índice original: 0
        }
        
        if (materiales.length > 1) {
            materialesOrdenados.push(materiales[1]); // Material 2
            indicesOriginales.push(1); // Índice original: 1
        }
        
        if (materiales.length > 3) {
            materialesOrdenados.push(materiales[3]); // Material 4
            indicesOriginales.push(3); // Índice original: 3
        }

        // Iterar sobre los materiales en el nuevo orden
        materialesOrdenados.forEach((material, newIndex) => {
            const idxOriginal = indicesOriginales[newIndex];
            const claveAlmacen = `${claseAlmacen}:${material}`;
            const fila = document.createElement('tr');

            // Celda de imagen
            const celdaImagen = document.createElement('td');
            celdaImagen.className = 'col-imagen';
            const imagen = document.createElement('img');
            const nombreImagen = material.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            imagen.src = `images/${nombreImagen}.png`;
            imagen.style.width = '30px';
            imagen.style.height = '30px';
            imagen.onerror = () => {
                imagen.style.display = 'none';
                const span = document.createElement('span');
                span.textContent = material.substring(0, 2);
                celdaImagen.appendChild(span);
            };
            celdaImagen.appendChild(imagen);
            fila.appendChild(celdaImagen);

            // Celda de nombre
            const celdaNombre = document.createElement('td');
            celdaNombre.className = 'col-nombre';
            celdaNombre.textContent = material;
            fila.appendChild(celdaNombre);

            // Celdas de colores
            ['dorado', 'morado', 'azul', 'verde', 'blanco'].forEach(color => {
                const celdaColor = document.createElement('td');
                celdaColor.className = 'col-color';
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'color-input';
                input.dataset.color = color;
                
                // Valor inicial
                input.value = estado.almacenMateriales[claveAlmacen]?.[color] || '0';
                
                // Deshabilitar según nivel - usar índice ORIGINAL
                const deshabilitado = (idxOriginal === 2 && estado.nivelActual === "1") || 
                                    (idxOriginal === 3 && (estado.nivelActual === "1" || estado.nivelActual === "2"));
                
                if (deshabilitado) {
                    input.disabled = true;
                    input.style.backgroundColor = '#f0f0f0';
                } else {
                    input.addEventListener('input', (e) => {
                        if (/^\d*$/.test(e.target.value)) {
                            if (!estado.almacenMateriales[claveAlmacen]) {
                                estado.almacenMateriales[claveAlmacen] = {};
                            }
                            estado.almacenMateriales[claveAlmacen][color] = e.target.value;
                            estado.cambiosPendientes = true;
                        } else {
                            e.target.value = estado.almacenMateriales[claveAlmacen][color] || '0';
                        }
                    });
                }

                celdaColor.appendChild(input);
                fila.appendChild(celdaColor);
            });

            tabla.appendChild(fila);
        });

        contenedorTabla.appendChild(tabla);
    } catch (error) {
        console.error('Error actualizando tabla:', error);
        contenedorTabla.innerHTML = '<p>Error al cargar los materiales</p>';
    }
}

export function actualizarSelectoresMaterialesInferiores(estado) {
    const seccionInferior = document.getElementById('bottom-section');
    if (!seccionInferior) return;
    seccionInferior.innerHTML = '';

    try {
        let materiales = [];
        const clase = estado.claseActual;
        
        // Determinar la clase de almacenamiento basada en la clase actual
        const claseAlmacen = 
            (clase === "Campeón" || clase === "Planewalker") ? "Campeón y Planewalker" :
            (clase === "Lord" || clase === "Noble Lord") ? "Lord y Noble Lord" :
            clase;

        if (claseAlmacen === "Lord y Noble Lord") {
            if (estado.materialesData[claseAlmacen]?.common) {
                materiales = estado.materialesData[claseAlmacen].common;
            }
        } else {
            if (estado.materialesData[claseAlmacen]?.[estado.equipoActual]) {
                materiales = estado.materialesData[claseAlmacen][estado.equipoActual];
            }
        }

        if (!materiales || materiales.length < 4) {
            seccionInferior.innerHTML = '<p>No hay suficientes materiales para mostrar</p>';
            return;
        }

        // Crear selectores en el orden correcto: material3, material1, base, material2, material4
        crearMaterialSelector(estado, seccionInferior, materiales[2], 2, claseAlmacen);
        crearMaterialSelector(estado, seccionInferior, materiales[0], 0, claseAlmacen);
        crearBaseSelector(estado, seccionInferior);
        crearMaterialSelector(estado, seccionInferior, materiales[1], 1, claseAlmacen);
        crearMaterialSelector(estado, seccionInferior, materiales[3], 3, claseAlmacen);
    } catch (error) {
        console.error('Error actualizando selectores inferiores:', error);
        seccionInferior.innerHTML = '<p>Error al cargar los selectores</p>';
    }
}

function crearMaterialSelector(estado, contenedor, material, indice, claseAlmacen) {
    try {
        const claveAlmacen = `${claseAlmacen}:${material}`;
        const colorActual = estado.colorPorMaterialSeleccionado[claveAlmacen];
        let colorFondo = estado.colorNoSeleccionado;

        const material3Restringido = indice === 2 && estado.nivelActual === "1";
        const material4Restringido = indice === 3 && (estado.nivelActual === "1" || estado.nivelActual === "2");

        const selectorMaterial = document.createElement('div');
        selectorMaterial.className = 'material-selector item-selector';
        selectorMaterial.style.backgroundColor = colorFondo;
        selectorMaterial.dataset.materialKey = claveAlmacen; // Refuerza unicidad

        if (material3Restringido || material4Restringido) {
            const deniedImage = document.createElement('img');
            deniedImage.src = 'images/denied.png';
            deniedImage.alt = 'Acción no permitida';
            selectorMaterial.appendChild(deniedImage);
        } else {
            const imagen = document.createElement('img');
            const nombreImagen = material.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            imagen.src = `images/${nombreImagen}.png`;
            imagen.alt = material;
            imagen.style.maxWidth = '100%';
            imagen.style.height = '100px';
            imagen.style.objectFit = 'contain';
            imagen.onerror = () => {
                imagen.style.display = 'none';
                const span = document.createElement('span');
                span.textContent = material;
                selectorMaterial.appendChild(span);
            };
            selectorMaterial.appendChild(imagen);

            // Botón de color visible para abrir el selector
            const colorBtn = document.createElement('button');
            colorBtn.type = 'button';
            colorBtn.className = 'color-btn';
            colorBtn.style.background = colorActual ? estado.mapaColores[colorActual] : colorFondo;
            colorBtn.style.border = '2px solid #888';
            colorBtn.style.borderRadius = '50%';
            colorBtn.style.width = '22px';
            colorBtn.style.height = '22px';
            colorBtn.style.position = 'absolute';
            colorBtn.style.bottom = '8px';
            colorBtn.style.left = '50%';
            colorBtn.style.transform = 'translateX(-50%)';
            colorBtn.style.cursor = 'pointer';
            colorBtn.title = 'Cambiar color';
            colorBtn.tabIndex = 0;

            // <select> invisible, de 1px y centrado
            const selector = document.createElement('select');
            selector.innerHTML = `
                <option value="">-</option>
                <option value="blanco" ${colorActual === 'blanco' ? 'selected' : ''}>Blanco</option>
                <option value="verde" ${colorActual === 'verde' ? 'selected' : ''}>Verde</option>
                <option value="azul" ${colorActual === 'azul' ? 'selected' : ''}>Azul</option>
                <option value="morado" ${colorActual === 'morado' ? 'selected' : ''}>Morado</option>
                <option value="dorado" ${colorActual === 'dorado' ? 'selected' : ''}>Dorado</option>
            `;
            selector.style.opacity = '0';
            selector.style.position = 'absolute';
            selector.style.top = '50%';
            selector.style.left = '50%';
            selector.style.width = '1px';
            selector.style.height = '1px';
            selector.style.transform = 'translate(-50%, -50%)';
            selector.style.zIndex = '10';
            selector.style.display = 'block';
            selector.dataset.materialKey = claveAlmacen; // Refuerza unicidad

            // Al hacer clic en el botón, abrir el <select>
            colorBtn.onclick = () => {
                if (typeof selector.showPicker === 'function') {
                    selector.showPicker();
                } else {
                    selector.focus();
                    const event = new MouseEvent('mousedown', { bubbles: true });
                    selector.dispatchEvent(event);
                }
            };

            selector.addEventListener('change', (e) => {
                e.stopPropagation();
                // Solo afecta a su propio material
                const key = e.target.dataset.materialKey;
                if (key && key === claveAlmacen) {
                    previsualizarUso(estado, key, e.target.value, selectorMaterial);
                    // Actualizar color del botón
                    colorBtn.style.background = e.target.value ? estado.mapaColores[e.target.value] : colorFondo;
                }
            });

            selectorMaterial.appendChild(colorBtn);
            selectorMaterial.appendChild(selector);
        }

        contenedor.appendChild(selectorMaterial);
    } catch (error) {
        console.error('Error creando selector de material:', error);
    }
}

function previsualizarUso(estado, claveAlmacen, colorObjetivo, selectorMaterial) {
    try {
        // DEPURACIÓN: Mostrar en consola la clave y el color seleccionado
        console.log('[DEBUG cambio color material]', { claveAlmacen, colorObjetivo });
        // MANEJO DE SELECTOR VACÍO: REINICIO VISUAL
        if (!colorObjetivo) {
            selectorMaterial.style.backgroundColor = estado.colorNoSeleccionado;
            delete estado.colorPorMaterialSeleccionado[claveAlmacen];
            return;
        }

        // Simplificar: siempre permitir el cambio de color
        if (estado.mapaColores[colorObjetivo]) {
            selectorMaterial.style.backgroundColor = estado.mapaColores[colorObjetivo];
            estado.colorPorMaterialSeleccionado[claveAlmacen] = colorObjetivo;
        } else {
            selectorMaterial.style.backgroundColor = estado.colorNoSeleccionado;
            const selector = selectorMaterial.querySelector('select');
            if (selector) selector.value = '';
            delete estado.colorPorMaterialSeleccionado[claveAlmacen];
        }
    } catch (error) {
        console.error('Error en previsualización de uso:', error);
        modales.mostrarMensaje('Error', 'Error al simular el uso de materiales', 'error');
    }
}

// Función para aplicar restricciones específicas para las clases especiales
function aplicarRestriccionesClase(estado) {
    const levelSelect = document.getElementById('level-select');
    const colorSelect = document.getElementById('color-select');
    const baseSelector = document.querySelector('.base-selector');

    // Clases que solo permiten nivel 5
    const clasesNivel5 = ["Planewalker", "Lord", "Noble Lord"];
    const clasesColoresLimitados = ["Campeón", "Planewalker", "Lord", "Noble Lord"];
    const coloresPermitidosLimitados = ["azul", "morado", "dorado"];
    const coloresPermitidosNormal = ["blanco", "verde", "azul", "morado", "dorado"];

    if (estado.claseActual === "Campeón") {
        // Fijar nivel a 4
        if (levelSelect) {
            levelSelect.value = "4";
            estado.nivelActual = "4";
            Array.from(levelSelect.options).forEach(option => {
                option.disabled = option.value !== "4";
            });
        }
        // Mostrar solo azul, morado y dorado
        if (colorSelect) {
            Array.from(colorSelect.options).forEach(option => {
                if (!coloresPermitidosLimitados.includes(option.value)) {
                    option.style.display = 'none';
                } else {
                    option.style.display = 'block';
                }
            });
            if (!coloresPermitidosLimitados.includes(estado.colorActual)) {
                estado.colorActual = "dorado";
                colorSelect.value = "dorado";
            }
        }
        // Actualizar el selector base para mostrar el equipo normal de nivel 4
        if (baseSelector) {
            const title = baseSelector.querySelector('.base-title');
            if (title) {
                const nombreEquipo = estado.equipoActual || 'Equipo';
                title.textContent = `${nombreEquipo} normal de nivel 4`;
            }
            let equipoImg = baseSelector.querySelector('.base-equipo-img');
            if (!equipoImg) {
                const dynamicContainer = baseSelector.querySelector('.base-dynamic-content');
                if (dynamicContainer) {
                    equipoImg = document.createElement('img');
                    equipoImg.className = 'base-equipo-img';
                    equipoImg.src = `images/${estado.equipoActual.toLowerCase()}.png`;
                    equipoImg.alt = estado.equipoActual;
                    equipoImg.style.marginBottom = '10px';
                    equipoImg.onerror = () => {
                        equipoImg.style.display = 'none';
                    };
                    dynamicContainer.insertBefore(equipoImg, dynamicContainer.firstChild);
                }
            } else {
                equipoImg.style.display = 'block';
            }
        }
    } else if (clasesNivel5.includes(estado.claseActual)) {
        // Fijar nivel a 5
        if (levelSelect) {
            levelSelect.value = "5";
            estado.nivelActual = "5";
            Array.from(levelSelect.options).forEach(option => {
                option.disabled = option.value !== "5";
            });
        }
        // Mostrar solo azul, morado y dorado
        if (colorSelect) {
            Array.from(colorSelect.options).forEach(option => {
                if (!coloresPermitidosLimitados.includes(option.value)) {
                    option.style.display = 'none';
                } else {
                    option.style.display = 'block';
                }
            });
            if (!coloresPermitidosLimitados.includes(estado.colorActual)) {
                estado.colorActual = "dorado";
                colorSelect.value = "dorado";
            }
        }
        // Actualizar el selector base para mostrar la imagen y el texto correspondiente
        if (baseSelector) {
            const title = baseSelector.querySelector('.base-title');
            let texto = '';
            const nombreEquipo = estado.equipoActual || 'Equipo';
            if (estado.claseActual === "Planewalker") {
                texto = `${nombreEquipo} normal de nivel 5`;
            } else if (estado.claseActual === "Lord") {
                texto = "Equipo de nivel 5 o menor";
            } else if (estado.claseActual === "Noble Lord") {
                texto = `${nombreEquipo} Lord de nivel 5`;
            }
            if (title) {
                title.textContent = texto;
            }
            let equipoImg = baseSelector.querySelector('.base-equipo-img');
            if (estado.claseActual === "Lord") {
                if (equipoImg) equipoImg.style.display = 'none';
            } else {
                if (!equipoImg) {
                    const dynamicContainer = baseSelector.querySelector('.base-dynamic-content');
                    if (dynamicContainer) {
                        equipoImg = document.createElement('img');
                        equipoImg.className = 'base-equipo-img';
                        equipoImg.src = `images/${estado.equipoActual.toLowerCase()}.png`;
                        equipoImg.alt = estado.equipoActual;
                        equipoImg.style.marginBottom = '10px';
                        equipoImg.onerror = () => {
                            equipoImg.style.display = 'none';
                        };
                        dynamicContainer.insertBefore(equipoImg, dynamicContainer.firstChild);
                    }
                } else {
                    equipoImg.style.display = 'block';
                }
            }
        }
    } else {
        // Restaurar los controles si es clase Normal
        if (levelSelect) {
            Array.from(levelSelect.options).forEach(option => {
                option.disabled = false;
            });
        }
        if (colorSelect) {
            Array.from(colorSelect.options).forEach(option => {
                if (!coloresPermitidosNormal.includes(option.value)) {
                    option.style.display = 'none';
                } else {
                    option.style.display = 'block';
                }
            });
            if (!coloresPermitidosNormal.includes(estado.colorActual)) {
                estado.colorActual = "blanco";
                colorSelect.value = "blanco";
            }
        }
        if (baseSelector) {
            const title = baseSelector.querySelector('.base-title');
            if (title) {
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
            }
            const equipoImg = baseSelector.querySelector('.base-equipo-img');
            if (equipoImg) {
                equipoImg.remove();
            }
        }
    }
}

export function actualizarUI(estado) {
    try {
        // Aplicar restricciones para la clase especial
        aplicarRestriccionesClase(estado);

        actualizarImagenEquipo(estado);
        actualizarTabla(estado);
        actualizarSelectoresMaterialesInferiores(estado);
        actualizarEstadoBase(estado);

        const pestañaActiva = document.querySelector('.tab-button.active');
        const idPestaña = pestañaActiva ? pestañaActiva.dataset.tab : 'materials';
        const esLeyenda = idPestaña === 'conversionlegend';
        const esArte = idPestaña === 'arte';
        const esAyuda = idPestaña === 'ayuda';

        const topSection = document.querySelector('.top-section');
        if (topSection) topSection.style.display = (esLeyenda || esArte || esAyuda) ? 'none' : 'flex';

        const bottomSection = document.getElementById('bottom-section');
        if (bottomSection) bottomSection.style.display = (esLeyenda || esArte || esAyuda) ? 'none' : 'flex';

        const useButton = document.getElementById('use-materials');
        if (useButton) {
            // Ocultar en ARTE, Ayuda y en Leyenda de Conversión, mostrar en el resto
            if (esArte || esLeyenda || esAyuda) {
                useButton.style.display = 'none';
            } else {
                useButton.style.display = 'block';
            }
        }

        const galleryButton = document.getElementById('gallery-button');
        if (galleryButton) galleryButton.style.display = (esLeyenda || esAyuda) ? 'none' : 'flex';

        // Ocultar/mostrar iconos flotantes según la pestaña
        const floatingIconsContainer = document.getElementById('floating-icons-container');
        if (floatingIconsContainer) {
            const shouldHide = esLeyenda || esAyuda || 
                              document.getElementById('materials-modal')?.style.display === 'block' ||
                              document.getElementById('gallery-modal')?.style.display === 'block';
            if (shouldHide) {
                floatingIconsContainer.classList.add('hidden');
            } else {
                floatingIconsContainer.classList.remove('hidden');
            }
        }

        if (idPestaña === 'arte') {
            generarTablaArte();
        } else if (idPestaña !== 'materials' && idPestaña !== 'conversionlegend') {
            conversiones.actualizarTablaConversion(estado, idPestaña);
        }

        // Cuando se actualiza el color del equipo, también cambia el fondo de las tablas y selectores
        actualizarColorFondoApp(estado);
    } catch (error) {
        console.error('Error en actualización de UI:', error);
        modales.mostrarMensaje('Error', 'Se produjo un error al actualizar la interfaz', 'error');
    }
}

export function cambiarPestana(nombrePestana) {
    try {
        // Obtener la pestaña actualmente activa
        const pestañaActiva = document.querySelector('.tab-content.active');
        const botonActivo = document.querySelector('.tab-button.active');
        
        // Desactivar todas las pestañas
        const botonesPestaña = document.querySelectorAll('.tab-button');
        botonesPestaña.forEach(boton => boton.classList.remove('active'));
        
        const contenidosPestaña = document.querySelectorAll('.tab-content');
        contenidosPestaña.forEach(contenido => contenido.classList.remove('active'));

        // Activar la pestaña seleccionada
        const botonNuevo = document.querySelector(`[data-tab="${nombrePestana}"]`);
        if (botonNuevo) {
            botonNuevo.classList.add('active');
        }
        
        const contenidoNuevo = document.getElementById(`${nombrePestana}-tab`);
        if (contenidoNuevo) {
            // Agregar transición suave
            contenidoNuevo.style.opacity = '0';
            contenidoNuevo.style.transform = 'translateY(10px)';
            contenidoNuevo.classList.add('active');
            
            // Animar la entrada
            setTimeout(() => {
                contenidoNuevo.style.transition = 'all 0.6s ease';
                contenidoNuevo.style.opacity = '1';
                contenidoNuevo.style.transform = 'translateY(0)';
            }, 10);
        }

        // Actualizar la UI según la pestaña
        if (window.estadoApp) {
            actualizarUI(window.estadoApp);
        }
        
        // Ocultar/mostrar iconos flotantes según la pestaña
        const floatingIconsContainer = document.getElementById('floating-icons-container');
        if (floatingIconsContainer) {
            const shouldHide = nombrePestana === 'conversionlegend' || nombrePestana === 'ayuda';
            if (shouldHide) {
                floatingIconsContainer.classList.add('hidden');
            } else {
                floatingIconsContainer.classList.remove('hidden');
            }
        }

        // Cambiar la pestaña activa
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === nombrePestana);
        });
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.toggle('active', tab.id === `${nombrePestana}-tab`);
        });

        // Refrescar la UI si salimos de Leyenda o Ayuda
        if (nombrePestana !== 'conversionlegend' && nombrePestana !== 'ayuda') {
            if (window.estadoApp) {
                actualizarUI(window.estadoApp);
            }
        }
    } catch (error) {
        console.error('Error al cambiar pestaña:', error);
    }
}

export function actualizarTablaMateriales(estado) {
    actualizarTabla(estado);
}

// === CAMBIO DE FONDO SEGÚN COLOR DE EQUIPO ===
function pastelizarColor(hex, factor = 0.7) {
    // Si es un nombre de color, convertir a hex
    const coloresNombres = {
        'white': '#FFFFFF',
        'blanco': '#FFFFFF',
        'verde': '#B7FDC5',
        'azul': '#B2DAFA',
        'morado': '#E5A3F0',
        'dorado': '#FFD700'
    };
    if (hex in coloresNombres) hex = coloresNombres[hex];
    if (!hex.startsWith('#')) return hex;
    // Convertir a RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    // Mezclar con blanco
    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);
    return `rgb(${r},${g},${b})`;
}

function colorFondoPorSeleccion(color) {
    // Blanco: color arena con gris
    if (color === 'blanco' || color === 'white') {
        return '#e5e0d2'; // Arena con gris
    }
    // Dorado: pastel clásico
    if (color === 'dorado') {
        return pastelizarColor('#FFD700', 0.7);
    }
    // Azul: más fuerte
    if (color === 'azul') {
        return pastelizarColor('#B2DAFA', 0.3);
    }
    // Morado: más fuerte
    if (color === 'morado') {
        return pastelizarColor('#E5A3F0', 0.3);
    }
    // Verde: un poco más fuerte
    if (color === 'verde') {
        return pastelizarColor('#B7FDC5', 0.4);
    }
    // Por defecto, pastel clásico
    return pastelizarColor('#FFFFFF', 0.7);
}

// Modifica aplicarFondoPorColorEquipo para animar el h1
function aplicarFondoPorColorEquipo() {
    const colorSelect = document.getElementById('color-select');
    if (!colorSelect) return;
    document.body.style.transition = 'background 0.8s cubic-bezier(0.4,0,0.2,1), background-color 0.8s cubic-bezier(0.4,0,0.2,1)';
    const color = colorSelect.value;
    const pastel = colorFondoPorSeleccion(color);
    document.body.style.background = pastel;
    // Transición sincronizada del h1
    const titulo = document.querySelector('header h1');
    if (titulo) {
        titulo.style.transition = 'color 0.8s cubic-bezier(0.4,0,0.2,1), text-shadow 0.8s cubic-bezier(0.4,0,0.2,1)';
        // Ajustar contraste del título
        let r, g, b;
        if (pastel.startsWith('rgb')) {
            const match = pastel.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                r = parseInt(match[1]);
                g = parseInt(match[2]);
                b = parseInt(match[3]);
            }
        } else if (pastel.startsWith('#')) {
            r = parseInt(pastel.slice(1, 3), 16);
            g = parseInt(pastel.slice(3, 5), 16);
            b = parseInt(pastel.slice(5, 7), 16);
        } else {
            r = g = b = 128;
        }
        const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        if (luminosidad > 0.5) {
            titulo.style.color = '#2f2f2f';
            titulo.style.textShadow = '0 2px 4px rgba(255, 255, 255, 0.3)';
        } else {
            titulo.style.color = '#ffffff';
            titulo.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const colorSelect = document.getElementById('color-select');
    if (colorSelect) {
        colorSelect.addEventListener('change', aplicarFondoPorColorEquipo);
        
        // Aplicar contraste inicial del título
        const titulo = document.querySelector('header h1');
        if (titulo) {
            titulo.style.color = '#ffffff';
            titulo.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        }
        
        // Timer de 6 segundos para cambiar de gris ónix a blanco si no se ha seleccionado color
        setTimeout(() => {
            // Solo cambiar si el color actual es blanco (por defecto)
            if (colorSelect.value === 'blanco') {
                aplicarFondoPorColorEquipo();
            }
        }, 6000); // 6 segundos
        
        // No aplicar fondo inmediatamente, mantener gris ónix inicial
        // aplicarFondoPorColorEquipo(); // Comentado para mantener gris ónix inicial
    }
});

// Cuando se actualiza el color del equipo, también cambia el fondo de las tablas y selectores
export function actualizarColorFondoApp(estado) {
    const colorSelect = document.getElementById('color-select');
    let color = 'blanco';
    if (colorSelect) color = colorSelect.value;
    const pastel = colorFondoPorSeleccion(color);
    document.body.style.background = pastel;
    document.querySelectorAll('.bottom-section').forEach(el => {
        el.style.backgroundColor = pastel;
    });
    document.querySelectorAll('.materials-table').forEach(el => {
        el.style.backgroundColor = pastel;
    });
    // También el fondo de #materials-tab
    const materialsTab = document.getElementById('materials-tab');
    if (materialsTab) {
        materialsTab.style.backgroundColor = pastel;
        materialsTab.style.transition = 'background 0.8s ease-in-out, background-color 0.8s ease-in-out';
    }
    // Fondo para la pestaña activa
    const tabActiva = document.querySelector('.tab-content.active');
    if (tabActiva) {
        tabActiva.style.backgroundColor = pastel;
        tabActiva.style.transition = 'background 0.8s ease-in-out, background-color 0.8s ease-in-out';
    }
}

export function mostrarModalConsultaRapida(estado) {
    const resultado = consultaRapidaMateriales(estado);
    let html = '';
    if (resultado.error) {
        html = `<p style='color: #c00; font-weight: bold;'>${resultado.error}</p>`;
    } else {
        html = `<h2 style='color: #FFD600; text-align:center; font-size:2rem;'>⚡ Consulta rápida</h2>`;
        html += `<button id='editar-receta-btn' style='float:right;background:#FFD600;color:#333;font-weight:bold;border-radius:6px;padding:4px 10px;margin-bottom:8px;font-size:1rem;'>✏️ Editar receta</button>`;
        html += `<p style='font-size:1.2rem; text-align:center;'><strong>Puedes fabricar <span style="color:#FFD600; font-size:1.5rem;">${resultado.maxEquipos}</span> equipo(s) completos</strong> con los materiales actuales.</p>`;
        html += `<hr/><h3>Desglose de materiales:</h3><ul style='font-size:1rem;'>`;
        for (const mat in resultado.desglose) {
            const d = resultado.desglose[mat];
            html += `<li><strong>${mat}:</strong> usados: ${d.usados}, restantes: ${d.restantes} (`;
            html += Object.entries(d.porColor).map(([color, cant]) => `${cant} ${color}`).join(', ');
            html += ")</li>";
        }
        html += '</ul>';
    }
    // Usar el sistema de modales
    if (window.modales && window.modales.mostrarMensajeHTML) {
        window.modales.mostrarMensajeHTML('Consulta rápida', html, 'info');
        setTimeout(() => {
            const btn = document.getElementById('editar-receta-btn');
            if (btn) btn.onclick = () => mostrarModalEdicionReceta(estado);
        }, 200);
    } else if (window.modales && window.modales.mostrarMensaje) {
        window.modales.mostrarMensaje('Consulta rápida', html, 'info');
    } else {
        alert('Consulta rápida:\n' + (resultado.error || `Puedes fabricar ${resultado.maxEquipos} equipos completos.`));
    }
}

export function mostrarModalEdicionReceta(estado) {
    // Obtener receta guardada o valores actuales
    const receta = obtenerRecetaPersonalizada(
        estado.equipoActual,
        estado.claseActual,
        estado.nivelActual,
        estado.colorActual,
        estado.colorBaseSeleccionado || 'N/A'
    ) || {
        equipo: estado.equipoActual,
        clase: estado.claseActual,
        nivel: estado.nivelActual,
        color: estado.colorActual,
        base: estado.colorBaseSeleccionado || 'N/A',
        materiales: [1,1,1,1],
        tasaExito: 100
    };
    // Formulario HTML
    let html = `<h2 style='color:#FFD600;text-align:center;'>Editar Receta</h2>`;
    html += `<form id='form-receta'>`;
    html += `<div><label>Material 1: <input type='number' name='mat1' min='1' value='${receta.materiales[0]}' required></label></div>`;
    html += `<div><label>Material 2: <input type='number' name='mat2' min='1' value='${receta.materiales[1]}' required></label></div>`;
    html += `<div><label>Material 3: <input type='number' name='mat3' min='1' value='${receta.materiales[2]}' required></label></div>`;
    html += `<div><label>Material 4: <input type='number' name='mat4' min='1' value='${receta.materiales[3]}' required></label></div>`;
    html += `<div><label>Base: <input type='text' name='base' value='${receta.base}' required></label></div>`;
    html += `<div><label>Tasa de éxito (%): <input type='number' name='tasaExito' min='1' max='100' value='${receta.tasaExito}' required></label></div>`;
    html += `<div style='margin-top:10px;'><button type='submit' style='background:#FFD600;color:#333;font-weight:bold;'>Guardar receta</button></div>`;
    html += `</form>`;
    html += `<div id='resultado-receta'></div>`;
    // Mostrar modal
    if (window.modales && window.modales.mostrarMensajeHTML) {
        window.modales.mostrarMensajeHTML('Editar Receta', html, 'info');
    }
    // Event listener para guardar
    setTimeout(() => {
        const form = document.getElementById('form-receta');
        if (form) {
            form.onsubmit = function(e) {
                e.preventDefault();
                const nuevaReceta = {
                    equipo: estado.equipoActual,
                    clase: estado.claseActual,
                    nivel: estado.nivelActual,
                    color: estado.colorActual,
                    base: form.base.value,
                    materiales: [
                        parseInt(form.mat1.value),
                        parseInt(form.mat2.value),
                        parseInt(form.mat3.value),
                        parseInt(form.mat4.value)
                    ],
                    tasaExito: parseInt(form.tasaExito.value)
                };
                guardarRecetaPersonalizada(nuevaReceta);
                form.querySelector('button[type=submit]').textContent = '¡Guardado!';
                setTimeout(()=>{form.querySelector('button[type=submit]').textContent = 'Guardar receta';}, 1200);
            };
        }
    }, 200);
}

export function exportarRecetas() {
    const recetas = cargarRecetasPersonalizadas();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recetas, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'recetas_art_manager.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
}

export function importarRecetas() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const nuevas = JSON.parse(evt.target.result);
                const actuales = cargarRecetasPersonalizadas();
                let agregadas = 0;
                for (const clave in nuevas) {
                    if (!actuales[clave]) {
                        actuales[clave] = nuevas[clave];
                        agregadas++;
                    }
                }
                localStorage.setItem('recetasPersonalizadas', JSON.stringify(actuales));
                if (window.modales && window.modales.mostrarMensajeHTML) {
                    window.modales.mostrarMensajeHTML('Importar recetas', `<p style='color:green;'>¡Importación completada! Se agregaron <b>${agregadas}</b> recetas nuevas.</p>`, 'success');
                } else {
                    alert(`Importación completada. Se agregaron ${agregadas} recetas nuevas.`);
                }
                setTimeout(mostrarGestorRecetas, 1000);
            } catch {
                if (window.modales && window.modales.mostrarMensajeHTML) {
                    window.modales.mostrarMensajeHTML('Importar recetas', `<p style='color:red;'>El archivo no es válido.</p>`, 'error');
                } else {
                    alert('El archivo no es válido.');
                }
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

export function mostrarGestorRecetas() {
    var modal = document.getElementById('gestor-recetas-modal');
    var contenido = document.getElementById('contenido-gestor-recetas');
    if (!modal || !contenido) return alert('No se encontró el modal de recetas');

    // Botones de exportar/importar
    let html = `<h2 style='color:#FFD600;text-align:center;'>Gestor de Recetas</h2>`;
    html += `<div style='text-align:center;margin-bottom:10px;'>
        <button id='exportar-recetas-btn' style='background:#FFD600;color:#333;font-weight:bold;border-radius:6px;padding:4px 10px;margin-right:8px;font-size:1rem;'>📤 Exportar</button>
        <button id='importar-recetas-btn' style='background:#FFD600;color:#333;font-weight:bold;border-radius:6px;padding:4px 10px;font-size:1rem;'>📥 Importar</button>
    </div>`;

    // Listado de recetas
    const recetas = cargarRecetasPersonalizadas();
    const claves = Object.keys(recetas);
    if (claves.length === 0) {
        html += `<p style='text-align:center;'>No hay recetas guardadas aún.</p>`;
    } else {
        html += `<table style='width:100%;font-size:1rem;margin-top:10px;'><thead><tr><th>Equipo</th><th>Clase</th><th>Nivel</th><th>Color</th><th>Base</th><th>Materiales</th><th>Éxito (%)</th><th>Acciones</th></tr></thead><tbody>`;
        for (const clave of claves) {
            const r = recetas[clave];
            html += `<tr>`;
            html += `<td>${r.equipo}</td>`;
            html += `<td>${r.clase}</td>`;
            html += `<td>${r.nivel}</td>`;
            html += `<td>${r.color}</td>`;
            html += `<td>${r.base}</td>`;
            html += `<td>${r.materiales.join(', ')}</td>`;
            html += `<td>${r.tasaExito || 100}</td>`;
            html += `<td><button class='editar-receta-lista' data-clave='${clave}' style='font-size:1.1rem;background:#FFD600;color:#333;border-radius:5px;padding:2px 8px;margin-right:4px;'>✏️</button>`;
            html += `<button class='eliminar-receta-lista' data-clave='${clave}' style='font-size:1.1rem;background:#f44336;color:#fff;border-radius:5px;padding:2px 8px;'>🗑️</button></td>`;
            html += `</tr>`;
        }
        html += `</tbody></table>`;
    }
    contenido.innerHTML = html;
    modal.style.display = 'flex';
    document.getElementById('cerrar-gestor-recetas').onclick = function() {
        modal.style.display = 'none';
    };

    // Botones exportar/importar
    document.getElementById('exportar-recetas-btn').onclick = function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recetas, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', 'recetas_art_manager.json');
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        document.body.removeChild(dlAnchor);
    };
    document.getElementById('importar-recetas-btn').onclick = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const nuevas = JSON.parse(evt.target.result);
                    const actuales = cargarRecetasPersonalizadas();
                    let agregadas = 0;
                    for (const clave in nuevas) {
                        if (!actuales[clave]) {
                            actuales[clave] = nuevas[clave];
                            agregadas++;
                        }
                    }
                    localStorage.setItem('recetasPersonalizadas', JSON.stringify(actuales));
                    alert(`Importación completada. Se agregaron ${agregadas} recetas nuevas.`);
                    window.mostrarGestorRecetas();
                } catch {
                    alert('El archivo no es válido.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // Editar receta
    document.querySelectorAll('.editar-receta-lista').forEach(btn => {
        btn.onclick = function() {
            const clave = btn.getAttribute('data-clave');
            const [equipo, clase, nivel, color, base] = clave.split('|');
            const receta = obtenerRecetaPersonalizada(equipo, clase, nivel, color, base);
            if (!receta) return alert('No se encontró la receta');
            // Mostrar formulario de edición
            contenido.innerHTML = `<h2 style='color:#FFD600;text-align:center;'>Editar Receta</h2>` +
                `<form id='form-receta'>` +
                `<div><label>Material 1: <input type='number' name='mat1' min='1' value='${receta.materiales[0]}' required></label></div>` +
                `<div><label>Material 2: <input type='number' name='mat2' min='1' value='${receta.materiales[1]}' required></label></div>` +
                `<div><label>Material 3: <input type='number' name='mat3' min='1' value='${receta.materiales[2]}' required></label></div>` +
                `<div><label>Material 4: <input type='number' name='mat4' min='1' value='${receta.materiales[3]}' required></label></div>` +
                `<div><label>Base: <input type='text' name='base' value='${receta.base}' required></label></div>` +
                `<div><label>Tasa de éxito (%): <input type='number' name='tasaExito' min='1' max='100' value='${receta.tasaExito}' required></label></div>` +
                `<div style='margin-top:10px;'><button type='submit' style='background:#FFD600;color:#333;font-weight:bold;'>Guardar receta</button></div>` +
                `</form>` +
                `<div style='margin-top:10px;'><button id='volver-gestor-recetas' style='background:#2196F3;color:#fff;font-weight:bold;border-radius:6px;padding:4px 10px;'>← Volver</button></div>`;
            document.getElementById('volver-gestor-recetas').onclick = window.mostrarGestorRecetas;
            document.getElementById('form-receta').onsubmit = function(e) {
                e.preventDefault();
                const nuevaReceta = {
                    equipo, clase, nivel, color,
                    base: this.base.value,
                    materiales: [
                        parseInt(this.mat1.value),
                        parseInt(this.mat2.value),
                        parseInt(this.mat3.value),
                        parseInt(this.mat4.value)
                    ],
                    tasaExito: parseInt(this.tasaExito.value)
                };
                guardarRecetaPersonalizada(nuevaReceta);
                alert('Receta guardada');
                window.mostrarGestorRecetas();
            };
        };
    });
    // Eliminar receta
    document.querySelectorAll('.eliminar-receta-lista').forEach(btn => {
        btn.onclick = function() {
            const clave = btn.getAttribute('data-clave');
            const [equipo, clase, nivel, color, base] = clave.split('|');
            if (confirm('¿Seguro que deseas eliminar esta receta?')) {
                eliminarRecetaPersonalizada(equipo, clase, nivel, color, base);
                window.mostrarGestorRecetas();
            }
        };
    });
}

// Conectar el botón 📖 al gestor de recetas de forma robusta
function conectarBotonGestorRecetas() {
    const btn = document.getElementById('gestor-recetas-btn');
    if (btn) btn.onclick = mostrarGestorRecetas;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', conectarBotonGestorRecetas);
} else {
    conectarBotonGestorRecetas();
}

// Asignar evento al botón 📖 aunque el DOM cambie dinámicamente
function asignarEventoGestorRecetas() {
    const btn = document.getElementById('gestor-recetas-btn');
    if (btn && !btn._eventoAsignado) {
        btn.onclick = mostrarGestorRecetas;
        btn._eventoAsignado = true;
    }
}

// Intentar asignar al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', asignarEventoGestorRecetas);
} else {
    asignarEventoGestorRecetas();
}

// Observer para cambios en el DOM
const observer = new MutationObserver(() => {
    asignarEventoGestorRecetas();
});
observer.observe(document.body, { childList: true, subtree: true });

// Modal gestor de recetas básico
window.mostrarGestorRecetas = function() {
    var modal = document.getElementById('gestor-recetas-modal');
    var contenido = document.getElementById('contenido-gestor-recetas');
    if (!modal || !contenido) return alert('No se encontró el modal de recetas');

    // Botones de exportar/importar
    let html = `<h2 style='color:#FFD600;text-align:center;'>Gestor de Recetas</h2>`;
    html += `<div style='text-align:center;margin-bottom:10px;'>
        <button id='exportar-recetas-btn' style='background:#FFD600;color:#333;font-weight:bold;border-radius:6px;padding:4px 10px;margin-right:8px;font-size:1rem;'>📤 Exportar</button>
        <button id='importar-recetas-btn' style='background:#FFD600;color:#333;font-weight:bold;border-radius:6px;padding:4px 10px;font-size:1rem;'>📥 Importar</button>
    </div>`;

    // Listado de recetas
    const recetas = cargarRecetasPersonalizadas();
    const claves = Object.keys(recetas);
    if (claves.length === 0) {
        html += `<p style='text-align:center;'>No hay recetas guardadas aún.</p>`;
    } else {
        html += `<table style='width:100%;font-size:1rem;margin-top:10px;'><thead><tr><th>Equipo</th><th>Clase</th><th>Nivel</th><th>Color</th><th>Base</th><th>Materiales</th><th>Éxito (%)</th><th>Acciones</th></tr></thead><tbody>`;
        for (const clave of claves) {
            const r = recetas[clave];
            html += `<tr>`;
            html += `<td>${r.equipo}</td>`;
            html += `<td>${r.clase}</td>`;
            html += `<td>${r.nivel}</td>`;
            html += `<td>${r.color}</td>`;
            html += `<td>${r.base}</td>`;
            html += `<td>${r.materiales.join(', ')}</td>`;
            html += `<td>${r.tasaExito || 100}</td>`;
            html += `<td><button class='editar-receta-lista' data-clave='${clave}' style='font-size:1.1rem;background:#FFD600;color:#333;border-radius:5px;padding:2px 8px;margin-right:4px;'>✏️</button>`;
            html += `<button class='eliminar-receta-lista' data-clave='${clave}' style='font-size:1.1rem;background:#f44336;color:#fff;border-radius:5px;padding:2px 8px;'>🗑️</button></td>`;
            html += `</tr>`;
        }
        html += `</tbody></table>`;
    }
    contenido.innerHTML = html;
    modal.style.display = 'flex';
    document.getElementById('cerrar-gestor-recetas').onclick = function() {
        modal.style.display = 'none';
    };

    // Botones exportar/importar
    document.getElementById('exportar-recetas-btn').onclick = function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recetas, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', 'recetas_art_manager.json');
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        document.body.removeChild(dlAnchor);
    };
    document.getElementById('importar-recetas-btn').onclick = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const nuevas = JSON.parse(evt.target.result);
                    const actuales = cargarRecetasPersonalizadas();
                    let agregadas = 0;
                    for (const clave in nuevas) {
                        if (!actuales[clave]) {
                            actuales[clave] = nuevas[clave];
                            agregadas++;
                        }
                    }
                    localStorage.setItem('recetasPersonalizadas', JSON.stringify(actuales));
                    alert(`Importación completada. Se agregaron ${agregadas} recetas nuevas.`);
                    window.mostrarGestorRecetas();
                } catch {
                    alert('El archivo no es válido.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // Editar receta
    document.querySelectorAll('.editar-receta-lista').forEach(btn => {
        btn.onclick = function() {
            const clave = btn.getAttribute('data-clave');
            const [equipo, clase, nivel, color, base] = clave.split('|');
            const receta = obtenerRecetaPersonalizada(equipo, clase, nivel, color, base);
            if (!receta) return alert('No se encontró la receta');
            // Mostrar formulario de edición
            contenido.innerHTML = `<h2 style='color:#FFD600;text-align:center;'>Editar Receta</h2>` +
                `<form id='form-receta'>` +
                `<div><label>Material 1: <input type='number' name='mat1' min='1' value='${receta.materiales[0]}' required></label></div>` +
                `<div><label>Material 2: <input type='number' name='mat2' min='1' value='${receta.materiales[1]}' required></label></div>` +
                `<div><label>Material 3: <input type='number' name='mat3' min='1' value='${receta.materiales[2]}' required></label></div>` +
                `<div><label>Material 4: <input type='number' name='mat4' min='1' value='${receta.materiales[3]}' required></label></div>` +
                `<div><label>Base: <input type='text' name='base' value='${receta.base}' required></label></div>` +
                `<div><label>Tasa de éxito (%): <input type='number' name='tasaExito' min='1' max='100' value='${receta.tasaExito}' required></label></div>` +
                `<div style='margin-top:10px;'><button type='submit' style='background:#FFD600;color:#333;font-weight:bold;'>Guardar receta</button></div>` +
                `</form>` +
                `<div style='margin-top:10px;'><button id='volver-gestor-recetas' style='background:#2196F3;color:#fff;font-weight:bold;border-radius:6px;padding:4px 10px;'>← Volver</button></div>`;
            document.getElementById('volver-gestor-recetas').onclick = window.mostrarGestorRecetas;
            document.getElementById('form-receta').onsubmit = function(e) {
                e.preventDefault();
                const nuevaReceta = {
                    equipo, clase, nivel, color,
                    base: this.base.value,
                    materiales: [
                        parseInt(this.mat1.value),
                        parseInt(this.mat2.value),
                        parseInt(this.mat3.value),
                        parseInt(this.mat4.value)
                    ],
                    tasaExito: parseInt(this.tasaExito.value)
                };
                guardarRecetaPersonalizada(nuevaReceta);
                alert('Receta guardada');
                window.mostrarGestorRecetas();
            };
        };
    });
    // Eliminar receta
    document.querySelectorAll('.eliminar-receta-lista').forEach(btn => {
        btn.onclick = function() {
            const clave = btn.getAttribute('data-clave');
            const [equipo, clase, nivel, color, base] = clave.split('|');
            if (confirm('¿Seguro que deseas eliminar esta receta?')) {
                eliminarRecetaPersonalizada(equipo, clase, nivel, color, base);
                window.mostrarGestorRecetas();
            }
        };
    });
};