// scripts/materiales.js
import * as modales from './modales.js';
import { agregarEquipoSimulado } from './arte.js';
import { reiniciarSelectorBase } from './baselogic.js'; // Importación añadida

export function construirMapaMaterialAEquipo(estado) {
    try {
        estado.mapaMaterialAEquipo = {};

        if (!estado.materialesData) {
            console.warn('Datos de materiales no disponibles');
            return;
        }

        for (const [clase, equiposData] of Object.entries(estado.materialesData)) {
            if (clase === "Lord y Noble Lord") {
                for (const mat of equiposData.common) {
                    const key = `${clase}:${mat}`;
                    estado.mapaMaterialAEquipo[key] = "common";
                }
            } else {
                for (const [equipo, materials] of Object.entries(equiposData)) {
                    for (const mat of materials) {
                        const key = `${clase}:${mat}`;
                        if (!estado.mapaMaterialAEquipo[key]) {
                            estado.mapaMaterialAEquipo[key] = equipo;
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error construyendo mapa material-equipo:', error);
        modales.mostrarMensaje('Error', 'Error al mapear materiales a equipos', 'error');
    }
}

export function inicializarAlmacenamientoMateriales(estado) {
    try {
        if (!estado.materialesData) {
            console.warn('Datos de materiales no disponibles para inicializar almacenamiento');
            return;
        }

        for (const clase in estado.materialesData) {
            const equiposIterar = (clase === "Lord y Noble Lord")
                ? ["common"]
                : Object.keys(estado.materialesData[clase]);

            for (const equipo of equiposIterar) {
                const materials = estado.materialesData[clase][equipo];
                for (const mat of materials) {
                    const storageKey = `${clase}:${mat}`;
                    if (!estado.almacenMateriales[storageKey]) {
                        estado.almacenMateriales[storageKey] = {
                            'dorado': '0',
                            'morado': '0',
                            'azul': '0',
                            'verde': '0',
                            'blanco': '0'
                        };
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error inicializando almacenamiento de materiales:', error);
        modales.mostrarMensaje('Error', 'Error al inicializar el almacenamiento de materiales', 'error');
    }
}

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

// Función para obtener el storage disponible (localStorage o sessionStorage como fallback)
function getAvailableStorage() {
    if (isLocalStorageAvailable()) {
        console.log('Usando localStorage');
        return localStorage;
    } else if (isSessionStorageAvailable()) {
        console.log('localStorage no disponible, usando sessionStorage como fallback');
        return sessionStorage;
    } else {
        console.error('Ningún storage disponible');
        return null;
    }
}

// Función para detectar si es un dispositivo móvil
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

export function cargarMaterialesDesdeLocalStorage(estado) {
    try {
        const storage = getAvailableStorage();
        if (!storage) {
            console.warn('Ningún storage disponible, usando valores por defecto');
            return;
        }

        // En móviles, intentar cargar desde localStorage primero, luego sessionStorage
        let materialesGuardados = null;
        if (isMobileDevice()) {
            console.log('Dispositivo móvil detectado, verificando ambos storages...');
            
            // Intentar localStorage primero
            if (isLocalStorageAvailable()) {
                materialesGuardados = localStorage.getItem('almacenMateriales');
                console.log('localStorage en móvil:', materialesGuardados ? 'datos encontrados' : 'sin datos');
            }
            
            // Si no hay datos en localStorage, intentar sessionStorage
            if (!materialesGuardados && isSessionStorageAvailable()) {
                materialesGuardados = sessionStorage.getItem('almacenMateriales');
                console.log('sessionStorage en móvil:', materialesGuardados ? 'datos encontrados' : 'sin datos');
            }
        } else {
            // En desktop, usar el storage disponible
            materialesGuardados = storage.getItem('almacenMateriales');
            console.log('Intentando cargar materiales desde storage:', materialesGuardados ? 'datos encontrados' : 'sin datos');
        }
        
        if (materialesGuardados) {
            const parsed = JSON.parse(materialesGuardados);
            if (parsed && typeof parsed === 'object') {
                estado.almacenMateriales = parsed;
                console.log('Materiales cargados exitosamente:', Object.keys(estado.almacenMateriales).length, 'materiales');
                estado.cambiosPendientes = false;
            } else {
                console.warn('Datos en storage no son válidos, usando valores por defecto');
            }
        } else {
            console.log('No se encontraron materiales guardados, usando valores por defecto');
        }
    } catch (e) {
        console.error('Error al cargar materiales desde storage:', e);
        if (localStorage.getItem('almacenMateriales') || sessionStorage.getItem('almacenMateriales')) {
            modales.mostrarMensaje('Error', 'Error al cargar materiales guardados. Se usarán valores por defecto.', 'warning');
        }
    }
}

export function guardarMaterialesEnLocalStorage(estado) {
    try {
        const storage = getAvailableStorage();
        if (!storage) {
            console.warn('Ningún storage disponible, no se pueden guardar los datos');
            return;
        }

        const datosParaGuardar = JSON.stringify(estado.almacenMateriales);
        
        // En móviles, guardar en ambos storages para mayor seguridad
        if (isMobileDevice()) {
            console.log('Dispositivo móvil detectado, guardando en ambos storages...');
            
            if (isLocalStorageAvailable()) {
                localStorage.setItem('almacenMateriales', datosParaGuardar);
                console.log('Datos guardados en localStorage (móvil)');
            }
            
            if (isSessionStorageAvailable()) {
                sessionStorage.setItem('almacenMateriales', datosParaGuardar);
                console.log('Datos guardados en sessionStorage (móvil)');
            }
        } else {
            // En desktop, usar el storage disponible
            storage.setItem('almacenMateriales', datosParaGuardar);
            console.log('Materiales guardados exitosamente:', Object.keys(estado.almacenMateriales).length, 'materiales');
        }
        
        estado.cambiosPendientes = false;
        
        // Verificar que se guardó correctamente
        const verificado = storage.getItem('almacenMateriales');
        if (verificado === datosParaGuardar) {
            console.log('Verificación de guardado exitosa');
        } else {
            console.warn('Verificación de guardado falló');
        }
    } catch (e) {
        console.error('Error al guardar materiales en storage:', e);
        modales.mostrarMensaje('Error', 'Error al guardar materiales. Los datos no se han perdido.', 'error');
    }
}

function material3Disponible(nivel) {
    return nivel !== "1";
}

function material4Disponible(nivel) {
    return parseInt(nivel) >= 3;
}

export function usarMateriales(estado) {
    try {
        let materialsInView = [];
        const clase = estado.claseActual;
        
        // Determinar la clase de almacenamiento basada en la clase actual
        const claseAlmacen = 
            (clase === "Campeón" || clase === "Planewalker") ? "Campeón y Planewalker" :
            (clase === "Lord" || clase === "Noble Lord") ? "Lord y Noble Lord" :
            clase;

        if (claseAlmacen === "Lord y Noble Lord") {
            if (estado.materialesData[claseAlmacen]?.common) {
                materialsInView = estado.materialesData[claseAlmacen].common;
            }
        } else {
            if (estado.materialesData[claseAlmacen]?.[estado.equipoActual]) {
                materialsInView = estado.materialesData[claseAlmacen][estado.equipoActual];
            }
        }

        if (!materialsInView || materialsInView.length < 4) {
            modales.mostrarMensaje("Error", "No se encontraron suficientes materiales para esta configuración", "error");
            return;
        }

        const faltantes = [];
        let cambiosAplicados = false;

        // Procesar cada material (solo los disponibles según nivel)
        for (let i = 0; i < materialsInView.length; i++) {
            const mat = materialsInView[i];
            const storageKey = `${claseAlmacen}:${mat}`;
            const colorObjetivo = estado.colorPorMaterialSeleccionado[storageKey];

            // Saltar materiales no disponibles por nivel
            if ((i === 2 && !material3Disponible(estado.nivelActual)) || 
                (i === 3 && !material4Disponible(estado.nivelActual))) {
                continue;
            }

            // Si no hay color seleccionado, saltar
            if (!colorObjetivo) {
                faltantes.push(`${mat} (no se seleccionó color)`);
                continue;
            }

            // Obtener cantidades actuales
            const originalCantidades = {};
            for (const c in estado.mapaColores) {
                originalCantidades[c] = parseInt(estado.almacenMateriales[storageKey]?.[c] || '0') || 0;
            }

            // Simular el uso
            if (!estado.simularUso) {
                modales.mostrarMensaje("Error", "Función de simulación no disponible", "error");
                return;
            }

            const resultado = estado.simularUso(originalCantidades, colorObjetivo);

            if (resultado.exito) {
                // Actualizar el almacén con los nuevos valores
                for (const c in resultado.stock) {
                    if (estado.almacenMateriales[storageKey]) {
                        estado.almacenMateriales[storageKey][c] = resultado.stock[c].toString();
                    }
                }
                cambiosAplicados = true;
            } else {
                faltantes.push(`${mat} (para ${colorObjetivo})`);
            }
        }

        // Manejar resultados
        if (faltantes.length > 0) {
            modales.mostrarMensaje("Materiales Insuficientes",
                `No se pudieron procesar:\n${faltantes.join('\n')}`, 'warning');
        }

        if (cambiosAplicados) {
            estado.cambiosPendientes = true;
            guardarMaterialesEnLocalStorage(estado);

            // Agregar a la lista de equipos simulados
            agregarEquipoSimulado({
                equipo: estado.equipoActual,
                clase: clase,
                nivel: estado.nivelActual,
                color: estado.colorActual,
                material1: materialsInView[0],
                material1Color: estado.colorPorMaterialSeleccionado[`${claseAlmacen}:${materialsInView[0]}`] || 'N/A',
                material2: materialsInView[1],
                material2Color: estado.colorPorMaterialSeleccionado[`${claseAlmacen}:${materialsInView[1]}`] || 'N/A',
                material3: material3Disponible(estado.nivelActual) ? materialsInView[2] : "N/A",
                material3Color: material3Disponible(estado.nivelActual) ? 
                    (estado.colorPorMaterialSeleccionado[`${claseAlmacen}:${materialsInView[2]}`] || 'N/A') : 'N/A',
                material4: material4Disponible(estado.nivelActual) ? materialsInView[3] : "N/A",
                material4Color: material4Disponible(estado.nivelActual) ? 
                    (estado.colorPorMaterialSeleccionado[`${claseAlmacen}:${materialsInView[3]}`] || 'N/A') : 'N/A',
                base: estado.colorBaseSeleccionado || 'N/A'
            });

            // REINICIAR SELECTORES DE MATERIALES Y BASE
            // Eliminar todas las selecciones de color para los materiales actuales
            materialsInView.forEach(mat => {
                const storageKey = `${claseAlmacen}:${mat}`;
                delete estado.colorPorMaterialSeleccionado[storageKey];
            });
            
            // Reiniciar selector base
            reiniciarSelectorBase(estado);

            // Forzar guardado inmediato
            if (window.guardarDatosCompletos) {
                window.guardarDatosCompletos();
            }

            modales.mostrarMensaje("Éxito", "Materiales procesados y equipo guardado en ARTE", 'success');
        } else if (faltantes.length === 0) {
            modales.mostrarMensaje("Sin cambios", "No se realizaron cambios en los materiales", 'info');
        }
    } catch (error) {
        console.error('Error en usarMateriales:', error);
        modales.mostrarMensaje('Error', 'Error al procesar materiales', 'error');
    }
}

export function abrirListaMateriales(estado) {
    try {
        const modal = document.getElementById('materials-modal');
        const tablaContenedor = document.getElementById('all-materials-table');
        if (!modal || !tablaContenedor) {
            modales.mostrarMensaje('Error', 'Elemento modal no encontrado', 'error');
            return;
        }
        
        tablaContenedor.innerHTML = '';
        
        const tableContainer = document.createElement('div');
        tableContainer.className = 'materials-table';
        
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Crear encabezados
        ['', 'Material', 'Dorado', 'Morado', 'Azul', 'Verde', 'Blanco'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        
        // Lista completa de 28 materiales
        const listaMateriales = [
            "Voluntad del emperador", 
            "Guardia del emperador", 
            "Alma del emperador", 
            "Aliento del emperador",
            "Quijada ácida", 
            "Oro talon",
            "Hoja de jade", 
            "Ámbar hierba", 
            "Carbonizado gnarl", 
            "Acero reforzado",
            "Pluma Stick", 
            "Extracto destilado", 
            "Razor diente de sierra", 
            "Piel de terciopelo", 
            "Crystal mystic", 
            "Tempest Stardust",
            "Maxilar", 
            "Garra", 
            "Hoja", 
            "Césped", 
            "Nudo", 
            "Acero", 
            "Pluma", 
            "Extraer",
            "Diente de sierra", 
            "Pelaje", 
            "Cristal", 
            "Stardust"
        ];

        // Crear filas para todos los materiales
        listaMateriales.forEach(material => {
            // Buscar la clave de almacenamiento para este material
            let claveEncontrada = null;
            for (const clave in estado.almacenMateriales) {
                if (clave.endsWith(`:${material}`)) {
                    claveEncontrada = clave;
                    break;
                }
            }

            // Si no se encuentra, crear una nueva entrada
            if (!claveEncontrada) {
                // Determinar la clase apropiada para este material
                let claseAsignada = "Normal";
                if (material.includes("emperador")) {
                    claseAsignada = "Lord y Noble Lord";
                } else if (material.includes("ácida") || material.includes("Stardust")) {
                    claseAsignada = "Campeón y Planewalker";
                }
                
                claveEncontrada = `${claseAsignada}:${material}`;
                
                if (!estado.almacenMateriales[claveEncontrada]) {
                    estado.almacenMateriales[claveEncontrada] = {
                        dorado: '0', morado: '0', azul: '0', verde: '0', blanco: '0'
                    };
                }
            }

            const fila = document.createElement('tr');
            
            // Celda de imagen
            const celdaImagen = document.createElement('td');
            const imagen = document.createElement('img');
            const nombreImagen = material.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            imagen.src = `images/${nombreImagen}.png`;
            imagen.className = 'material-img';
            imagen.onerror = () => {
                imagen.style.display = 'none';
                const span = document.createElement('span');
                span.textContent = material.substring(0, 3);
                span.className = 'material-initials';
                celdaImagen.appendChild(span);
            };
            celdaImagen.appendChild(imagen);
            fila.appendChild(celdaImagen);

            // Celda de nombre SOLO CON EL MATERIAL (sin clase)
            const celdaNombre = document.createElement('td');
            celdaNombre.textContent = material;
            fila.appendChild(celdaNombre);

            // Celdas de colores
            ['dorado', 'morado', 'azul', 'verde', 'blanco'].forEach(color => {
                const celda = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.value = estado.almacenMateriales[claveEncontrada]?.[color] || '0';
                input.className = 'color-input';
                input.setAttribute('data-color', color);

                input.addEventListener('change', (e) => {
                    const valor = e.target.value;
                    // Validar que sea número no negativo
                    if (/^\d+$/.test(valor)) {
                        if (!estado.almacenMateriales[claveEncontrada]) {
                            estado.almacenMateriales[claveEncontrada] = {
                                dorado: '0', morado: '0', azul: '0', verde: '0', blanco: '0'
                            };
                        }
                        estado.almacenMateriales[claveEncontrada][color] = valor;
                        estado.cambiosPendientes = true;
                        guardarMaterialesEnLocalStorage(estado);
                    } else {
                        e.target.value = estado.almacenMateriales[claveEncontrada][color] || '0';
                    }
                });
                
                celda.appendChild(input);
                fila.appendChild(celda);
            });

            tbody.appendChild(fila);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(table);
        tablaContenedor.appendChild(tableContainer);
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error en abrirListaMateriales:', error);
        modales.mostrarMensaje('Error', 'Error al abrir la lista de materiales', 'error');
    }
}