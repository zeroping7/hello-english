# Tareas: Ranking diario y mensual

> **Plan:** `specs/plataforma/027-ranking/plan.md` · **Estado:** Aprobadas
> Reglas: cada tarea cabe en una sesión con Claude, deja todo funcionando en `main` y se prueba abriendo la web en el móvil o en el PC.
> Mientras el ranking no esté terminado (hasta T2707), su entrada en el inicio solo se ve con `?debug=1`.

## Fase 0 — Decisiones y esfuerzo
- [ ] T2701 — Decisiones y constitución
  - Archivos: `docs/decisiones.md` (D-021, D-022, D-023), `docs/constitucion.md` (P2 y PR1), `docs/arquitectura.md`
  - Hecho cuando: las tres decisiones están apuntadas y la constitución nombra la excepción del ranking
  - Probar: leer los documentos en GitHub
- [ ] T2702 — Multiplicador por esfuerzo
  - Archivos: `juegos/registro.js`, `src/ui/ronda.js`, `src/ui/escucha-elige.js`, `src/pantallas/juego.js`, `juegos/tests.html`
  - Hecho cuando: cada minijuego tiene la dificultad de la tabla de la spec y, en Daily standup y Entrevista, responder hablando da ×1,5
  - Probar: jugar Prompt y ver que un acierto A1 da 13 puntos; en Daily standup, responder hablando y eligiendo y comparar los puntos

## Fase 1 — Servidor
- [ ] T2703 — Reglas del servidor y sus pruebas
  - Archivos: `servidor/worker.js` (solo las funciones puras), `servidor/vetadas.js`, `servidor/tests.html`
  - Hecho cuando: `servidor/tests.html` sale en verde (día de Madrid, alias, envíos imposibles, topes)
  - Probar: abrir `servidor/tests.html` en el navegador
- [ ] T2704 — API completa y base de datos
  - Archivos: `servidor/worker.js`, `servidor/esquema.sql`, `servidor/LEEME.md`
  - Hecho cuando: las 5 rutas funcionan con D1 y CORS solo deja entrar a la web publicada
  - Probar: **tú** creas la cuenta de Cloudflare, la base de datos y el Worker siguiendo `LEEME.md` (desde el panel web, también en el móvil) y me pasas la URL del Worker; abrir `<URL>/ranking?periodo=dia` debe devolver una lista vacía

## Fase 2 — App
- [ ] T2705 — Identidad guardada y lógica del cliente
  - Archivos: `src/progreso/progreso.js`, `src/progreso/logica.js`, `src/progreso/datos.js`, `src/ranking/config.js`, `src/ranking/logica.js`, `src/ranking/api.js`, `src/ranking/ranking.js`, `src/ranking/tests.html`, `sw.js`
  - Hecho cuando: `src/ranking/tests.html` sale en verde; exportar, importar y borrar incluyen `he-ranking`
  - Probar: abrir `src/ranking/tests.html`; exportar el progreso y ver que el archivo sigue siendo válido
- [ ] T2706 — Unirse y ver la clasificación
  - Archivos: `src/pantallas/ranking.js`, `src/router.js`, `src/app.js`, `src/pantallas/inicio.js`, `src/i18n/es.json`, `src/i18n/en.json`, `css/app.css`
  - Hecho cuando: con `?debug=1`, desde el inicio se entra al ranking, se elige un alias, se ve el código y luego el top del día y del mes
  - Probar: en el móvil, abrir la web con `?debug=1`, unirse y ver tu alias con 0 puntos
- [ ] T2707 — Puntos al ranking y posición en el inicio
  - Archivos: `src/pantallas/juego.js`, `src/ranking/ranking.js`, `src/pantallas/inicio.js`, `src/app.js`
  - Hecho cuando: al terminar una partida suben sus puntos; sin red quedan pendientes y se envían al volver; el inicio muestra "#N hoy" para todos (se quita la condición de `?debug=1`)
  - Probar: jugar una partida y ver los puntos en el ranking; repetir en modo avión, volver a la red y abrir la app
- [ ] T2708 — Ajustes: código, recuperar y salir
  - Archivos: `src/pantallas/ajustes.js`, `src/i18n/es.json`, `src/i18n/en.json`
  - Hecho cuando: se puede copiar el código, recuperar el alias en otro navegador y salir borrando los datos del servidor
  - Probar: copiar el código en el móvil, recuperarlo en el PC y ver el mismo alias; salir y comprobar que desaparece del top

## Fase 3 — Pulido
- [ ] T2709 — Accesibilidad, estilo final y versión 1.1.0
  - Archivos: `css/app.css`, `src/pantallas/ranking.js`, `src/ui/iconos.js` (trofeo), `src/version.js`, `sw.js`, `README.md`
  - Hecho cuando: pestañas con flechas, foco visible, tu fila marcada con texto, todo bien a 320 px y en los dos temas; README actualizado
  - Probar: en el PC, recorrer el ranking solo con teclado; en el móvil, revisar el tema claro y el oscuro
