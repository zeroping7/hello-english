# Spec: Prompt

> **ID:** 006-prompt · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Una terminal con una frase con hueco y su traducción como comentario. El usuario escribe la palabra que falta. Tab da una letra de pista, como el autocompletado de una terminal.

## 2. Qué se aprende
- **Categoría:** Lectura y gramática
- **Habilidades:** escritura, vocabulario
- **Niveles:** De vocabulario básico (file, button) a términos como «idempotent» o expresiones como «rock the boat» (C1).

## 3. Partida
- **Ejercicios:** 8 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Leer la frase y la traducción → escribir la palabra → Enter → ver la frase completa y la explicación.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Escribir | Teclado del móvil | Teclado |  |
| Pista | Botón Pista | Tab | Completa lo bien escrito más una letra |
| Comprobar | Botón | Enter |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** El hueco en verde y la frase completa con altavoz; se indica si se usaron pistas (no restan puntos).
- **Al fallar:** El hueco en rojo y tachado, la palabra buena y la explicación.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `prompt`: `enunciado` con un hueco `___`, `respuesta` (una palabra), `aceptadas` opcionales (sinónimos válidos), `traduccion` y `explicacion`. No cuentan mayúsculas ni espacios. Mínimo 6 por nivel.
Hoy: 30 ejercicios (A1 6, A2 6, B1 6, B2 6, C1 6), de los tres temas.

## 8. Voz y audio
Altavoz para la frase completa. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Una terminal: comentario con la traducción, `$` y la frase con el campo dentro; botones Pista y Comprobar.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Escribo la palabra y la compruebo con Enter.
- [x] Con Tab o el botón Pista se completa una letra.
- [x] Se aceptan las alternativas válidas y no importan las mayúsculas.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Autocompletar con una lista de palabras sugeridas.

## 12. Preguntas abiertas
- Ninguna.
