# Servidor del ranking

API del ranking (spec 027): un **Cloudflare Worker** con una base de datos **D1**, en el plan gratuito (D-021). Todo se hace desde el panel web de Cloudflare, también desde el móvil; no hace falta terminal.

| Archivo | Para qué |
|---|---|
| `worker.js` | El código del Worker. Se pega entero en el editor de Cloudflare |
| `esquema.sql` | Las tablas. Se pega una vez en la consola de D1 (solo en una instalación nueva) |
| `tests.html` | Pruebas de las reglas (ábrelo en el navegador) |

> Los nombres de los menús de Cloudflare pueden cambiar un poco; si algo no coincide, busca la opción equivalente.

## Puesta en marcha (una sola vez, ~10 minutos)

### 1. Cuenta
Crea una cuenta gratis en <https://dash.cloudflare.com/sign-up>. No pide tarjeta.

### 2. Base de datos
1. En el panel: **Storage & Databases → D1 SQL Database → Create**.
2. Nombre: `hello-english`. Ubicación: automática (o Europa occidental).
3. Entra en la base de datos → pestaña **Console**.
4. Pega todo el contenido de [`esquema.sql`](esquema.sql) y pulsa **Execute**.
5. En la pestaña **Tables** deben aparecer `jugadores`, `puntos` y `altas`.

### 3. Worker
1. En el panel: **Compute → Workers & Pages → Create application → Start with Hello World!**.
2. Nombre: el que proponga Cloudflare vale (se puede cambiar luego en **Settings**). Deja **Protect with Cloudflare Access** desactivado → **Deploy**.
3. Pulsa **Edit code**, borra todo lo que hay y pega el contenido de [`worker.js`](worker.js) → **Deploy**.

### 4. Enlazar la base de datos al Worker
1. Entra en el Worker (pulsa su nombre) → pestaña **Bindings** (o **Settings → Bindings**) → **Add binding → D1 database**.
2. Variable name: `DB` (en mayúsculas, exactamente así). Database: `hello-english` → **Save** / **Deploy**.

### 5. Comprobar
Abre en el navegador la URL del Worker (algo como `https://hello-english-ranking.<tu-usuario>.workers.dev`) añadiendo `/ranking?periodo=dia`:

```
https://hello-english-ranking.<tu-usuario>.workers.dev/ranking?periodo=dia
```

Debe responder `{"periodo":"dia", ... "top":[], ... "jugadores":0}`. Si dice `sin-base-de-datos`, revisa el paso 4.

> El subdominio (`<tu-usuario>.workers.dev`) es de la cuenta y puede llevar datos personales. Se cambia en **Workers & Pages → Account details → Subdomain** (lápiz). La URL vieja deja de funcionar al momento y la nueva tarda unos minutos.

### 6. Conectar la app
Pon esa URL (sin `/ranking...`) en `src/ranking/config.js` y sube la versión, o pásasela a Claude. Hasta entonces, el ranking no aparece en la app.

Para probar la app contra el Worker sin cambiar nada: abre la web con
`?debug=1&api=https://hello-english-ranking.<tu-usuario>.workers.dev`.

### 7. Recordatorios: cron cada 15 minutos
Para que lleguen los recordatorios diarios (spec 032), el Worker tiene que despertarse solo:
1. En el Worker: **Settings → Trigger events** (en algunos paneles, **Triggers**) → **Add → Cron trigger**.
2. Elige **Custom** / escribe `*/15 * * * *` → **Add** / **Deploy**.

Sin esto, todo lo demás funciona, pero no llega ningún recordatorio.

## Actualizar a la v2 (app 1.2.0)
Si ya tenías el ranking de la v1.1:
1. Worker → **Edit code** → borra todo, pega el `worker.js` nuevo → **Deploy**.
2. Añade el cron del paso 7.

No hace falta tocar la base de datos: el Worker añade solo las columnas y tablas nuevas la primera vez que recibe una petición (D-024). Para comprobarlo, abre `<URL>/rachas`: debe responder `{"api":2, ... "top":[] ...}`.

## Mantenimiento
- **Actualizar el Worker** tras un cambio en `worker.js`: Worker → **Edit code** → pegar → **Deploy**.
- **Borrar un alias ofensivo**: base de datos → **Console**:
  ```sql
  DELETE FROM puntos WHERE jugador = (SELECT id FROM jugadores WHERE alias = 'el_alias');
  DELETE FROM jugadores WHERE alias = 'el_alias';
  ```
  Y añade la palabra a `VETADAS_PARTE` o `VETADAS_ENTERA` en `worker.js`.
- **Ver cuántos jugadores hay**: `SELECT COUNT(*) FROM jugadores;`
- **Ver cuántos recordatorios hay**: `SELECT COUNT(*) FROM recordatorios;`
- **Límites gratis**: 100.000 peticiones al día. Si se superan, el ranking falla hasta medianoche UTC; la app sigue funcionando y no se cobra nada.

## API
Todas las respuestas son JSON. Las rutas de un jugador llevan `Authorization: Bearer <código>`.

| Ruta | Entrada | Respuesta |
|---|---|---|
| `POST /unirse` | `{ "alias": "..." }` | 201 `{ alias, codigo }` · 409 alias usado · 422 alias no válido · 429 demasiadas altas |
| `POST /puntos` | `{ "puntos": n, "ejercicios": n }` | 200 `{ hoy, mes }` · 401 código · 422 imposible · 429 tope |
| `GET /ranking?periodo=dia\|mes` | código opcional | 200 `{ periodo, dia, top: [{ pos, alias, puntos }], yo, jugadores }` |
| `POST /recuperar` | — | 200 `{ alias }` · 401 código |
| `DELETE /yo` | — | 204 · 401 código |
| `GET /ranking?periodo=ayer\|mesAnterior&liga=B1` | código opcional | Igual que arriba, con `api: 2`, `desde`, `hasta` y `liga` (specs 028 y 030) |
| `GET /rachas` | código opcional | 200 `{ dia, top: [{ pos, alias, racha }], yo, jugadores }` (spec 031) |
| `POST /reto` | `{ juego, aciertos, total: 10, segundos }` | 201 · 409 ya jugado · 422 imposible (spec 033) |
| `GET /reto` | código opcional | 200 `{ dia, top: [{ pos, alias, aciertos, total, segundos }], yo, jugadores }` |
| `GET /recordatorio/clave` | — | 200 `{ clave }` (clave pública VAPID, spec 032) |
| `POST /recordatorio` | `{ endpoint, hora, zona, idioma }` | 201 · 422 · 429 |
| `DELETE /recordatorio` | `{ endpoint }` | 204 |
| `POST /recordatorio/hecho` | `{ endpoint, dia }` | 204 (ese día no se avisa) |
