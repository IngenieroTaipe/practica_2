/**
 * Módulo: interface.js
 * Responsable: Navarro Serva Lesly Brenda
 * Funcionalidades: Interfaz del sorteo de equipos y validaciones.
 */

export function inicializarInterfazSorteo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Crear la interfaz completa
    container.innerHTML = `
        <div class="sorteo-controles-container">
            <div class="sorteo-input-group">
                <label for="sorteo-titulo">Título del Sorteo:</label>
                <input type="text" id="sorteo-titulo" class="sorteo-input" placeholder="Ej. Torneo de Vóley">
            </div>

            <div class="sorteo-config-row">
                <div class="sorteo-input-group flex-1">
                    <label>Modo de división:</label>
                    <div class="sorteo-radio-group">
                        <label class="radio-label">
                            <input type="radio" name="modo-sorteo" value="cantidad-equipos" checked>
                            Cantidad de equipos
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="modo-sorteo" value="participantes-equipo">
                            Participantes por equipo
                        </label>
                    </div>
                </div>
                
                <div class="sorteo-input-group num-group">
                    <label for="sorteo-numero">Cantidad:</label>
                    <input type="number" id="sorteo-numero" class="sorteo-input number-input" min="2" max="50" value="2">
                </div>
            </div>

            <div class="sorteo-input-group">
                <label for="participantes-sorteo">Participantes (un nombre por línea):</label>
                <textarea 
                    id="participantes-sorteo" 
                    class="participantes-textarea"
                    placeholder="Ejemplo:\nJuan Pérez\nMaría Gómez"
                    rows="10"
                ></textarea>
                <div class="participantes-info">
                    <span id="sorteo-count">0</span>/100 participantes (Máx 50 caracteres c/u)
                </div>
                <div id="sorteo-error" class="error-msg"></div>
            </div>
            
            <div class="sorteo-actions">
                <button id="btn-sortear" class="btn-sortear">¡Generar Equipos!</button>
                <button id="btn-limpiar-sorteo" class="btn-limpiar">Limpiar Formulario</button>
            </div>
        </div>
    `;

    const textArea = document.getElementById('participantes-sorteo');
    const tituloInput = document.getElementById('sorteo-titulo');
    const numeroInput = document.getElementById('sorteo-numero');
    const btnLimpiar = document.getElementById('btn-limpiar-sorteo');
    const radiosModo = document.querySelectorAll('input[name="modo-sorteo"]');
    
    // Cargar datos persistidos desde localStorage
    const datosGuardados = localStorage.getItem('sorteo_participantes');
    if (datosGuardados) {
        textArea.value = datosGuardados;
    }
    
    const tituloGuardado = localStorage.getItem('sorteo_titulo');
    if (tituloGuardado) tituloInput.value = tituloGuardado;
    
    const numeroGuardado = localStorage.getItem('sorteo_numero');
    if (numeroGuardado) numeroInput.value = numeroGuardado;

    const modoGuardado = localStorage.getItem('sorteo_modo');
    if (modoGuardado) {
        radiosModo.forEach(radio => {
            radio.checked = (radio.value === modoGuardado);
        });
    }

    // Event listeners
    textArea.addEventListener('input', manejarEntradaTextArea);
    tituloInput.addEventListener('input', (e) => localStorage.setItem('sorteo_titulo', e.target.value));
    numeroInput.addEventListener('input', (e) => localStorage.setItem('sorteo_numero', e.target.value));
    radiosModo.forEach(radio => {
        radio.addEventListener('change', (e) => localStorage.setItem('sorteo_modo', e.target.value));
    });

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarFormulario);
    }
    
    // Inicializar los contadores si hay datos cargados
    if (datosGuardados) {
        textArea.dispatchEvent(new Event('input'));
    }
}

function manejarEntradaTextArea(e) {
    const textArea = e.target;
    let lineas = textArea.value.split('\n');
    const errorMsg = document.getElementById('sorteo-error');
    
    let validado = true;
    let mensajeError = "";

    // Filtrar y validar cada línea (máx 50 caracteres)
    const lineasFiltradas = lineas.map(linea => {
        if (linea.length > 50) {
            validado = false;
            mensajeError = "Un participante no puede exceder los 50 caracteres.";
            return linea.substring(0, 50);
        }
        return linea;
    });

    // Limitar a 100 participantes
    if (lineasFiltradas.length > 100) {
        validado = false;
        mensajeError = "El límite es de 100 participantes.";
        lineasFiltradas.length = 100;
    }

    if (!validado) {
        errorMsg.textContent = mensajeError;
        // Restaurar posición del cursor para evitar saltos incómodos
        const start = textArea.selectionStart;
        textArea.value = lineasFiltradas.join('\n');
        textArea.setSelectionRange(start, start);
    } else {
        errorMsg.textContent = "";
    }

    const recuento = lineasFiltradas.filter(l => l.trim() !== "").length;
    document.getElementById('sorteo-count').textContent = recuento;

    // Guardar los datos en localStorage para que persistan
    localStorage.setItem('sorteo_participantes', textArea.value);
}

export function validarEntrada(texto) {
    return texto.trim().length > 0;
}

/**
 * Valida todos los campos del formulario de sorteo antes de proceder.
 * @returns {Object} { valido: boolean, mensaje: string, datos: Object }
 */
export function validarFormularioSorteo() {
    const titulo = document.getElementById('sorteo-titulo')?.value.trim();
    const modo = document.querySelector('input[name="modo-sorteo"]:checked')?.value;
    const numero = parseInt(document.getElementById('sorteo-numero')?.value, 10);
    const textArea = document.getElementById('participantes-sorteo');
    
    // Obtener participantes válidos (no vacíos)
    const participantes = textArea ? textArea.value.split('\n').filter(p => p.trim() !== "") : [];

    if (!titulo) {
        return { valido: false, mensaje: "El título del sorteo es obligatorio." };
    }

    if (!numero || numero < 2) {
        return { valido: false, mensaje: "La cantidad debe ser un número válido mayor o igual a 2." };
    }

    if (participantes.length < 2) {
        return { valido: false, mensaje: "Debe ingresar al menos 2 participantes." };
    }

    if (modo === 'cantidad-equipos' && participantes.length < numero) {
        return { valido: false, mensaje: `Hay ${participantes.length} participantes, no se pueden formar ${numero} equipos.` };
    }

    if (modo === 'participantes-equipo' && participantes.length < numero) {
        return { valido: false, mensaje: `Hay ${participantes.length} participantes, no alcanzan para equipos de ${numero} personas.` };
    }

    return { 
        valido: true, 
        mensaje: "Validación exitosa",
        datos: {
            titulo,
            modo,
            numero,
            participantes
        }
    };
}

export function limpiarFormulario() {
    const textArea = document.getElementById('participantes-sorteo');
    const tituloInput = document.getElementById('sorteo-titulo');
    const numeroInput = document.getElementById('sorteo-numero');
    const radiosModo = document.querySelectorAll('input[name="modo-sorteo"]');

    if(textArea) {
        textArea.value = "";
        document.getElementById('sorteo-count').textContent = "0";
        document.getElementById('sorteo-error').textContent = "";
    }
    if (tituloInput) tituloInput.value = "";
    if (numeroInput) numeroInput.value = "2";
    if (radiosModo.length > 0) radiosModo[0].checked = true;
        
    // Limpiar también el localStorage
    localStorage.removeItem('sorteo_participantes');
    localStorage.removeItem('sorteo_titulo');
    localStorage.removeItem('sorteo_numero');
    localStorage.removeItem('sorteo_modo');
}
