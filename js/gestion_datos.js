/**
 * Módulo: gestion_datos.js
 * Responsable: Equipo de Desarrollo
 * Funcionalidades: Gestión del TextArea de la ruleta, sincronización automática,
 * lógica de teclas S y R, pantalla completa, y manejo de localStorage.
 */

import { guardarEnAlmacenamiento, obtenerDeAlmacenamiento } from './storage.js';
import { dibujarRuleta, girarRuleta, mostrarResultado } from './ruleta.js';

// Claves para localStorage
const CLAVE_TEXTAREA_RULETA = 'textarea_ruleta';
const CLAVE_SECTORES_RULETA = 'sectores_ruleta';

// Estado de la ruleta
let sectores = [];
let sectoresOcultos = new Set();

// Función para inicializar el TextArea de la ruleta
export function inicializarTextAreaRuleta(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Crear TextArea
    const textArea = document.createElement('textarea');
    textArea.id = 'textarea-ruleta';
    textArea.placeholder = 'Ingresa los participantes, uno por línea (máx 100, 50 chars c/u)';
    textArea.rows = 10;
    textArea.cols = 50;

    // Recuperar datos guardados
    const datosGuardados = obtenerDeAlmacenamiento(CLAVE_TEXTAREA_RULETA);
    if (datosGuardados) {
        textArea.value = datosGuardados;
        sectores = datosGuardados.split('\n').filter(line => line.trim() !== '');
    }

    // Agregar al contenedor
    container.appendChild(textArea);

    // Sincronización automática
    textArea.addEventListener('input', () => {
        const texto = textArea.value;
        sectores = texto.split('\n').filter(line => line.trim() !== '' && !sectoresOcultos.has(line.trim()));
        guardarEnAlmacenamiento(CLAVE_TEXTAREA_RULETA, texto);
        actualizarRuleta();
    });

    // Manejo de teclas
    document.addEventListener('keydown', manejarTeclas);
}

// Función para actualizar la ruleta
function actualizarRuleta() {
    const containerId = 'ruleta-container';
    dibujarRuleta(containerId, sectores);
    guardarEnAlmacenamiento(CLAVE_SECTORES_RULETA, sectores);
}

// Función para manejar teclas especiales
function manejarTeclas(event) {
    switch (event.key.toLowerCase()) {
        case 'f4':
            event.preventDefault();
            // Guardar/recuperar TextArea (ya se hace automáticamente en input)
            break;
        case 'f5':
        case 'f6':
            event.preventDefault();
            actualizarRuleta();
            break;
        case 's':
            event.preventDefault();
            marcarYOcultarSector();
            break;
        case 'r':
            event.preventDefault();
            reiniciarRuleta();
            break;
        case 'f':
            event.preventDefault();
            togglePantallaCompleta();
            break;
    }
}

// Función para marcar gris y ocultar sector (tecla S)
function marcarYOcultarSector() {
    // Asumiendo que hay un sector seleccionado o el último resultado
    const resultadoEl = document.getElementById('resultado-valor');
    if (resultadoEl && resultadoEl.textContent !== '-') {
        const sector = resultadoEl.textContent.trim();
        if (!sectoresOcultos.has(sector)) {
            sectoresOcultos.add(sector);
            // Marcar como gris (esto podría requerir modificar dibujarRuleta para manejar ocultos)
            actualizarRuleta();
        }
    }
}

// Función para reiniciar (tecla R)
function reiniciarRuleta() {
    sectoresOcultos.clear();
    const textArea = document.getElementById('textarea-ruleta');
    if (textArea) {
        textArea.value = '';
        sectores = [];
        guardarEnAlmacenamiento(CLAVE_TEXTAREA_RULETA, '');
        actualizarRuleta();
        mostrarResultado('-');
    }
}

// Función para pantalla completa (tecla F)
function togglePantallaCompleta() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Función para obtener sectores visibles
export function obtenerSectoresVisibles() {
    return sectores.filter(sector => !sectoresOcultos.has(sector));
}