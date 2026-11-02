# Spec de funcionalidad: Resultados de ayer y del mes pasado

> **ID:** 028-resultados-anteriores · **Estado:** Implementada (v1.2.0) · **Fecha:** 2026-11-02
> Pedida por el usuario el 2026-11-02 con «hazlo todo y avísame al terminar»: las preguntas abiertas las decidió Claude (§6) y quedan para que el usuario las revise.

## 1. Problema
El ranking solo enseña el día y el mes en curso. A medianoche se pone a cero y nadie sabe quién ganó ayer ni cómo quedó él.

## 2. Objetivo
Ver la clasificación final de ayer y del mes pasado, y que la app avise al abrirla: «Ayer quedaste #3 de 25».

## 3. Historias de usuario
**HU-1 — Ver lo anterior.** Como jugador apuntado, quiero ver el resultado final de ayer y del mes pasado.
- [x] En la pestaña Día puedo elegir Hoy o Ayer; en Mes, Este mes o Mes pasado.
- [x] Se dice qué se está viendo («Resultado final de ayer, 1 de noviembre»).

**HU-2 — Aviso.** Como jugador apuntado, quiero que la app me diga mi puesto de ayer al abrirla.
- [x] Al abrir la app, si ayer tuve puesto, sale un aviso con el puesto y cuántos jugaron. Lo mismo el primer día del mes con el mes pasado.
- [x] Cada aviso sale una sola vez; sin red se intenta otro día.
- [x] Al unirse no salen avisos de periodos de antes.

## 4. Requisitos no funcionales
- Sin red, el aviso no sale y no se pierde: se mira la próxima vez.
- Mismas reglas de accesibilidad que el ranking (027).

## 5. Fuera de alcance
- Histórico más antiguo que el mes pasado (el servidor solo guarda el mes actual y el anterior).

## 6. Preguntas abiertas (decididas por Claude)
- [x] ¿Ayer y mes pasado como pestañas o como opción dentro de Día y Mes? → **Opción dentro** (botones segmentados), para que las pestañas quepan a 320 px.
- [x] ¿Cuándo avisar? → **Al abrir la app**, una vez por periodo.
