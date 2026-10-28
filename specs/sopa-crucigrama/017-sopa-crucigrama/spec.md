# Spec: Sopa y crucigrama

> **ID:** 017-sopa-crucigrama · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Seis términos con pistas en inglés, en una sopa de letras o en un crucigrama (se elige al empezar). Las pistas son definiciones, así que hay que saber la palabra.

## 2. Qué se aprende
- **Categoría:** Vocabulario
- **Habilidades:** vocabulario, escritura
- **Niveles:** De CODE o MOUSE (A1) a ROLLBACK o THROTTLE (C1).

## 3. Partida
- **Ejercicios:** 6 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Sopa: leer una pista → tocar la primera y la última letra de la palabra. Crucigrama: elegir una pista → escribir la palabra (2 intentos).

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Elegir modo | Tocar | Tab y Enter |  |
| Sopa: marcar | Tocar inicio y fin | Flechas para moverse, Enter para marcar | Derecha, abajo o diagonal, en cualquier sentido |
| Crucigrama: escribir | Tocar la pista y escribir | Enter |  |
| Rendirse | Me rindo |  | Las que falten cuentan como fallo |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** Cada palabra encontrada suma y se tacha su pista.
- **Al fallar:** En el crucigrama, tras 2 intentos se revela la palabra en rojo; al rendirse se revelan todas.
- **Resumen final:** Al terminar, lista de palabras con sus pistas. El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `sopa-crucigrama`: `palabra` (solo letras, de 3 a 9) y `pista` en inglés. Mínimo 8 por nivel. Las palabras que no caben en el crucigrama se quedan fuera de esa partida.
Hoy: 40 ejercicios (A1 8, A2 8, B1 8, B2 8, C1 8), de los tres temas.

## 8. Voz y audio
Ninguna. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Sopa: cuadrícula de 8×8 a 12×12 que ocupa el ancho y lista de pistas con su número de letras. Crucigrama: tablero con números, pista actual con su campo y lista de pistas.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Elijo sopa o crucigrama.
- [x] Encuentro las palabras a partir de definiciones en inglés.
- [x] Puedo rendirme y ver las que faltan.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Escribir letra a letra en las casillas del crucigrama.

## 12. Preguntas abiertas
- Ninguna.
