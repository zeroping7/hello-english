# Spec de funcionalidad: Medallas del ranking

> **ID:** 029-medallas · **Estado:** Implementada (v1.2.0) · **Fecha:** 2026-11-02
> Pedida por el usuario el 2026-11-02 con «hazlo todo y avísame al terminar»: las preguntas abiertas las decidió Claude (§6) y quedan para que el usuario las revise.

## 1. Problema
Quedar primero un día no deja huella: al día siguiente el ranking empieza de cero.

## 2. Objetivo
Medallas que se quedan para siempre: oro, plata y bronce por los 3 primeros puestos de un día; top 10 y campeón por el mes. Con sus logros.

## 3. Historias de usuario
**HU-1 — Ganar medallas.** Como jugador apuntado, quiero ganar una medalla al quedar en el podio.
- [x] Puesto 1, 2 o 3 de un día → oro, plata o bronce. Top 10 de un mes → medalla de top 10; puesto 1 → campeón del mes (cuenta también como top 10).
- [x] Se gana al ver el resultado (028), con un aviso y sonido.
- [x] Cada día y cada mes cuentan una sola vez.

**HU-2 — Verlas.** Como jugador, quiero ver mis medallas.
- [x] Salen arriba del ranking y en Estadísticas.
- [x] Logros nuevos: «Al podio», «Primer commit en main» (oro), «Top 10», «Release del mes».
- [x] Las medallas se quedan aunque salga del ranking, y van en exportar e importar.

## 4. Requisitos no funcionales
- Las medallas usan emoji y texto (no solo color, C4).

## 5. Fuera de alcance
- Medallas por ligas (las medallas salen del ranking de todos).
- Medallas del reto del día.

## 6. Preguntas abiertas (decididas por Claude)
- [x] ¿Dónde se guardan? → En el **progreso** (v3), no en `he-ranking`: son logros del jugador y no se pierden al salir.
- [x] ¿Medallas por liga? → **No**: con pocos jugadores habría medallas casi regaladas.
