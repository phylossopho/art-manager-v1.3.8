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
        // Estructura de modal estándar
        let html = `
        <div class='modal-content' style='max-width: 95vw; width: 90vw; min-width: 320px;'>
            <div class='modal-header'>
                <h2 style='color:#4CAF50; font-size:1.4rem; margin:0;'>Gestor de Recetas</h2>
                <span class='close' id='cerrar-gestor-recetas' title='Cerrar'>&times;</span>
            </div>
            <div class='modal-body'>
                <div style='text-align:center;margin-bottom:10px;'>
                    <button id='nueva-receta-btn' class='back-button' style='background:#4CAF50;margin-right:8px;' title='Nueva receta'>➕</button>
                    <button id='importar-recetas-btn' class='back-button' style='background:#FFD600;color:#333;' title='Importar recetas'>⬇️</button>
                    ${Object.keys(cargarRecetasPersonalizadas()).length > 0 ? `<button id='exportar-recetas-btn' class='back-button' style='background:#FFD600;color:#333;margin-left:8px;' title='Exportar recetas'>⬆️</button>` : ''}
                </div>
                ${(() => {
                    const recetas = cargarRecetasPersonalizadas();
                    const claves = Object.keys(recetas);
                    if (claves.length === 0) {
                        return `<p style='text-align:center;'>No hay recetas guardadas aún.</p>`;
                    } else {
                        // Tabla responsiva
                        let tabla = `<div style='overflow-x:auto;'><table class='materials-table' style='width:90vw;min-width:320px;max-width:90vw;font-size:0.98rem;'><thead><tr>`;
                        tabla += `<th style='width:12vw;min-width:40px;'>Equipo</th>`;
                        tabla += `<th style='width:16vw;min-width:60px;'>Clase</th>`;
                        tabla += `<th style='width:10vw;min-width:40px;'>Nivel</th>`;
                        tabla += `<th style='width:12vw;min-width:40px;'>Base</th>`;
                        tabla += `<th colspan='4' style='width:24vw;min-width:80px;'>Materiales</th>`;
                        tabla += `<th style='width:12vw;min-width:50px;'>Éxito (%)</th>`;
                        tabla += `<th style='width:14vw;min-width:60px;'>Acciones</th>`;
                        tabla += `</tr></thead><tbody>`;
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
                            tabla += `<tr>`;
                            tabla += `<td class='equipo-bg' style="--equipo-bg:${colorFondo};text-align:center;vertical-align:middle;"><img src='images/${r.equipo.toLowerCase()}.png' alt='' style='width:32px;height:32px;vertical-align:middle;' onerror="this.style.display='none'"></td>`;
                            tabla += `<td style='text-align:center;vertical-align:middle;'>${r.clase}</td>`;
                            tabla += `<td style='text-align:center;vertical-align:middle;'>${r.nivel}</td>`;
                            const baseBg = (r.base && window.mapaColores && window.mapaColores[r.base]) ? window.mapaColores[r.base] : '#f0f0f0';
                            tabla += `<td style='text-align:center;vertical-align:middle;'><div class='circle-color' style='width:24px;height:24px;border-radius:50%;margin:auto;border:2px solid #bbb;display:inline-block;--circle-color:${baseBg};background:${baseBg};'></div></td>`;
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
                                tabla += `<td style='text-align:center;vertical-align:middle;'><div class='circle-color' style='width:22px;height:22px;border-radius:50%;margin:auto;border:2px solid #bbb;display:inline-block;--circle-color:${matBg};background:${matBg};'></div></td>`;
                            }
                            let tasa = r.tasaExito !== undefined && r.tasaExito !== '' ? parseFloat(r.tasaExito) : '';
                            tabla += `<td style='text-align:center;vertical-align:middle;'>${tasa !== '' ? tasa % 1 === 0 ? tasa : tasa.toFixed(2) : ''}</td>`;
                            tabla += `<td style='text-align:center;vertical-align:middle;'><button class='editar-receta-lista back-button' data-clave='${clave}' style='background:#FFD600;color:#333;margin-right:4px;' title='Editar'>✏️</button>`;
                            tabla += `<button class='eliminar-receta-lista back-button' data-clave='${clave}' style='background:#f44336;color:#fff;' title='Eliminar'>🗑️</button></td>`;
                            tabla += `</tr>`;
                        }
                        tabla += `</tbody></table></div>`;
                        return tabla;
                    }
                })()}
            </div>
            <div class='modal-footer'>
                <button id='volver-gestor-recetas' class='back-button' style='background:#2196F3;' title='Volver'>←</button>
            </div>
        </div>`;
        contenido.innerHTML = html;
        modal.style.display = 'flex';
        // Cerrar modal
        document.getElementById('cerrar-gestor-recetas').onclick = function() {
            modal.style.display = 'none';
        };
        document.getElementById('volver-gestor-recetas').onclick = function() {
            modal.style.display = 'none';
        };
        document.getElementById('nueva-receta-btn').onclick = function() {
            mostrarFormularioReceta(document.getElementById('contenido-gestor-recetas'), null);
        };
        document.getElementById('importar-recetas-btn').onclick = function() {
            importarRecetas();
        };
        if (Object.keys(cargarRecetasPersonalizadas()).length > 0) {
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
                mostrarFormularioReceta(document.getElementById('contenido-gestor-recetas'), receta);
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
    let html = `
    <div class='modal-content' style='max-width: 95vw; width: 90vw; min-width: 320px;'>
        <div class='modal-header'>
            <h2 style='color:#4CAF50; font-size:1.2rem; margin:0;'>${receta ? 'Editar' : 'Nueva'} Receta</h2>
            <span class='close' id='cerrar-form-receta' title='Cerrar'>&times;</span>
        </div>
        <div class='modal-body'>
            <div class='centered-content' style='margin-bottom:10px;'>
                <span class='centered-text'><strong>Equipo:</strong> ${equipo} &nbsp; <strong>Clase:</strong> ${clase} &nbsp; <strong>Nivel:</strong> ${nivel} &nbsp; <strong>Color:</strong> ${color}</span>
            </div>
            <form id='form-receta'>
                <div style='margin-bottom:10px;'>
                    <label style='font-weight:bold;display:block;margin-bottom:5px;'>Materiales requeridos por color:</label>
                    <div style='display:grid;grid-template-columns:repeat(2,1fr);gap:8px;'>
                        ${colores.map(col => {
                            const val = receta && receta.materiales && receta.materiales[col] ? receta.materiales[col] : '';
                            return `<div><label>${col.charAt(0).toUpperCase() + col.slice(1)}:
                                <select name='mat_${col}' style='width:60px;padding:3px 6px;border-radius:5px;'>
                                    <option value=''></option>
                                    <option value='1' ${val==1?'selected':''}>1</option>
                                    <option value='2' ${val==2?'selected':''}>2</option>
                                    <option value='3' ${val==3?'selected':''}>3</option>
                                    <option value='4' ${val==4?'selected':''}>4</option>
                                </select>
                            </label></div>`;
                        }).join('')}
                    </div>
                </div>
                <div style='margin-bottom:10px;'>
                    <label style='font-weight:bold;display:block;margin-bottom:5px;'>Color de la base:</label>
                    <select name='baseColor' required style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>
                        <option value=''>Selecciona un color...</option>
                        ${(coloresPorClase[clase] || colores).map(col => {
                            const sel = receta && receta.base && receta.base === col ? 'selected' : '';
                            return `<option value='${col}' ${sel}>${col.charAt(0).toUpperCase() + col.slice(1)}</option>`;
                        }).join('')}
                    </select>
                </div>
                <div style='margin-bottom:10px;'>
                    <label style='font-weight:bold;display:block;margin-bottom:5px;'>Tasa de éxito (%):</label>
                    <input type='number' name='tasaExito' min='1' max='100' step='any' value='${receta && receta.tasaExito ? receta.tasaExito : ''}' style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>
                </div>
                <div id='error-materiales' style='color:#f44336;font-weight:bold;margin-bottom:10px;display:none;'></div>
                <div style='margin-top:10px;text-align:center;'>
                    <button type='submit' class='back-button' style='background:#4CAF50;margin-right:10px;' title='Guardar'>✔️</button>
                    <button type='button' id='volver-gestor-recetas' class='back-button' style='background:#2196F3;' title='Volver'>←</button>
                </div>
            </form>
        </div>
    </div>`;
    contenido.innerHTML = html;
    document.getElementById('cerrar-form-receta').onclick = mostrarGestorRecetas;
    document.getElementById('volver-gestor-recetas').onclick = mostrarGestorRecetas;
    const form = document.getElementById('form-receta');
    form.onsubmit = function(e) {
        e.preventDefault();
        const materiales = {};
        let suma = 0;
        colores.forEach(col => {
            const val = parseInt(this[`mat_${col}`].value) || 0;
            materiales[col] = val;
            suma += val;
        });
        // Validar suma de materiales
        if (![2,3,4].includes(suma)) {
            const errorDiv = document.getElementById('error-materiales');
            errorDiv.textContent = 'La suma de materiales debe ser 2, 3 o 4.';
            errorDiv.style.display = 'block';
            return;
        } else {
            document.getElementById('error-materiales').style.display = 'none';
        }
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
        modales.mostrarMensaje('Éxito', 'Receta guardada exitosamente', 'success');
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