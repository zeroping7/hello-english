# Plan técnico: Más ejercicios de nivel B2 y C1

> **Spec:** `specs/contenido/035-mas-b2-c1/spec.md` · **Estado:** Aprobado (con la spec) · **Fecha:** 2026-11-02

## 1. Cumplimiento de la constitución
- [x] A2 Todo en `contenido/*.json`, con el formato de cada banco (`src/contenido/esquema.js`)
- [x] CO2 Ficha completa: id nuevo, nivel, tema, traducción y explicación cuando el banco la pide
- [x] Q2 `contenido/tests.html`

## 2. Archivos
| Archivo | Ejercicios nuevos |
|---|---|
| `contenido/acronimos.json` | ac-026 a ac-029 (MVP, DNS, SSO, RFC) |
| `contenido/ahorcado.json` | ah-021 a ah-024 (repository, backlog, throughput, concurrency) |
| `contenido/bug-report.json` | br-011 y br-012 |
| `contenido/daily-standup.json` | ds-021 a ds-024 |
| `contenido/dictado-audio.json` | da-021 a da-024 |
| `contenido/dictado-codigo.json` | dc-021 a dc-024 |
| `contenido/dilo-bien.json` | db-029 a db-032 (syntax, column, protocol, asynchronous) |
| `contenido/educado-o-borde.json` | eb-021 a eb-024 |
| `contenido/entrevista.json` | et-021 a et-024 |
| `contenido/jerga-dev.json` | jd-021 a jd-024 (to circle back, hotfix, happy path, low-hanging fruit) |

## 3. Modelo de datos
Sin cambios de formato.

## 4. Contenido
Los ejercicios se eligen como siempre (60/30/10 por nivel, D-012); el reto del día (D-026) puede sacar los nuevos.

## 5-7. Pantallas, textos y assets
Sin cambios.

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Algún uso no natural | Baja | Revisión del usuario antes de dar la spec por cerrada |

## 9. Pruebas
- **`tests.html`:** `contenido/tests.html`.
- **Manual:** con nivel C1 (Ajustes → repetir la prueba de nivel), jugar cada minijuego y leer los ejercicios nuevos.
