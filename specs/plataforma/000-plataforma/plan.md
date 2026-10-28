# Plan técnico: Plataforma (inicio, ajustes, progreso y app instalable)

> **Spec:** `specs/plataforma/000-plataforma/spec.md` · **Estado:** Aprobado · **Fecha:** 2026-10-28
> Describe CÓMO. Cada decisión debe poder trazarse a una parte de la spec.

## 1. Cumplimiento de la constitución
- [x] A1 Las reglas de puntos, objetivo diario, racha y exportación están en `src/progreso/logica.js`, sin DOM ni almacenamiento. La fecha se le pasa desde fuera.
- [x] A2 No hay contenido de aprendizaje en esta spec. La frase de prueba de la voz es un texto de interfaz y va en i18n.
- [x] A3 Todos los textos en `src/i18n/es.json` y `en.json`. `src/i18n/tests.html` comprueba que los dos tienen las mismas claves.
- [x] A4 Solo `src/progreso/` toca `localStorage`. Ajustes también se guarda a través de él (`almacen.js`).
- [x] A5 Registro de los 19 minijuegos con `disponible: false`. Las pantallas usan la misma interfaz `montar` / `desmontar` que los minijuegos.
- [x] A6 No se usa aleatoriedad en esta spec.
- [x] P5 `sw.js` con la lista `FILES` completa y `manifest.webmanifest`.
- [x] C1-C5 Controles nativos (`button`, `input type=radio`, `dialog`), foco al título en cada cambio de pantalla, `aria-live` para avisos y `prefers-reduced-motion`.
- [x] PR1 Sin peticiones a otros dominios: fuentes e iconos en el repo.
- [x] Q1 `?debug=1` (§9). Q2 `tests.html` de progreso e i18n. Q3 versión en Ajustes.
- Excepciones: ninguna.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `index.html` | Esqueleto de la página. Un script corto aplica el tema guardado antes de pintar, para evitar un destello de color, y carga `src/app.js` |
| `manifest.webmanifest` | Nombre, iconos, colores, `display: standalone` |
| `sw.js` | Caché para usar sin conexión (§8) |
| `iconos/` | `icono.svg` (favicon), `icono-192.png`, `icono-512.png`, `icono-maskable-512.png` |
| `fuentes/` | JetBrains Mono 400 y 700 en `woff2`, solo caracteres latinos (§7) |
| `css/tokens.css` | Colores de los dos temas (constitución E3), espacios, radios y tipografías |
| `css/app.css` | Estilos comunes: base, botones, tarjetas, rejilla, avisos, diálogo |
| `src/app.js` | Arranque: carga ajustes e idioma, registra el service worker y arranca el router |
| `src/router.js` | Lee el hash, desmonta la pantalla actual, monta la nueva y lleva el foco a su título |
| `src/version.js` | `export const VERSION = '0.1.0'` |
| `src/i18n/textos.js` | `cargarIdioma(id)`, `t(clave, variables)`, `idiomaDelNavegador()` |
| `src/i18n/es.json`, `en.json` | Textos de interfaz |
| `src/i18n/tests.html` | Mismas claves en los dos idiomas y variables `{x}` iguales |
| `src/progreso/almacen.js` | Lee y escribe `localStorage` con versión y migraciones. Si falla, guarda en memoria y lo avisa (HU-5) |
| `src/progreso/logica.js` | Funciones puras: puntos, objetivo, racha, validar y migrar una exportación |
| `src/progreso/progreso.js` | Une lógica y almacén. Emite el evento `cambio` para que el inicio se repinte |
| `src/progreso/cronometro.js` | Cuenta segundos de juego mientras la pestaña está visible (HU-4) |
| `src/progreso/reloj.js` | `hoy()` en hora local como `AAAA-MM-DD`. Con `?debug=1&dias=N` adelanta N días para probar la racha |
| `src/progreso/tests.html` | Pruebas de `logica.js` |
| `src/ajustes/ajustes.js` | Valores por defecto, `leer()`, `cambiar(clave, valor)`, aplica tema e idioma y emite `cambio` |
| `src/voz/voz.js` | `hablar(texto)` con la voz y velocidad de los ajustes. Elige voz `en-GB` o `en-US` (§6) |
| `src/sonido/sonido.js` | Efectos `acierto`, `fallo` y `meta` con Web Audio, y `vibrar(tipo)`. Respeta los ajustes |
| `src/ui/dom.js` | `h(etiqueta, atributos, hijos)` para crear elementos sin `innerHTML` |
| `src/ui/aviso.js` | Avisos breves en una zona `aria-live` |
| `src/ui/confirmar.js` | Diálogo de confirmación con `<dialog>`, con opción de pedir que se escriba una palabra |
| `src/ui/iconos.js` | Iconos SVG en línea (ajustes, atrás, racha, puntos, categorías…) |
| `src/ui/debug.js` | Panel de `?debug=1` |
| `src/pantallas/bienvenida.js` | Los tres pasos de HU-1 |
| `src/pantallas/inicio.js` | HU-2 |
| `src/pantallas/ajustes.js` | HU-3 y HU-5 |
| `src/pantallas/proximamente.js` | Lo que se ve al abrir `#/juego/<id>` de un minijuego no disponible o desconocido |
| `src/pruebas/mini.js` | Mini ejecutor de pruebas para todos los `tests.html` (`prueba(nombre, fn)`, `igual(a, b)`) |
| `juegos/registro.js` | Los 19 minijuegos (§4) |

## 3. Modelo de datos

### Ajustes — clave `he-ajustes`
```js
/** @typedef {Object} Ajustes
 *  @property {1} v
 *  @property {'es'|'en'} idioma
 *  @property {'sistema'|'claro'|'oscuro'} tema        // por defecto 'sistema'
 *  @property {'gb'|'us'} acento                       // por defecto 'gb'
 *  @property {'normal'|'lenta'} velocidad             // normal = 1, lenta = 0.75
 *  @property {boolean} sonido                         // por defecto true
 *  @property {boolean} vibracion                      // por defecto true
 *  @property {5|10|20} objetivoMin
 *  @property {boolean} bienvenidaHecha
 */
```

### Progreso — clave `he-progreso`
```js
/** @typedef {Object} Progreso
 *  @property {1} v
 *  @property {'A1'|'A2'|'B1'|'B2'|'C1'} nivel        // en esta spec siempre A1 (HU-4)
 *  @property {boolean} nivelProbado                   // si ya hizo la prueba de nivel
 *  @property {number} puntos
 *  @property {Object<string, number>} dias            // 'AAAA-MM-DD' → segundos jugados; se guardan los últimos 60 días
 *  @property {string|null} ultimoDiaCumplido          // último día en que se llegó al objetivo
 *  @property {number} racha                           // días seguidos cumplidos hasta ultimoDiaCumplido
 */
```

### Funciones de `logica.js`
| Función | Qué hace |
|---|---|
| `puntosPorAcierto(nivelEjercicio, dificultadJuego)` | `round(10 × multiplicador del nivel × dificultad)`; ver la tabla de abajo |
| `sumarSegundos(progreso, fecha, segundos, objetivoMin)` | Suma al día. Si con eso llega al objetivo por primera vez ese día, actualiza la racha y devuelve `{ progreso, cumplidoAhora: true }` |
| `rachaVisible(progreso, hoy)` | La racha si `ultimoDiaCumplido` es hoy o ayer; si no, 0 (HU-4: "vuelve a 0 al día siguiente") |
| `segundosHoy(progreso, hoy)` | Para la barra del objetivo |
| `podarDias(dias, hoy)` | Deja solo los últimos 60 días |
| `crearExportacion(ajustes, progreso, ahora)` | `{ app: 'hello-english', formato: 1, exportado, ajustes, progreso }` |
| `validarImportacion(datos)` | Devuelve `{ ok, ajustes, progreso }` ya migrados, o `{ ok: false, motivo }` |
| `migrar(clave, datos)` | Lleva datos antiguos a la versión actual. Hoy solo existe la v1 |

**Puntos** (pregunta abierta resuelta en la spec):

| Nivel del ejercicio | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| Multiplicador | 1 | 1,2 | 1,5 | 1,8 | 2 |

`dificultadJuego` es 1 para la mayoría de minijuegos y 1,5 para los más exigentes (dictados, Dilo bien, Incidente en producción). Se declara en el registro. Ejemplo: acierto B1 en Dictado de código = 10 × 1,5 × 1,5 ≈ **23** puntos.

**Racha:** al cumplir el objetivo el día `F`, si `ultimoDiaCumplido` es el día anterior a `F`, `racha + 1`; si es `F`, no cambia; en cualquier otro caso, `racha = 1`. Después, `ultimoDiaCumplido = F`.

### Exportar e importar (HU-5)
- **Archivo:** `hello-english-AAAA-MM-DD.json`. Se descarga con un enlace `download` y un `Blob`, sin servidor.
- **Importar:** `<input type="file" accept=".json">`. Se valida (que `app` sea `hello-english`, que `formato` no sea de una versión futura y que tipos y rangos sean correctos), se pide confirmación y se sustituye todo.
- **Borrar:** confirmación escribiendo `BORRAR` (o `DELETE` con la interfaz en inglés). Borra las claves `he-*` y va a `#/bienvenida`.

## 4. Registro de minijuegos
Los 19 de `docs/vision.md`, con los campos de `docs/arquitectura.md` §3 más `dificultad` (1 o 1,5) y `disponible: false`. Hasta que cada minijuego tenga su icono, la tarjeta usa el icono de su categoría.

## 5. Pantallas
| Pantalla | Ruta | Qué muestra | Viene de / va a |
|---|---|---|---|
| Bienvenida | `#/bienvenida` | Paso 1 idioma · paso 2 objetivo · paso 3 "Hacer prueba de nivel" (deshabilitado: *Próximamente*) o "Empezar en A1". Indicador "1/3" y botón Atrás | Primera visita o tras borrar → Inicio |
| Inicio | `#/inicio` | Cabecera `>_ hello` + botón Ajustes. Resumen: nivel, puntos, racha y barra del objetivo de hoy. Botón "Práctica de hoy" (*Próximamente*). Cuatro secciones con rejilla de tarjetas: 2 columnas en móvil, 3-4 en PC | → Ajustes, → `#/juego/<id>` |
| Ajustes | `#/ajustes` | Grupos: General (idioma, tema), Voz (acento, velocidad, "Escuchar prueba"), Sonido (efectos, vibración), Aprendizaje (objetivo, repetir prueba de nivel: *Próximamente*), Mis datos (exportar, importar, borrar) y versión | ← Inicio |
| Próximamente | `#/juego/<id>` | Nombre e icono del minijuego, "Próximamente" y botón para volver | ← Inicio |

- Cualquier ruta desconocida lleva a `#/inicio`, o a `#/bienvenida` si no está hecha.
- Al cambiar de pantalla, el foco va al `h1` y `document.title` cambia (lectores de pantalla, C3).
- **Avisos:** al cumplir el objetivo del día suena `meta`, vibra y aparece "¡Objetivo de hoy cumplido! Racha: N días".
- **Sin almacenamiento** (modo privado): aviso fijo y discreto en el inicio: "No se puede guardar tu progreso en este navegador".

## 6. Voz
- Se buscan voces con `lang` `en-GB` (o `en-US` según el ajuste). Se prefieren las locales (`localService`), que no envían el texto fuera del dispositivo. Si no hay ninguna del acento elegido, se usa cualquier `en-*` y Ajustes lo indica.
- Las voces se cargan tarde en algunos navegadores: se espera al evento `voiceschanged`, como mucho 2 s.
- El reconocimiento de voz queda fuera de esta spec; llega con el primer minijuego que lo use.

## 7. Estilo
- **Tipografías:** JetBrains Mono (títulos, botones, números y código) y la fuente del sistema (`system-ui`) para los textos largos, que se lee mejor y no pesa nada. Unos 90 KB en total.
- **Tema:** atributo `data-theme="claro|oscuro"` en `<html>`; sin el atributo se sigue `prefers-color-scheme`.
- **Detalles de editor:** títulos con prefijo de comentario (`// Vocabulario`), cursor parpadeante en el logo (sin parpadeo con "reducir movimiento") y números de racha y puntos en `--number`.
- **Icono de la app:** fondo `--fondo` oscuro, `>_` en `--keyword` y *hello* en `--texto`. Versión SVG para el favicon y PNG para instalar.

## 8. App instalable y caché
- `sw.js`: precachea `FILES` al instalarse. En cada petición, primero red con `cache: 'no-cache'` y guarda la respuesta; sin red, usa lo guardado. Las navegaciones sin red devuelven `index.html`.
- `CACHE = 'he-v0.1.0'`: se sube con cada cambio de `FILES`. Al activarse, borra las cachés antiguas.
- `manifest.webmanifest`: `name` y `short_name` "Hello English", `start_url: './'`, `scope: './'`, `display: standalone`, `background_color` y `theme_color` = `--fondo` oscuro, sin `orientation`.

## 9. `?debug=1`
Panel plegable en una esquina con:
- Versión de la app y de los datos.
- Idioma, tema y acento activos, y la voz elegida.
- Segundos de hoy, racha guardada y racha visible.
- Botones **+1 min** (suma 60 s al día actual), **+1 día** (recarga con `dias=N+1`) y **Ver JSON** (muestra el progreso tal como está guardado).
- Claves de i18n que faltan en inglés.

## 10. Textos de interfaz
Grupos de claves: `app.*`, `bienvenida.*`, `inicio.*`, `categoria.*` (4), `juego.<id>.titulo` y `.desc` (19 × 2), `ajustes.*`, `datos.*` (exportar, importar, borrar, errores), `aviso.*`, `comun.*` (volver, aceptar, cancelar, próximamente).

## 11. Assets
| Asset | Formato | Origen / licencia |
|---|---|---|
| JetBrains Mono 400 y 700 | woff2, subconjunto latino | JetBrains, SIL OFL 1.1 (paquete `@fontsource/jetbrains-mono` en jsDelivr; se descarga una vez y se guarda en el repo) |
| Icono de la app | SVG + PNG | propio |
| Iconos de interfaz y categorías | SVG en línea | propios, trazo simple |
| Efectos de sonido | Web Audio | sintetizados, sin archivos |

## 12. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| El dispositivo no tiene voz británica | Media | Se usa otra voz inglesa y Ajustes lo indica |
| Hay que generar los PNG del icono sin herramientas de diseño | Alta | Claude los genera en el PC a partir del SVG con el navegador integrado y los sube. Desde el móvil no hace falta tocarlos |
| El service worker sirve una versión vieja | Media | Primero red con `no-cache`, y `CACHE` versionado |
| Cambio de hora o de zona horaria rompe la racha | Baja | Fechas como texto `AAAA-MM-DD` en hora local y comparación por días, no por horas |
| El navegador borra `localStorage` (iOS tras 7 días sin uso en Safari sin instalar) | Media | Ajustes recomienda instalar la app y exportar de vez en cuando |

## 13. Pruebas
- **`src/progreso/tests.html`:** puntos por nivel y dificultad; objetivo cumplido una sola vez al día; racha que sube, se mantiene, se reinicia y se ve a 0 tras un día sin cumplir; poda de 60 días; exportar → importar da lo mismo; importaciones inválidas (otra app, formato futuro, tipos erróneos) rechazadas.
- **`src/i18n/tests.html`:** mismas claves y mismas variables en `es.json` y `en.json`.
- **Manual en el móvil:** primera visita → bienvenida en el idioma del móvil → inicio. Cambiar idioma, tema y voz en Ajustes y escuchar la prueba. Instalar la app, ponerla en modo avión y abrirla. Exportar el progreso, borrarlo e importarlo.
- **Manual en el PC:** todo lo anterior solo con teclado (Tab, Enter, Esc). Con `?debug=1`, pulsar **+1 min** hasta cumplir el objetivo (aviso y racha 1), luego **+1 día** y repetir (racha 2), y **+1 día** dos veces sin cumplir (racha visible 0).
- **Accesibilidad:** contraste de los dos temas con las herramientas del navegador, TalkBack en el inicio y "reducir movimiento" activado.

## 14. Cambios en otros documentos al aprobar
- `docs/arquitectura.md`: añadir `src/router.js`, `src/progreso/almacen.js`, `cronometro.js`, `reloj.js`, `src/pruebas/mini.js` y el campo `dificultad` del registro.
- `docs/decisiones.md`:
  - **D-008** Tipografía: JetBrains Mono para lo destacado y la fuente del sistema para los textos largos.
  - **D-009** Textos de interfaz en JSON cargados con `fetch`, porque importar JSON como módulo aún no funciona en todos los Safari.
  - **D-010** Fórmula de puntos y reglas de la racha.
