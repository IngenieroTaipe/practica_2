/**
 * Módulo: storage.js
 * Responsable: Barja Ortiz Erick Gerson
 * Funcionalidades: Gestión de localStorage, sincronización y teclas especiales.
 */
import { dibujarRuleta } from './ruleta.js';

export function inicializarStorage() {
    const textArea = document.getElementById('ruleta-textarea');
    if (!textArea) return;

    // Cargar datos previos o por defecto
    const datosGuardados = localStorage.getItem('ruleta_participantes');
    if (datosGuardados) {
        textArea.value = datosGuardados;
    } else {
        textArea.value = "Ana\nCarlos\nDavid\nLesly\nErick";
    }

    // Dibujar inicial
    actualizarRuletaDesdeTexto();

    // Evento de escritura
    textArea.addEventListener('input', (e) => {
        localStorage.setItem('ruleta_participantes', e.target.value);
        actualizarRuletaDesdeTexto();
    });

    // Teclas especiales globales
    window.addEventListener('keydown', manejarTeclasEspeciales);
}

function actualizarRuletaDesdeTexto() {
    const textArea = document.getElementById('ruleta-textarea');
    if (!textArea) return;
    const lineas = textArea.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    dibujarRuleta('ruleta-container', lineas);
}

function manejarTeclasEspeciales(e) {
    // Evitar interferencia cuando se escribe en inputs de sorteo
    if (document.activeElement.id === 'sorteo-textarea' || 
        document.activeElement.id === 'sorteo-titulo' || 
        document.activeElement.id === 'sorteo-cantidad') {
        return;
    }

    const tecla = e.key.toLowerCase();
    const escribiendoRuleta = document.activeElement.id === 'ruleta-textarea';

    // Tecla F: Pantalla completa (siempre permitida)
    if (tecla === 'f' && !e.ctrlKey && !e.metaKey) {
        if (!escribiendoRuleta) { // Si esta escribiendo una F, no la bloqueamos
            e.preventDefault();
            alternarPantallaCompleta();
        }
    }

    // Teclas R y S (solo si no estamos escribiendo dentro del textarea para no evitar teclear esas letras)
    if (!escribiendoRuleta) {
        if (tecla === 'r') {
            e.preventDefault();
            reiniciarRuleta();
        } else if (tecla === 's') {
            e.preventDefault();
            quitarGanador();
        }
    }
}

function alternarPantallaCompleta() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error al intentar pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

function reiniciarRuleta() {
    const textArea = document.getElementById('ruleta-textarea');
    if (textArea) {
        if(confirm("¿Seguro que deseas reiniciar y borrar la lista de la ruleta?")) {
            textArea.value = "";
            localStorage.removeItem('ruleta_participantes');
            actualizarRuletaDesdeTexto();
            const el = document.getElementById('resultado-valor');
            if (el) el.textContent = "-";
        }
    }
}

function quitarGanador() {
    const ganadorActual = document.getElementById('resultado-valor')?.textContent;
    if (!ganadorActual || ganadorActual === "-" || ganadorActual === "Girando...") return;

    const textArea = document.getElementById('ruleta-textarea');
    if (textArea) {
        let lineas = textArea.value.split('\n');
        // Encontrar la primera coincidencia exacta (con trim)
        const index = lineas.findIndex(l => l.trim() === ganadorActual);
        if (index !== -1) {
            lineas.splice(index, 1);
            textArea.value = lineas.join('\n');
            localStorage.setItem('ruleta_participantes', textArea.value);
            actualizarRuletaDesdeTexto();
            const el = document.getElementById('resultado-valor');
            if (el) el.textContent = "-"; // Reset resultado
            alert(`Participante '${ganadorActual}' retirado de la ruleta.`);
        }
    }
}
