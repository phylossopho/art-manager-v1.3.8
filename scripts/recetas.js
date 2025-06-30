import { cargarRecetasPersonalizadas, eliminarRecetaPersonalizada, guardarRecetaPersonalizada, obtenerRecetaPersonalizada } from './materiales.js';
import { datosMateriales, restriccionesClase, imagenesEquipos, nivelesPorClase, coloresPorClase, obtenerRestriccionesClase } from './datos.js';

export function mostrarGestorRecetas() {
    var modal = document.getElementById('gestor-recetas-modal');
    var contenido = document.getElementById('contenido-gestor-recetas');
    if (!modal || !contenido) return alert('No se encontró el modal de recetas');

    // Botones de exportar/importar/nueva receta
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

    // Listado de recetas
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

    // Nueva receta
    document.getElementById('nueva-receta-btn').onclick = function() {
        mostrarFormularioNuevaReceta(contenido);
    };

    // Importar recetas
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
                    mostrarGestorRecetas();
                } catch {
                    alert('El archivo no es válido.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // Exportar recetas (solo si hay)
    if (claves.length > 0) {
        document.getElementById('exportar-recetas-btn').onclick = function() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recetas, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute('href', dataStr);
            dlAnchor.setAttribute('download', 'recetas_art_manager.json');
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            document.body.removeChild(dlAnchor);
        };
    }

    // Editar receta
    document.querySelectorAll('.editar-receta-lista').forEach(btn => {
        btn.onclick = function() {
            const clave = btn.getAttribute('data-clave');
            const [equipo, clase, nivel, color, base] = clave.split('|');
            const receta = obtenerRecetaPersonalizada(equipo, clase, nivel, color, base);
            if (!receta) return alert('No se encontró la receta');
            mostrarFormularioEditarReceta(contenido, receta, equipo, clase, nivel, color);
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
}

function mostrarFormularioNuevaReceta(contenido) {
    const equipos = Object.keys(imagenesEquipos);
    const clases = Object.keys(nivelesPorClase);
    
    let html = `<h2 style='color:#4CAF50;text-align:center;'>Nueva Receta</h2>`;
    html += `<form id='form-nueva-receta'>`;
    
    // Paso 1: Seleccionar equipo
    html += `<div style='margin-bottom:15px;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>1. Tipo de Equipo:</label>`;
    html += `<select id='equipo-select' name='equipo' required style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
    html += `<option value=''>Selecciona un equipo...</option>`;
    equipos.forEach(equipo => {
        html += `<option value='${equipo}'>${equipo}</option>`;
    });
    html += `</select>`;
    html += `</div>`;
    
    // Paso 2: Seleccionar clase
    html += `<div style='margin-bottom:15px;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>2. Clase:</label>`;
    html += `<select id='clase-select' name='clase' required style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
    html += `<option value=''>Selecciona una clase...</option>`;
    clases.forEach(clase => {
        html += `<option value='${clase}'>${clase}</option>`;
    });
    html += `</select>`;
    html += `</div>`;
    
    // Paso 3: Seleccionar nivel (se actualizará dinámicamente)
    html += `<div id='nivel-container' style='margin-bottom:15px;display:none;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>3. Nivel:</label>`;
    html += `<select id='nivel-select' name='nivel' required style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
    html += `<option value=''>Selecciona un nivel...</option>`;
    html += `</select>`;
    html += `</div>`;
    
    // Paso 4: Seleccionar color (se actualizará dinámicamente)
    html += `<div id='color-container' style='margin-bottom:15px;display:none;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>4. Color:</label>`;
    html += `<select id='color-select' name='color' required style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
    html += `<option value=''>Selecciona un color...</option>`;
    html += `</select>`;
    html += `</div>`;
    
    // Paso 5: Materiales por color
    html += `<div id='materiales-container' style='margin-bottom:15px;display:none;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>5. Cantidad de materiales por color:</label>`;
    html += `<div style='display:grid;grid-template-columns:1fr 1fr;gap:10px;'>`;
    html += `<div><label>Dorados: <input type='number' name='dorados' min='0' value='0' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `<div><label>Morados: <input type='number' name='morados' min='0' value='0' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `<div><label>Azules: <input type='number' name='azules' min='0' value='0' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `<div><label>Verdes: <input type='number' name='verdes' min='0' value='0' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `<div><label>Blancos: <input type='number' name='blancos' min='0' value='0' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `</div>`;
    html += `</div>`;
    
    // Paso 6: Base (se mostrará automáticamente según la clase)
    html += `<div id='base-container' style='margin-bottom:15px;display:none;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>6. Base requerida:</label>`;
    html += `<div id='base-info' style='padding:10px;background:#f0f0f0;border-radius:4px;border:1px solid #ccc;'></div>`;
    html += `</div>`;
    
    // Tasa de éxito
    html += `<div style='margin-bottom:15px;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>Tasa de éxito (%):</label>`;
    html += `<input type='number' name='tasaExito' min='1' max='100' value='100' required style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
    html += `</div>`;
    
    html += `<div style='margin-top:20px;text-align:center;'>`;
    html += `<button type='submit' style='background:#4CAF50;color:#fff;font-weight:bold;padding:10px 20px;border-radius:6px;border:none;margin-right:10px;'>Guardar receta</button>`;
    html += `<button type='button' id='volver-gestor-recetas' style='background:#2196F3;color:#fff;font-weight:bold;padding:10px 20px;border-radius:6px;border:none;'>← Volver</button>`;
    html += `</div>`;
    html += `</form>`;
    
    contenido.innerHTML = html;
    
    // Eventos para actualizar selectores dinámicamente
    document.getElementById('equipo-select').onchange = actualizarClases;
    document.getElementById('clase-select').onchange = actualizarNiveles;
    document.getElementById('nivel-select').onchange = actualizarColores;
    document.getElementById('color-select').onchange = mostrarMaterialesYBase;
    document.getElementById('volver-gestor-recetas').onclick = mostrarGestorRecetas;
    
    document.getElementById('form-nueva-receta').onsubmit = function(e) {
        e.preventDefault();
        guardarNuevaReceta(this);
    };
}

function actualizarClases() {
    const equipo = document.getElementById('equipo-select').value;
    const claseSelect = document.getElementById('clase-select');
    const nivelContainer = document.getElementById('nivel-container');
    const colorContainer = document.getElementById('color-container');
    const materialesContainer = document.getElementById('materiales-container');
    const baseContainer = document.getElementById('base-container');
    
    if (!equipo) {
        claseSelect.value = '';
        nivelContainer.style.display = 'none';
        colorContainer.style.display = 'none';
        materialesContainer.style.display = 'none';
        baseContainer.style.display = 'none';
        return;
    }
    
    // Mostrar selector de clase
    claseSelect.style.display = 'block';
    nivelContainer.style.display = 'none';
    colorContainer.style.display = 'none';
    materialesContainer.style.display = 'none';
    baseContainer.style.display = 'none';
}

function actualizarNiveles() {
    const clase = document.getElementById('clase-select').value;
    const nivelSelect = document.getElementById('nivel-select');
    const nivelContainer = document.getElementById('nivel-container');
    const colorContainer = document.getElementById('color-container');
    const materialesContainer = document.getElementById('materiales-container');
    const baseContainer = document.getElementById('base-container');
    
    if (!clase) {
        nivelContainer.style.display = 'none';
        colorContainer.style.display = 'none';
        materialesContainer.style.display = 'none';
        baseContainer.style.display = 'none';
        return;
    }
    
    // Actualizar niveles disponibles
    nivelSelect.innerHTML = '<option value="">Selecciona un nivel...</option>';
    const niveles = nivelesPorClase[clase] || [];
    niveles.forEach(nivel => {
        nivelSelect.innerHTML += `<option value='${nivel}'>${nivel}</option>`;
    });
    
    nivelContainer.style.display = 'block';
    colorContainer.style.display = 'none';
    materialesContainer.style.display = 'none';
    baseContainer.style.display = 'none';
}

function actualizarColores() {
    const clase = document.getElementById('clase-select').value;
    const colorSelect = document.getElementById('color-select');
    const colorContainer = document.getElementById('color-container');
    const materialesContainer = document.getElementById('materiales-container');
    const baseContainer = document.getElementById('base-container');
    
    if (!clase) {
        colorContainer.style.display = 'none';
        materialesContainer.style.display = 'none';
        baseContainer.style.display = 'none';
        return;
    }
    
    // Actualizar colores disponibles
    colorSelect.innerHTML = '<option value="">Selecciona un color...</option>';
    const colores = coloresPorClase[clase] || [];
    colores.forEach(color => {
        colorSelect.innerHTML += `<option value='${color}'>${color}</option>`;
    });
    
    colorContainer.style.display = 'block';
    materialesContainer.style.display = 'none';
    baseContainer.style.display = 'none';
}

function mostrarMaterialesYBase() {
    const equipo = document.getElementById('equipo-select').value;
    const clase = document.getElementById('clase-select').value;
    const nivel = document.getElementById('nivel-select').value;
    const color = document.getElementById('color-select').value;
    const materialesContainer = document.getElementById('materiales-container');
    const baseContainer = document.getElementById('base-container');
    
    if (!equipo || !clase || !nivel || !color) {
        materialesContainer.style.display = 'none';
        baseContainer.style.display = 'none';
        return;
    }
    
    // Mostrar materiales
    materialesContainer.style.display = 'block';
    
    // Mostrar base según restricciones
    const restricciones = obtenerRestriccionesClase(clase);
    const baseInfo = document.getElementById('base-info');
    
    if (restricciones.opcionesBase && restricciones.opcionesBase[equipo]) {
        baseInfo.innerHTML = `<strong>${restricciones.opcionesBase[equipo]}</strong>`;
        if (restricciones.mensajeBase) {
            baseInfo.innerHTML += `<br><small>${restricciones.mensajeBase}</small>`;
        }
    } else {
        baseInfo.innerHTML = `<strong>Base requerida para ${equipo} ${clase}</strong>`;
    }
    
    baseContainer.style.display = 'block';
}

function guardarNuevaReceta(form) {
    const equipo = form.equipo.value;
    const clase = form.clase.value;
    const nivel = form.nivel.value;
    const color = form.color.value;
    const tasaExito = parseInt(form.tasaExito.value);
    
    // Obtener cantidades de materiales
    const materiales = [
        parseInt(form.dorados.value) || 0,
        parseInt(form.morados.value) || 0,
        parseInt(form.azules.value) || 0,
        parseInt(form.verdes.value) || 0,
        parseInt(form.blancos.value) || 0
    ];
    
    // Obtener base según restricciones
    const restricciones = obtenerRestriccionesClase(clase);
    const base = restricciones.opcionesBase && restricciones.opcionesBase[equipo] 
        ? restricciones.opcionesBase[equipo] 
        : `${equipo} ${clase}`;
    
    const nuevaReceta = {
        equipo: equipo,
        clase: clase,
        nivel: nivel,
        color: color,
        base: base,
        materiales: materiales,
        tasaExito: tasaExito
    };
    
    guardarRecetaPersonalizada(nuevaReceta);
    alert('Receta guardada exitosamente');
    mostrarGestorRecetas();
}

function mostrarFormularioEditarReceta(contenido, receta, equipo, clase, nivel, color) {
    let html = `<h2 style='color:#FFD600;text-align:center;'>Editar Receta</h2>`;
    html += `<div style='margin-bottom:15px;padding:10px;background:#f0f0f0;border-radius:4px;'>`;
    html += `<strong>Equipo:</strong> ${equipo}<br>`;
    html += `<strong>Clase:</strong> ${clase}<br>`;
    html += `<strong>Nivel:</strong> ${nivel}<br>`;
    html += `<strong>Color:</strong> ${color}<br>`;
    html += `<strong>Base:</strong> ${receta.base}`;
    html += `</div>`;
    
    html += `<form id='form-editar-receta'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>Cantidad de materiales por color:</label>`;
    html += `<div style='display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;'>`;
    html += `<div><label>Dorados: <input type='number' name='dorados' min='0' value='${receta.materiales[0] || 0}' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `<div><label>Morados: <input type='number' name='morados' min='0' value='${receta.materiales[1] || 0}' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `<div><label>Azules: <input type='number' name='azules' min='0' value='${receta.materiales[2] || 0}' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `<div><label>Verdes: <input type='number' name='verdes' min='0' value='${receta.materiales[3] || 0}' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `<div><label>Blancos: <input type='number' name='blancos' min='0' value='${receta.materiales[4] || 0}' style='width:100%;padding:5px;border-radius:4px;border:1px solid #ccc;'></label></div>`;
    html += `</div>`;
    
    html += `<div style='margin-bottom:15px;'>`;
    html += `<label style='font-weight:bold;display:block;margin-bottom:5px;'>Tasa de éxito (%):</label>`;
    html += `<input type='number' name='tasaExito' min='1' max='100' value='${receta.tasaExito || 100}' required style='width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;'>`;
    html += `</div>`;
    
    html += `<div style='margin-top:20px;text-align:center;'>`;
    html += `<button type='submit' style='background:#FFD600;color:#333;font-weight:bold;padding:10px 20px;border-radius:6px;border:none;margin-right:10px;'>Guardar cambios</button>`;
    html += `<button type='button' id='volver-gestor-recetas' style='background:#2196F3;color:#fff;font-weight:bold;padding:10px 20px;border-radius:6px;border:none;'>← Volver</button>`;
    html += `</div>`;
    html += `</form>`;
    
    contenido.innerHTML = html;
    
    document.getElementById('volver-gestor-recetas').onclick = mostrarGestorRecetas;
    
    document.getElementById('form-editar-receta').onsubmit = function(e) {
        e.preventDefault();
        
        const nuevaReceta = {
            equipo: equipo,
            clase: clase,
            nivel: nivel,
            color: color,
            base: receta.base,
            materiales: [
                parseInt(this.dorados.value) || 0,
                parseInt(this.morados.value) || 0,
                parseInt(this.azules.value) || 0,
                parseInt(this.verdes.value) || 0,
                parseInt(this.blancos.value) || 0
            ],
            tasaExito: parseInt(this.tasaExito.value)
        };
        
        guardarRecetaPersonalizada(nuevaReceta);
        alert('Receta actualizada exitosamente');
        mostrarGestorRecetas();
    };
} 