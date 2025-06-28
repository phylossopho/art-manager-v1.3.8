// scripts/eventos.js
// ============= INICIO DE eventos.js =============
import * as ui from './ui.js';
import * as galeria from './galeria.js';
import * as modales from './modales.js';
import { usarMateriales } from './materiales.js';
import { crearBaseSelector, actualizarEstadoBase } from './baselogic.js';
import { abrirListaMateriales } from './materiales.js';

function configurarEventListeners(estado) {
    try {
        // === SELECTORES PRINCIPALES ===
        const equipmentSelect = document.getElementById('equipment-select');
        const classSelect = document.getElementById('class-select');
        const levelSelect = document.getElementById('level-select');
        const colorSelect = document.getElementById('color-select');

        // Event listeners para selectores
        equipmentSelect.addEventListener('change', () => {
            estado.equipoActual = equipmentSelect.value;
            ui.actualizarImagenEquipo(estado);
            ui.actualizarTablaMateriales(estado);
        });

        classSelect.addEventListener('change', () => {
            estado.claseActual = classSelect.value;
            ui.actualizarTablaMateriales(estado);
        });

        levelSelect.addEventListener('change', () => {
            estado.nivelActual = levelSelect.value;
            ui.actualizarTablaMateriales(estado);
        });

        colorSelect.addEventListener('change', () => {
            estado.colorActual = colorSelect.value;
            ui.actualizarTablaMateriales(estado);
        });

        // === BOTÓN MOSTRAR MATERIALES ===
        const showMaterialsButton = document.getElementById('show-materials');
        showMaterialsButton.addEventListener('click', () => {
            abrirListaMateriales(estado);
        });

        // === BOTÓN GALERÍA ===
        const galleryButton = document.getElementById('gallery-button');
        galleryButton.addEventListener('click', () => {
            galeria.abrirGaleria(estado);
        });

        // === BOTÓN USAR MATERIALES ===
        const useMaterialsButton = document.getElementById('use-materials');
        useMaterialsButton.addEventListener('click', () => {
            usarMateriales(estado);
        });

        // === BOTÓN VOLVER A MATERIALES (ARTE) ===
        const arteBackButton = document.getElementById('arte-back-button');
        if (arteBackButton) {
            arteBackButton.addEventListener('click', () => {
                ui.cambiarPestana('materials');
            });
        }

        // === BOTÓN VOLVER (MODAL MATERIALES) ===
        const materialsBackButton = document.getElementById('materials-back-button');
        if (materialsBackButton) {
            materialsBackButton.addEventListener('click', () => {
                modales.cerrarModalMateriales();
            });
        }

        // === PESTAÑAS ===
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                ui.cambiarPestana(tabName);
            });
        });

        // === GALERÍA ===
        const addImageButton = document.getElementById('add-image-button');
        const galleryFileInput = document.getElementById('gallery-file-input');

        addImageButton.addEventListener('click', () => {
            galleryFileInput.click();
        });

        galleryFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                galeria.agregarImagenAGaleria(file, estado);
            }
        });

        // === CARRUSEL ===
        const carouselPrev = document.getElementById('carousel-prev');
        const carouselNext = document.getElementById('carousel-next');
        const carouselClose = document.getElementById('carousel-close');

        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => {
                if (estado.imagenesGaleria.length > 0) {
                    estado.indiceCarruselActual = (estado.indiceCarruselActual - 1 + estado.imagenesGaleria.length) % estado.imagenesGaleria.length;
                    galeria.mostrarImagenCarrusel(estado);
                }
            });
        }

        if (carouselNext) {
            carouselNext.addEventListener('click', () => {
                if (estado.imagenesGaleria.length > 0) {
                    estado.indiceCarruselActual = (estado.indiceCarruselActual + 1) % estado.imagenesGaleria.length;
                    galeria.mostrarImagenCarrusel(estado);
                }
            });
        }

        if (carouselClose) {
            carouselClose.addEventListener('click', () => {
                const modal = document.getElementById('carousel-modal');
                modal.style.display = 'none';
            });
        }

        // === CERRAR MODALES ===
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Cerrar modales al hacer clic fuera
        window.addEventListener('click', (e) => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // === SELECTORES DE COLOR POR MATERIAL ===
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('material-color-select')) {
                const materialId = e.target.getAttribute('data-material');
                const color = e.target.value;
                const storageKey = `${estado.claseActual}:${materialId}`;
                estado.colorPorMaterialSeleccionado[storageKey] = color;
                estado.cambiosPendientes = true;
            }
        });

        // === SELECTOR BASE ===
        document.addEventListener('change', (e) => {
            if (e.target.id === 'base-select') {
                actualizarEstadoBase(estado, e.target.value);
            }
        });

        console.log('Event listeners configurados con éxito');
    } catch (error) {
        console.error('Error al configurar event listeners:', error);
    }
}

export default configurarEventListeners;
// ============= FIN DE eventos.js =============