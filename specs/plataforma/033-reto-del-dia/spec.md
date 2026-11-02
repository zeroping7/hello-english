# Spec de funcionalidad: Reto del día

> **ID:** 033-reto-del-dia · **Estado:** Implementada (v1.2.0) · **Fecha:** 2026-11-02
> Pedida por el usuario el 2026-11-02 con «hazlo todo y avísame al terminar»: las preguntas abiertas las decidió Claude (§6) y quedan para que el usuario las revise.

## 1. Problema
Cada jugador juega ejercicios distintos, así que comparar puntos no dice quién lo ha hecho mejor en lo mismo.

## 2. Objetivo
Un reto diario igual para todos: mismo minijuego, mismos 10 ejercicios, un solo intento y su propia clasificación.

## 3. Historias de usuario
**HU-1 — Jugar el reto.** Como jugador, quiero jugar el reto de hoy desde el inicio.
- [x] Tarjeta «Reto del día» en el inicio con el minijuego de hoy.
- [x] 10 ejercicios, 2 de cada nivel de A1 a C1, en orden de dificultad.
- [x] Solo cuenta el primer intento; si salgo a medias, se guarda lo que lleve. Se avisa antes.
- [x] Hecho, el inicio enseña el resultado (aciertos y tiempo) y no deja repetirlo.
- [x] Los puntos del reto cuentan como cualquier partida.

**HU-2 — Clasificación.** Como jugador apuntado, quiero comparar mi reto con el de los demás.
- [x] Pestaña Reto: gana quien más acierta y, si empatan, quien tarda menos.
- [x] Logros: primer reto, reto perfecto y 7 retos.

## 4. Requisitos no funcionales
- El reto se puede jugar sin estar en el ranking (sin clasificación).
- Mismo reto en todos los dispositivos sin preguntar al servidor (semilla con la fecha de Madrid, D-026).

## 5. Fuera de alcance
- Elegir el minijuego del reto a mano.
- Retos de minijuegos con voz (no todos pueden hablar).

## 6. Preguntas abiertas (decididas por Claude)
- [x] ¿Qué minijuegos? → Los de un ejercicio cada vez y sin voz: Merge Conflict, Caza el bug, Prompt, Ordenar frases, Falsos amigos, Acrónimos, Jerga dev y ¿Educado o borde?
- [x] ¿Nivel del reto? → **Todos los niveles**, para que sea el mismo para todos.
- [x] ¿Desempate? → El tiempo.
