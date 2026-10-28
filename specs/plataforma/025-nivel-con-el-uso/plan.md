# Plan técnico: Subida de nivel con el uso

> **Spec:** `specs/plataforma/025-nivel-con-el-uso/spec.md` · **Estado:** Aprobado (por Claude, con permiso del usuario) · **Fecha:** 2026-10-28

## 1. Datos
`ventana: [0|1]` (los últimos 20 del nivel actual) en `he-progreso` v2 (D-019).

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `src/progreso/logica.js` | `VENTANA = 20`, `PARA_SUBIR = 16`, `anotarNivel` |
| `src/progreso/progreso.js` | Lo llama `registrarResultado`; emite `nivel`. `fijarNivel` vacía la ventana |
| `src/app.js` | Aviso de subida |

## 3. Pruebas
`src/progreso/tests.html`: sube con 16/20, no con 15/20, otro nivel no cuenta, C1 no sube.
