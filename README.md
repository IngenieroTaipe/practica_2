# Práctica 2: Sistema de Ruleta y Sorteo de Equipos - UNCP

Este proyecto es una aplicación web de Vanilla JavaScript diseñada para gestionar sorteos y dinámicas de grupo de manera interactiva.

## 🚀 Estructura del Proyecto

```plaintext
/
├── index.html          (Estructura principal)
├── css/
│   ├── style.css       (Estilos globales premium)
│   ├── ruleta.css      (Estilos para la ruleta)
│   └── sorteo.css      (Estilos para el sorteo)
└── js/
    ├── main.js         (Punto de entrada/Orquestador)
    ├── ruleta.js       (Módulo de David)
    ├── storage.js      (Módulo de Erick)
    ├── interface.js    (Módulo de Lesly)
    └── sorteo.js       (Módulo de Benjamin)
```

## 👥 Responsabilidades y Ramas

Cada integrante debe trabajar en su rama correspondiente para evitar conflictos en `main`.

### 1. Toribio Anselmo David Angel (`feature/ruleta-core`)
- **Archivo:** `js/ruleta.js`, `css/ruleta.css`
- **Tareas:** 
  - Dibujado dinámico de la ruleta en `<canvas>` con 5 colores.
  - Lógica de giro aleatorio (Click, Botón "Iniciar" o SPACE).
  - Visualización del resultado en el cuadro de "RESPUESTA".

### 2. Barja Ortiz Erick Gerson (`feature/ruleta-data-storage`)
- **Archivo:** `js/storage.js`
- **Tareas:** 
  - Gestión del TextArea de la ruleta con `localStorage`.
  - Sincronización automática: al escribir, la ruleta se actualiza.
  - Atajos de teclado: `S` (marcar gris), `R` (reiniciar), `F` (pantalla completa).

### 3. Navarro Serva Lesly Brenda (`feature/sorteo-equipos-ui`)
- **Archivo:** `js/interface.js`, `css/sorteo.css`
- **Tareas:** 
  - Interfaz de sorteo: TextArea (hasta 100 participantes, máx 50 caracteres).
  - Persistencia en `localStorage`.
  - Controles: "Cantidad de equipos" o "Participantes por equipo" y campo de Título.
  - Botón "Limpiar" y validaciones.

### 4. Yauri Torres Benjamin Raul (`feature/sorteo-logica-export`)
- **Archivo:** `js/sorteo.js`
- **Tareas:** 
  - Algoritmo de generación aleatoria (mostrar integrantes uno a uno).
  - Funciones de exportación: Descargar JPG, copiar al portapapeles y por columnas.

---

## 🛠 Protocolo de Trabajo

1. **Nombres:** Usar variables y funciones descriptivas en **español** (ej. `girarRuleta`).
2. **Javascript Puro:** No usar librerías externas (React, Vue, jQuery, etc.).
3. **Módulos:** Usar `import/export` para mantener el código organizado.
4. **Sincronización:** Antes de subir cambios, ejecutar `git pull origin main`.

---
¡Muchos éxitos ingenieros de la UNCP! 🎓
