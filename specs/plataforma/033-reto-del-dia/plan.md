# Plan técnico: Reto del día

> **Spec:** `specs/plataforma/033-reto-del-dia/spec.md` · **Estado:** Aprobado (con la spec) · **Fecha:** 2026-11-02

## 1. Cumplimiento de la constitución
- [x] A1 `src/reto/logica.js` puro
- [x] A4 `reto` y `stats.retos` en el progreso v3; el envío pendiente en `he-ranking.reto`
- [x] A6 Semilla de la fecha (`semillaReto`)
- [x] Q2 `src/ranking/tests.html` (reto) y `servidor/tests.html`
- El servidor es la v2 de `servidor/worker.js` (D-024): hay que volver a pegarlo en Cloudflare.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `src/reto/logica.js` | `RETO_N`, `JUEGOS_RETO`, `juegoDelReto(dia)`, `elegirReto(items, dia)` |
| `src/pantallas/juego.js` | Modo `#/juego/<id>/reto` |
| `src/pantallas/inicio.js` | Tarjeta del reto |
| `src/ranking/ranking.js` | `guardarReto`, `clasificacionReto` |
| `servidor/worker.js` | Tabla `reto`; `POST /reto` (solo el primero), `GET /reto` |

## 3. Modelo de datos
Progreso: `reto: { dia, juego, aciertos, total, segundos } | null`, `stats.retos`, `stats.retosPerfectos`. Servidor: `reto(jugador, dia, juego, aciertos, total, segundos)`.

## 4. Contenido
No usa contenido nuevo salvo que se diga aquí.

## 5. Pantallas
| Inicio | Tarjeta del reto | `#/juego/<id>/reto` o, hecho, `#/ranking/reto` |
| Reto | Antes, partida, resumen con tiempo | `#/ranking/reto` |
| Ranking → Reto | Top 50 del reto | — |

## 6. Textos de interfaz
`reto.*`, `ranking.{vacio.reto,tuReto,sinReto,jugadoresReto}`, `logro.reto-*`

## 7. Assets
Sin assets nuevos (iconos de trazo en `src/ui/iconos.js`).

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Mirar el reto en otro dispositivo y repetir | Baja | El servidor solo guarda el primer resultado de cada alias |
| Bancos con pocos ejercicios de un nivel | Baja | Se completa con niveles vecinos; prueba que comprueba los bancos |

## 9. Pruebas
- **`tests.html`:** mismo reto para todos, independiente del orden del banco, 2 por nivel, servidor (validación y desempate).
- **Manual:** jugar el reto en el móvil y ver la pestaña Reto; volver a entrar y ver que no deja repetir.
