# Tareas: Formato del contenido y primer banco

> **Plan:** `specs/contenido/001-formato-y-primer-banco/plan.md` · **Estado:** Hechas (v0.1.1)

- [x] T101 — Esquema, carga, azar y elección + pruebas
  - Archivos: `src/contenido/*.js`, `contenido/temas.json`, `contenido/tests.html`, i18n
  - Hecho cuando: `contenido/tests.html` valida un banco de ejemplo y las pruebas de `elegir.js` y `azar.js` salen en verde
  - Probar: abrir `…/contenido/tests.html`
- [x] T102 — Banco de la prueba de nivel
  - Archivos: `contenido/prueba-nivel.json`
  - Hecho cuando: 25 preguntas o más, 5 por nivel, y la validación sale en verde
- [x] T103 — Banco de Falsos amigos
  - Archivos: `contenido/falsos-amigos.json`
  - Hecho cuando: 40 tarjetas o más, 6 por nivel como mínimo, y la validación sale en verde
- [x] T104 — Banco de Merge Conflict
  - Archivos: `contenido/merge-conflict.json`, `sw.js`
  - Hecho cuando: 40 pares o más, 6 por nivel como mínimo, la validación sale en verde y los JSON están en `FILES`
