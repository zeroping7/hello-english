# Spec: ¿Educado o borde?

> **ID:** 020-educado-o-borde · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Una situación de trabajo (pedir ayuda, una code review, decir que no a un cliente) y tres mensajes: uno con el tono adecuado y dos bordes o fuera de lugar. Enseña el registro del inglés profesional.

## 2. Qué se aprende
- **Categoría:** Inglés profesional
- **Habilidades:** lectura
- **Niveles:** De «Could you help me, please?» (A1) a rechazar una petición de un cliente o pedir un aumento (C1).

## 3. Partida
- **Ejercicios:** 6 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Leer la situación → elegir el mensaje → ver por qué ese tono funciona.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Elegir | Tocar | 1, 2, 3 |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** El mensaje bueno con altavoz y la explicación del tono.
- **Al fallar:** Lo mismo; la explicación se ve siempre porque es lo que se aprende.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `educado-o-borde`: `situacion` (es y en), `opciones` (3; la primera es la buena) y `explicacion`. Mínimo 4 por nivel.
Hoy: 20 ejercicios (A1 4, A2 4, B1 4, B2 4, C1 4), de los tres temas.

## 8. Voz y audio
Altavoz para el mensaje bueno. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
La situación en un recuadro con borde naranja y las tres opciones.

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Elijo el mensaje con el tono adecuado.
- [x] Entiendo por qué los otros no funcionan.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Escribir el mensaje propio.

## 12. Preguntas abiertas
- Ninguna.
