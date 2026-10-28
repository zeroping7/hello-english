# Spec: Dictado

> **ID:** 014-dictado-audio · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Se oye una frase y se escribe. Se corrige palabra a palabra, sin contar mayúsculas ni puntuación, para ver exactamente qué falló. Dificultad 1,5.

## 2. Qué se aprende
- **Categoría:** Escucha y habla
- **Habilidades:** escucha, escritura
- **Niveles:** De «I am a programmer.» (A1) a «It remains to be seen whether the new architecture will scale.» (C1).

## 3. Partida
- **Ejercicios:** 6 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Escuchar → escribir → Comprobar → ver la frase y las palabras que faltan o están mal.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Escuchar | Escuchar / Más despacio |  |  |
| Comprobar | Botón | Enter |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** La frase y su traducción.
- **Al fallar:** La frase con las palabras falladas en rojo y cuántas son.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `dictado-audio`: `frase` y `traduccion`. Mínimo 4 por nivel.
Hoy: 20 ejercicios (A1 4, A2 4, B1 4, B2 4, C1 4), de los tres temas.

## 8. Voz y audio
Necesita voz. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Botones de escucha y un campo ancho con letra normal.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Oigo la frase y la escribo.
- [x] Veo qué palabras fallé.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Aceptar errores pequeños de ortografía como acierto.

## 12. Preguntas abiertas
- Ninguna.
