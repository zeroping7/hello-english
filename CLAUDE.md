# Instrucciones para Claude

**Hello English**: app web para aprender inglés de informática y programación con minijuegos. Para adultos de cualquier nivel (A1–C1), un solo jugador, sin instalar nada (PC, móvil y tablet). Se publica en GitHub Pages desde `main`: https://zeroping7.github.io/hello-english/

## Antes de cualquier tarea
1. Lee `docs/constitucion.md` (reglas no negociables).
2. Lee `docs/arquitectura.md` y `docs/decisiones.md`. La visión completa del producto está en `docs/vision.md`.
3. Lee la spec, el plan y las tareas de la carpeta `specs/<area>/NNN-*` en la que se trabaja.

## Sobre el usuario
- Programador Android: cuando aparezca un concepto web por primera vez (service worker, módulo ES, router por hash...), explícalo en 1-2 frases, con un paralelismo Android si ayuda.
- Explicaciones breves y concisas.
- Trabaja **a veces desde el móvil y a veces desde el PC**. No dependas de terminal, Node ni herramientas locales: todo se prueba abriendo la web publicada (o `tests.html`) en el navegador.

## Flujo Spec Driven Development
Cada pieza vive en `specs/<area>/NNN-nombre/` con tres archivos. `<area>` es `plataforma` (lo común), `contenido` (bancos de ejercicios) o el id del minijuego en `juegos/registro.js`. NNN es un número global (no se repite entre carpetas):

| Paso | Archivo | Contenido | Quién aprueba |
|---|---|---|---|
| 1. Especificar | `spec.md` | QUÉ y POR QUÉ (sin detalles técnicos) | Usuario |
| 2. Planificar | `plan.md` | CÓMO (archivos, estado, pantallas, datos) | Usuario |
| 3. Desglosar | `tareas.md` | Tareas pequeñas, ordenadas y verificables | Usuario |
| 4. Implementar | código | Una tarea cada vez | Usuario la prueba |

Órdenes que usará el usuario:
- **"spec de X"** → copia `specs/_plantillas/spec-minijuego.md` (minijuego nuevo) o `spec-feature.md` (plataforma, contenido o ampliación) a `specs/<area>/NNN-x/spec.md` (NNN = siguiente número libre en todo `specs/`), rellena lo que sepas y haz las preguntas de "Preguntas abiertas". No escribas código.
- **"plan de NNN"** → solo si la spec está *Aprobada*. Usa `specs/_plantillas/plan.md`.
- **"tareas de NNN"** → solo si el plan está *Aprobado*. Usa `specs/_plantillas/tareas.md`.
- **"implementa TNNN"** → implementa SOLO esa tarea, marca su casilla y termina diciendo cómo probarla en el móvil y en el PC.
- **"contenido de <tema> <nivel>"** → genera ejercicios en `contenido/` siguiendo el formato de su spec, valídalos con su `tests.html` y resume qué has añadido para que el usuario lo revise.

## Reglas de trabajo
- Nunca escribas código sin spec y plan aprobados (salvo que el usuario pida explícitamente un "prototipo").
- Si al implementar descubres que la spec o el plan están mal, para, propón el cambio y actualiza el documento antes de seguir.
- Cada tarea termina con todo funcionando en `main` (es lo que se publica).
- En cada cambio: sube `src/version.js` (Ajustes la muestra) y, si añades o renombras archivos, actualiza `FILES` y `CACHE` en `sw.js`.
- Ningún texto de interfaz va escrito en el código: va en `src/i18n/es.json` y `src/i18n/en.json`.
- El contenido (palabras, frases, ejercicios) es inglés correcto y revisado: nada de inventarse términos. Si dudas de un uso, no lo incluyas.
- Un minijuego nuevo se da de alta en `juegos/registro.js` con su categoría y un icono SVG.
- Toda decisión técnica relevante se apunta en `docs/decisiones.md`.
