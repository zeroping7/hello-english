# Spec: Práctica de hoy

> **ID:** 024-practica-de-hoy · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
El botón grande del inicio. Propone tres minijuegos para el día: primero el que más repasos tiene pendientes y luego, de categorías distintas, los que menos se han jugado. Se juegan seguidos y, al completarlos, se celebra.

## 2. Problema / motivación
Con 19 minijuegos, decidir a qué jugar cuesta. La práctica decide por el usuario y mezcla habilidades y repasos.

## 3. Alcance
- **Incluye:** la elección del día (estable: no cambia al recargar); la pantalla `#/practica` con los tres pasos; jugar cada paso sin elegir tema; volver a la práctica al terminar; avance en el inicio («1 de 3 hechos · 5 para repasar»).
- **No incluye:** elegir cuántos minijuegos; una práctica que dure exactamente el objetivo diario.

## 4. Historias de usuario
**HU-1 — Practicar.**
- [x] En el inicio toco «Práctica de hoy» y veo los tres minijuegos de hoy.
- [x] Empiezo, juego el primero y al terminar «Continuar la práctica» me lleva al siguiente.
- [x] Al acabar el tercero veo «Práctica de hoy completada».

**HU-2 — Cada día, otra.**
- [x] Mañana la práctica es otra; los minijuegos que necesitan voz no salen si el navegador no puede hablar.

## 5. Criterios generales
- [x] Si salgo a medias, la práctica guarda lo que llevo.

## 6. Preguntas abiertas
- Ninguna.
