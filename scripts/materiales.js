// scripts/materiales.js
import * as datos from './datos.js';
import * as modales from './modales.js';
import { agregarEquipoSimulado } from './arte.js';
import { reiniciarSelectorBase } from './baselogic.js';

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

            // Agregar a la lista de equipos simulados
            const equipoSimulado = {
                equipo: estado.equipoActual,
                clase: clase,
                nivel: estado.nivelActual,
                color: estado.colorActual,
                material1: materialsInView[0],
                material1Color: estado.colorPorMaterialSeleccionado[`${claseAlmacen}:${materialsInView[0]}`] || estado.colorActual || 'N/A',
                material2: materialsInView[1],
                material2Color: estado.colorPorMaterialSeleccionado[`${claseAlmacen}:${materialsInView[1]}`] || estado.colorActual || 'N/A',
                material3: material3Disponible(estado.nivelActual) ? materialsInView[2] : "N/A",
                material3Color: material3Disponible(estado.nivelActual) ? 
                    (estado.colorPorMaterialSeleccionado[`${claseAlmacen}:${materialsInView[2]}`] || estado.colorActual || 'N/A') : 'N/A',
                material4: material4Disponible(estado.nivelActual) ? materialsInView[3] : "N/A",
                material4Color: material4Disponible(estado.nivelActual) ? 
                    (estado.colorPorMaterialSeleccionado[`${claseAlmacen}:${materialsInView[3]}`] || estado.colorActual || 'N/A') : 'N/A',
                base: estado.colorBaseSeleccionado || 'N/A'
            };
            console.log('Equipo simulado a guardar:', equipoSimulado);
            agregarEquipoSimulado(equipoSimulado);

            // REINICIAR SELECTORES DE MATERIALES Y BASE
            // Eliminar todas las selecciones de color para los materiales actuales
            materialsInView.forEach(mat => {
                const storageKey = `${claseAlmacen}:${mat}`;
                delete estado.colorPorMaterialSeleccionado[storageKey];
            });
            
            // Reiniciar selector base
            reiniciarSelectorBase(estado);

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
        
        // Usar la nueva función con transición
        modales.abrirModalConTransicion('materials-modal');
    } catch (error) {
        console.error('Error en abrirListaMateriales:', error);
        modales.mostrarMensaje('Error', 'Error al abrir la lista de materiales', 'error');
    }
}

/**
 * Calcula el máximo de equipos completos que se pueden fabricar con los materiales actuales,
 * considerando conversiones automáticas (4 blancos = 1 verde, etc.) para el equipo seleccionado.
 * Devuelve un objeto: { maxEquipos, desglose: {material: {usados, restantes, porColor}} }
 */
export function consultaRapidaMateriales(estado) {
    // Obtener la receta del equipo seleccionado
    const clase = estado.claseActual;
    const equipo = estado.equipoActual;
    const nivel = estado.nivelActual;
    // Determinar la clase de almacenamiento
    const claseAlmacen =
        (clase === "Campeón" || clase === "Planewalker") ? "Campeón y Planewalker" :
        (clase === "Lord" || clase === "Noble Lord") ? "Lord y Noble Lord" :
        clase;
    let materiales = [];
    if (claseAlmacen === "Lord y Noble Lord") {
        if (estado.materialesData[claseAlmacen]?.common) {
            materiales = estado.materialesData[claseAlmacen].common;
        }
    } else {
        if (estado.materialesData[claseAlmacen]?.[equipo]) {
            materiales = estado.materialesData[claseAlmacen][equipo];
        }
    }
    if (!materiales || materiales.length < 4) {
        return { maxEquipos: 0, desglose: {}, error: 'No hay suficientes materiales para este equipo.' };
    }
    // Para cada material, obtener el storageKey
    const storageKeys = materiales.map(mat => `${claseAlmacen}:${mat}`);
    // Cantidades requeridas por material (por defecto 1 de cada uno, pero se puede adaptar si la receta cambia)
    const requeridos = [1, 1, 1, 1];
    // Colores en orden de mayor a menor
    const colores = ['dorado', 'morado', 'azul', 'verde', 'blanco'];
    // Equivalencias: cuántos de cada color hacen uno del superior
    const equivalencias = { blanco: 4, verde: 4, azul: 4, morado: 4 };
    // Paso 1: obtener el stock total de cada material, convertido a "unidades equivalentes de blanco"
    function aBlancos(cant, color) {
        switch (color) {
            case 'dorado': return cant * 256;
            case 'morado': return cant * 64;
            case 'azul': return cant * 16;
            case 'verde': return cant * 4;
            case 'blanco': return cant;
            default: return 0;
        }
    }
    // Paso 2: para cada material, calcular el total en blancos
    const stockBlancos = storageKeys.map((key) => {
        let total = 0;
        for (const color of colores) {
            const cant = parseInt(estado.almacenMateriales[key]?.[color] || '0');
            total += aBlancos(cant, color);
        }
        return total;
    });
    // Paso 3: ¿cuántos equipos completos se pueden hacer?
    // Para cada material, se necesita 1 dorado (256 blancos) para un equipo completo
    // El máximo de equipos es el mínimo entre los materiales
    const maxPorMaterial = stockBlancos.map(total => Math.floor(total / 256));
    const maxEquipos = Math.max(0, Math.min(...maxPorMaterial));
    // Paso 4: calcular desglose de usados/restantes
    const desglose = {};
    for (let i = 0; i < materiales.length; i++) {
        const usados = maxEquipos * 256;
        const restantes = stockBlancos[i] - usados;
        // Convertir los restantes a cada color
        let resto = restantes;
        const porColor = {};
        for (const color of colores) {
            let factor = 1;
            switch (color) {
                case 'dorado': factor = 256; break;
                case 'morado': factor = 64; break;
                case 'azul': factor = 16; break;
                case 'verde': factor = 4; break;
                case 'blanco': factor = 1; break;
            }
            porColor[color] = Math.floor(resto / factor);
            resto = resto % factor;
        }
        desglose[materiales[i]] = {
            usados: usados,
            restantes: restantes,
            porColor: porColor
        };
    }
    return { maxEquipos, desglose };
}

// === GESTOR DE RECETAS PERSONALIZADAS ===
const RECETAS_KEY = 'recetasPersonalizadas';
let recetasMemoriaFallback = {};
let usandoFallback = false;

function mostrarAvisoFallback() {
    if (!usandoFallback) {
        usandoFallback = true;
        if (window.modales && typeof window.modales.mostrarMensajeHTML === 'function') {
            window.modales.mostrarMensajeHTML('Aviso', `<p style='color:orange;'>No se puede acceder a localStorage. Las recetas solo se guardarán temporalmente mientras la app esté abierta.</p>`, 'warning');
        } else {
            alert('No se puede acceder a localStorage. Las recetas solo se guardarán temporalmente mientras la app esté abierta.');
        }
    }
}

export function guardarRecetaPersonalizada(receta) {
    try {
        const recetas = cargarRecetasPersonalizadas();
        const clave = `${receta.equipo}|${receta.clase}|${receta.nivel}|${receta.color}|${receta.base}`;
        recetas[clave] = receta;
        if (!usandoFallback) {
            localStorage.setItem(RECETAS_KEY, JSON.stringify(recetas));
        } else {
            recetasMemoriaFallback = recetas;
        }
    } catch (error) {
        mostrarAvisoFallback();
        if (window.modales && typeof window.modales.mostrarMensajeHTML === 'function') {
            window.modales.mostrarMensajeHTML('Error al guardar receta', `<p style='color:red;'>${error.message || error}</p>`, 'error', '0051');
        } else {
            alert('Error al guardar receta: ' + (error.message || error) + '\nCódigo de error: 0051');
        }
        recetasMemoriaFallback = recetasMemoriaFallback || {};
        const clave = `${receta.equipo}|${receta.clase}|${receta.nivel}|${receta.color}|${receta.base}`;
        recetasMemoriaFallback[clave] = receta;
    }
}

export function cargarRecetasPersonalizadas() {
    try {
        if (!usandoFallback) {
            const data = localStorage.getItem(RECETAS_KEY);
            return data ? JSON.parse(data) : {};
        } else {
            return recetasMemoriaFallback;
        }
    } catch (error) {
        mostrarAvisoFallback();
        // No mostrar error 0052 al usuario, solo operar en memoria
        return recetasMemoriaFallback;
    }
}

export function obtenerRecetaPersonalizada(equipo, clase, nivel, color, base) {
    try {
        const recetas = cargarRecetasPersonalizadas();
        const clave = `${equipo}|${clase}|${nivel}|${color}|${base}`;
        return recetas[clave] || null;
    } catch (error) {
        mostrarAvisoFallback();
        if (window.modales && typeof window.modales.mostrarMensajeHTML === 'function') {
            window.modales.mostrarMensajeHTML('Error al obtener receta', `<p style='color:red;'>${error.message || error}</p>`, 'error', '0053');
        } else {
            alert('Error al obtener receta: ' + (error.message || error) + '\nCódigo de error: 0053');
        }
        return recetasMemoriaFallback[`${equipo}|${clase}|${nivel}|${color}|${base}`] || null;
    }
}

export function eliminarRecetaPersonalizada(equipo, clase, nivel, color, base) {
    try {
        const recetas = cargarRecetasPersonalizadas();
        const clave = `${equipo}|${clase}|${nivel}|${color}|${base}`;
        if (recetas[clave]) {
            delete recetas[clave];
            if (!usandoFallback) {
                localStorage.setItem(RECETAS_KEY, JSON.stringify(recetas));
            } else {
                recetasMemoriaFallback = recetas;
            }
        }
    } catch (error) {
        mostrarAvisoFallback();
        if (window.modales && typeof window.modales.mostrarMensajeHTML === 'function') {
            window.modales.mostrarMensajeHTML('Error al eliminar receta', `<p style='color:red;'>${error.message || error}</p>`, 'error', '0054');
        } else {
            alert('Error al eliminar receta: ' + (error.message || error) + '\nCódigo de error: 0054');
        }
        const clave = `${equipo}|${clase}|${nivel}|${color}|${base}`;
        if (recetasMemoriaFallback[clave]) {
            delete recetasMemoriaFallback[clave];
        }
    }
}