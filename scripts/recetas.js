// Archivo de recetas simplificado

import { cargarRecetasPersonalizadas, eliminarRecetaPersonalizada, guardarRecetaPersonalizada, obtenerRecetaPersonalizada } from './materiales.js';
import { imagenesEquipos, nivelesPorClase, coloresPorClase, obtenerRestriccionesClase } from './datos.js';

export function mostrarGestorRecetas() {
    try {
        // Asegurar que window.mapaColores esté disponible
        if (!window.mapaColores && typeof imagenesEquipos === 'object' && typeof window.estadoApp === 'object' && window.estadoApp.mapaColores) {
            window.mapaColores = window.estadoApp.mapaColores;
        }
        console.log('🔧 Iniciando gestor de recetas...');
        
        var modal = document.getElementById('gestor-recetas-modal');
        var contenido = document.getElementById('contenido-gestor-recetas');
        
        if (!modal || !contenido) {
            console.error('❌ No se encontró el modal de recetas');
            alert('Error: No se encontró el modal de recetas');
            return;
        }

        let html = `<h2 style='color:#FFD600;text-align:center;'>Gestor de Recetas</h2>`;
        html += `<div style='text-align:center;margin-bottom:10px;'>
            <button id='nueva-receta-btn' style='background:#4CAF50;color:#fff;font-weight:bold;border-radius:6px;padding:4px 10px;margin-right:8px;font-size:1rem;'>➕ Nueva receta</button>
            <button id='importar-recetas-btn' style='background:#FFD600;color:#333;font-weight:bold;border-radius:6px;padding:4px 10px;font-size:1rem;'>�� Importar</button>`;
        
        const recetas = cargarRecetasPersonalizadas();
        const claves = Object.keys(recetas);
        
        if (claves.length > 0) {
            html += `<button id='exportar-recetas-btn' style='background:#FFD600;color:#333;font-weight:bold;border-radius:6px;padding:4px 10px;margin-left:8px;font-size:1rem;'>📤 Exportar</button>`;
        }
        html += `</div>`;

        if (claves.length === 0) {
            html += `<p style='text-align:center;'>No hay recetas guardadas aún.</p>`;
        } else {
            html += `<table style='width:100%;font-size:1rem;margin-top:10px;'><thead><tr><th style='padding:8px;'>Equipo</th><th style='padding:8px;'>Clase</th><th style='padding:8px;'>Nivel</th><th style='padding:8px;'>Base</th><th colspan='4' style='padding:8px;'>Materiales</th><th style='padding:8px;width:60px;'>Éxito (%)</th><th style='padding:8px;'>Acciones</th></tr></thead><tbody>`;
            for (const clave of claves) {
                const r = recetas[clave];
                html += `<tr>`;
                // Celda de equipo solo imagen, fondo según color, sin texto
                let colorFondo = '#e0e0e0';
                if (r.color && window.mapaColores && window.mapaColores[r.color]) {
                    colorFondo = window.mapaColores[r.color];
                } else if (r.color && typeof r.color === 'string') {
                    // Intentar forzar minúsculas y quitar espacios
                    const colorKey = r.color.toLowerCase().replace(/\s+/g, '');
                    if (window.mapaColores && window.mapaColores[colorKey]) {
                        colorFondo = window.mapaColores[colorKey];
                    }
                }
                html += `<td style="background:${colorFondo};text-align:center;vertical-align:middle;padding:8px;">`;
                html += `<img src='images/${r.equipo.toLowerCase()}.png' alt='' style='width:32px;height:32px;vertical-align:middle;' onerror="this.style.display='none'">`;
                html += `</td>`;
                html += `<td style='padding:8px;text-align:center;vertical-align:middle;'>${r.clase}</td>`;
                html += `<td style='padding:8px;text-align:center;vertical-align:middle;'>${r.nivel}</td>`;
                // Columna base: solo círculo de color, sin texto, usando background-color
                const baseBg = (r.base && window.mapaColores && window.mapaColores[r.base]) ? window.mapaColores[r.base] : '#f0f0f0';
                html += `<td style='padding:8px;text-align:center;vertical-align:middle;'><div class='circle-color' style='width:24px;height:24px;border-radius:50%;margin:auto;border:2px solid #bbb;display:inline-block;--circle-color:${baseBg};'></div></td>`;
                // Materiales: 4 círculos, usando variable CSS
                const ordenColores = ['dorado','morado','azul','verde','blanco'];
                let materialesArr = [];
                ordenColores.forEach(col => {
                    for(let i=0;i<(r.materiales[col]||0);i++){
                        materialesArr.push(col);
                    }
                });
                for(let i=0;i<4;i++){
                    const matColor = materialesArr[i] || '';
                    const matBg = (matColor && window.mapaColores && window.mapaColores[matColor]) ? window.mapaColores[matColor] : '#f0f0f0';
                    html += `<td style='width:28px;height:28px;text-align:center;vertical-align:middle;'><div class='circle-color' style='width:22px;height:22px;border-radius:50%;margin:auto;border:2px solid #bbb;display:inline-block;--circle-color:${matBg};'></div></td>`;
                }
                // Tasa de éxito angosta
                let tasa = r.tasaExito !== undefined && r.tasaExito !== '' ? parseFloat(r.tasaExito) : '';
                html += `<td style='padding:8px;width:60px;text-align:center;vertical-align:middle;'>${tasa !== '' ? tasa % 1 === 0 ? tasa : tasa.toFixed(2) : ''}</td>`;
                html += `<td style='padding:8px;text-align:center;vertical-align:middle;'><button class='editar-receta-lista' data-clave='${clave}' style='font-size:1.1rem;background:#FFD600;color:#333;border-radius:5px;padding:2px 8px;margin-right:4px;'>✏️</button>`;
                html += `<button class='eliminar-receta-lista' data-clave='${clave}' style='font-size:1.1rem;background:#f44336;color:#fff;border-radius:5px;padding:2px 8px;'>🗑️</button></td>`;
                html += `</tr>`;
            }
            html += `</tbody></table>`;
        }
        
        contenido.innerHTML = html;
        modal.style.display = 'flex';
        
        // Event listeners
        document.getElementById('cerrar-gestor-recetas').onclick = function() {
            modal.style.display = 'none';
        };

        document.getElementById('nueva-receta-btn').onclick = function() {
            mostrarFormularioReceta(contenido, null);
        };

        document.getElementById('importar-recetas-btn').onclick = function() {
            importarRecetas();
        };

        if (claves.length > 0) {
            document.getElementById('exportar-recetas-btn').onclick = function() {
                exportarRecetas();
            };
        }

        // Editar receta
        document.querySelectorAll('.editar-receta-lista').forEach(btn => {
            btn.onclick = function() {
                const clave = btn.getAttribute('data-clave');
                const [equipo, clase, nivel, color, base] = clave.split('|');
                const receta = obtenerRecetaPersonalizada(equipo, clase, nivel, color, base);
                if (!receta) return alert('No se encontró la receta');
                mostrarFormularioReceta(contenido, receta);
            };
        });
        
        // Eliminar receta
        document.querySelectorAll('.eliminar-receta-lista').forEach(btn => {
            btn.onclick = function() {
                const clave = btn.getAttribute('data-clave');
                const [equipo, clase, nivel, color, base] = clave.split('|');
                if (confirm('¿Seguro que deseas eliminar esta receta?')) {
                    eliminarRecetaPersonalizada(equipo, clase, nivel, color, base);
                    mostrarGestorRecetas();
                }
            };
        });
        
        console.log('✅ Gestor de recetas cargado correctamente');
    } catch (error) {
        if (window.modales && typeof window.modales.mostrarMensajeHTML === 'function') {
            window.modales.mostrarMensajeHTML('Error en gestor de recetas', `<p style='color:red;'>${error.message || error}</p>`, 'error', '0401');
        }
        console.error('Error en gestor de recetas:', error);
    }
}

function mostrarFormularioReceta(contenido, receta) {
    // Obtener selección actual de la interfaz principal
    const equipo = document.getElementById('equipment-select').value;
    const clase = document.getElementById('class-select').value;
    const nivel = document.getElementById('level-select').value;
    const color = document.getElementById('color-select').value;
    const colores = ['dorado', 'morado', 'azul', 'verde', 'blanco'];
    
    let html = `<h2 style='color:#4CAF50;text-align:center;'>${receta ? 'Editar' : 'Nueva'} Receta</h2>`;
    html += `<div style='margin-bottom:15px;padding:10px;background:#f0f0f0;border-radius:4px;text-align:center;'>`;
    html += `<strong>Equipo:</strong> ${equipo} &nbsp; <strong>Clase:</strong> ${clase} &nbsp; <strong>Nivel:</strong> ${nivel} &nbsp; <strong>Color:</strong> ${color}`;
    html += `</div>`;
    html += `<form id='form-receta'>`;
    html += `<div style='margin-bottom:15px;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>Materiales requeridos por color:</label>`;
    colores.forEach(col => {
        html += `<div style='margin-bottom:8px;'><label>${col.charAt(0).toUpperCase() + col.slice(1)}: <input type='number' name='mat_${col}' min='0' value='${receta && receta.materiales && receta.materiales[col] ? receta.materiales[col] : 0}' style='width:60px;'></label></div>`;
    });
    html += `</div>`;
    // Color de la base
    html += `<div style='margin-bottom:15px;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>Color de la base:</label>`;
    html += `<select name='baseColor' required style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
    html += `<option value=''>Selecciona un color...</option>`;
    (coloresPorClase[clase] || colores).forEach(col => {
        const sel = receta && receta.base && receta.base === col ? 'selected' : '';
        html += `<option value='${col}' ${sel}>${col.charAt(0).toUpperCase() + col.slice(1)}</option>`;
    });
    html += `</select></div>`;
    // Tasa de éxito
    html += `<div style='margin-bottom:15px;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>Tasa de éxito (%):</label>`;
    html += `<input type='number' name='tasaExito' min='1' max='100' step='any' value='${receta && receta.tasaExito ? receta.tasaExito : ''}' style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
    html += `</div>`;
    html += `<div style='margin-top:20px;text-align:center;'>`;
    html += `<button type='submit' style='background:#4CAF50;color:#fff;font-weight:bold;padding:10px 20px;border-radius:6px;border:none;margin-right:10px;'>Guardar receta</button>`;
    html += `<button type='button' id='volver-gestor-recetas' style='background:#2196F3;color:#fff;font-weight:bold;padding:10px 20px;border-radius:6px;border:none;'>← Volver</button>`;
    html += `</div>`;
    html += `</form>`;
    contenido.innerHTML = html;
    document.getElementById('volver-gestor-recetas').onclick = mostrarGestorRecetas;
    document.getElementById('form-receta').onsubmit = function(e) {
        e.preventDefault();
        const materiales = {};
        colores.forEach(col => {
            materiales[col] = parseInt(this[`mat_${col}`].value) || 0;
        });
        const baseColor = this.baseColor.value;
        const tasaExito = parseFloat(this.tasaExito.value) || '';
        // Asegurar que el color se guarda en minúsculas y sin espacios
        const colorGuardado = color ? color.toLowerCase().replace(/\s+/g, '') : '';
        const nuevaReceta = {
            equipo, clase, nivel, color: colorGuardado,
            base: baseColor,
            materiales,
            tasaExito
        };
        guardarRecetaPersonalizada(nuevaReceta);
        alert('Receta guardada exitosamente');
        mostrarGestorRecetas();
    };
}

function esMovil() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
}

function mostrarToastInfo(mensaje) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.right = '0';
        container.style.bottom = '0';
        container.style.zIndex = '99999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column-reverse';
        container.style.alignItems = 'center';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast toast-info';
    toast.style.background = '#ffe066';
    toast.style.color = '#222';
    toast.style.fontWeight = 'bold';
    toast.style.textAlign = 'center';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.10)';
    toast.style.margin = '0 0 16px 0';
    toast.style.padding = '14px 32px';
    toast.style.maxWidth = '90vw';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(30px)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.pointerEvents = 'auto';
    toast.innerText = mensaje;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(30px)';
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3000);
}

function exportarRecetas() {
    const recetas = cargarRecetasPersonalizadas();
    const nombreSugerido = 'recetas_art_manager.json';
    const soportaSaveFilePicker = typeof window.showSaveFilePicker === 'function';
    if (soportaSaveFilePicker && !esMovil()) {
        (async () => {
            try {
                alert(`Elige dónde quieres guardar tus recetas.\n\nEl nombre sugerido es: ${nombreSugerido}\n(Puedes cambiarlo si lo deseas)`);
                const options = {
                    suggestedName: nombreSugerido,
                    types: [
                        {
                            description: 'Archivo JSON',
                            accept: { 'application/json': ['.json'] }
                        }
                    ]
                };
                const handle = await window.showSaveFilePicker(options);
                const writable = await handle.createWritable();
                await writable.write(JSON.stringify(recetas, null, 2));
                await writable.close();
                mostrarToastInfo('✅ Recetas exportadas correctamente.');
            } catch (e) {
                if (e.name === 'AbortError') {
                    mostrarToastInfo('Guardado cancelado.');
                } else {
                    mostrarToastInfo('❌ Error al guardar el archivo.');
                }
            }
        })();
    } else {
        // Fallback tradicional, mensaje claro para móvil
        if (esMovil()) {
            mostrarToastInfo('El archivo se descargará en tu carpeta de descargas. Puedes cambiar el nombre o moverlo desde tu gestor de archivos.');
        } else {
            alert(`El archivo se descargará automáticamente con el nombre sugerido: ${nombreSugerido}`);
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recetas, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', nombreSugerido);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        document.body.removeChild(dlAnchor);
        setTimeout(() => mostrarToastInfo('✅ Recetas exportadas.'), 400);
    }
}

function importarRecetas() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) {
            mostrarToastInfo('Importación cancelada.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                let nuevas = JSON.parse(evt.target.result);
                if (Array.isArray(nuevas)) {
                    const obj = {};
                    nuevas.forEach((r, idx) => {
                        if (r && r.equipo && r.clase && r.nivel && r.color && r.base) {
                            const clave = `${r.equipo}|${r.clase}|${r.nivel}|${r.color}|${r.base}`;
                            obj[clave] = r;
                        } else {
                            obj[`receta_${idx}`] = r;
                        }
                    });
                    nuevas = obj;
                }
                if (typeof nuevas !== 'object' || nuevas === null) throw new Error('Formato de archivo no válido');
                const actuales = cargarRecetasPersonalizadas();
                let agregadas = 0;
                for (const clave in nuevas) {
                    if (!actuales[clave]) {
                        actuales[clave] = nuevas[clave];
                        agregadas++;
                    }
                }
                mostrarToastInfo(`Importación completada. Se agregaron ${agregadas} recetas.`);
                mostrarGestorRecetas();
            } catch (err) {
                mostrarToastInfo('El archivo no es válido o está corrupto.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
} 