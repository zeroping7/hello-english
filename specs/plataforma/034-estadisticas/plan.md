# Plan técnico: Estadísticas

> **Spec:** `specs/plataforma/034-estadisticas/spec.md` · **Estado:** Aprobado (con la spec) · **Fecha:** 2026-11-02

## 1. Cumplimiento de la constitución
- [x] A1 `src/progreso/estadisticas.js` puro
- [x] A4 `stats.aciertos` y `stats.temas` en el progreso v3
- [x] C4 Porcentaje escrito junto a cada barra
- [x] R3 Barras con `transform`
- [x] Q2 `src/progreso/tests.html`

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `src/progreso/estadisticas.js` | `calcularEstadisticas`, `juegosFlojos` |
| `src/progreso/logica.js` | `anotarRespuesta` |
| `src/progreso/practica.js` | `elegirPractica(…, flojos)` |
| `src/pantallas/estadisticas.js` | Pantalla `#/estadisticas` |

## 3. Modelo de datos
`stats.aciertos: { [juego]: [aciertos, fallos] }`, `stats.temas: { [tema]: [aciertos, fallos] }`.

## 4. Contenido
No usa contenido nuevo salvo que se diga aquí.

## 5. Pantallas
| Estadísticas | Cifras, medallas, historial, para mejorar, por minijuego y por tema | Enlaces a cada minijuego |

## 6. Textos de interfaz
`stats.*`

## 7. Assets
Sin assets nuevos (iconos de trazo en `src/ui/iconos.js`).

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Pocos datos al principio | Alta | Mensajes de vacío que explican cuándo aparecerán |

## 9. Pruebas
- **`tests.html`:** porcentajes, orden, historial, flojos, práctica con flojo.
- **Manual:** jugar varias partidas fallando en una y ver «Para mejorar».
