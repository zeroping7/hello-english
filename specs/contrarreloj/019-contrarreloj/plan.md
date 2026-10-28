# Plan técnico: Contrarreloj

> **Spec:** `specs/contrarreloj/019-contrarreloj/spec.md` · **Estado:** Aprobado (por Claude, con permiso del usuario) · **Fecha:** 2026-10-28

## 1. Cumplimiento de la constitución
- [x] A1 Reglas puras en `logica.js` (si las hay) con pruebas en `juegos/tests.html`.
- [x] A2 Contenido en `contenido/contrarreloj.json`, validado por `src/contenido/esquema.js`. A3 Textos en i18n.
- [x] A5 `juegos/contrarreloj/juego.js` con `BANCO`, `EJERCICIOS` y `montar` / `desmontar`; alta en el registro con su icono.
- [x] C1-C5 Se juega con toque y con teclado; acierto y fallo con ✓/✗ y texto, no solo color.
- [x] P5 Archivos en `FILES` de `sw.js`.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `juegos/contrarreloj/logica.js` | `prepararPregunta`, `quedan`, `SEGUNDOS` |
| `juegos/contrarreloj/juego.js` | Reloj y bucle propio |
| `juegos/contrarreloj/juego.css` | Reloj y botones |
| `contenido/contrarreloj.json` | Banco |

## 3. Cómo encaja
Lo monta la pantalla común (`src/pantallas/juego.js`, D-014), que elige los ejercicios con `elegirConRepaso`, cuenta tiempo y puntos con `registrarResultado` y enseña el resumen. Los minijuegos de un ejercicio cada vez usan `ronda()` (`src/ui/ronda.js`, D-016): pintan el ejercicio y llaman a `responder(acierto, lineas)`; `ronda` pone el panel, «Siguiente» y Enter.

## 4. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Contenido con algún error de inglés | Media | Revisado al escribirlo; el usuario puede pedir cambios en `contenido/contrarreloj.json` |
| Pantalla estrecha | Baja | Probado a 375 px de ancho |

## 5. Pruebas
- `juegos/tests.html` (reglas) y `contenido/tests.html` (banco).
- Partida completa en el navegador a 375 px, con toque y con teclado.
