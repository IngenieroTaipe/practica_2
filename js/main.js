/**
 * Punto de entrada principal
 * Importa y coordina los módulos de los integrantes.
 */

import { inicializarStorage } from './storage.js';
import { inicializarInterfazSorteo } from './interface.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplicación Práctica 2 inicializada");

    // Inicializar componentes base y de almacenamiento
    inicializarStorage();
    inicializarInterfazSorteo();
});
