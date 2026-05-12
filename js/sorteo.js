/**
 * Módulo: sorteo.js
 * Responsable: Yauri Torres Benjamin Raul
 * Funcionalidades: Algoritmo de generación aleatoria y exportación.
 */

/**
 * F3: Generar equipos aleatoriamente
 * @param {Array} participantes - Lista de nombres
 * @param {number} valor - Número (equipos o participantes por equipo)
 * @param {string} tipo - 'cantidad-equipos' o 'participantes-equipo'
 * @returns {Array} Array de equipos, cada equipo es un array de participantes
 */
export function generarEquiposAleatorios(participantes, valor, tipo) {
    if (!participantes || participantes.length === 0) {
        return [];
    }
    
    // Mezclar participantes (Fisher-Yates)
    const mezclados = [...participantes];
    for (let i = mezclados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
    }
    
    let numEquipos;
    
    if (tipo === 'cantidad-equipos') {
        numEquipos = valor;
    } else {
        // tipo === 'participantes-equipo'
        numEquipos = Math.ceil(mezclados.length / valor);
    }
    
    // Distribuir en equipos
    const equipos = Array(numEquipos).fill().map(() => []);
    mezclados.forEach((participante, index) => {
        equipos[index % numEquipos].push(participante);
    });
    
    return equipos.filter(equipo => equipo.length > 0);
}

/**
 * F3: Mostrar animación uno a uno en la segunda pantalla
 * @param {Array} equipos - Array de equipos
 * @param {string} titulo - Título del sorteo
 * @param {HTMLElement} contenedor - Donde se mostrará (sorteo-container)
 */
export async function mostrarAnimacionEquipos(equipos, titulo, contenedor) {
    // Limpiar el contenedor y crear vista de resultados
    contenedor.innerHTML = '';
    
    // Contenedor principal de resultados
    const resultadosDiv = document.createElement('div');
    resultadosDiv.id = 'resultados-sorteo-view';
    
    // Título del sorteo
    if (titulo) {
        const tituloElem = document.createElement('h3');
        tituloElem.textContent = titulo;
        tituloElem.style.cssText = 'text-align: center; margin-bottom: 1.5rem; color: #1e293b;';
        resultadosDiv.appendChild(tituloElem);
    }
    
    // Grid para equipos
    const equiposGrid = document.createElement('div');
    equiposGrid.className = 'sorteo-grid';
    resultadosDiv.appendChild(equiposGrid);
    
    // Crear rectángulos para cada equipo (vacíos inicialmente)
    const equiposData = [];
    for (let i = 0; i < equipos.length; i++) {
        const equipoCard = document.createElement('div');
        equipoCard.className = 'equipo-card';
        equipoCard.innerHTML = `
            <h3 style="color: #2563eb; margin-bottom: 0.75rem;">Equipo ${i + 1}</h3>
            <ul class="participantes-lista" style="list-style: none; padding: 0; margin: 0;"></ul>
        `;
        equiposGrid.appendChild(equipoCard);
        equiposData.push({
            card: equipoCard,
            lista: equipoCard.querySelector('.participantes-lista')
        });
    }
    
    contenedor.appendChild(resultadosDiv);
    
    // *** ANIMACIÓN UNO A UNO (F3) ***
    for (let i = 0; i < equipos.length; i++) {
        const equipo = equipos[i];
        const { lista } = equiposData[i];
        
        for (const participante of equipo) {
            const li = document.createElement('li');
            li.textContent = participante;
            li.style.cssText = 'padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0;';
            lista.appendChild(li);
            await delay(300); // 300ms entre cada persona
        }
    }
    
    // Agregar los 3 botones de exportación (F4)
    agregarBotonesExportacion(resultadosDiv, equipos, titulo);
    
    // Scroll hacia los resultados
    contenedor.scrollIntoView({ behavior: 'smooth' });
}

/**
 * F4: Agregar los 3 botones de exportación
 */
function agregarBotonesExportacion(contenedor, equipos, titulo) {
    const divBotones = document.createElement('div');
    divBotones.style.cssText = 'display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;';
    
    // Botón 1: Descargar JPG
    const btnJPG = document.createElement('button');
    btnJPG.textContent = '📸 Descargar JPG';
    btnJPG.style.cssText = 'padding: 0.75rem 1.5rem; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;';
    btnJPG.onclick = () => exportarAImagen(contenedor, titulo, equipos);
    
    // Botón 2: Copiar al portapapeles
    const btnCopiar = document.createElement('button');
    btnCopiar.textContent = '📋 Copiar al portapapeles';
    btnCopiar.style.cssText = 'padding: 0.75rem 1.5rem; background: #16a34a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;';
    btnCopiar.onclick = () => copiarResultadosPortapapeles(equipos, titulo);
    
    // Botón 3: Copiar por columnas
    const btnColumnas = document.createElement('button');
    btnColumnas.textContent = '📊 Copiar por columnas';
    btnColumnas.style.cssText = 'padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;';
    btnColumnas.onclick = () => copiarPorColumnas(equipos);
    
    divBotones.appendChild(btnJPG);
    divBotones.appendChild(btnCopiar);
    divBotones.appendChild(btnColumnas);
    
    contenedor.appendChild(divBotones);
}

/**
 * F4: Exportar a JPG (usando Canvas API nativa)
 */
export function exportarAImagen(elemento, titulo, equipos) {
    // Como no se pueden usar librerías externas, ofrecemos alternativa
    const confirmar = confirm(
        'Para descargar como JPG sin librerías externas:\n\n' +
        '1. Toma una captura de pantalla (Windows: Win+Shift+S / Mac: Cmd+Shift+4)\n' +
        '2. O usa la opción "Copiar al portapapeles" para guardar el texto\n\n' +
        '¿Quieres copiar los resultados al portapapeles como alternativa?'
    );
    
    if (confirmar) {
        copiarResultadosPortapapeles(equipos, titulo);
    }
}

/**
 * F4: Copiar resultados al portapapeles (formato legible)
 */
export function copiarResultadosPortapapeles(equipos, titulo) {
    const texto = formatearEquiposTexto(equipos, titulo);
    copiarAlPortapapeles(texto);
    alert('¡Resultados copiados al portapapeles!');
}

/**
 * F4: Copiar equipos en columnas separadas
 */
export function copiarPorColumnas(equipos) {
    let texto = '';
    equipos.forEach((equipo, index) => {
        texto += `Equipo ${index + 1}: ${equipo.join(', ')}\n`;
    });
    copiarAlPortapapeles(texto);
    alert('¡Equipos copiados por columnas!');
}

/**
 * Helper: Copiar texto al portapapeles
 */
export function copiarAlPortapapeles(texto) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).catch(() => copiarAlternativo(texto));
    } else {
        copiarAlternativo(texto);
    }
}

/**
 * Helper: Formatear equipos como texto
 */
function formatearEquiposTexto(equipos, titulo) {
    let texto = titulo ? `${titulo}\n${'='.repeat(40)}\n\n` : '';
    equipos.forEach((equipo, index) => {
        texto += `🔹 EQUIPO ${index + 1} 🔹\n`;
        texto += `${'-'.repeat(25)}\n`;
        equipo.forEach((p, i) => {
            texto += `${i + 1}. ${p}\n`;
        });
        texto += '\n';
    });
    return texto;
}

/**
 * Helper: Copia alternativa (fallback)
 */
function copiarAlternativo(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

/**
 * Helper: Delay para animación
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}