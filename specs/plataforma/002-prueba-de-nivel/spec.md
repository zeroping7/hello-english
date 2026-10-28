# Spec de funcionalidad: Prueba de nivel

> **ID:** 002-prueba-de-nivel · **Estado:** Implementada (v0.2.0) · **Fecha:** 2026-10-28

## 1. Problema
Todo el mundo empieza en A1, aunque ya sepa inglés. Quien tiene nivel se aburre con ejercicios demasiado fáciles.

## 2. Objetivo
Una prueba corta (10 preguntas) que se adapta sobre la marcha y deja al usuario en su nivel, desde la bienvenida o desde Ajustes.

## 3. Historias de usuario

**HU-1 — Hacer la prueba.** Como usuario nuevo, quiero que la app sepa mi nivel sin un examen largo.
- [x] En el paso 3 de la bienvenida, "Hacer la prueba de nivel" ya está disponible.
- [x] La prueba tiene 10 preguntas de elegir una de cuatro opciones, con temas de informática.
- [x] Empieza en A2. Si acierto, la siguiente es de un nivel más; si fallo, de uno menos.
- [x] Veo en qué pregunta voy ("3 de 10").
- [x] Al responder veo si he acertado (con icono y texto, no solo color), la frase traducida y una explicación breve si he fallado; después paso a la siguiente.
- [x] No se repiten preguntas en la misma prueba.

**HU-2 — Resultado.**
- [x] Al terminar veo mi nivel (A1–C1) con su nombre ("B1 · Intermedio") y cuántas he acertado.
- [x] Con "Empezar" se guarda el nivel y voy al inicio, que ya lo muestra.

**HU-3 — Repetirla.**
- [x] En Ajustes, "Repetir la prueba de nivel" ya funciona. El nivel nuevo sustituye al anterior.

**HU-4 — Salir a medias.**
- [x] Puedo salir con el botón de volver, el atrás del móvil o Esc. Se pide confirmación y no se guarda nada.

**HU-5 — Con cualquier control.**
- [x] Se responde tocando, con el ratón o con las teclas 1-4, y se pasa a la siguiente con Enter.

## 4. Requisitos no funcionales
- La prueba cuenta como tiempo de práctica para el objetivo del día, pero no da puntos.
- Accesible: las opciones son botones, el resultado se anuncia al lector de pantalla.

## 5. Fuera de alcance
- Que el nivel suba solo con el uso (spec de progresión).
- Preguntas de escucha o de pronunciación.

## 6. Preguntas abiertas
- [x] ¿Se enseña si se acierta durante la prueba? → **Sí**: es una app para aprender, y la explicación ya enseña algo.
- [x] ¿Da puntos? → **No**: así nadie falla a propósito para empezar más abajo y ganar puntos fáciles.
