# Plan técnico: Resultados de ayer y del mes pasado

> **Spec:** `specs/plataforma/028-resultados-anteriores/spec.md` · **Estado:** Aprobado (con la spec) · **Fecha:** 2026-11-02

## 1. Cumplimiento de la constitución
- [x] A1 `rangoPeriodo` (servidor), `diaAnterior` y `mesAnterior` (app) son puros
- [x] A3 Textos `ranking.periodo.*`, `ranking.viendo.*`, `aviso.resultado.*`
- [x] A4 Lo ya revisado se guarda en `medallas.dia` / `medallas.mes` del progreso (029)
- [x] Q2 `servidor/tests.html` y `src/ranking/tests.html`
- El servidor es la v2 de `servidor/worker.js` (D-024): hay que volver a pegarlo en Cloudflare.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `servidor/worker.js` | `GET /ranking?periodo=dia\|ayer\|mes\|mesAnterior` |
| `src/ranking/ranking.js` | `clasificacion(periodo)`, `comprobarResultados()`, `alVerResultado()` |
| `src/pantallas/ranking.js` | Opciones Hoy/Ayer y Este mes/Mes pasado |
| `src/app.js` | Aviso con el puesto |

## 3. Modelo de datos
Respuesta de `/ranking`: `{ api: 2, periodo, dia, desde, hasta, liga, top, yo, jugadores }`. `dia` es el día de referencia (ayer o el día 1 del mes).

## 4. Contenido
No usa contenido nuevo salvo que se diga aquí.

## 5. Pantallas
| Ranking → Día/Mes | Opción de periodo y una línea con qué se ve | — |

## 6. Textos de interfaz
`ranking.periodo`, `ranking.periodo.{dia,diaAnterior,mes,mesAnterior}`, `ranking.viendo.{ayer,mes}`, `ranking.vacio.{ayer,mesAnterior}`, `ranking.sinPuntos.{ayer,mesAnterior}`, `aviso.resultado.{dia,mes}`

## 7. Assets
Sin assets nuevos (iconos de trazo en `src/ui/iconos.js`).

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| El servidor sin actualizar responde con el día de hoy | Media | La app dice «hay que actualizar el servidor» cuando una ruta no existe (`sin-version`) |

## 9. Pruebas
- **`tests.html`:** periodos (servidor), fechas iguales en app y servidor.
- **Manual:** abrir la app un día después de jugar y ver el aviso; en Ranking → Día → Ayer.
