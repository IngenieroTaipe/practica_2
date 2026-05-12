/**
 * Módulo: storage.js
 * Responsable: Barja Ortiz Erick Gerson
 * Funcionalidades: Gestión de localStorage y sincronización.
 */

export function guardarEnAlmacenamiento(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
    console.log(`Datos guardados en ${clave}`);
}

export function obtenerDeAlmacenamiento(clave) {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : null;
}

export function sincronizarTextArea(idTextArea, callback) {
    const textArea = document.getElementById(idTextArea);
    if (textArea) {
        textArea.addEventListener('input', (e) => {
            callback(e.target.value);
        });
    }
}

export function manejarTeclasEspeciales(evento) {
    // Lógica para tecla S (gris/ocultar), R (reiniciar), F (pantalla completa)
}
