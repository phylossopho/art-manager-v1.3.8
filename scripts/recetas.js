// Archivo de recetas simplificado

import { cargarRecetasPersonalizadas, eliminarRecetaPersonalizada, guardarRecetaPersonalizada, obtenerRecetaPersonalizada } from './materiales.js';
import { imagenesEquipos, nivelesPorClase, coloresPorClase, obtenerRestriccionesClase } from './datos.js';

export function mostrarGestorRecetas() {
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
        html += `<table style='width:100%;font-size:1rem;margin-top:10px;'><thead><tr><th>Equipo</th><th>Clase</th><th>Nivel</th><th>Color</th><th>Base</th><th>Materiales</th><th>Éxito (%)</th><th>Acciones</th></tr></thead><tbody>`;
        for (const clave of claves) {
            const r = recetas[clave];
            html += `<tr>`;
            html += `<td>${r.equipo}</td>`;
            html += `<td>${r.clase}</td>`;
            html += `<td>${r.nivel}</td>`;
            html += `<td>${r.color}</td>`;
            html += `<td>${r.base}</td>`;
            html += `<td>${r.materiales ? Object.entries(r.materiales).map(([color, cant]) => cant > 0 ? `${cant} ${color}` : '').filter(Boolean).join(', ') : 'N/A'}</td>`;
            html += `<td>${r.tasaExito || ''}</td>`;
            html += `<td><button class='editar-receta-lista' data-clave='${clave}' style='font-size:1.1rem;background:#FFD600;color:#333;border-radius:5px;padding:2px 8px;margin-right:4px;'>✏️</button>`;
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
    html += `<input type='number' name='tasaExito' min='1' max='100' value='${receta && receta.tasaExito ? receta.tasaExito : ''}' style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
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
        const tasaExito = parseInt(this.tasaExito.value) || '';
        const nuevaReceta = {
            equipo, clase, nivel, color,
            base: baseColor,
            materiales,
            tasaExito
        };
        guardarRecetaPersonalizada(nuevaReceta);
        alert('Receta guardada exitosamente');
        mostrarGestorRecetas();
    };
}

function importarRecetas() {
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
                mostrarGestorRecetas();
            } catch {
                alert('El archivo no es válido.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportarRecetas() {
    const recetas = cargarRecetasPersonalizadas();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recetas, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'recetas_art_manager.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
} 