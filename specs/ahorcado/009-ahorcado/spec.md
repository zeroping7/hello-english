# Spec: Ahorcado

> **ID:** 009-ahorcado · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Adivinar una palabra técnica letra a letra, con su definición en inglés como pista. Con 6 fallos se pierde.

## 2. Qué se aprende
- **Categoría:** Lectura y gramática
- **Habilidades:** vocabulario, escritura
- **Niveles:** De «file» o «mouse» (A1) a «idempotent» o «deprecated» (C1).

## 3. Partida
- **Ejercicios:** 5 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Leer la definición → probar letras → ganar o perder → ver la palabra y su traducción.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Probar letra | Teclado en pantalla | Letras del teclado | Las probadas se desactivan |
| Siguiente | Botón | Enter |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** La palabra en verde con altavoz y traducción.
- **Al fallar:** La palabra completa en rojo y su traducción.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `ahorcado`: `palabra` (solo letras, 3 o más), `pista` (definición en inglés) y `traduccion`. Mínimo 4 por nivel.
Hoy: 20 ejercicios (A1 4, A2 4, B1 4, B2 4, C1 4), de los tres temas.

## 8. Voz y audio
Altavoz para la palabra. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Terminal con `$ define ???` y la pista, la palabra con huecos, los fallos que quedan como `[####..]` y un teclado QWERTY.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Juego 5 palabras de mi nivel.
- [x] Puedo usar el teclado en pantalla o el físico.
- [x] Una letra repetida no cuenta como fallo.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Palabras con espacios o guiones.

## 12. Preguntas abiertas
- Ninguna.
