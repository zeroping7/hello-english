# Spec: Contrarreloj

> **ID:** 019-contrarreloj · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
60 segundos para traducir todas las palabras posibles eligiendo entre dos. Muchas trampas son falsos amigos (actually/actualmente, library/librería).

## 2. Qué se aprende
- **Categoría:** Vocabulario
- **Habilidades:** vocabulario
- **Niveles:** De file/archivo (A1) a to deprecate/declarar obsoleto o caveat/advertencia (C1).

## 3. Partida
- **Ejercicios:** 40 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Ver la palabra → elegir rápido → acierto o fallo en un instante → la siguiente.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Elegir | Tocar | 1/2 o ←/→ |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** Marca verde breve y +1 en el marcador.
- **Al fallar:** La elegida en rojo y la buena en verde, un poco más de tiempo para verlo.
- **Resumen final:** Al acabar el tiempo (o las 40), aciertos y lista de las falladas con su traducción. El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `contrarreloj`: `en`, `es` y `incorrecta`. Mínimo 10 por nivel.
Hoy: 50 ejercicios (A1 10, A2 10, B1 10, B2 10, C1 10), de los tres temas.

## 8. Voz y audio
Ninguna. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Reloj grande (rojo en los últimos 10 s), barra de tiempo, marcador, palabra y dos botones grandes.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Tengo 60 segundos y el tiempo solo corre con la pestaña visible.
- [x] Al acabar veo las que fallé.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Elegir la duración. El límite de tiempo es parte del juego (WCAG 2.2.1 lo permite si es esencial); los demás minijuegos no tienen.

## 12. Preguntas abiertas
- Ninguna.
