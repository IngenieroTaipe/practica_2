/**
 * Módulo: sorteo.js
 * Responsable: Yauri Torres Benjamin Raul
 * Funcionalidades: Algoritmo de generación aleatoria y exportación.
 */

let ultimosEquipos = [];
let ultimoTitulo = "";

export function generarEquiposAleatorios(participantes, cantidad, tipo, titulo) {
    const container = document.getElementById('sorteo-container');
    container.innerHTML = ''; // Limpiar resultados anteriores
    
    // Algoritmo Fisher-Yates para mezclar aleatoriamente
    let mezclados = [...participantes];
    for (let i = mezclados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
    }

    let equipos = [];
    
    // Lógica de división
    if (tipo === 'cantidad_equipos') {
        const numEquipos = Math.min(cantidad, mezclados.length);
        for(let i=0; i<numEquipos; i++) equipos.push([]);
        mezclados.forEach((p, idx) => {
            equipos[idx % numEquipos].push(p);
        });
    } else {
        // participantes_equipo
        const tamano = cantidad;
        for (let i = 0; i < mezclados.length; i += tamano) {
            equipos.push(mezclados.slice(i, i + tamano));
        }
    }

    ultimosEquipos = equipos;
    ultimoTitulo = titulo || "Sorteo de Equipos";

    // Renderizar UI con animaciones
    const tituloEl = document.createElement('h3');
    tituloEl.textContent = ultimoTitulo;
    tituloEl.className = 'resultado-titulo';
    container.appendChild(tituloEl);

    const grid = document.createElement('div');
    grid.className = 'sorteo-grid';
    container.appendChild(grid);

    equipos.forEach((equipo, i) => {
        const card = document.createElement('div');
        card.className = 'equipo-card';
        card.innerHTML = `<h4 class="equipo-titulo">Equipo ${i+1}</h4><ul class="equipo-lista"></ul>`;
        grid.appendChild(card);
        
        const ul = card.querySelector('ul');
        
        // Animación uno a uno usando setTimeout
        equipo.forEach((miembro, j) => {
            setTimeout(() => {
                const li = document.createElement('li');
                li.textContent = miembro;
                li.className = 'animar-entrada';
                ul.appendChild(li);
            }, (i * 300) + (j * 400)); // Delay escalonado
        });
    });

    // Habilitar botones de exportación cuando empiece la animación
    setTimeout(() => {
        document.getElementById('btn-export-jpg').disabled = false;
        document.getElementById('btn-export-clipboard').disabled = false;
    }, 500);
}

export function exportarAImagen() {
    if(ultimosEquipos.length === 0) return;
    
    // Crear un canvas nativo para exportar la imagen
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Dimensiones de la imagen
    const columnas = Math.min(3, ultimosEquipos.length);
    const filas = Math.ceil(ultimosEquipos.length / columnas);
    const anchoCard = 300;
    const altoLinea = 30;
    
    // Determinar la altura de la tarjeta más alta
    let maxIntegrantes = 0;
    ultimosEquipos.forEach(eq => { if(eq.length > maxIntegrantes) maxIntegrantes = eq.length; });
    const altoCard = 70 + (maxIntegrantes * altoLinea);
    
    canvas.width = (anchoCard * columnas) + ((columnas+1) * 30);
    canvas.height = 100 + (altoCard * filas) + ((filas+1) * 30);
    
    // Dibujar Fondo
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar Título Principal
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ultimoTitulo, canvas.width / 2, 60);
    
    // Dibujar Equipos
    ctx.textAlign = 'left';
    ultimosEquipos.forEach((equipo, i) => {
        const col = i % columnas;
        const fil = Math.floor(i / columnas);
        
        const x = 30 + (col * (anchoCard + 30));
        const y = 100 + (fil * (altoCard + 30));
        
        // Fondo de tarjeta
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        ctx.fillRect(x, y, anchoCard, altoCard);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        
        // Borde superior decorativo
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(x, y, anchoCard, 6);
        
        // Título del Equipo
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(`Equipo ${i+1}`, x + 20, y + 45);
        
        // Integrantes
        ctx.fillStyle = '#334155';
        ctx.font = '18px sans-serif';
        equipo.forEach((miembro, j) => {
            let txt = miembro.length > 25 ? miembro.substring(0, 22) + '...' : miembro;
            ctx.fillText(`• ${txt}`, x + 20, y + 85 + (j * altoLinea));
        });
    });
    
    // Trigger Descarga
    const link = document.createElement('a');
    link.download = 'sorteo_equipos.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
}

export function copiarAlPortapapeles() {
    if(ultimosEquipos.length === 0) return;
    
    let texto = `🌟 ${ultimoTitulo.toUpperCase()} 🌟\n\n`;
    ultimosEquipos.forEach((equipo, i) => {
        texto += `=== EQUIPO ${i+1} ===\n`;
        equipo.forEach(miembro => {
            texto += `- ${miembro}\n`;
        });
        texto += '\n';
    });
    
    navigator.clipboard.writeText(texto).then(() => {
        alert("¡Resultados copiados al portapapeles exitosamente!");
    }).catch(err => {
        alert("Error al copiar: " + err);
    });
}

// Asignar los eventos de exportación al cargar
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-export-jpg')?.addEventListener('click', exportarAImagen);
    document.getElementById('btn-export-clipboard')?.addEventListener('click', copiarAlPortapapeles);
});