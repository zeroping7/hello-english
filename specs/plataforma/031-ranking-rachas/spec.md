# Spec de funcionalidad: Ranking de rachas

> **ID:** 031-ranking-rachas · **Estado:** Implementada (v1.2.0) · **Fecha:** 2026-11-02
> Pedida por el usuario el 2026-11-02 con «hazlo todo y avísame al terminar»: las preguntas abiertas las decidió Claude (§6) y quedan para que el usuario las revise.

## 1. Problema
El ranking premia jugar mucho un día, no la constancia, que es lo que más ayuda a aprender.

## 2. Objetivo
Una clasificación de rachas: quién lleva más días seguidos cumpliendo el objetivo.

## 3. Historias de usuario
**HU-1 — Rachas.** Como jugador apuntado, quiero ver quién tiene la racha más larga.
- [x] Pestaña Rachas con el top 50 de rachas activas y mi puesto.
- [x] Solo cuentan las rachas vivas (cumplidas hoy o ayer).
- [x] Mi racha se manda con cada envío de puntos.

## 4. Requisitos no funcionales
- Anti-trampas: la racha solo puede subir 1 por día desde el último envío; en el primero, hasta 365.

## 5. Fuera de alcance
- Rachas por liga.

## 6. Preguntas abiertas (decididas por Claude)
- [x] ¿Cómo evitar rachas inventadas? → **Límite de subida por día** (regla `rachaAceptada`).
- [x] ¿Día de Madrid o local? → El servidor usa Madrid para el límite; la racha la calcula la app en hora local. La diferencia de horas no cambia nada importante.
