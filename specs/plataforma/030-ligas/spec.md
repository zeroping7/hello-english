# Spec de funcionalidad: Ligas por nivel

> **ID:** 030-ligas · **Estado:** Implementada (v1.2.0) · **Fecha:** 2026-11-02
> Pedida por el usuario el 2026-11-02 con «hazlo todo y avísame al terminar»: las preguntas abiertas las decidió Claude (§6) y quedan para que el usuario las revise.

## 1. Problema
Un A1 compite contra un C1: aunque los puntos ya pesan el nivel (027), quien empieza casi nunca ve su nombre arriba.

## 2. Objetivo
Poder ver el ranking solo con los jugadores de mi nivel.

## 3. Historias de usuario
**HU-1 — Mi liga.** Como jugador apuntado, quiero filtrar el ranking por mi nivel.
- [x] En Día y Mes (también ayer y mes pasado) elijo «Todos» o «Mi nivel (B1)».
- [x] Mi liga es mi nivel actual en la app; se manda al servidor con cada envío de puntos.
- [x] Si subo de nivel, paso a la liga nueva desde el siguiente envío.

## 4. Requisitos no funcionales
- Sin datos nuevos personales: el nivel ya se deduce de los puntos.

## 5. Fuera de alcance
- Ascensos y descensos entre ligas con temporadas.
- La posición del inicio y las medallas siguen siendo del ranking de todos.

## 6. Preguntas abiertas (decididas por Claude)
- [x] ¿La liga es el nivel en el momento de cada partida o el actual? → **El actual** (más simple y se entiende mejor).
- [x] ¿Por defecto Todos o Mi nivel? → **Todos**, igual que el inicio y las medallas.
