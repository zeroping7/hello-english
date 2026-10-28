# Spec: Dilo bien

> **ID:** 011-dilo-bien · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Términos que los hispanohablantes suelen pronunciar mal (cache, queue, width, Linux, nginx...). Con micrófono, el usuario lo dice y el reconocimiento de voz lo comprueba; sin él, elige cómo suena entre tres opciones. Dificultad 1,5.

## 2. Qué se aprende
- **Categoría:** Escucha y habla
- **Habilidades:** pronunciación
- **Niveles:** De «meeting» o «Wi-Fi» (A1) a «hierarchy» o «algorithm» (C1).

## 3. Partida
- **Ejercicios:** 6 por partida (con hasta un 40 % de repasos pendientes, spec 022).
- **Termina:** al acabar el último.
- **Puntos:** cada acierto, según su nivel y la dificultad del minijuego (D-010).

## 4. Bucle
Ver el término → decirlo (2 intentos) o elegir cómo suena → ver la pronunciación, el IPA y el error típico.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Decirlo | Botón Pulsa y dilo |  | Hasta 2 intentos |
| Sin micrófono | No puedo hablar ahora |  | Pasa a elegir y se recuerda en la partida |
| Elegir | Tocar | 1, 2, 3 |  |
| Salir | ← de la barra | Esc | Pide confirmación (pantalla común) |

## 6. Acierto y fallo
- **Al acertar:** Término con IPA, cómo suena y altavoz.
- **Al fallar:** Lo mismo, más «No: …» con la pronunciación típica equivocada.
- **Resumen final:**  El común (spec 003): aciertos, puntos y jugar otra vez.

## 7. Contenido que necesita
Banco `dilo-bien`: `termino`, `suena` (pronunciación figurada para hispanohablantes, con la sílaba fuerte en mayúsculas), `ipa`, `otras` (2: la primera es el error típico), `aceptadas` opcionales (homófonos que puede devolver el reconocimiento, p. ej. «cash» para «cache») y `explicacion`. Mínimo 5 por nivel.
Hoy: 28 ejercicios (A1 5, A2 6, B1 7, B2 5, C1 5), de los tres temas.

## 8. Voz y audio
Usa el reconocimiento de voz si existe (en Chrome el audio va a los servidores de Google: la pantalla lo dice). Sin reconocimiento o sin permiso, modo de elegir (constitución C1). La voz lee el término al terminar. Sonidos de acierto y fallo de la pantalla común.

## 9. Pantalla
Término grande, botón de micrófono que late mientras escucha (sin animación con «reducir movimiento»).

## 10. Historias de usuario
**HU-1 — Jugar.**
- [x] Con micrófono digo la palabra y sé si me ha entendido.
- [x] Sin micrófono puedo jugar eligiendo cómo suena.
- [x] Siempre veo cómo se pronuncia y el error típico.

**HU-2 — Progreso.**
- [x] Los aciertos suman puntos, los fallos van al repaso espaciado y el tiempo cuenta para el objetivo.

## 11. Fuera de alcance (v1)
- Puntuar la calidad de la pronunciación (el reconocimiento solo dice qué palabra ha entendido).

## 12. Preguntas abiertas
- Ninguna.
