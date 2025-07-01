/**
 * Módulo de Consulta Rápida
 *
 * Este módulo contiene la lógica para mostrar la consulta rápida de materiales,
 * permitiendo calcular cuántos equipos completos se pueden fabricar con los materiales actuales,
 * y mostrar un desglose detallado. Incluye también la edición rápida de recetas personalizadas.
 *
 * Puede ser reutilizado en el futuro para añadir un acceso rápido desde otros lugares de la interfaz,
 * o para integrarse como función avanzada en el gestor de recetas.
 */
import { consultaRapidaMateriales, guardarRecetaPersonalizada } from './materiales.js';

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
    const receta = estado.recetaActual || {
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
    html += `<div><label>Tasa de éxito (%): <input type='text' name='tasaExito' value='${receta.tasaExito}'></label></div>`;
    console.log('Mostrando tasaExito en input:', receta.tasaExito);
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
                let tasaExitoStr = form.tasaExito.value.replace(',', '.').trim();
                console.log('Guardando tasaExito:', tasaExitoStr);
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
                    tasaExito: tasaExitoStr
                };
                guardarRecetaPersonalizada(nuevaReceta);
                form.querySelector('button[type=submit]').textContent = '¡Guardado!';
                setTimeout(()=>{form.querySelector('button[type=submit]').textContent = 'Guardar receta';}, 1200);
            };
        }
    }, 200);
} 