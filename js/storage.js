/**
 * Módulo: storage.js
 * Responsable: Barja Ortiz Erick Gerson
 * Funcionalidades: Gestión del TextArea de la ruleta, localStorage, sincronización automática y atajos de teclado.
 */

const CLAVE_TEXTAREA = 'ruleta_participantes';
let sectoresOcultos = new Set();

/**
 * Guarda datos en localStorage
 */
export function guardarEnAlmacenamiento(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
    console.log(`Datos guardados en ${clave}`);
}

/**
 * Obtiene datos del localStorage
 */
export function obtenerDeAlmacenamiento(clave) {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : null;
}

/**
 * Inicializa el TextArea de la ruleta con sincronización automática
 */
export function inicializarTextAreaRuleta(containerId, callbackActualizar) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Crear TextArea
    const textArea = document.createElement('textarea');
    textArea.id = 'textarea-ruleta';
    textArea.placeholder = 'Ingresa los participantes, uno por línea (máx 100, 50 chars c/u)';
    textArea.rows = 10;
    textArea.cols = 50;
    textArea.style.marginBottom = '20px';
    container.appendChild(textArea);

    // Recuperar datos guardados
    const datosGuardados = obtenerDeAlmacenamiento(CLAVE_TEXTAREA);
    if (datosGuardados) {
        textArea.value = datosGuardados;
    }

    // Sincronización automática: al escribir, se guarda y se actualiza la ruleta
    textArea.addEventListener('input', () => {
        guardarEnAlmacenamiento(CLAVE_TEXTAREA, textArea.value);
        const sectores = textArea.value
            .split('\n')
            .map(s => s.trim())
            .filter(s => s !== '' && !sectoresOcultos.has(s));
        if (callbackActualizar) {
            callbackActualizar(sectores);
        }
    });

    // Atajos de teclado
    document.addEventListener('keydown', (evento) => {
        manejarTeclasEspeciales(evento, textArea, callbackActualizar);
    });

    // Actualizar ruleta inicial si hay datos
    if (datosGuardados) {
        const sectores = datosGuardados
            .split('\n')
            .map(s => s.trim())
            .filter(s => s !== '' && !sectoresOcultos.has(s));
        if (callbackActualizar) {
            callbackActualizar(sectores);
        }
    }
}

/**
 * Sincroniza un TextArea con callback
 */
export function sincronizarTextArea(idTextArea, callback) {
    const textArea = document.getElementById(idTextArea);
    if (textArea) {
        textArea.addEventListener('input', (e) => {
            callback(e.target.value);
        });
    }
}

/**
 * Manejo de atajos de teclado: S (marcar gris), R (reiniciar), F (pantalla completa)
 */
export function manejarTeclasEspeciales(evento, textArea, callbackActualizar) {
    const tecla = evento.key.toLowerCase();

    if (tecla === 's') {
        evento.preventDefault();
        marcarYOcultar(textArea, callbackActualizar);
    } else if (tecla === 'r') {
        evento.preventDefault();
        reiniciar(textArea, callbackActualizar);
    } else if (tecla === 'f') {
        evento.preventDefault();
        togglePantallaCompleta();
    }
}

/**
 * Marca un sector como gris (oculto) - Tecla S
 */
function marcarYOcultar(textArea, callbackActualizar) {
    const resultadoEl = document.getElementById('resultado-valor');
    if (resultadoEl && resultadoEl.textContent !== '-') {
        const sector = resultadoEl.textContent.trim();
        if (!sectoresOcultos.has(sector)) {
            sectoresOcultos.add(sector);
            // Actualizar ruleta sin el sector oculto
            const sectoresActuales = textArea.value
                .split('\n')
                .map(s => s.trim())
                .filter(s => s !== '' && !sectoresOcultos.has(s));
            if (callbackActualizar) {
                callbackActualizar(sectoresActuales);
            }
            console.log(`Sector "${sector}" marcado como oculto`);
        }
    }
}

/**
 * Reinicia la ruleta limpiando todo - Tecla R
 */
function reiniciar(textArea, callbackActualizar) {
    if (textArea) {
        textArea.value = '';
        guardarEnAlmacenamiento(CLAVE_TEXTAREA, '');
        sectoresOcultos.clear();
        if (callbackActualizar) {
            callbackActualizar([]);
        }
        // Limpiar resultado
        const resultadoEl = document.getElementById('resultado-valor');
        if (resultadoEl) {
            resultadoEl.textContent = '-';
        }
        console.log("Ruleta reiniciada");
    }
}

/**
 * Toggle de pantalla completa - Tecla F
 */
function togglePantallaCompleta() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error al intentar pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Obtiene sectores ocultos actuales
 */
export function obtenerSectoresOcultos() {
    return new Set(sectoresOcultos);
}

/**
 * Limpia los sectores ocultos
 */
export function limpiarSectoresOcultos() {
    sectoresOcultos.clear();
}
