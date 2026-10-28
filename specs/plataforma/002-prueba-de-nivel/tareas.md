# Tareas: Prueba de nivel

> **Plan:** `specs/plataforma/002-prueba-de-nivel/plan.md` · **Estado:** Hechas (v0.2.0)

- [x] T201 — Lógica de la prueba + pruebas
  - Archivos: `src/prueba/logica.js`, `src/prueba/tests.html`
  - Hecho cuando: `src/prueba/tests.html` sale en verde
- [x] T202 — Piezas comunes de ejercicio
  - Archivos: `src/ui/ejercicio.js`, `css/app.css`, i18n
  - Hecho cuando: hay contador, opciones barajadas, panel de acierto/fallo y resumen listos para usar
- [x] T203 — Pantalla de la prueba y resultado
  - Archivos: `src/pantallas/prueba-nivel.js`, `src/progreso/progreso.js`, `src/app.js`, `src/pantallas/bienvenida.js`, `src/pantallas/ajustes.js`, `sw.js`, i18n
  - Hecho cuando: la prueba se hace entera desde la bienvenida y desde Ajustes, guarda el nivel y el inicio lo muestra
  - Probar: borrar el progreso, hacer la bienvenida con la prueba; repetirla desde Ajustes; salir a medias con Esc
