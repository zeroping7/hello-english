# Plan técnico: Logros

> **Spec:** `specs/plataforma/023-logros/spec.md` · **Estado:** Aprobado (por Claude, con permiso del usuario) · **Fecha:** 2026-10-28

## 1. Datos
`logros: { [id]: 'AAAA-MM-DD' }` y `stats: { partidas, perfectas, juegos: { [id]: n }, practicas, aprendidos, rachaMax }` en `he-progreso` v2.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `src/progreso/logros.js` | `LOGROS` (id, icono, condición) y `comprobarLogros` (puro) |
| `src/progreso/progreso.js` | Comprueba logros en cada guardado y emite `logro` |
| `src/progreso/logica.js` | `anotarPartida`; `rachaMax` al subir la racha |
| `src/pantallas/logros.js` | Pantalla `#/logros` |
| `src/app.js` | Aviso «Logro conseguido» |
| `src/pantallas/inicio.js` | Enlace «Logros N/18» |

## 3. Pruebas
`src/progreso/tests.html`: se apuntan una vez, con fecha, e ids únicos.
