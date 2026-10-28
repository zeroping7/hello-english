# Spec: Falsos amigos

> **ID:** 003-falsos-amigos · **Estado:** Implementada (v0.3.0) · **Fecha:** 2026-10-28
> Incluye la **pantalla común de minijuego** (elegir tema, jugar, resumen), que usarán todos los minijuegos.

## 1. Resumen
Aparece una tarjeta como *library = librería?* y el usuario decide si es verdad o si es un falso amigo, deslizando la tarjeta o con dos botones. Es rápido, adictivo y ataca uno de los errores más típicos de los hispanohablantes.

## 2. Qué se aprende
- **Categoría:** Vocabulario
- **Habilidades:** vocabulario
- **Niveles:** las tarjetas de niveles bajos son palabras de uso diario (*library*, *exit*); las de niveles altos, matices (*compromise*, *notorious*).

## 3. Partida
- **Ejercicios:** 10 tarjetas, unos 2 minutos.
- **Termina:** al responder la décima.
- **Puntos:** cada acierto, según su nivel (D-010). Dificultad 1.

## 4. Bucle
Ver la tarjeta → deslizar o pulsar → ver si acierta, qué significa de verdad y un ejemplo → siguiente.

## 5. Controles
| Acción | Táctil | Teclado | Notas |
|---|---|---|---|
| Es verdad | Deslizar a la derecha o botón ✓ | → | |
| Es falso amigo | Deslizar a la izquierda o botón ✗ | ← | |
| Escuchar la palabra | Botón 🔊 | — | voz del navegador |
| Siguiente | Botón | Enter | |

## 6. Acierto y fallo
- **Al acertar y al fallar:** ✓ o ✗ con texto, qué significa de verdad la palabra (*library → biblioteca*) y una frase de ejemplo en inglés.
- **Solo al fallar:** la explicación, en el idioma de la interfaz.
- **Resumen final:** aciertos, puntos ganados, "Jugar otra vez" y "Volver al inicio".

## 7. Contenido que necesita
Banco `falsos-amigos` (spec 001): `en`, `es`, `verdadero`, `significa`, `ejemplo`.

## 8. Voz y audio
Botón para oír la palabra y el ejemplo. Si no hay voz, el botón no aparece. Sonidos de acierto y fallo.

## 9. Pantalla
- **Antes de jugar (común):** nombre, descripción, selector de tema (Todos, Programación, Web, Trabajo en equipo) y "Jugar".
- **Jugando:** barra con Volver y "3 de 10"; la tarjeta en el centro; los dos botones debajo, al alcance del pulgar.
- **PC:** la tarjeta centrada con un ancho máximo; las flechas del teclado funcionan.

## 10. Historias de usuario
**HU-1 — Jugar una partida.**
- [x] Desde el inicio, Falsos amigos ya no sale como "Próximamente": entro, elijo tema y juego 10 tarjetas de mi nivel.
- [x] Puedo deslizar la tarjeta o usar los botones o las flechas.
- [x] Tras cada respuesta veo si he acertado, el significado real y un ejemplo; si fallo, también la explicación.
- [x] Al final veo mis aciertos y los puntos, y puedo jugar otra vez o volver.

**HU-2 — Progreso.**
- [x] Cada acierto suma puntos al total del inicio.
- [x] El tiempo jugando cuenta para el objetivo del día.

**HU-3 — Salir.**
- [x] Volver o Esc a mitad de partida pide confirmación; los puntos ganados hasta ahí se quedan.

## 11. Fuera de alcance (v1)
- Repaso espaciado de las tarjetas falladas (spec propia).
- Modo contrarreloj (ya existe como minijuego aparte).

## 12. Preguntas abiertas
- [x] ¿Se muestra el significado también al acertar? → **Sí**: refuerza lo aprendido y es corto.
- [x] ¿Se pierden los puntos al salir a medias? → **No**: ya se han ganado; perderlos desanima.
