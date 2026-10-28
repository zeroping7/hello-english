# Arquitectura

> Primera versión, antes de escribir código. Se irá concretando con los planes de cada spec.

## 1. Estructura de carpetas
```
index.html               # la app: una sola página (D-002)
manifest.webmanifest  sw.js  iconos/
css/
  tokens.css             # colores y medidas de los dos temas (constitución E2, E3)
  app.css                # estilos comunes
fuentes/                 # fuentes alojadas en el repo (constitución P3, PR1)
src/
  app.js                 # arranque: ajustes, idioma, service worker y router
  router.js              # router por hash: monta y desmonta pantallas (§2)
  version.js             # export const VERSION = 'x.y.z'
  i18n/                  # textos de interfaz: es.json, en.json, textos.js, tests.html (§5)
  ajustes/               # idioma, tema, voz, sonido, objetivo diario
  progreso/              # único dueño del almacenamiento (§6)
    almacen.js           #   localStorage con versión, migraciones y respaldo en memoria
    logica.js            #   reglas puras: puntos, objetivo, racha, exportar/importar
    progreso.js          #   une lógica y almacén; evento 'cambio'
    cronometro.js        #   segundos de juego con la pestaña visible
    reloj.js             #   hoy() en hora local; ?debug=1&dias=N para probar
    datos.js             #   exportar, importar y borrar (Mis datos)
    tests.html
  voz/                   # leer en voz alta y reconocer voz (§7)
  sonido/                # efectos con Web Audio y vibración
  ui/                    # piezas comunes: dom, barra, opciones, aviso, confirmar, iconos, debug y ejercicio
  pantallas/             # bienvenida, inicio, ajustes, prueba de nivel, juego (común a los minijuegos), próximamente
  contenido/             # carga, validación (esquema), azar con semilla y elección de ejercicios (D-011, D-012)
  prueba/                # lógica de la prueba de nivel (spec 002)
  pruebas/mini.js        # mini ejecutor de pruebas para los tests.html
juegos/
  registro.js            # lista de minijuegos (§3)
  <id>/
    juego.js             # montar / desmontar (§4)
    logica.js            # reglas puras (constitución A1)
    tests.html           # pruebas de logica.js
    juego.css  icono.svg
contenido/               # bancos de ejercicios en JSON (formato en la spec de contenido)
  tests.html             # valida todos los bancos
docs/  CLAUDE.md
specs/
  _plantillas/
  plataforma/NNN-*/      # lo común
  contenido/NNN-*/       # formato y bancos de contenido
  <id-minijuego>/NNN-*/  # specs de cada minijuego (D-006)
```

## 2. Navegación
- Una sola página con **router por hash**: `#/inicio`, `#/ajustes`, `#/juego/<id>`, `#/juego/<id>/practica`, `#/practica`, `#/logros`, `#/prueba-nivel`, `#/bienvenida`.
- El botón "atrás" del navegador y del móvil funciona en todas las pantallas.
- Los minijuegos se cargan con `import()` al entrar (constitución R2) y se desmontan al salir, liberando sus escuchas y temporizadores.
- `iniciarRouter(raiz, rutas, porDefecto, redirigir)`: `redirigir(ruta)` puede mandar a otra (sin bienvenida hecha, todo va a `#/bienvenida`).
- Esc vuelve atrás salvo en campos de texto, diálogos o pantallas con `data-esc-propio` (la bienvenida gestiona sus pasos).

## 3. Registro de minijuegos (`juegos/registro.js`)
```js
{
  id: 'falsos-amigos',               // = nombre de la carpeta
  titulo: 'juego.falsos-amigos.titulo',      // clave de i18n, no texto
  descripcion: 'juego.falsos-amigos.desc',
  categoria: 'vocabulario',          // 'lectura' | 'escucha' | 'vocabulario' | 'profesional'
  habilidades: ['vocabulario'],      // lo que suma al progreso
  icono: 'juegos/falsos-amigos/icono.svg',
  necesita: [],                      // p. ej. ['voz'] o ['microfono']
  dificultad: 1,                     // 1 o 1.5: multiplica los puntos (D-010)
  disponible: true,                  // false = "Próximamente"
}
```

## 4. Interfaz común de un minijuego
```js
// juegos/<id>/juego.js
export function montar(raiz, {
  ejercicios,          // elementos de contenido ya elegidos (nivel, tema, repaso)
  idioma,              // idioma de la interfaz
  voz, sonido,         // servicios comunes
  alResponder(idElemento, acierto),  // para puntos y repaso espaciado
  alTerminar(resumen), // { aciertos, fallos, segundos }
}) {
  // ...
  return { desmontar() {} };
}
```
Así el inicio, la Práctica de hoy y la prueba de nivel usan cualquier minijuego igual.

**Versión implementada (spec 003, D-014):** el módulo exporta también `BANCO` y `EJERCICIOS`, y `montar(raiz, { ejercicios, idioma, ponerContador, alResponder(item, acierto), alTerminar })`. La pantalla común `src/pantallas/juego.js` elige tema, carga el banco, elige los ejercicios, cuenta tiempo y puntos, pone sonido y vibración, y enseña el resumen. Los estilos propios van en `juegos/<id>/juego.css`.

**v1.0.0 (D-016):** los minijuegos de un ejercicio cada vez se montan sobre `ronda()` (`src/ui/ronda.js`); `alResponder(item, acierto, { sonido })` y `ponerContador(n, total)`. La pantalla común registra cada resultado con `registrarResultado` (puntos, repaso espaciado y nivel, D-018 y D-019) y cada partida con `registrarPartida` (estadísticas, logros y Práctica de hoy, D-020). Las reglas de los minijuegos nuevos se prueban en `juegos/tests.html`.

## 5. Idiomas de la interfaz
- `t('clave', { variables })` devuelve el texto en el idioma elegido. Si falta una clave en inglés, se usa la española y `?debug=1` lo avisa.
- Al cambiar de idioma en Ajustes, la pantalla se vuelve a pintar sin recargar.

## 6. Progreso y almacenamiento
- Todo en `localStorage`, con una clave por bloque (`he-ajustes`, `he-progreso`) y un campo `v` con la versión del formato. Formato v1 en el plan de 000, §3; la v2 añade `repaso`, `stats`, `logros`, `ventana` y `practica` (D-018).
- Exportar descarga un archivo `.json`; importar lo valida antes de sustituir nada.
- Si el almacenamiento falla (modo privado), la app funciona igual y avisa de que no se guardará el progreso.

## 7. Voz
- Leer en voz alta con `speechSynthesis`: voz británica por defecto, americana en Ajustes, velocidad normal o lenta.
- Reconocer voz con `SpeechRecognition` donde exista (`src/voz/reconocer.js`, D-017). Las pantallas que lo usan avisan de que el audio lo procesa el servicio del navegador, y siempre hay alternativa sin hablar (constitución C1).

## 8. App instalable y caché
- `sw.js`: primero red (con `cache: 'no-cache'`, para ver una versión recién publicada al recargar) y, sin conexión, lo guardado. Al cambiar la lista `FILES`, subir `CACHE`.
- `manifest.webmanifest`: "Hello English", sin orientación fija.
