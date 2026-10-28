# Plan técnico: Merge Conflict

> **Spec:** `specs/merge-conflict/004-merge-conflict/spec.md` · **Estado:** Aprobado (por Claude, con permiso del usuario) · **Fecha:** 2026-10-28

## 1. Cumplimiento de la constitución
- [x] A1 `juegos/merge-conflict/logica.js` puro con `tests.html`.
- [x] A2 Banco `merge-conflict`. A3 Textos en i18n.
- [x] A5 Interfaz común de minijuego (spec 003, D-014); `disponible: true` en el registro.
- [x] A6 Qué lado es el correcto se decide con el `azar` que da la pantalla común.
- [x] C1-C4 Botones, teclas 1/2 y ↑/↓, ✓/✗ con texto.
- [x] P5 Archivos en `FILES`.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `juegos/merge-conflict/logica.js` | `prepararConflicto(item, azar)` → `{ arriba, abajo, correcta: 'arriba'|'abajo', rama }`; `comprobar(conflicto, lado)` |
| `juegos/merge-conflict/tests.html` | Pruebas de la lógica |
| `juegos/merge-conflict/juego.js` | Bloque de conflicto, botones, teclas y resultado |
| `juegos/merge-conflict/juego.css` | Aspecto de editor |
| `src/pantallas/juego.js` | Pasa también `azar` al minijuego |

## 3. Rama
El nombre de la rama de abajo sale del tema: `feature/<tema>-fix` (p. ej. `feature/web-fix`). Es decorado: no se aprende nada de él.

## 4. Textos de interfaz
`mc.instruccion`, `mc.aceptarArriba` (*Accept current*), `mc.aceptarAbajo` (*Accept incoming*), `mc.ayudaArriba`, `mc.ayudaAbajo`, `mc.fusionada`, `mc.escuchar`.

## 5. Pruebas
- **`tests.html`:** la correcta sale en los dos lados según la semilla; `comprobar` acierta y falla bien; la rama lleva el tema.
- **Manual:** partida entera en el móvil y en el PC con 1/2 y Enter.
