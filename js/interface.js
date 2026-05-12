/**
 * Módulo: interface.js
 * Responsable: Navarro Serva Lesly Brenda
 * Funcionalidades: Interfaz del sorteo de equipos y validaciones.
 */

export function inicializarInterfazSorteo(containerId) {
    console.log("Inicializando interfaz de sorteo en:", containerId);
    // Lógica para crear el TextArea (máx 100 participantes, 50 chars c/u)
}

export function validarEntrada(texto) {
    // Validaciones de entrada
    return texto.length > 0;
}

export function limpiarFormulario() {
    console.log("Limpiando formulario de sorteo...");
}
