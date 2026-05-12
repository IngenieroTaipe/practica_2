/**
 * Módulo: interface.js
 * Responsable: Navarro Serva Lesly Brenda
 * Funcionalidades: Interfaz del sorteo de equipos y validaciones.
 */

import { generarEquiposAleatorios } from './sorteo.js';

export function inicializarInterfazSorteo() {
    const txtArea = document.getElementById('sorteo-textarea');
    const txtTitulo = document.getElementById('sorteo-titulo');
    const contador = document.getElementById('sorteo-contador');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const btnSortear = document.getElementById('btn-sortear');
    const selectTipo = document.getElementById('sorteo-tipo-division');
    const inputCantidad = document.getElementById('sorteo-cantidad');

    if (!txtArea) return;

    // Cargar desde LocalStorage
    const guardado = localStorage.getItem('sorteo_participantes');
    if (guardado) txtArea.value = guardado;
    
    const tituloGuardado = localStorage.getItem('sorteo_titulo');
    if (tituloGuardado) txtTitulo.value = tituloGuardado;

    actualizarContador();

    // Eventos de guardado automático
    txtArea.addEventListener('input', (e) => {
        localStorage.setItem('sorteo_participantes', e.target.value);
        actualizarContador();
    });

    txtTitulo.addEventListener('input', (e) => {
        localStorage.setItem('sorteo_titulo', e.target.value);
    });

    // Botones
    btnLimpiar.addEventListener('click', limpiarFormulario);
    
    btnSortear.addEventListener('click', () => {
        const validado = validarEntrada();
        if (validado) {
            generarEquiposAleatorios(
                validado.participantes, 
                parseInt(inputCantidad.value), 
                selectTipo.value, 
                txtTitulo.value
            );
        }
    });

    function actualizarContador() {
        const lineas = txtArea.value.split('\n').filter(l => l.trim().length > 0);
        contador.textContent = `${lineas.length} / 100`;
        if (lineas.length > 100) {
            contador.style.color = 'var(--ef4444)';
        } else {
            contador.style.color = 'var(--text-muted)';
        }
    }
}

export function validarEntrada() {
    const txtArea = document.getElementById('sorteo-textarea');
    const errorMsg = document.getElementById('sorteo-error');
    errorMsg.textContent = "";

    const lineas = txtArea.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    if (lineas.length === 0) {
        errorMsg.textContent = "Error: Debes ingresar al menos un participante.";
        return null;
    }
    
    if (lineas.length > 100) {
        errorMsg.textContent = "Error: El máximo permitido es de 100 participantes.";
        return null;
    }

    // Validar max 50 caracteres por persona
    for (let i = 0; i < lineas.length; i++) {
        if (lineas[i].length > 50) {
            errorMsg.textContent = `Error: El participante en la línea ${i+1} excede los 50 caracteres permitidos.`;
            return null;
        }
    }

    const cantidad = parseInt(document.getElementById('sorteo-cantidad').value);
    if (isNaN(cantidad) || cantidad <= 0) {
        errorMsg.textContent = "Error: Ingresa una cantidad válida mayor a 0.";
        return null;
    }

    return { participantes: lineas };
}

export function limpiarFormulario() {
    if(confirm("¿Seguro que deseas limpiar todos los datos del sorteo?")) {
        document.getElementById('sorteo-textarea').value = "";
        document.getElementById('sorteo-titulo').value = "";
        localStorage.removeItem('sorteo_participantes');
        localStorage.removeItem('sorteo_titulo');
        document.getElementById('sorteo-contador').textContent = "0 / 100";
        document.getElementById('sorteo-container').innerHTML = '<div class="placeholder-content">Los resultados aparecerán aquí</div>';
        document.getElementById('btn-export-jpg').disabled = true;
        document.getElementById('btn-export-clipboard').disabled = true;
        document.getElementById('sorteo-error').textContent = "";
    }
}
