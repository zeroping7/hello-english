# Plan técnico: Ligas por nivel

> **Spec:** `specs/plataforma/030-ligas/spec.md` · **Estado:** Aprobado (con la spec) · **Fecha:** 2026-11-02

## 1. Cumplimiento de la constitución
- [x] A1 `nivelValido` (servidor)
- [x] PR1 Se envía también el nivel (A1-C1); se explica en D-024
- [x] Q2 `servidor/tests.html`
- El servidor es la v2 de `servidor/worker.js` (D-024): hay que volver a pegarlo en Cloudflare.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `servidor/worker.js` | Columna `jugadores.nivel`; `/puntos` acepta `nivel`; `/ranking?liga=B1` |
| `src/ranking/ranking.js` | Manda `nivel` y `racha` en cada envío; `clasificacion(periodo, { liga })` |
| `src/pantallas/ranking.js` | Opción Todos / Mi nivel |

## 3. Modelo de datos
`jugadores.nivel TEXT` (se añade solo, D-024).

## 4. Contenido
No usa contenido nuevo salvo que se diga aquí.

## 5. Pantallas
| Ranking → Día/Mes | Opción de liga (solo si el servidor ya es v2) | — |

## 6. Textos de interfaz
`ranking.liga`, `ranking.liga.{todas,mia}`, `ranking.viendo.liga`

## 7. Assets
Sin assets nuevos (iconos de trazo en `src/ui/iconos.js`).

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Jugadores sin nivel (antes de la v1.2.0) | Alta al principio | Solo salen en «Todos» hasta su siguiente partida |

## 9. Pruebas
- **`tests.html`:** niveles válidos.
- **Manual:** jugar con dos alias de distinto nivel y filtrar.
