# Spec: Caza el bug

> **ID:** 005-caza-el-bug · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Un email, un commit, un mensaje de Slack o un README con una palabra mal escrita o mal usada. El usuario toca la palabra con el error y ve el texto corregido. Entrena el ojo para la gramática y la ortografía en textos reales del trabajo.

## 2. Qué se aprende
- **Categoría:** Lectura y gramática
- **Habilidades:** gramática, lectura
- **Niveles:** De concordancias y artículos (A1) a inversiones, «fewer/less» o «affect/effect» (C1).

## 3. Partida
- **Ejercicios:** 8 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Leer el texto → tocar la palabra mal → ver la corrección, la traducción y por qué → siguiente.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Elegir la palabra | Tocarla | Tab y Enter | Cada palabra es un botón |
| Siguiente | Botón | Enter |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** La palabra pasa a verde con la forma mala tachada y la buena al lado; se ve la frase corregida, la traducción y la explicación (siempre: es lo que se aprende).
- **Al fallar:** La palabra tocada en rojo y la del error en verde, con la explicación en el idioma de la interfaz.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `caza-el-bug`: `formato` (email, commit, slack, docs o ticket: cambia la cabecera), `texto` con un solo error marcado como `{mal|bien}` (sin espacios dentro), `traduccion` y `explicacion`. Mínimo 6 por nivel.
Hoy: 30 ejercicios (A1 6, A2 6, B1 6, B2 6, C1 6), de los tres temas.

## 8. Voz y audio
Altavoz para oír la frase corregida. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Un recuadro con la cabecera de la herramienta (p. ej. `$ git commit -m`) y las palabras como botones.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Entro, elijo tema y juego 8 textos de mi nivel.
- [x] Tras tocar una palabra veo la corrección, la traducción y la explicación.
- [x] Puedo jugar solo con teclado (Tab y Enter).

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Textos con varios errores a la vez o con errores que ocupan varias palabras.

## 12. Preguntas abiertas
- Ninguna.
