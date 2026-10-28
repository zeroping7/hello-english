# Spec: Acrónimos

> **ID:** 015-acronimos · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Qué significa una sigla (API, JSON, GDPR, YAGNI...) y cómo se dice: deletreada o como una palabra.

## 2. Qué se aprende
- **Categoría:** Vocabulario
- **Habilidades:** vocabulario, pronunciación
- **Niveles:** De PC o USB (A1) a CORS, SLA o TL;DR (C1).

## 3. Partida
- **Ejercicios:** 8 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Ver la sigla → elegir su significado entre 4 → ver la traducción y cómo se pronuncia.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Elegir | Tocar | 1-4 |  |
| Siguiente | Botón | Enter |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** Sigla = significado, traducción y pronunciación con altavoz.
- **Al fallar:** Lo mismo, marcando la opción elegida.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `acronimos`: `sigla`, `significa`, `otras` (3 falsas), `letras` (true si se deletrea), `suena` (si se lee como palabra), `traduccion` y `explicacion` opcional. Mínimo 5 por nivel.
Hoy: 25 ejercicios (A1 5, A2 5, B1 5, B2 5, C1 5), de los tres temas.

## 8. Voz y audio
Opcional: altavoz para oírla (deletreada si `letras`). Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
La sigla muy grande y cuatro opciones.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Aprendo qué significa cada sigla.
- [x] Sé si se deletrea o se lee como palabra.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Escribir la sigla a partir del significado.

## 12. Preguntas abiertas
- Ninguna.
