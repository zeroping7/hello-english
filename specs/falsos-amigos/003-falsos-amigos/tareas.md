# Tareas: Falsos amigos y pantalla común de minijuego

> **Plan:** `specs/falsos-amigos/003-falsos-amigos/plan.md` · **Estado:** Hechas (v0.3.0)

- [x] T301 — Pantalla común de minijuego
  - Archivos: `src/pantallas/juego.js`, `src/app.js`, `css/app.css`, i18n
  - Hecho cuando: `#/juego/<id>` enseña "Próximamente" si no está disponible y, si lo está, la pantalla de antes de jugar, la partida y el resumen
- [x] T302 — Lógica de Falsos amigos + pruebas
  - Archivos: `juegos/falsos-amigos/logica.js`, `juegos/falsos-amigos/tests.html`
  - Hecho cuando: las pruebas salen en verde
- [x] T303 — Juego de Falsos amigos
  - Archivos: `juegos/falsos-amigos/juego.js`, `juegos/falsos-amigos/juego.css`, `juegos/registro.js`, `sw.js`, i18n
  - Hecho cuando: se juega una partida entera con gesto, botones y flechas, suma puntos y enseña el resumen
  - Probar: en el móvil deslizando; en el PC con ← y →
