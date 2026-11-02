# Plan técnico: Medallas del ranking

> **Spec:** `specs/plataforma/029-medallas/spec.md` · **Estado:** Aprobado (con la spec) · **Fecha:** 2026-11-02

## 1. Cumplimiento de la constitución
- [x] A1 `anotarPuesto` en `src/progreso/logica.js`
- [x] A4 Progreso **v3** con migración 2 → 3 (D-027)
- [x] C4 Emoji + texto
- [x] Q2 `src/progreso/tests.html`

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `src/progreso/logica.js` | `medallas`, `anotarPuesto`, `MEDALLA_DIA` |
| `src/progreso/progreso.js` | `registrarPuesto`, `puestoRevisado`, evento `medalla` |
| `src/progreso/logros.js` | 4 logros nuevos |
| `src/pantallas/ranking.js` | `filaMedallas` |

## 3. Modelo de datos
`medallas: { oro, plata, bronce, top10Mes, campeonMes, dia: 'AAAA-MM-DD'|null, mes: 'AAAA-MM'|null }` en `he-progreso` v3.

## 4. Contenido
No usa contenido nuevo salvo que se diga aquí.

## 5. Pantallas
| Ranking y Estadísticas | Fila de medallas (si hay alguna) | — |

## 6. Textos de interfaz
`medallas.*`, `aviso.medalla.*`, `logro.{medalla,oro,top10-mes,campeon-mes}.*`

## 7. Assets
Sin assets nuevos (iconos de trazo en `src/ui/iconos.js`).

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Trampas con puntos falsos | Baja | Topes del servidor (D-021) |

## 9. Pruebas
- **`tests.html`:** medallas por puesto, una vez por periodo, migración e importación.
- **Manual:** quedar primero un día y abrir la app al siguiente.
