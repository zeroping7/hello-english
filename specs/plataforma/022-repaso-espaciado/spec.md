# Spec: Repaso espaciado

> **ID:** 022-repaso-espaciado · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Lo que el usuario falla vuelve a salir más adelante, a intervalos cada vez más largos, hasta que lo acierta tres veces seguidas. Así se repasa justo lo que cuesta, sin pantallas aparte: los repasos aparecen dentro de las partidas normales.

## 2. Problema / motivación
Sin repaso, un error se ve una vez y se olvida. Repetir todo a la vez aburre; repetir solo lo fallado, espaciado, es lo que mejor funciona.

## 3. Alcance
- **Incluye:** anotar cada fallo; repasarlo mañana, a los 3 días y a la semana; darlo por aprendido al acertar el tercer repaso; meter hasta un 40 % de repasos pendientes en cada partida; avisar en la pantalla del minijuego y en el inicio de cuántos hay.
- **No incluye:** repasar lo que se acierta a la primera; una pantalla solo de repaso (la Práctica de hoy, spec 024, ya empieza por el minijuego con más repasos).

## 4. Historias de usuario
**HU-1 — Repasar lo fallado.**
- [x] Si fallo un ejercicio hoy, mañana puede salirme en una partida de ese minijuego.
- [x] Si lo acierto, vuelve a los 3 días; si lo acierto otra vez, a la semana; al acertarlo una tercera vez, desaparece del repaso.
- [x] Si lo vuelvo a fallar, empieza otra vez desde mañana.

**HU-2 — Saber qué toca.**
- [x] Antes de jugar veo «Tienes N ejercicios para repasar».
- [x] En el inicio, la Práctica de hoy dice cuántos repasos hay.

## 5. Criterios generales
- [x] Funciona sin conexión y se exporta e importa con el resto del progreso.
- [x] Con `?debug=1&dias=N` se puede probar avanzando días.

## 6. Preguntas abiertas
- Ninguna.
