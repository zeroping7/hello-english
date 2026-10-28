# Spec: Dictado de código

> **ID:** 010-dictado-codigo · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
La voz lee una línea de código como la diría un compañero («name equals double quote Ana double quote semicolon») y el usuario la escribe. Al responder, aprende cómo se dicen los símbolos. Dificultad 1,5.

## 2. Qué se aprende
- **Categoría:** Escucha y habla
- **Habilidades:** escucha, escritura
- **Niveles:** De `x = 5` (A1) a `a[href^="https"]` o `items.map(i => i * 2)` (C1).

## 3. Partida
- **Ejercicios:** 5 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Escuchar (normal o lento) → escribir el código → Comprobar → ver el código, lo dictado y la tabla de símbolos.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Escuchar | Botones Escuchar / Más despacio |  | Se oye solo al empezar |
| Ver lo dictado | Ver el texto |  | Ayuda si la voz no se entiende |
| Comprobar | Botón | Enter | Espacios y tipo de comillas no cuentan |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** Código en verde y tabla «cómo se dicen los símbolos».
- **Al fallar:** Lo escrito, el código bueno y la misma tabla.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `dictado-codigo`: `codigo` y `dictado` (cómo se lee). `explicacion` opcional para símbolos de varios caracteres (`=>`, `!=`). Mínimo 4 por nivel.
Hoy: 20 ejercicios (A1 4, A2 4, B1 4, B2 4, C1 4), de los tres temas.

## 8. Voz y audio
Necesita voz en inglés: sin ella, la pantalla común avisa y no deja jugar (constitución C1: los demás minijuegos siguen disponibles). Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Botones de escucha, recuadro con «Ver el texto», campo monoespaciado.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Oigo el código y lo escribo.
- [x] No me penalizan espacios ni comillas simples o dobles.
- [x] Veo cómo se dice cada símbolo, en británico y americano cuando cambia.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Bloques de varias líneas.

## 12. Preguntas abiertas
- Ninguna.
