# Plan técnico: Repaso espaciado

> **Spec:** `specs/plataforma/022-repaso-espaciado/spec.md` · **Estado:** Aprobado (por Claude, con permiso del usuario) · **Fecha:** 2026-10-28

## 1. Datos
En `he-progreso` (formato v2, D-018): `repaso: { [idItem]: { c: caja (0-2), p: 'AAAA-MM-DD' } }` y `stats.aprendidos`.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `src/progreso/logica.js` | `INTERVALOS = [1, 3, 7]`, `anotarRepaso`, `repasosPendientes`; migración v1 → v2 |
| `src/progreso/progreso.js` | `registrarResultado` (puntos + repaso + nivel), `pendientes(prefijo)` |
| `src/contenido/elegir.js` | `elegirConRepaso`: hasta un 40 % de pendientes, el resto con el reparto 60/30/10 |
| `src/contenido/esquema.js` | `PREFIJO` de cada banco, para saber de qué minijuego es cada id |
| `src/pantallas/juego.js` | Usa `elegirConRepaso` y avisa de los pendientes |

## 3. Reglas
- Fallo → `c = 0`, `p = mañana`.
- Acierto de uno pendiente (`p ≤ hoy`) → `c + 1`; con `c = 3` se borra y suma `aprendidos`. Si no tocaba aún, no cambia.
- Acierto de uno que no está en el repaso → nada (solo se repasa lo fallado).

## 4. Pruebas
`src/progreso/tests.html`: fallo, subida de caja, aprendido, acierto que no toca, migración e importación.
