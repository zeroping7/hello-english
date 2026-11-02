# Spec de funcionalidad: Estadísticas

> **ID:** 034-estadisticas · **Estado:** Implementada (v1.2.0) · **Fecha:** 2026-11-02
> Pedida por el usuario el 2026-11-02 con «hazlo todo y avísame al terminar»: las preguntas abiertas las decidió Claude (§6) y quedan para que el usuario las revise.

## 1. Problema
El jugador no sabe en qué falla más, y la Práctica de hoy solo mira los repasos y lo menos jugado.

## 2. Objetivo
Una pantalla de estadísticas con los puntos flojos, y que la Práctica de hoy los tenga en cuenta.

## 3. Historias de usuario
**HU-1 — Ver mis estadísticas.** Como jugador, quiero ver cómo voy.
- [x] Desde el inicio (junto a Logros) se abre Estadísticas.
- [x] Resumen: partidas, % de aciertos, aprendidos, mejor racha, perfectas y retos; mis medallas.
- [x] Minutos de los últimos 14 días en barras.
- [x] % de aciertos por minijuego (de peor a mejor) y por tema.

**HU-2 — Puntos flojos.** Como jugador, quiero practicar lo que más me cuesta.
- [x] «Para mejorar»: hasta 3 minijuegos con menos de un 75 % de aciertos (con al menos 10 respuestas), con enlace para jugar.
- [x] La Práctica de hoy mete el más flojo después del de repasos.

## 4. Requisitos no funcionales
- Barras con número al lado (C4); cada barra del historial tiene texto para el lector de pantalla.
- Todo sale del progreso local: nada se envía.

## 5. Fuera de alcance
- Gráficas de más de 14 días o por palabra.

## 6. Preguntas abiertas (decididas por Claude)
- [x] ¿Desde cuándo se cuentan? → Desde la v1.2.0 (antes no se guardaban aciertos por minijuego). Se dice en la pantalla.
