# Constitución del proyecto

Reglas no negociables. Cualquier spec o plan que las incumpla debe justificarlo en `docs/decisiones.md`.

## 1. Plataforma
- **P1 — Sin build.** HTML + CSS + JavaScript (módulos ES). Nada de npm, bundlers, frameworks ni compilación. Lo que está en el repo es lo que se sirve.
- **P2 — GitHub Pages.** Sitio estático servido desde la rama `main` (raíz). Sin backend propio.
- **P3 — Sin dependencias externas por defecto.** Si hiciera falta una librería, por CDN con versión fijada (nunca `@latest`) y justificada en `docs/decisiones.md`. Fuentes e iconos van alojados en el propio repo (ver PR1).
- **P4 — Navegadores objetivo:** Chrome Android (prioridad 1), Chrome/Firefox/Edge escritorio, Safari iOS (mejor esfuerzo; lo que no funcione se avisa al usuario).
- **P5 — App instalable y sin conexión.** `sw.js` y `manifest.webmanifest` cubren todo el sitio. Tras la primera visita, todo funciona sin conexión.

## 2. Arquitectura
- **A1 — Lógica separada de la interfaz.** Las reglas de cada minijuego, la puntuación, la progresión y el repaso viven en módulos JavaScript puros (`logica.js` y similares): reciben datos y devuelven resultados, sin tocar el DOM, el almacenamiento ni el audio.
- **A2 — Contenido separado del código.** Las palabras, frases y ejercicios están en archivos JSON de `contenido/`. Ningún minijuego lleva contenido escrito en su código.
- **A3 — Textos de interfaz traducibles.** Todo texto visible de la interfaz sale de `src/i18n/` (español e inglés). Nada de texto suelto en el código ni en el HTML.
- **A4 — Un único dueño del progreso.** Solo `src/progreso/` lee y escribe el progreso guardado. Los datos llevan número de versión y se migran si cambia el formato: un usuario nunca pierde su progreso por una actualización.
- **A5 — Un minijuego, una carpeta.** Cada minijuego vive en `juegos/<id>/`, se da de alta en `juegos/registro.js` y se monta y desmonta con la misma interfaz común (ver `docs/arquitectura.md`), para que la Práctica de hoy pueda encadenarlos.
- **A6 — Aleatoriedad con semilla.** La lógica no usa `Math.random()` directamente: recibe un generador con semilla, para poder repetir una partida en las pruebas.

## 3. Rendimiento
- **R1** — Inicio interactivo en < 3 s con 4G en un Android de gama media.
- **R2** — Cada minijuego descarga su código y su contenido solo al abrirlo.
- **R3** — Animaciones fluidas (60 FPS): solo se animan `transform` y `opacity`.
- **R4** — Nada se bloquea más de 100 ms al tocar un botón.

## 4. Interacción y accesibilidad
- **C1** — Todo se puede usar completo con táctil y con teclado. Los minijuegos de voz tienen alternativa para quien no pueda o no quiera hablar.
- **C2** — Diseño adaptable desde 320 px de ancho hasta escritorio; zonas táctiles de al menos 44 × 44 px.
- **C3** — Contraste WCAG AA en los dos temas, foco visible con teclado y etiquetas para lectores de pantalla.
- **C4** — Nunca se usa solo el color para decir si algo está bien o mal: también icono o texto.
- **C5** — Con "reducir movimiento" activado en el sistema, las animaciones se quitan o se acortan.

## 5. Contenido
- **CO1 — Generado por adelantado y revisado.** Claude genera el contenido y lo guarda en `contenido/`; el usuario lo revisa antes de publicarlo. No hay IA en tiempo real.
- **CO2 — Ficha completa.** Cada elemento tiene un id estable que nunca se reutiliza, un nivel (A1–C1), un tema, la traducción al español, una definición en inglés y, si se puede fallar, una explicación breve en español y en inglés.
- **CO3 — Inglés correcto y real.** Solo términos y usos que se emplean de verdad en el trabajo. Ante la duda, no se incluye.
- **CO4 — Original.** Nada copiado de libros, cursos ni webs con derechos.

## 6. Privacidad
- **PR1** — Sin cuentas, sin cookies, sin estadísticas ni seguimiento. Nada sale del dispositivo, salvo lo que el propio navegador envíe para el reconocimiento de voz, y eso se avisa antes de usarlo.
- **PR2** — El usuario puede exportar, importar y borrar su progreso en cualquier momento.

## 7. Calidad y depuración
- **Q1** — `?debug=1` muestra información útil para probar (nivel calculado, elementos pendientes de repaso, versión de los datos).
- **Q2** — Cada módulo de lógica y cada banco de contenido tiene una página `tests.html` que se abre en el navegador y ejecuta pruebas básicas (sin frameworks).
- **Q3** — Ajustes muestra la versión (`src/version.js`).

## 8. Estilo
- **E1** — Moderno y limpio, inspirado en un editor de código: letra monoespaciada para títulos, código y detalles; letra sin serifa para textos largos.
- **E2** — Tema claro y oscuro con los mismos tokens de color (`css/tokens.css`). Por defecto, el del sistema.
- **E3** — Colores de resaltado de sintaxis con significado fijo en toda la app:

| Token | Uso | Oscuro | Claro |
|---|---|---|---|
| `--fondo` | fondo | `#0f1117` | `#fafafa` |
| `--panel` | tarjetas | `#181b24` | `#ffffff` |
| `--texto` | texto | `#e6e8ee` | `#1f2330` |
| `--tenue` | texto secundario | `#8b93a7` | `#5d6475` |
| `--keyword` | botones, acento principal | `#c792ea` | `#7c3aed` |
| `--string` | correcto | `#8fd694` | `#16803c` |
| `--error` | incorrecto | `#ff7a7a` | `#c62828` |
| `--number` | puntos y racha | `#f6a35b` | `#b45309` |
| `--function` | enlaces e información | `#82aaff` | `#1d4ed8` |

- **E4** — Solo assets propios o con licencia CC0 / compatible, anotada en `docs/creditos.md`.
