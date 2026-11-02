# Plan técnico: Ranking de rachas

> **Spec:** `specs/plataforma/031-ranking-rachas/spec.md` · **Estado:** Aprobado (con la spec) · **Fecha:** 2026-11-02

## 1. Cumplimiento de la constitución
- [x] A1 `rachaAceptada` (servidor)
- [x] Q2 `servidor/tests.html`
- El servidor es la v2 de `servidor/worker.js` (D-024): hay que volver a pegarlo en Cloudflare.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `servidor/worker.js` | Columnas `racha` y `racha_dia`; `GET /rachas` |
| `src/ranking/ranking.js` | `rachas()` |
| `src/pantallas/ranking.js` | Pestaña Rachas |

## 3. Modelo de datos
`jugadores.racha INTEGER`, `jugadores.racha_dia TEXT`. Respuesta: `{ api: 2, dia, top: [{ pos, alias, racha }], yo, jugadores }`.

## 4. Contenido
No usa contenido nuevo salvo que se diga aquí.

## 5. Pantallas
| Ranking → Rachas | Top 50 de rachas activas y la mía | — |

## 6. Textos de interfaz
`ranking.pestana.rachas`, `ranking.rachas.explica`, `ranking.{vacio.rachas,tuRacha,sinRacha,jugadoresRacha}`

## 7. Assets
Sin assets nuevos (iconos de trazo en `src/ui/iconos.js`).

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Racha que no baja en el servidor al perderla | Media | Solo se enseñan las cumplidas hoy o ayer |

## 9. Pruebas
- **`tests.html`:** límite de subida, primera racha, valores no válidos.
- **Manual:** cumplir el objetivo y ver la racha en la pestaña.
