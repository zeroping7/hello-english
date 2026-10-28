# Plan técnico: Prueba de nivel

> **Spec:** `specs/plataforma/002-prueba-de-nivel/spec.md` · **Estado:** Aprobado (por Claude, con permiso del usuario) · **Fecha:** 2026-10-28

## 1. Cumplimiento de la constitución
- [x] A1 Lógica de la prueba en `src/prueba/logica.js`, pura y con pruebas.
- [x] A2 Preguntas del banco `prueba-nivel` (spec 001).
- [x] A3 Textos en i18n. A4 El nivel se guarda con `fijarNivel()` de `src/progreso/progreso.js`.
- [x] A6 Elección y orden de las opciones con `crearAzar`.
- [x] C1-C4 Botones nativos, teclas 1-4 y Enter, ✓/✗ además del color, `aria-live` en el resultado.
- [x] P5 Archivos nuevos en `FILES` de `sw.js`.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `src/prueba/logica.js` | `crearPrueba(preguntas, azar)`, `siguiente(estado)`, `responder(estado, acierto)`, `resultado(estado)` |
| `src/prueba/tests.html` | Pruebas de la lógica |
| `src/pantallas/prueba-nivel.js` | Pantalla `#/prueba-nivel`: pregunta, respuesta, resultado |
| `src/ui/ejercicio.js` | Piezas comunes para la prueba y los minijuegos: contador "3 de 10", opciones barajadas, panel de acierto/fallo y resumen |
| `src/progreso/progreso.js` | `fijarNivel(nivel)`: guarda el nivel y `nivelProbado: true` |
| `src/app.js` | Ruta nueva; la bienvenida sin hacer deja entrar en `#/prueba-nivel` |
| `src/pantallas/bienvenida.js`, `ajustes.js` | Activan los botones de la prueba |

## 3. Lógica
```js
/** @typedef {{ pos: number, preguntas: object[], respondidas: { id, nivel, acierto }[], azar }} EstadoPrueba */
```
- **Inicio:** `pos = 1` (A2). Total: 10 preguntas.
- **Siguiente pregunta:** una sin usar del nivel `pos`; si no quedan, del nivel más cercano.
- **Responder:** acierto → `pos + 1` (máximo C1); fallo → `pos - 1` (mínimo A1).
- **Resultado:** el nivel más alto con al menos 2 aciertos y no más fallos que aciertos; si no hay, el más alto con algún acierto y ningún fallo; si tampoco, A1.

## 4. Pantallas
| Estado | Qué muestra |
|---|---|
| Pregunta | Barra con Volver y "3 de 10"; el enunciado con el hueco resaltado; 4 opciones barajadas |
| Respondida | La opción elegida y la correcta marcadas (✓/✗); frase completa traducida; explicación si se falló; "Siguiente" (o "Ver resultado" en la 10) |
| Resultado | "Tu nivel" + "B1 · Intermedio", aciertos "7 de 10", botón "Empezar" |

- Volver, atrás o Esc a medias → `confirmar()` "¿Salir de la prueba? No se guardará el resultado".
- Al terminar: `fijarNivel()`. Si venía de la bienvenida, se marca `bienvenidaHecha`. En los dos casos se va a `#/inicio`.
- Se cuenta el tiempo con `iniciarCronometro()`; no se llama a `registrarAcierto()`.

## 5. Textos de interfaz
`prueba.*` (título, contador, siguiente, ver resultado, resultado, tu nivel, aciertos, empezar, salir, confirmar salir), `nivel.A1`…`nivel.C1`, `ejercicio.*` (correcto, incorrecto, la respuesta era, traducción).

## 6. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Con 5 preguntas por nivel, alguien muy bueno agota las de C1 | Media | Se completa con el nivel más cercano (B2); el resultado lo tiene en cuenta |
| Salir con el atrás del móvil sin confirmar | Media | La confirmación se pide al pulsar Volver o Esc; con el atrás del móvil se sale sin guardar, que es lo esperado |

## 7. Pruebas
- **`src/prueba/tests.html`:** sube y baja de nivel con los límites; no repite; 10 preguntas; resultados para perfiles típicos (todo bien → C1, todo mal → A1, alterno en B1 → B1).
- **Manual:** desde la bienvenida y desde Ajustes, con táctil y con teclas 1-4 + Enter; salir a medias.
