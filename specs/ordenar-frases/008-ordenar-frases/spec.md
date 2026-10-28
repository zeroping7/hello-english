# Spec: Ordenar frases

> **ID:** 008-ordenar-frases · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Las palabras de una frase, desordenadas. El usuario las toca en orden para formarla, guiándose por la traducción. Practica el orden de las palabras: preguntas, preguntas indirectas, inversiones.

## 2. Qué se aprende
- **Categoría:** Lectura y gramática
- **Habilidades:** gramática
- **Niveles:** De «This is my first program.» (A1) a «Had we written more tests, the bug would have been caught.» (C1).

## 3. Partida
- **Ejercicios:** 8 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Leer la traducción → tocar las palabras en orden → Comprobar → ver la frase buena.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Poner palabra | Tocarla | 1-9 | El número es su posición entre las que quedan |
| Quitar palabra | Tocarla en la frase | Retroceso (la última) |  |
| Comprobar | Botón | Enter | Solo con todas puestas |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** La frase en verde, con altavoz y traducción.
- **Al fallar:** La frase formada en rojo y la buena debajo.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `ordenar-frases`: `frase` (3 palabras o más; la puntuación va pegada a su palabra) y `traduccion`. Mínimo 6 por nivel.
Hoy: 30 ejercicios (A1 6, A2 6, B1 6, B2 6, C1 6), de los tres temas.

## 8. Voz y audio
Altavoz para la frase buena. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Traducción, zona de la frase (con borde discontinuo), fichas que quedan y Comprobar.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Formo la frase tocando palabras y puedo devolver cualquiera.
- [x] Con teclado: números, Retroceso y Enter.
- [x] El desorden nunca coincide con la frase buena.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Aceptar otros órdenes también correctos.

## 12. Preguntas abiertas
- Ninguna.
