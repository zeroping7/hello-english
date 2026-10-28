# Plan técnico: Práctica de hoy

> **Spec:** `specs/plataforma/024-practica-de-hoy/spec.md` · **Estado:** Aprobado (por Claude, con permiso del usuario) · **Fecha:** 2026-10-28

## 1. Datos
`practica: { dia, juegos: [3 ids], hechos: [ids] }` en `he-progreso` v2; `stats.practicas` cuenta las completadas.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `src/progreso/practica.js` | `elegirPractica` (semilla del día), `practicaDeHoy`, `marcarHecho`, `siguientePaso` (puro) |
| `src/progreso/progreso.js` | `leerPractica`, `registrarPartida(…, { practica })` |
| `src/pantallas/practica.js` | Pantalla `#/practica` y `practicaActual()` |
| `src/pantallas/juego.js` | Ruta `#/juego/<id>/practica`: empieza sin elegir tema y al terminar vuelve a la práctica |
| `src/pantallas/inicio.js` | Botón con el avance |

## 3. Pruebas
`src/progreso/tests.html`: 3 distintos y de categorías distintas, estable en el día, prioridad de repasos y de los menos jugados, marcar pasos.
