# Tareas: <Nombre>

> **Plan:** `specs/<area>/NNN-<id>/plan.md`
> Reglas: cada tarea cabe en una sesión con Claude, deja todo funcionando en `main` y se prueba abriendo la web en el móvil o en el PC.
> Orden fijo: primero lo mínimo usable sin estilo, después lo completo y al final el pulido.

Formato de cada tarea:
```
- [ ] TNNN — Título
  - Archivos:
  - Hecho cuando:
  - Probar:
```

## Fase 0 — Esqueleto
- [ ] T001 — Carpeta, alta en el registro e icono provisional
  - Archivos: `juegos/<id>/juego.js`, `juegos/<id>/icono.svg`, `juegos/registro.js`, `sw.js`
  - Hecho cuando: el minijuego aparece en su categoría del inicio; al entrar se ve una pantalla vacía y "atrás" vuelve
  - Probar: abrir la web, entrar en el minijuego y volver
- [ ] T002 — `logica.js` mínima + `tests.html`
  - Hecho cuando: `tests.html` muestra todas las pruebas en verde

## Fase 1 — Usable
- [ ] T010 — Bucle principal con contenido de prueba
- [ ] T011 — Acierto, fallo y explicación
- [ ] T012 — Fin de partida y resumen
- [ ] T013 — Puntos y progreso guardado
- [ ] T014 — Táctil y teclado verificados

## Fase 2 — Completo
- [ ] T020 — Contenido real por nivel y tema
- [ ] T021 — Textos en español e inglés
- [ ] T022 — Voz (si aplica) y alternativa sin voz

## Fase 3 — Pulido
- [ ] T030 — Estilo definitivo e icono final
- [ ] T031 — Animaciones y sonido
- [ ] T032 — Accesibilidad: contraste, foco, lector de pantalla y reducir movimiento
