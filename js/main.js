/**
 * Punto de entrada principal
 * Importa y coordina los módulos de los integrantes.
 */

import { dibujarRuleta } from './ruleta.js';
import { inicializarInterfazSorteo } from './interface.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplicación Práctica 2 inicializada");

    // Opciones iniciales de prueba para la ruleta
    const opcionesPrueba = ['Erick', 'Lesly', 'David', 'Benjamin', 'Docente'];

    // Inicializar componentes base
    dibujarRuleta('ruleta-container', opcionesPrueba);
    inicializarInterfazSorteo('sorteo-container');
});
