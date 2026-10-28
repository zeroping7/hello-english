# Plan técnico: Falsos amigos y pantalla común de minijuego

> **Spec:** `specs/falsos-amigos/003-falsos-amigos/spec.md` · **Estado:** Aprobado (por Claude, con permiso del usuario) · **Fecha:** 2026-10-28

## 1. Cumplimiento de la constitución
- [x] A1 Reglas en `juegos/falsos-amigos/logica.js` (puro) con `tests.html`.
- [x] A2 Tarjetas del banco `falsos-amigos`. A3 Textos en i18n.
- [x] A5 `juegos/falsos-amigos/juego.js` con `montar` / `desmontar`; alta en el registro (`disponible: true`).
- [x] A6 Elección con `elegirEjercicios` y `crearAzar`.
- [x] C1-C5 Botones además del gesto, flechas, ✓/✗ con texto; sin animación con "reducir movimiento".
- [x] P5 Archivos en `FILES`.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `src/pantallas/juego.js` | Pantalla común `#/juego/<id>`: antes de jugar (tema), partida, resumen. Si el minijuego no está disponible, delega en `proximamente.js` |
| `juegos/registro.js` | `disponible: true` para `falsos-amigos` |
| `juegos/falsos-amigos/juego.js` | Tarjeta, gesto, botones, teclas y panel de resultado |
| `juegos/falsos-amigos/logica.js` | `comprobar(tarjeta, diceVerdad)`, `umbralDeslizar(ancho)` |
| `juegos/falsos-amigos/tests.html` | Pruebas de la lógica |
| `juegos/falsos-amigos/juego.css` | Estilos de la tarjeta |

## 3. Interfaz común de minijuego (amplía arquitectura §4)
```js
// juegos/<id>/juego.js
export const BANCO = 'falsos-amigos';   // banco de contenido
export const EJERCICIOS = 10;           // por partida
export function montar(raiz, {
  ejercicios, idioma,
  ponerContador(n),                     // la pantalla común pinta "n de EJERCICIOS"
  alResponder(item, acierto),           // puntos, sonido y vibración los pone la pantalla común
  alTerminar(),                         // la pantalla común enseña el resumen
}) { return { desmontar() {} }; }
```
La pantalla común: carga el banco, elige con `elegirEjercicios({ nivel, n: EJERCICIOS, azar, tema })`, inicia el cronómetro, suma puntos con `registrarAcierto(item.nivel, juego.dificultad)` y pide confirmación al salir a medias. Los estilos propios (`juego.css`) se cargan con un `<link>` al montar y se quitan al desmontar.

## 4. Gesto de deslizar
- Pointer events sobre la tarjeta (`touch-action: pan-y` para no bloquear el scroll vertical).
- Se mueve con el dedo (`translateX` y un giro leve). Al soltar, si se pasó del umbral (25 % del ancho de la tarjeta, mínimo 80 px), cuenta como respuesta; si no, vuelve al centro.
- Mientras se arrastra, aparece "✓ Verdad" o "✗ Falso amigo" en el lado correspondiente.
- Con "reducir movimiento" la tarjeta no gira ni anima: solo cuentan los botones y el umbral.

## 5. Pantallas
| Estado | Qué muestra |
|---|---|
| Antes de jugar | Icono, nombre, descripción, selector de tema y "Jugar" |
| Tarjeta | `en` grande, "= `es`?", botón 🔊, botones ✗ Falso amigo / ✓ Verdad |
| Respondida | Panel ✓/✗, `en → significa`, ejemplo, explicación si falló, "Siguiente" |
| Resumen | Aciertos, puntos, "Jugar otra vez", "Volver al inicio" |

## 6. Textos de interfaz
`juego.jugar`, `juego.tema`, `juego.otraVez`, `juego.alInicio`, `juego.salir`, `juego.salir.texto`, `juego.resumen`, `fa.pregunta`, `fa.verdad`, `fa.falso`, `fa.significa`, `fa.escuchar`, `fa.ejemplo`.

## 7. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| El gesto choca con el scroll en móvil | Media | `touch-action: pan-y` y umbral horizontal; siempre hay botones |
| El atrás del móvil sale sin confirmar | Media | Es lo esperado; los puntos ya están guardados |

## 8. Pruebas
- **`juegos/falsos-amigos/tests.html`:** comprobar verdadera y falsa; umbral con anchos pequeños y grandes.
- **Manual:** partida entera en el móvil deslizando y en el PC con flechas; puntos en el inicio; salir a medias.
