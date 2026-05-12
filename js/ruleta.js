/**
 * Módulo: ruleta.js
 * Responsable: Toribio Anselmo David Angel
 * Funcionalidades: Dibujado dinámico y lógica de giro.
 */

export function dibujarRuleta(canvasId, sectores) {
    console.log("Dibujando ruleta en:", canvasId);
    // Lógica para dibujar sectores de 5 colores básicos
}

export function girarRuleta() {
    console.log("Iniciando giro aleatorio...");
    // Lógica de giro activada por click o SPACE
}

export function mostrarResultado(valor) {
    const el = document.getElementById('resultado-valor');
    if (el) el.textContent = valor;
}
