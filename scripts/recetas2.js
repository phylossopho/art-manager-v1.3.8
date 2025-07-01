import { cargarRecetasPersonalizadas, eliminarRecetaPersonalizada, guardarRecetaPersonalizada, obtenerRecetaPersonalizada } from './materiales.js';
import { imagenesEquipos, nivelesPorClase, coloresPorClase, obtenerRestriccionesClase } from './datos.js';
import * as modales from './modales.js';

export function mostrarGestorRecetas() {
    try {
        if (!window.mapaColores && typeof imagenesEquipos === 'object' && typeof window.estadoApp === 'object' && window.estadoApp.mapaColores) {
            window.mapaColores = window.estadoApp.mapaColores;
        }
        var modal = document.getElementById('gestor-recetas-modal');
        var contenido = document.getElementById('contenido-gestor-recetas');
        if (!modal || !contenido) {
            alert('Error: No se encontró el modal de recetas');
            return;
        }
        let html = `<h2 style='color:#FFD600;text-align:center;'>Gestor de Recetas</h2>`;
        html += `<div style='text-align:center;margin-bottom:10px;'>
            <button id='nueva-receta-btn' style='background:#4CAF50;color:#fff;font-weight:bold;border-radius:6px;padding:4px 10px;margin-right:8px;font-size:1rem;'>➕ Nueva receta</button>
            <button id='importar-recetas-btn' style='background:#FFD600;color:#333;font-weight:bold;border-radius:6px;padding:4px 10px;font-size:1rem;'>📥 Importar</button>`;
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
                let colorFondo = '#e0e0e0';
                if (r.color && window.mapaColores && window.mapaColores[r.color]) {
                    colorFondo = window.mapaColores[r.color];
                } else if (r.color && typeof r.color === 'string') {
                    const colorKey = r.color.toLowerCase().replace(/\s+/g, '');
                    if (window.mapaColores && window.mapaColores[colorKey]) {
                        colorFondo = window.mapaColores[colorKey];
                    }
                }
                html += `<tr>`;
                html += `<td style="background:${colorFondo};text-align:center;vertical-align:middle;padding:8px;">
                    <img src='images/${r.equipo.toLowerCase()}.png' alt='' style='width:32px;height:32px;vertical-align:middle;' onerror="this.style.display='none'">
                </td>`;
                html += `<td style='padding:8px;text-align:center;vertical-align:middle;'>${r.clase}</td>`;
                html += `<td style='padding:8px;text-align:center;vertical-align:middle;'>${r.nivel}</td>`;
                const baseBg = (r.base && window.mapaColores && window.mapaColores[r.base]) ? window.mapaColores[r.base] : '#f0f0f0';
                html += `<td style='padding:8px;text-align:center;vertical-align:middle;'><div class='circle-color' style='width:24px;height:24px;border-radius:50%;margin:auto;border:2px solid #bbb;display:inline-block;--circle-color:${baseBg};'></div></td>`;
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
        document.querySelectorAll('.editar-receta-lista').forEach(btn => {
            btn.onclick = function() {
                const clave = btn.getAttribute('data-clave');
                const [equipo, clase, nivel, color, base] = clave.split('|');
                const receta = obtenerRecetaPersonalizada(equipo, clase, nivel, color, base);
                if (!receta) return alert('No se encontró la receta');
                mostrarFormularioReceta(contenido, receta);
            };
        });
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
    } catch (error) {
        alert('Error en gestor de recetas: ' + (error.message || error));
    }
}

function mostrarFormularioReceta(contenido, receta) {
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
    html += `<div style='margin-bottom:15px;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>Color de la base:</label>`;
    html += `<select name='baseColor' required style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
    html += `<option value=''>Selecciona un color...</option>`;
    (coloresPorClase[clase] || colores).forEach(col => {
        const sel = receta && receta.base && receta.base === col ? 'selected' : '';
        html += `<option value='${col}' ${sel}>${col.charAt(0).toUpperCase() + col.slice(1)}</option>`;
    });
    html += `</select></div>`;
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

export async function exportarRecetas() {
    try {
        const recetasObj = cargarRecetasPersonalizadas();
        const recetasArr = Object.values(recetasObj);
        const nombreSugerido = `recetas-art-manager-${new Date().toISOString().split('T')[0]}.json`;
        let guardadoExitoso = false;
        if (window.showSaveFilePicker && !esMovil()) {
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
                await writable.write(JSON.stringify(recetasArr, null, 2));
                await writable.close();
                guardadoExitoso = true;
                modales.mostrarMensaje('Éxito', '✅ Recetas exportadas correctamente (formato array).', 'success');
            } catch (e) {
                if (e.name !== 'AbortError') {
                    modales.mostrarMensaje('Error', '❌ Error al guardar el archivo: ' + (e.message || e), 'error');
                } else {
                    modales.mostrarMensaje('Cancelado', 'Guardado cancelado.', 'warning');
                }
            }
        }
        if (!guardadoExitoso) {
            alert(`Elige dónde quieres guardar tus recetas.\n\nEl nombre sugerido es: ${nombreSugerido}\n(Puedes cambiarlo si lo deseas en el diálogo de descarga)`);
            const blob = new Blob([JSON.stringify(recetasArr, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = nombreSugerido;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            modales.mostrarMensaje('Éxito', `✅ Recetas exportadas como: ${nombreSugerido} (formato array).`, 'success');
        }
    } catch (error) {
        modales.mostrarMensaje('Error', '❌ Error al exportar recetas: ' + (error.message || error), 'error');
    }
}

export function importarRecetas() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) {
            modales.mostrarMensaje('Cancelado', 'Importación cancelada.', 'warning');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                let data = JSON.parse(evt.target.result);
                if (!Array.isArray(data)) {
                    modales.mostrarMensaje('Advertencia', 'El archivo debe ser un array de recetas.', 'warning');
                    return;
                }
                let recetasImportadas = {};
                let errores = [];
                let agregadas = 0;
                data.forEach((r, idx) => {
                    if (r && r.equipo && r.clase && r.nivel && r.color && r.base && r.materiales) {
                        const clave = `${r.equipo}|${r.clase}|${r.nivel}|${r.color}|${r.base}`;
                        recetasImportadas[clave] = r;
                    } else {
                        errores.push(`Receta ${idx + 1} inválida`);
                    }
                });
                if (Object.keys(recetasImportadas).length === 0) {
                    modales.mostrarMensaje('Advertencia', 'No se encontraron recetas válidas en el archivo.' + (errores.length ? `\nErrores: ${errores.join(', ')}` : ''), 'warning');
                    return;
                }
                // Reemplazar completamente las recetas en memoria
                window._recetasMemoria = recetasImportadas;
                agregadas = Object.keys(recetasImportadas).length;
                let msg = `Importación completada. Se agregaron ${agregadas} recetas.`;
                if (errores.length) msg += `\nAlgunas recetas fueron ignoradas: ${errores.join(', ')}`;
                modales.mostrarMensaje('Éxito', msg, 'success');
                mostrarGestorRecetas();
            } catch (err) {
                modales.mostrarMensaje('Error', 'El archivo no es válido o está corrupto.', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
} 