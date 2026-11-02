# Tareas: Resultados de ayer y del mes pasado

> **Plan:** `specs/plataforma/028-resultados-anteriores/plan.md` · **Estado:** Hechas (v1.2.0)
> Hechas de una vez junto con las specs 028-035 (petición «hazlo todo»).

- [x] T2801 — Periodos en el servidor y sus pruebas
  - Archivos: `servidor/worker.js`, `servidor/tests.html`
  - Probar: `servidor/tests.html`; `<URL>/ranking?periodo=ayer`
- [x] T2802 — Opciones en la pantalla del ranking y aviso al abrir
  - Archivos: `src/ranking/*`, `src/pantallas/ranking.js`, `src/app.js`, `src/i18n/*`
  - Probar: Ranking → Día → Ayer; abrir la app al día siguiente de jugar
