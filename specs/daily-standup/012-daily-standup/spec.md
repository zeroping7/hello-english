# Spec: Daily standup

> **ID:** 012-daily-standup · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Una reunión diaria simulada: un compañero cuenta qué hizo y qué hará, y el usuario responde a una pregunta sobre lo que ha oído o da su propia actualización. Se responde tocando o diciendo la respuesta.

## 2. Qué se aprende
- **Categoría:** Escucha y habla
- **Habilidades:** escucha, pronunciación
- **Niveles:** De «Yesterday I fixed a bug» (A1) a «It turns out it's a race condition in the test setup» (C1).

## 3. Partida
- **Ejercicios:** 5 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Escuchar (el texto está oculto, se puede mostrar) → elegir o decir la respuesta → ver el texto, la traducción y por qué.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Escuchar | Escuchar / Más despacio |  | Se oye solo al empezar |
| Responder | Tocar | 1, 2, 3 |  |
| Responder hablando | Botón con micrófono |  | Elige la opción que más se parece a lo dicho |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** La respuesta buena con altavoz, el texto oído y su traducción.
- **Al fallar:** Lo mismo, más la explicación.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `daily-standup`: `quien` (nombre), `audio`, `pregunta`, `opciones` (3; la primera es la buena y se barajan), `traduccion` y `explicacion`. Mínimo 4 por nivel.
Hoy: 20 ejercicios (A1 4, A2 4, B1 4, B2 4, C1 4), de los tres temas.

## 8. Voz y audio
Necesita voz. El micrófono es opcional. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Avatar con la inicial y el nombre, botones de escucha, burbuja con «Ver el texto», pregunta, opciones y «Responder hablando».

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Escucho al compañero y respondo.
- [x] Puedo ver el texto si no lo entiendo.
- [x] Puedo responder hablando.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Conversaciones de varios turnos.

## 12. Preguntas abiertas
- Ninguna.
