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
- Sin cuentas, sin cookies y sin estadísticas: el progreso se queda en tu dispositivo.

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
| — | Más temas: hardware, redes, cloud, seguridad, IA… («contenido de <tema> <nivel>») | Pendiente |

**Pruebas:** abre en el navegador `contenido/tests.html`, `juegos/tests.html`, `src/progreso/tests.html`, `src/i18n/tests.html`, `src/prueba/tests.html` y los `tests.html` de Falsos amigos y Merge Conflict.
