# Spec: Merge Conflict

> **ID:** 004-merge-conflict · **Estado:** Implementada (v0.4.0) · **Fecha:** 2026-10-28

## 1. Resumen
Aparece un conflicto de git con dos versiones de la misma frase, una correcta y otra con un error de gramática. El usuario resuelve el conflicto quedándose con la buena, como en su editor. Practica gramática con algo que hace todos los días.

## 2. Qué se aprende
- **Categoría:** Lectura y gramática
- **Habilidades:** gramática, lectura
- **Niveles:** de concordancias y artículos (A1) a inversiones y estructuras formales (C1).

## 3. Partida
- **Ejercicios:** 8 conflictos, unos 2-3 minutos.
- **Termina:** al resolver el octavo.
- **Puntos:** cada acierto, según su nivel (D-010). Dificultad 1.

## 4. Bucle
Leer las dos versiones → aceptar una → ver la frase "fusionada", la traducción y, si se falla, por qué → siguiente.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Aceptar la versión de arriba (*current*) | Botón | 1 o ↑ | |
| Aceptar la de abajo (*incoming*) | Botón | 2 o ↓ | |
| Siguiente | Botón | Enter | |

## 6. Acierto y fallo
- **Siempre:** la frase correcta queda "fusionada" en verde, con su traducción.
- **Al fallar:** la explicación en el idioma de la interfaz.
- **Resumen final:** el común (spec 003).

## 7. Contenido que necesita
Banco `merge-conflict` (spec 001): `correcta`, `incorrecta`, `traduccion`. La correcta sale arriba o abajo al azar.

## 8. Voz y audio
Botón para oír la frase correcta después de responder. Sonidos de acierto y fallo.

## 9. Pantalla
- Un bloque con aspecto de editor: `<<<<<<< HEAD`, versión de arriba, `=======`, versión de abajo, `>>>>>>> feature/…`, con números de línea.
- Debajo, dos botones con los nombres del editor: **Accept current** y **Accept incoming** (en inglés en los dos idiomas, como en VS Code), con una ayuda traducida debajo.

## 10. Historias de usuario
**HU-1 — Resolver conflictos.**
- [x] Merge Conflict ya no sale como "Próximamente": entro, elijo tema y resuelvo 8 conflictos de mi nivel.
- [x] La frase correcta está arriba o abajo al azar.
- [x] Tras responder veo la frase fusionada, la traducción y, si fallé, la explicación.
- [x] Respondo tocando o con las teclas 1/2 o ↑/↓, y sigo con Enter.

**HU-2 — Progreso y salida.**
- [x] Los aciertos suman puntos y el tiempo cuenta para el objetivo; al salir a medias se pide confirmación (pantalla común).

## 11. Fuera de alcance (v1)
- Conflictos de más de una línea o con tres versiones.

## 12. Preguntas abiertas
- [x] ¿Traducimos "Accept current / incoming"? → **No**: son los nombres reales del editor y forman parte de lo que se aprende; se añade una ayuda traducida.
