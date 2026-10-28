# Spec: Emparejar

> **ID:** 018-emparejar · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Dos tableros de 5 parejas: palabras a un lado y definiciones (o un dibujo, para cosas concretas) al otro. Se toca una palabra y luego lo que significa.

## 2. Qué se aprende
- **Categoría:** Vocabulario
- **Habilidades:** vocabulario
- **Niveles:** De keyboard o printer, con dibujo (A1), a «single point of failure» o «bus factor» (C1).

## 3. Partida
- **Ejercicios:** 10 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Tocar palabra → tocar definición → pareja hecha o sacudida → siguiente tablero.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Unir | Tocar palabra y definición (en cualquier orden) | Tab y Enter |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** Las dos fichas en verde. Cuenta como acierto si esa palabra no se había unido mal antes.
- **Al fallar:** Las dos fichas parpadean en rojo y la palabra queda marcada como fallada.
- **Resumen final:** Al acabar cada tablero, la lista de parejas con ✗ en las falladas. El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `emparejar`: `palabra`, `definicion` en inglés y `emoji` opcional (solo para objetos fáciles de reconocer). Mínimo 6 por nivel.
Hoy: 30 ejercicios (A1 6, A2 6, B1 6, B2 6, C1 6), de los tres temas.

## 8. Voz y audio
Ninguna. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Dos columnas: palabras (más estrecha) y definiciones.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Uno palabras con su significado.
- [x] Si me equivoco, puedo seguir intentándolo.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Arrastrar las fichas.

## 12. Preguntas abiertas
- Ninguna.
