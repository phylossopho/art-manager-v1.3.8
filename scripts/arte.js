// scripts/arte.js - INICIO
import { mapaColores } from './datos.js';
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

let equiposSimulados = [];

// Inicializar equipos simulados al cargar el módulo
try {
    // En móviles, intentar cargar desde localStorage primero, luego sessionStorage
    let equiposGuardados = null;
    if (isMobileDevice()) {
        console.log('Dispositivo móvil detectado, verificando ambos storages para equipos...');
        
        if (isLocalStorageAvailable()) {
            equiposGuardados = localStorage.getItem('equiposSimulados');
            console.log('localStorage para equipos en móvil:', equiposGuardados ? 'datos encontrados' : 'sin datos');
        }
        
        if (!equiposGuardados && isSessionStorageAvailable()) {
            equiposGuardados = sessionStorage.getItem('equiposSimulados');
            console.log('sessionStorage para equipos en móvil:', equiposGuardados ? 'datos encontrados' : 'sin datos');
        }
    } else {
        if (isLocalStorageAvailable()) {
            equiposGuardados = localStorage.getItem('equiposSimulados');
        }
    }
    
    if (equiposGuardados) {
        const parsed = JSON.parse(equiposGuardados);
        if (Array.isArray(parsed)) {
            equiposSimulados = parsed;
            console.log('Equipos simulados cargados desde storage:', equiposSimulados.length, 'equipos');
        } else {
            console.warn('Datos de equipos simulados no son válidos, usando array vacío');
            equiposSimulados = [];
        }
    } else {
        console.log('No se encontraron equipos simulados en storage, usando array vacío');
        equiposSimulados = [];
    }
} catch (e) {
    console.error('Error al cargar equipos simulados desde storage:', e);
    equiposSimulados = [];
}

// Exponer globalmente para que backup.js pueda acceder
window.equiposSimulados = equiposSimulados;

export function agregarEquipoSimulado(equipo) {
    equiposSimulados.unshift(equipo); // Agregar al inicio
}

export function generarTablaArte() {
    const arteTable = document.getElementById('arte-table');
    if (!arteTable) return;

    arteTable.innerHTML = '';

    if (equiposSimulados.length === 0) {
        arteTable.innerHTML = '<p>No hay equipos simulados aún.</p>';
        return;
    }

    const table = document.createElement('table');

    // Encabezados con 10 columnas (agregamos Eliminar)
    const encabezados = [
        "Icono", "Tipo", "Clase", "Nivel",
        "Material 3", "Material 1", "Base",
        "Material 2", "Material 4", "Eliminar"
    ];
    const filaEncabezados = document.createElement('tr');

    encabezados.forEach(encabezado => {
        const th = document.createElement('th');
        th.textContent = encabezado;
        filaEncabezados.appendChild(th);
    });
    table.appendChild(filaEncabezados);

    // Función para crear celdas de material (movida fuera del forEach)
    const crearCeldaMaterial = (material, color) => {
        const celda = document.createElement('td');
        if (material && material !== 'N/A') {
            if (color && mapaColores[color]) {
                celda.style.backgroundColor = mapaColores[color];
            }
            
            // Verificar si el material es un color (no tiene imagen)
            const colores = ['blanco', 'verde', 'azul', 'morado', 'dorado'];
            if (colores.includes(material.toLowerCase())) {
                // Es un color, mostrar solo texto
                const span = document.createElement('span');
                span.textContent = material;
                span.style.fontWeight = 'bold';
                celda.appendChild(span);
            } else {
                // Es un material, intentar cargar imagen
                const img = document.createElement('img');
                const nombreImagen = material.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                img.src = `images/${nombreImagen}.png`;
                img.alt = material;
                img.style.width = '33px';
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = '0 auto';
                img.onerror = function() {
                    this.style.display = 'none';
                    const span = document.createElement('span');
                    span.textContent = material;
                    celda.appendChild(span);
                };
                celda.appendChild(img);
            }
        } else {
            celda.innerHTML = '&nbsp;';
        }
        return celda;
    };

    // Filas con datos - ORDEN INVERSO (más antiguo primero)
    [...equiposSimulados].reverse().forEach((equipo, idx) => {
        const fila = document.createElement('tr');
        // 1. Imagen del equipo con fondo de color
        const celdaEquipoImg = document.createElement('td');
        if (equipo.color && mapaColores[equipo.color]) {
            celdaEquipoImg.style.backgroundColor = mapaColores[equipo.color];
        }
        const imgEquipo = document.createElement('img');
        imgEquipo.src = `images/${equipo.equipo.toLowerCase()}.png`;
        imgEquipo.alt = equipo.equipo;
        imgEquipo.style.width = '33px';
        imgEquipo.style.height = 'auto';
        imgEquipo.style.display = 'block';
        imgEquipo.style.margin = '0 auto';
        imgEquipo.onerror = function() {
            this.style.display = 'none';
            const span = document.createElement('span');
            span.textContent = equipo.equipo;
            celdaEquipoImg.appendChild(span);
        };
        celdaEquipoImg.appendChild(imgEquipo);
        fila.appendChild(celdaEquipoImg);

        // 2. Tipo de equipo (texto)
        const celdaTipo = document.createElement('td');
        celdaTipo.textContent = equipo.equipo;
        fila.appendChild(celdaTipo);

        // 3. Clase
        const celdaClase = document.createElement('td');
        celdaClase.textContent = equipo.clase;
        fila.appendChild(celdaClase);

        // 4. Nivel
        const celdaNivel = document.createElement('td');
        celdaNivel.textContent = equipo.nivel;
        fila.appendChild(celdaNivel);

        // 5. Material 3
        fila.appendChild(crearCeldaMaterial(equipo.material3, equipo.material3Color));
        // 6. Material 1
        fila.appendChild(crearCeldaMaterial(equipo.material1, equipo.material1Color));
        // 7. Base
        const celdaBase = document.createElement('td');
        if (equipo.base && equipo.base !== 'N/A') {
            if (mapaColores[equipo.base]) {
                celdaBase.style.backgroundColor = mapaColores[equipo.base];
            }
            
            // Verificar si la base es un color (no tiene imagen)
            const colores = ['blanco', 'verde', 'azul', 'morado', 'dorado'];
            if (colores.includes(equipo.base.toLowerCase())) {
                // Es un color, mostrar solo texto
                celdaBase.textContent = equipo.base;
                celdaBase.style.fontWeight = 'bold';
            } else {
                // Es un material, intentar cargar imagen
                const nombreBase = equipo.base.toLowerCase();
                const imgBase = document.createElement('img');
                imgBase.src = `images/${nombreBase}.png`;
                imgBase.alt = equipo.base;
                imgBase.style.width = '33px';
                imgBase.style.height = 'auto';
                imgBase.style.display = 'block';
                imgBase.style.margin = '0 auto';
                imgBase.onerror = function() {
                    this.style.display = 'none';
                    celdaBase.textContent = equipo.base;
                };
                celdaBase.appendChild(imgBase);
            }
        } else {
            celdaBase.textContent = 'N/A';
        }
        fila.appendChild(celdaBase);
        // 8. Material 2
        fila.appendChild(crearCeldaMaterial(equipo.material2, equipo.material2Color));
        // 9. Material 4
        fila.appendChild(crearCeldaMaterial(equipo.material4, equipo.material4Color));

        // 10. Columna Eliminar
        const celdaEliminar = document.createElement('td');
        celdaEliminar.style.textAlign = 'center';
        const btnEliminar = document.createElement('img');
        btnEliminar.src = 'images/borrarsim.png';
        btnEliminar.alt = 'Eliminar';
        btnEliminar.style.width = '33px';
        btnEliminar.style.height = 'auto';
        btnEliminar.style.cursor = 'pointer';
        btnEliminar.style.display = 'block';
        btnEliminar.style.margin = '0 auto';
        // El índice real en equiposSimulados (ya que se invierte)
        const realIdx = equiposSimulados.length - 1 - idx;
        btnEliminar.addEventListener('click', () => {
            equiposSimulados.splice(realIdx, 1);
            generarTablaArte();
        });
        celdaEliminar.appendChild(btnEliminar);
        fila.appendChild(celdaEliminar);

        table.appendChild(fila);
    });

    arteTable.appendChild(table);
}

// scripts/arte.js - FIN