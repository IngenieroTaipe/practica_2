/**
 * Módulo: ruleta.js
 * Responsable: Toribio Anselmo David Angel
 * Funcionalidades: Dibujado dinámico y lógica de giro.
 */

// Estado interno de la ruleta
let opcionesRuleta = [];
let coloresBase = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#d946ef', '#14b8a6'];
let rotacionActual = 0;
let estaGirando = false;
let canvasElemento = null;
let ctx = null;

export function dibujarRuleta(containerId, sectores) {
    console.log("Dibujando ruleta en:", containerId);
    const container = document.getElementById(containerId);
    if (!container) return;

    // Limpiar contenedor
    container.innerHTML = '';

    // Si no hay sectores, usamos 5 por defecto
    if (!sectores || sectores.length === 0) {
        opcionesRuleta = ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5'];
    } else {
        opcionesRuleta = sectores;
    }

    // Crear la flecha indicadora
    const flecha = document.createElement('div');
    flecha.className = 'ruleta-pointer';
    container.appendChild(flecha);

    // Crear el canvas
    canvasElemento = document.createElement('canvas');
    canvasElemento.id = 'ruleta-canvas';
    canvasElemento.width = 400;
    canvasElemento.height = 400;
    container.appendChild(canvasElemento);

    ctx = canvasElemento.getContext('2d');
    
    dibujarSectores();

    // Event Listeners para girar
    canvasElemento.addEventListener('click', girarRuleta);
    
    // Solo registrar el evento del teclado una vez en el window
    if (!window.ruletaTecladoAsignado) {
        window.addEventListener('keydown', (e) => {
            // Activar con la tecla Espacio, si no hay inputs enfocados
            if (e.code === 'Space' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault(); // Evitar scroll
                girarRuleta();
            }
        });
        window.ruletaTecladoAsignado = true;
    }

    // Event Listener para detectar fin de giro
    canvasElemento.addEventListener('transitionend', () => {
        estaGirando = false;
        calcularResultado();
    });
}

function dibujarSectores() {
    if (!ctx || !canvasElemento) return;
    
    const numOpciones = opcionesRuleta.length;
    const anguloPorSector = (2 * Math.PI) / numOpciones;
    const centroX = canvasElemento.width / 2;
    const centroY = canvasElemento.height / 2;
    const radio = Math.min(centroX, centroY) - 10;

    ctx.clearRect(0, 0, canvasElemento.width, canvasElemento.height);

    for (let i = 0; i < numOpciones; i++) {
        const anguloInicio = i * anguloPorSector;
        const anguloFin = anguloInicio + anguloPorSector;
        
        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, radio, anguloInicio, anguloFin);
        ctx.closePath();
        
        ctx.fillStyle = coloresBase[i % coloresBase.length];
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Dibujar texto
        ctx.save();
        ctx.translate(centroX, centroY);
        ctx.rotate(anguloInicio + anguloPorSector / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Inter, sans-serif';
        // Recortar texto muy largo
        let textoCorto = opcionesRuleta[i].length > 15 ? opcionesRuleta[i].substring(0, 15) + '...' : opcionesRuleta[i];
        ctx.fillText(textoCorto, radio - 20, 5);
        ctx.restore();
    }
}

export function girarRuleta() {
    if (estaGirando || !canvasElemento || opcionesRuleta.length === 0) return;
    
    console.log("Iniciando giro aleatorio...");
    estaGirando = true;
    mostrarResultado("Girando...");

    // Calcular grados aleatorios: entre 5 y 10 vueltas completas + un ángulo aleatorio
    const vueltas = Math.floor(Math.random() * 5) + 5; // 5 a 9 vueltas
    const gradosExtra = Math.floor(Math.random() * 360);
    
    rotacionActual += (vueltas * 360) + gradosExtra;
    
    canvasElemento.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
    canvasElemento.style.transform = `rotate(${rotacionActual}deg)`;
}

function calcularResultado() {
    const numOpciones = opcionesRuleta.length;
    const gradosPorSector = 360 / numOpciones;
    
    // El canvas dibuja desde la derecha (3 en punto o 0 grados).
    // Nuestra flecha indicadora está arriba (12 en punto o -90 grados).
    // Fórmula para saber qué índice cae en la posición de -90 grados (270 grados en el círculo completo).
    const rotacionNormalizada = rotacionActual % 360;
    const anguloEfectivo = (630 - rotacionNormalizada) % 360;
    const indiceGanador = Math.floor(anguloEfectivo / gradosPorSector);
    
    const resultado = opcionesRuleta[indiceGanador];
    mostrarResultado(resultado);
}

export function mostrarResultado(valor) {
    const el = document.getElementById('resultado-valor');
    if (el) {
        el.textContent = valor;
        // Animación sencilla al mostrar resultado
        el.style.transform = 'scale(1.1)';
        el.style.color = 'var(--primary-hover)';
        setTimeout(() => {
            el.style.transform = 'scale(1)';
            el.style.color = 'var(--primary-color)';
        }, 300);
    }
}
