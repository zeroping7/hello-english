# Spec: Bug report

> **ID:** 021-bug-report · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Un informe de bug con sus cuatro partes desordenadas: título, pasos para reproducirlo, resultado esperado y resultado actual. El usuario pone cada texto en su campo. Aprende la estructura y el vocabulario de un buen informe.

## 2. Qué se aprende
- **Categoría:** Inglés profesional
- **Habilidades:** escritura, lectura
- **Niveles:** De «Login button doesn't work / Nothing happens.» (A1) a errores intermitentes con escrituras concurrentes (C1).

## 3. Partida
- **Ejercicios:** 3 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Leer los textos → tocar cada uno para ponerlo en el siguiente campo → Comprobar.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Poner texto | Tocarlo | 1-4 | Va al primer campo vacío |
| Vaciar campo | Tocar el campo |  |  |
| Comprobar | Botón | Enter |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** Los cuatro campos en verde.
- **Al fallar:** Campos bien en verde y mal en rojo, y el informe bien hecho debajo.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `bug-report`: `partes` con `titulo`, `pasos`, `esperado` y `actual`. Mínimo 2 por nivel.
Hoy: 10 ejercicios (A1 2, A2 2, B1 2, B2 2, C1 2), de los tres temas.

## 8. Voz y audio
Ninguna. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
El informe con los nombres de los campos en inglés (como en GitHub o Jira) y una ayuda traducida; debajo, los textos que faltan.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Ordeno las partes de un informe de bug.
- [x] Distingo «expected» de «actual».

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Escribir el informe desde cero.

## 12. Preguntas abiertas
- Ninguna.
