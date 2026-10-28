# Spec: Incidente en producción

> **ID:** 007-incidente · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Una historia por pasos: algo falla en producción y el usuario lee logs y mensajes del equipo en inglés para decidir qué hacer. El final cambia según las decisiones. Dificultad 1,5.

## 2. Qué se aprende
- **Categoría:** Lectura y gramática
- **Habilidades:** lectura
- **Niveles:** De «la web no carga porque el disco está lleno» (A1) a una fuga de memoria tras una release (C1).

## 3. Partida
- **Ejercicios:** 2 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Leer el log → elegir una de tres decisiones → ver qué pasa → siguiente paso; al final, cómo acaba y la causa.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Decidir | Tocar la opción | 1, 2, 3 |  |
| Siguiente | Botón | Enter |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** Cada decisión buena suma puntos; la nota explica por qué.
- **Al fallar:** La nota explica qué habría pasado; la historia sigue.
- **Resumen final:** Tres finales: «Incidente resuelto» (todas bien), «Resuelto, con retraso» (la mitad o más) y «Caída larga». Se enseña la causa raíz. El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `incidente`: `titulo`, `causa` y `pasos` (2 o más), cada uno con `log` (líneas; las que empiezan por `@nombre:` son mensajes), `pregunta` y 3 `opciones` (`texto`, `bien`, `nota` es/en). Mínimo 1 por nivel; hay 8.
Hoy: 8 ejercicios (A1 1, A2 2, B1 2, B2 2, C1 1), de los tres temas.

## 8. Voz y audio
Ninguna. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Título con un punto rojo, terminal con el log en colores (ERROR rojo, WARN naranja, mensajes azules), pregunta y opciones.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Juego 2 incidentes de mi nivel, de unos 3 pasos cada uno.
- [x] Cada decisión muestra su consecuencia.
- [x] Al final veo uno de tres finales y la causa.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Historias con ramas distintas según la decisión (de momento cambian el final, no los pasos).

## 12. Preguntas abiertas
- Ninguna.
