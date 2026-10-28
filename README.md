# Hello English

Aprende inglés de informática y programación con minijuegos, desde el navegador y sin instalar nada. Para adultos de cualquier nivel, del A1 al C1.

**Usar:** https://zeroping7.github.io/hello-english/ — se puede instalar como app (menú del navegador → Instalar / Añadir a pantalla de inicio) y funciona sin conexión.

## Qué tiene
- **Prueba de nivel** de 10 preguntas al empezar.
- **Práctica de hoy**: una sesión que mezcla minijuegos y repasos según tu nivel.
- **19 minijuegos** en cuatro categorías: Lectura y gramática, Escucha y habla, Vocabulario e Inglés profesional. La lista completa está en [`docs/vision.md`](docs/vision.md).
- Puntos, niveles, racha diaria, logros y repaso espaciado.
- Interfaz en español o en inglés, tema claro u oscuro y voz británica o americana.
- Sin cuentas, sin cookies y sin estadísticas: el progreso se queda en tu dispositivo.

## Cómo se desarrolla
Con Spec Driven Development y Claude, desde el móvil o el PC:
1. **"spec de <x>"** → `specs/<area>/NNN-<id>/spec.md` (qué y por qué)
2. **"plan de NNN"** → `plan.md` (cómo)
3. **"tareas de NNN"** → `tareas.md` (pasos pequeños)
4. **"implementa TNNN"** → código, una tarea cada vez

Reglas en [`docs/constitucion.md`](docs/constitucion.md), estructura en [`docs/arquitectura.md`](docs/arquitectura.md) y decisiones en [`docs/decisiones.md`](docs/decisiones.md). Instrucciones para Claude en [`CLAUDE.md`](CLAUDE.md).

## Hoja de ruta (versión 1)
| Spec | Qué | Estado |
|---|---|---|
| 000 | Plataforma: inicio, ajustes, idioma, tema, progreso y app instalable | Implementada (v0.1.0) |
| 001 | Contenido: formato de los ejercicios y primer banco (2-3 temas) | Implementada (v0.1.1) |
| 002 | Prueba de nivel | Implementada (v0.2.0) |
| 003 | Minijuego: Falsos amigos | — |
| 004 | Minijuego: Merge Conflict | — |
| … | Resto de minijuegos, uno por spec | — |
| … | Repaso espaciado, logros y Práctica de hoy | — |
