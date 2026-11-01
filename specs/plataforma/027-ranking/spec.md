# Spec de funcionalidad: Ranking diario y mensual

> **ID:** 027-ranking · **Estado:** Borrador · **Fecha:** 2026-11-01
> Primera pieza con servidor. Cambia las reglas P2 y PR1 de la constitución: hay que justificarlo en `docs/decisiones.md`.

## 1. Problema
Hoy cada jugador juega solo y su progreso se queda en su dispositivo. No hay forma de compararse con otros ni un motivo extra para volver cada día.

## 2. Objetivo
Quien quiera puede apuntarse a un ranking con un alias y competir con otros jugadores en una clasificación **diaria** y otra **mensual**. Quien no se apunte sigue usando la app exactamente igual: sin cuentas y sin que nada salga de su dispositivo.

## 3. Historias de usuario
**HU-1 — Apuntarse.** Como jugador, quiero unirme al ranking eligiendo solo un alias, para competir sin crear una cuenta.
- [ ] Dado que no estoy apuntado, cuando abro el ranking, entonces veo qué datos se envían (alias y puntos) y un botón para unirme.
- [ ] Dado que elijo un alias, cuando ya existe o contiene palabras ofensivas, entonces se me pide otro.
- [ ] Dado que me uno, entonces recibo un código de recuperación y se me recomienda guardarlo.

**HU-2 — Sumar puntos.** Como jugador apuntado, quiero que mis partidas cuenten solas, para no tener que hacer nada más.
- [ ] Dado que termino un minijuego, cuando hay conexión, entonces mis puntos se envían al ranking.
- [ ] Dado que no hay conexión, cuando vuelve, entonces se envían los pendientes del día (si el día no ha cerrado).

**HU-3 — Ver la clasificación.** Como jugador, quiero ver el top del día y del mes y mi posición, para saber cómo voy.
- [ ] Dado que abro el ranking, entonces veo dos pestañas (Hoy / Este mes) con el top 50 y mi posición aunque no esté en el top.
- [ ] Dado que no hay conexión, entonces veo un aviso en lugar de la lista.

**HU-4 — Recuperar mi identidad.** Como jugador, quiero usar mi alias en otro dispositivo o tras borrar datos, para no perder mis puntos.
- [ ] Dado que introduzco mi código de recuperación, entonces vuelvo a tener mi alias y mis puntos.
- [ ] Exportar progreso incluye el código; importarlo me deja apuntado.

**HU-5 — Salir.** Como jugador apuntado, quiero dejar el ranking y borrar mis datos del servidor.
- [ ] Dado que salgo del ranking desde Ajustes, entonces mi alias y mis puntos desaparecen del servidor y la app vuelve a ser solo local.

## 4. Requisitos no funcionales
- **Servidor:** Cloudflare Workers + D1 en el plan gratuito. La app sigue en GitHub Pages y solo llama a la API del Worker.
- **Privacidad:** opcional y desactivado por defecto. Solo se envían alias, puntos y un id anónimo. Sin email, sin cookies, sin estadísticas.
- **Antitrampas:** el servidor rechaza puntuaciones imposibles (tope por partida y por día) y limita el número de envíos.
- **Sin conexión:** la app funciona igual sin red; el ranking solo es una pantalla más que avisa si no puede cargar.
- **Días y meses:** se cierran a medianoche de hora de España (Europe/Madrid).
- Accesibilidad, estilo y textos traducibles como el resto de la app (constitución §4, §8 y A3).

## 5. Fuera de alcance
- Login con Google u otras cuentas.
- Amigos, chat o mensajes entre jugadores.
- Premios o recompensas por quedar arriba.
- Histórico de rankings de días o meses anteriores.

## 6. Preguntas abiertas
- [ ] **¿Qué puntúa?** a) XP totales del día/mes; b) XP ponderados por nivel (más puntos en C1 que en A1); c) un ranking separado por nivel.
- [ ] **¿Cuenta todo o solo algunas cosas?** ¿Todos los minijuegos y la Práctica de hoy, o también los repasos?
- [ ] **Alias:** ¿longitud y caracteres permitidos (propuesta: 3-16, letras, números, `_` y `-`)? ¿Se puede cambiar después?
- [ ] **¿Dónde se ve?** ¿Botón en el inicio, pestaña propia o dentro de Progreso?
- [ ] **¿Top 50** te parece bien o prefieres otro tamaño?
