# Spec: Entrevista de trabajo

> **ID:** 013-entrevista · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Preguntas típicas de una entrevista de trabajo en tecnología. El usuario escucha a la entrevistadora y elige (o dice) la mejor respuesta.

## 2. Qué se aprende
- **Categoría:** Escucha y habla
- **Habilidades:** escucha, pronunciación
- **Niveles:** De «What's your name?» (A1) a «Tell me about a time you had to deliver bad news to a stakeholder» o la pregunta del salario (C1).

## 3. Partida
- **Ejercicios:** 5 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Escuchar la pregunta → elegir o decir la respuesta → ver por qué es la mejor.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Escuchar | Escuchar / Más despacio |  |  |
| Responder | Tocar | 1, 2, 3 |  |
| Responder hablando | Botón con micrófono |  |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** La respuesta buena con altavoz y la traducción de la pregunta.
- **Al fallar:** Lo mismo, más la explicación (qué buscan con esa pregunta).
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `entrevista`: `audio` (la pregunta), `opciones` (3; la primera es la buena), `traduccion` y `explicacion`. Mínimo 4 por nivel.
Hoy: 20 ejercicios (A1 4, A2 4, B1 4, B2 4, C1 4), de los tres temas.

## 8. Voz y audio
Necesita voz. El micrófono es opcional. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
La misma que Daily standup, con «Emma · entrevistadora» y «¿Qué respondes?».

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Escucho preguntas de entrevista y elijo la mejor respuesta.
- [x] Aprendo qué buscan con cada pregunta.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Respuestas libres evaluadas por IA.

## 12. Preguntas abiertas
- Ninguna.
