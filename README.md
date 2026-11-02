# Hello English

Aprende inglés de informática y programación con minijuegos, desde el navegador y sin instalar nada. Para adultos de cualquier nivel, del A1 al C1.

**Usar:** https://zeroping7.github.io/hello-english/ — se puede instalar como app (menú del navegador → Instalar / Añadir a pantalla de inicio) y funciona sin conexión.

## Qué tiene
- **Prueba de nivel** de 10 preguntas al empezar.
- **Práctica de hoy**: tres minijuegos elegidos cada día, empezando por el que tiene más cosas para repasar.
- **19 minijuegos** en cuatro categorías: Lectura y gramática, Escucha y habla, Vocabulario e Inglés profesional. La lista completa está en [`docs/vision.md`](docs/vision.md).
- Puntos, racha diaria, 18 logros, repaso espaciado de lo que fallas y un nivel que sube solo al acertar.
- Más de 500 ejercicios de A1 a C1 sobre programación, web y trabajo en equipo.
- Interfaz en español o en inglés, tema claro u oscuro y voz británica o americana.
- **Ranking diario y mensual** opcional: te unes con un alias, sin cuenta ni email. Con resultados de ayer y del mes pasado, medallas, ligas por nivel y ranking de rachas.
- **Reto del día**: el mismo minijuego y los mismos 10 ejercicios para todos, con su clasificación.
- **Estadísticas**: tus puntos flojos, que también orientan la Práctica de hoy.
- **Recordatorio diario** opcional: una notificación si aún no has cumplido el objetivo.
- Sin cuentas, sin cookies y sin estadísticas: el progreso se queda en tu dispositivo. Si te unes al ranking, solo se envían tu alias, tus puntos, tu nivel, tu racha y tu reto del día; si activas el recordatorio, la dirección de avisos del navegador, la hora y la zona horaria.

## Cómo se desarrolla
Con Spec Driven Development y Claude, desde el móvil o el PC:
1. **"spec de <x>"** → `specs/<area>/NNN-<id>/spec.md` (qué y por qué)
2. **"plan de NNN"** → `plan.md` (cómo)
3. **"tareas de NNN"** → `tareas.md` (pasos pequeños)
4. **"implementa TNNN"** → código, una tarea cada vez

Reglas en [`docs/constitucion.md`](docs/constitucion.md), estructura en [`docs/arquitectura.md`](docs/arquitectura.md) y decisiones en [`docs/decisiones.md`](docs/decisiones.md). Instrucciones para Claude en [`CLAUDE.md`](CLAUDE.md).

## Hoja de ruta
| Spec | Qué | Estado |
|---|---|---|
| 000 | Plataforma: inicio, ajustes, idioma, tema, progreso y app instalable | Implementada (v0.1.0) |
| 001 | Contenido: formato de los ejercicios y primer banco (2-3 temas) | Implementada (v0.1.1) |
| 002 | Prueba de nivel | Implementada (v0.2.0) |
| 003 | Minijuego: Falsos amigos (y pantalla común de minijuego) | Implementada (v0.3.0) |
| 004 | Minijuego: Merge Conflict | Implementada (v0.4.0) |
| 005-021 | Los otros 17 minijuegos: Caza el bug, Prompt, Incidente en producción, Ordenar frases, Ahorcado, Dictado de código, Dilo bien, Daily standup, Entrevista, Dictado, Acrónimos, Jerga dev, Sopa y crucigrama, Emparejar, Contrarreloj, ¿Educado o borde? y Bug report | Implementadas (v1.0.0) |
| 022 | Repaso espaciado | Implementada (v1.0.0) |
| 023 | Logros | Implementada (v1.0.0) |
| 024 | Práctica de hoy | Implementada (v1.0.0) |
| 025 | Subida de nivel con el uso | Implementada (v1.0.0) |
| 026 | Contenido de los 17 minijuegos | Implementada (v1.0.0) |
| 027 | Ranking diario y mensual (servidor en Cloudflare, ver [`servidor/LEEME.md`](servidor/LEEME.md)) | Implementada (v1.1.0) |
| 028 | Resultados de ayer y del mes pasado | Implementada (v1.2.0) |
| 029 | Medallas del ranking | Implementada (v1.2.0) |
| 030 | Ligas por nivel | Implementada (v1.2.0) |
| 031 | Ranking de rachas | Implementada (v1.2.0) |
| 032 | Recordatorio diario (Web Push) | Implementada (v1.2.0) |
| 033 | Reto del día | Implementada (v1.2.0) |
| 034 | Estadísticas y Práctica orientada | Implementada (v1.2.0) |
| 035 | Contenido: más ejercicios B2 y C1 | Implementada (v1.2.0), pendiente de revisar |
| — | Más temas: hardware, redes, cloud, seguridad, IA… («contenido de <tema> <nivel>») | Pendiente |

**Pruebas:** abre en el navegador `contenido/tests.html`, `juegos/tests.html`, `src/progreso/tests.html`, `src/i18n/tests.html`, `src/prueba/tests.html`, `src/ranking/tests.html`, `servidor/tests.html` y los `tests.html` de Falsos amigos y Merge Conflict.
