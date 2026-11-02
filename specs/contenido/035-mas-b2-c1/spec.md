# Spec de funcionalidad: Más ejercicios de nivel B2 y C1

> **ID:** 035-mas-b2-c1 · **Estado:** Implementada (v1.2.0), **pendiente de que el usuario revise el contenido** (CO1) · **Fecha:** 2026-11-02
> Pedida por el usuario el 2026-11-02 con «hazlo todo y avísame al terminar».

## 1. Problema
Los bancos de 10 minijuegos tienen solo 4 o 5 ejercicios de B2 y de C1 (Bug report, 2). Quien tiene un nivel alto ve los mismos ejercicios enseguida.

## 2. Objetivo
Añadir 2 de B2 y 2 de C1 a esos bancos (1 y 1 en Bug report), con inglés real de trabajo (CO3) y sus traducciones y explicaciones.

## 3. Historias de usuario
**HU-1 —** Como jugador de nivel B2 o C1, quiero más variedad para no repetir ejercicios tan pronto.
- [x] Acrónimos, Ahorcado, Daily standup, Dictado, Dictado de código, Dilo bien, ¿Educado o borde?, Entrevista y Jerga dev: +2 B2 y +2 C1 cada uno.
- [x] Bug report: +1 B2 y +1 C1.
- [x] `contenido/tests.html` sale en verde (ids nuevos, nunca reutilizados).

## 4. Requisitos no funcionales
- Original (CO4) y revisado: solo términos que se usan de verdad. En la duda, fuera (p. ej. palabras con pronunciación distinta en Reino Unido y EE. UU., como *data* o *schedule*, no entran en Dilo bien).

## 5. Fuera de alcance
- Incidente en producción (cada ejercicio es una historia larga; queda para otra spec).
- Bancos que ya tienen 6 o más por nivel.

## 6. Preguntas abiertas (decididas por Claude)
- [x] ¿Cuántos? → 38 ejercicios en total, para que el usuario los pueda revisar de una vez.
