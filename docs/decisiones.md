# Registro de decisiones

Una entrada por decisión. Nunca se borran; si cambian, se añade una nueva que la sustituye.

```
## D-NNN — Título
- Fecha:
- Estado: Aceptada | Sustituida por D-NNN
- Contexto: por qué hubo que decidir
- Decisión:
- Alternativas descartadas:
- Consecuencias:
```

---

## D-001 — HTML, CSS y JavaScript sin framework ni motor de juegos
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: misma base que RetroGaming (sin build, GitHub Pages), pero aquí los minijuegos son de interfaz (tocar, arrastrar, escribir, escuchar), no de acción.
- Decisión: HTML + CSS + módulos ES nativos, sin Phaser ni frameworks.
- Alternativas descartadas: Phaser (pensado para dibujar en canvas; aquí se necesitan textos, campos y accesibilidad del DOM); React/Vue/Svelte (requieren build o añaden peso sin necesidad); Kotlin/Compose para web (requiere build).
- Consecuencias: sin tipos; usar JSDoc en la lógica y en el formato del contenido.

## D-002 — Una sola página con router por hash
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: en RetroGaming cada juego era una página aparte (D-005 de allí). Aquí la Práctica de hoy y la prueba de nivel encadenan minijuegos, y todos comparten ajustes, voz y progreso.
- Decisión: `index.html` único con router por hash (`#/inicio`, `#/juego/<id>`...). Cada minijuego es un módulo que se carga con `import()` y expone `montar` / `desmontar` (arquitectura §4).
- Alternativas descartadas: una página por minijuego (pasar de uno a otro recarga todo y obliga a guardar la sesión entre páginas).
- Consecuencias: cada minijuego debe limpiar sus escuchas y temporizadores al desmontarse.

## D-003 — Contenido generado por Claude por adelantado
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: el contenido se genera con IA sobre temas de informática. Hacerlo mientras se juega exige una clave de API y, para no exponerla, un servidor.
- Decisión: Claude genera los bancos de ejercicios en JSON dentro de `contenido/`; el usuario los revisa y se publican con la app.
- Alternativas descartadas: IA en tiempo real (coste por uso, lentitud, clave expuesta o backend, y riesgo de errores que nadie ha revisado).
- Consecuencias: el contenido funciona sin conexión y es gratis. Para añadir más hay que pedirlo ("contenido de <tema> <nivel>") y publicar una versión nueva.

## D-004 — Progreso solo en el dispositivo, con exportar e importar
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: sincronizar entre dispositivos exige cuentas y un servicio externo.
- Decisión: `localStorage`, con un botón para exportar el progreso a un archivo e importarlo en otro dispositivo.
- Alternativas descartadas: Firebase o Supabase (cuentas, claves y límites; incumple P2 y PR1).
- Consecuencias: si el usuario borra los datos del navegador pierde el progreso; Ajustes le recuerda que puede exportarlo.

## D-005 — Voz del navegador, británica por defecto
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: hay minijuegos de escucha y de pronunciación.
- Decisión: Web Speech API: `speechSynthesis` para leer en voz alta (voz británica por defecto, americana en Ajustes) y `SpeechRecognition` para reconocer voz. En Safari iOS se avisa de que el reconocimiento puede fallar.
- Alternativas descartadas: audios grabados (pesan mucho y habría que grabar miles); servicios de voz en la nube (clave y coste).
- Consecuencias: la calidad de la voz depende del dispositivo. El reconocimiento de voz envía el audio al servicio del navegador (Google o Apple), así que se avisa antes del primer uso (PR1).

## D-006 — Specs agrupadas por área
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: con 19 minijuegos, una lista plana de specs mezclaría unos con otros (como D-010 de RetroGaming).
- Decisión: `specs/plataforma/`, `specs/contenido/` y `specs/<id-minijuego>/`, cada una con `NNN-nombre/`. La numeración NNN es global.
- Alternativas descartadas: lista plana; numeración por carpeta.
- Consecuencias: el código de cada minijuego está en `juegos/<id>/` y sus specs en la carpeta con el mismo id.

## D-007 — Fuentes alojadas en el repo
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: cargar fuentes desde Google Fonts envía la IP del usuario a Google y no funciona sin conexión.
- Decisión: las fuentes (con licencia OFL) se guardan en `fuentes/` en formato `woff2`.
- Alternativas descartadas: Google Fonts (privacidad, PR1; sin conexión, P5); solo fuentes del sistema (el estilo de editor de código pierde personalidad).
- Consecuencias: unos 100-200 KB que se descargan una vez y quedan en caché.

## D-008 — Tipografía: JetBrains Mono y la fuente del sistema
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: el estilo de editor de código pide letra monoespaciada (constitución E1), pero los textos largos se leen peor con ella.
- Decisión: JetBrains Mono 400 y 700 (SIL OFL, alojada en `fuentes/`, D-007) para títulos, botones, números y código; `system-ui` para los textos largos.
- Alternativas descartadas: todo monoespaciado (cansa en explicaciones largas); una segunda fuente propia como Inter (más peso sin gran mejora).
- Consecuencias: unos 90 KB de fuentes, descargados una vez.

## D-009 — Textos de interfaz en JSON cargados con `fetch`
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: los textos van en `src/i18n/es.json` y `en.json` (constitución A3).
- Decisión: se cargan con `fetch` al arrancar y al cambiar de idioma.
- Alternativas descartadas: `import ... with { type: 'json' }` (no funciona en todos los Safari que queremos cubrir); textos en módulos `.js` (más difícil de revisar y de comparar entre idiomas).
- Consecuencias: el service worker debe guardar los dos JSON para el uso sin conexión.

## D-010 — Puntos y racha
- Fecha: 2026-10-28
- Estado: Aceptada
- Contexto: la spec 000 deja los valores de puntos para el plan y define la racha por objetivo diario.
- Decisión: acierto = `round(10 × nivel × dificultad)`, con nivel A1 1 · A2 1,2 · B1 1,5 · B2 1,8 · C1 2 y dificultad 1 o 1,5 según el minijuego (campo `dificultad` del registro). La racha suma un día al cumplir el objetivo un día seguido del anterior; si se salta un día, vuelve a 1 al cumplir y se ve 0 mientras tanto.
- Alternativas descartadas: puntos fijos por acierto (no premia subir de nivel); racha por abrir la app (no mide práctica real).
- Consecuencias: los minijuegos solo informan de aciertos y nivel; los puntos los calcula `src/progreso/logica.js`.
