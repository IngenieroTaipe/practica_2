/**
 * Punto de entrada principal
 * Importa y coordina los módulos de los integrantes.
 */

import { dibujarRuleta } from './ruleta.js';
import { inicializarInterfazSorteo } from './interface.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplicación Práctica 2 inicializada");

    // Inicializar componentes base
    dibujarRuleta('ruleta-container', []);
    inicializarInterfazSorteo('sorteo-container');
});
