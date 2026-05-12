/**
 * Punto de entrada principal
 * Importa y coordina los módulos de los integrantes.
 */

import { dibujarRuleta } from './ruleta.js';
import { inicializarInterfazSorteo } from './interface.js';
import { inicializarTextAreaRuleta } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplicación Práctica 2 inicializada");

    // Callback para actualizar la ruleta cuando cambia el textarea
    const actualizarRuleta = (sectores) => {
        dibujarRuleta('ruleta-container', sectores);
    };

    // Inicializar componentes base
    inicializarTextAreaRuleta('ruleta-container', actualizarRuleta);
    inicializarInterfazSorteo('sorteo-container');
});
