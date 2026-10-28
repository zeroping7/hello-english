# Spec: Jerga dev

> **ID:** 016-jerga-dev · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Expresiones que usan los programadores (rubber duck debugging, yak shaving, bus factor...) con un ejemplo de uso. Se elige qué significan.

## 2. Qué se aprende
- **Categoría:** Vocabulario
- **Habilidades:** vocabulario
- **Niveles:** De «bug» o «to google» (A1) a «heisenbug» o «to boil the ocean» (C1).

## 3. Partida
- **Ejercicios:** 6 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Leer la expresión y el ejemplo → elegir el significado entre 3 → ver la respuesta.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Elegir | Tocar | 1, 2, 3 |  |
| Escuchar | Altavoces |  | Expresión y ejemplo |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** Expresión → significado.
- **Al fallar:** Lo mismo, marcando la elegida.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `jerga-dev`: `expresion`, `ejemplo` y `opciones` (3, con es y en; la primera es la buena). Las opciones salen en el idioma de la interfaz. Mínimo 4 por nivel.
Hoy: 20 ejercicios (A1 4, A2 4, B1 4, B2 4, C1 4), de los tres temas.

## 8. Voz y audio
Opcional. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
La expresión grande, el ejemplo como cita y las opciones.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Aprendo expresiones con un ejemplo real.
- [x] Las opciones salen en mi idioma de interfaz.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Usar la expresión en una frase propia.

## 12. Preguntas abiertas
- Ninguna.
