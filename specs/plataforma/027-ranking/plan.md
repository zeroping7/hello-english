# Plan técnico: Ranking diario y mensual

> **Spec:** `specs/plataforma/027-ranking/spec.md` · **Estado:** Borrador · **Fecha:** 2026-11-01
> Describe CÓMO. Cada decisión debe poder trazarse a una parte de la spec.

## 1. Cumplimiento de la constitución
- [x] A1 Reglas puras en `src/ranking/logica.js` y en las funciones exportadas de `servidor/worker.js`
- [x] A2 Ningún contenido escrito en el código (la lista de palabras vetadas del alias va en `servidor/vetadas.js`, no es contenido de aprendizaje)
- [x] A3 Textos nuevos en `src/i18n/es.json` y `en.json` (prefijo `ranking.`)
- [x] A4 La identidad del ranking se guarda a través de `src/progreso/` (clave nueva `he-ranking`), y entra en exportar, importar y borrar
- [ ] A5 No aplica (no es un minijuego)
- [ ] A6 No aplica (sin aleatoriedad en la lógica; los códigos los genera el servidor)
- [x] P5 Archivos nuevos en `FILES` de `sw.js` y `CACHE` subido. Las llamadas a la API **no** pasan por la caché
- [x] C1-C5 Pantalla de ranking usable con teclado y lector de pantalla; la posición propia se marca con texto, no solo color
- [ ] **P2 y PR1: excepción** → D-021
- [x] Q2 `src/ranking/tests.html` y `servidor/tests.html`
- Excepciones: **D-021** (servidor opcional en Cloudflare), **D-022** (identidad con código secreto), **D-023** (multiplicador por esfuerzo)

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `servidor/worker.js` | API del ranking (Cloudflare Worker). Exporta también sus reglas puras para probarlas |
| `servidor/esquema.sql` | Tablas de D1; se pega una vez en la consola de D1 |
| `servidor/vetadas.js` | Palabras ofensivas que no puede contener un alias (es y en) |
| `servidor/tests.html` | Pruebas de las reglas del servidor en el navegador |
| `servidor/LEEME.md` | Cómo crear la base de datos y el Worker desde el panel de Cloudflare |
| `src/ranking/config.js` | URL de la API |
| `src/ranking/logica.js` | Reglas puras: validar alias, acumular pendientes, decidir si se envía, formatear posición |
| `src/ranking/api.js` | `fetch` a la API con tiempo límite; errores traducidos a motivos (`sin-red`, `alias-usado`, `codigo`…) |
| `src/ranking/ranking.js` | Une lógica, API y progreso: `unirse`, `sumar`, `enviarPendientes`, `clasificacion`, `recuperar`, `salir` |
| `src/ranking/tests.html` | Pruebas de `logica.js` |
| `src/pantallas/ranking.js` | Pantalla `#/ranking`: unirse y pestañas Hoy / Este mes |
| `src/pantallas/inicio.js` | Dato nuevo "Ranking" junto a los puntos |
| `src/pantallas/ajustes.js` | Sección Ranking: ver código, recuperar con código, salir |
| `src/pantallas/juego.js` | Al terminar una partida, suma sus puntos al ranking |
| `src/progreso/progreso.js`, `logica.js`, `datos.js` | `leerRanking` / `guardarRanking`; exportar e importar incluyen `he-ranking`; borrar lo borra |
| `src/ui/ronda.js`, `src/ui/escucha-elige.js` | `responder(acierto, lineas, { hablado })` llega a `alResponder` |
| `juegos/registro.js` | `dificultad` según la tabla de esfuerzo de la spec (1, 1,3 o 1,5) |
| `docs/constitucion.md` | P2 y PR1 nombran la excepción del ranking |

## 3. Modelo de datos

### En el dispositivo (`he-ranking`, v1)
```js
/** @typedef {Object} Ranking
 *  @property {1} v
 *  @property {string} alias
 *  @property {string} codigo      // secreto: identifica y recupera (D-022)
 *  @property {{ dia: string, puntos: number, ejercicios: number } | null} pendiente
 */
```
- Sin `he-ranking` = no apuntado. Se crea al unirse o recuperar y se borra al salir.
- **Pendiente:** al terminar una partida se suman sus puntos y ejercicios al pendiente del día. Si el envío va bien, se vacía. Si el pendiente es de un día que ya no es hoy, se descarta (spec HU-2).
- Se intenta enviar al terminar cada partida, al abrir la app y con el evento `online` del navegador.

### En el servidor (D1)
```sql
CREATE TABLE jugadores (
  id INTEGER PRIMARY KEY,
  alias TEXT NOT NULL UNIQUE COLLATE NOCASE,
  codigo_hash TEXT NOT NULL UNIQUE,   -- SHA-256 del código; el código nunca se guarda
  creado TEXT NOT NULL
);
CREATE TABLE puntos (
  jugador INTEGER NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
  dia TEXT NOT NULL,                  -- 'AAAA-MM-DD' en Europe/Madrid
  puntos INTEGER NOT NULL DEFAULT 0,
  envios INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (jugador, dia)
);
CREATE INDEX puntos_dia ON puntos(dia, puntos DESC);
CREATE TABLE altas (ip_hash TEXT, hora TEXT, n INTEGER, PRIMARY KEY (ip_hash, hora));
```
- El mes se calcula sumando los días: `WHERE dia BETWEEN 'AAAA-MM-01' AND 'AAAA-MM-31'`.

### API
Todas en JSON. Las que identifican al jugador llevan `Authorization: Bearer <codigo>`.

| Método y ruta | Entrada | Salida |
|---|---|---|
| `POST /unirse` | `{ alias }` | `{ alias, codigo }` · 409 alias usado · 422 alias no válido · 429 demasiadas altas |
| `POST /puntos` | `{ puntos, ejercicios }` | `{ hoy, mes }` (mis puntos) · 422 imposible · 429 tope |
| `GET /ranking?periodo=dia\|mes` | — (código opcional) | `{ top: [{ pos, alias, puntos }], yo: { pos, puntos } \| null }` |
| `POST /recuperar` | código en la cabecera | `{ alias }` · 401 código no válido |
| `DELETE /yo` | código en la cabecera | 204 |

- **Día y mes los decide el servidor** (hora de Europe/Madrid), nunca el cliente.
- **CORS:** solo `https://zeroping7.github.io` (y `http://localhost` para probar).

### Antitrampas (spec §5)
Un acierto vale como mucho `10 × 2 (C1) × 1,5 = 30` puntos.
- Por envío: `ejercicios` entre 1 y 40, y `puntos ≤ 30 × ejercicios`.
- Por día: como mucho 300 envíos y 10.000 puntos (≈ 330 aciertos de C1 en lo más difícil, varias horas de juego).
- Altas: como mucho 5 por hora y por IP (la IP se guarda resumida con SHA-256 y se borra al día siguiente).
- Lo que no cumple se rechaza entero; la app lo descarta y no reintenta.

### Esfuerzo (spec §4, D-023)
- `juegos/registro.js`: `dificultad` pasa a 1 / 1,3 / 1,5 según la tabla de la spec.
- `alResponder(item, acierto, { hablado })`: si `hablado` es `true`, la pantalla común usa 1,5 en lugar de la dificultad del minijuego. Lo marca `escucha-elige.js` cuando la opción se ha elegido hablando (Daily standup y Entrevista).
- `puntosPorAcierto` no cambia. Los puntos ya ganados tampoco.

## 4. Contenido
No usa contenido de `contenido/`.

## 5. Pantallas
| Pantalla | Qué muestra | Viene de / va a |
|---|---|---|
| Inicio | Dato nuevo junto a "Puntos": `#12 hoy` si estoy apuntado, `—` sin red, o "Únete al ranking" | → `#/ranking` |
| `#/ranking` sin apuntar | Qué se envía (alias y puntos), campo de alias con sus reglas, aviso de que no se puede cambiar, botón Unirme y enlace "Ya tengo un código" | ← Inicio · → código tras unirse |
| `#/ranking` código | El código en grande, botón Copiar y aviso de guardarlo (también está en Ajustes y en Exportar) | → clasificación |
| `#/ranking` clasificación | Pestañas Hoy / Este mes, top 50 (posición, alias, puntos), mi fila marcada con "(tú)" y, si no estoy en el top, mi posición debajo | ← Inicio |
| Ajustes → Ranking | Alias, ver y copiar código, "Recuperar con código", "Salir del ranking" (con confirmación) | — |

## 6. Textos de interfaz
Prefijo `ranking.`: `titulo`, `unete`, `posicionHoy`, `hoy`, `mes`, `tu`, `queSeEnvia`, `alias`, `aliasReglas`, `aliasFijo`, `unirme`, `tengoCodigo`, `codigo`, `codigoAviso`, `copiar`, `copiado`, `recuperar`, `salir`, `salirConfirmar`, `sinRed`, `vacio`, `error.alias-usado`, `error.alias-no-valido`, `error.codigo`, `error.tope`, `error.servidor`.

## 7. Assets
| Asset | Formato | Origen / licencia |
|---|---|---|
| Icono de trofeo | SVG en `src/ui/iconos.js` | Propio |

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Alguien envía puntos falsos | Media | Topes del servidor; no se puede evitar del todo sin mover el juego al servidor (aceptado en la spec) |
| Se pierde el código (Safari borra datos a los 7 días sin uso, cambio de móvil) | Media | Se enseña al unirse, está en Ajustes y en Exportar |
| Altas masivas de alias basura | Baja | Tope por IP; alias únicos sin distinguir mayúsculas |
| Se supera el plan gratuito de Cloudflare | Muy baja | Solo falla hasta medianoche UTC; la app sigue funcionando y el ranking avisa |
| Un alias ofensivo pasa el filtro | Media | Lista vetada ampliable; borrado manual desde la consola de D1 |
| La caché del service worker sirve una respuesta vieja de la API | Muy baja | `sw.js` ya deja pasar sin tocar lo que no es del propio sitio (línea 153) |

## 9. Pruebas
- **`src/ranking/tests.html`:** alias válido / no válido; el pendiente se acumula y se descarta al cambiar de día; formato de posición.
- **`servidor/tests.html`:** día de Madrid en los cambios de hora; envíos imposibles rechazados; topes diarios; filtro de palabras vetadas (también con mayúsculas y números por letras).
- **Manual en el móvil:** unirse con un alias, jugar una partida y ver los puntos en el ranking; modo avión, jugar, volver a la red y ver que se envían; recuperar con el código en otro navegador; salir y comprobar que el alias desaparece.
- **Manual en el PC:** lo mismo solo con teclado; pestañas con flechas; lector de pantalla en la tabla.
