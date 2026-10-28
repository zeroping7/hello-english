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
  app.js                 # arranque y router por hash (§2)
  version.js             # export const VERSION = 'x.y.z'
  i18n/                  # textos de interfaz: es.json, en.json, textos.js (§5)
  ajustes/               # idioma, tema, voz, sonido, objetivo diario
  progreso/              # único dueño del almacenamiento: puntos, racha, nivel, exportar/importar (§6)
  voz/                   # leer en voz alta y reconocer voz (§7)
  sonido/                # efectos con Web Audio y vibración
  ui/                    # piezas comunes: barra superior, tarjeta, aviso de acierto/fallo, resumen
  pantallas/             # inicio, ajustes, bienvenida...
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
- Una sola página con **router por hash**: `#/inicio`, `#/ajustes`, `#/juego/<id>`, `#/practica`, `#/prueba-nivel`, `#/bienvenida`.
- El botón "atrás" del navegador y del móvil funciona en todas las pantallas.
- Los minijuegos se cargan con `import()` al entrar (constitución R2) y se desmontan al salir, liberando sus escuchas y temporizadores.

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

## 5. Idiomas de la interfaz
- `t('clave', { variables })` devuelve el texto en el idioma elegido. Si falta una clave en inglés, se usa la española y `?debug=1` lo avisa.
- Al cambiar de idioma en Ajustes, la pantalla se vuelve a pintar sin recargar.

## 6. Progreso y almacenamiento
- Todo en `localStorage`, con una clave por bloque (`he-ajustes`, `he-progreso`, `he-repaso`) y un campo `v` con la versión del formato.
- Exportar descarga un archivo `.json`; importar lo valida antes de sustituir nada.
- Si el almacenamiento falla (modo privado), la app funciona igual y avisa de que no se guardará el progreso.

## 7. Voz
- Leer en voz alta con `speechSynthesis`: voz británica por defecto, americana en Ajustes, velocidad normal o lenta.
- Reconocer voz con `SpeechRecognition` donde exista. Antes del primer uso se avisa de que el audio lo procesa el servicio del navegador. En Safari iOS se avisa de que puede fallar y se ofrece la alternativa sin hablar (constitución C1).

## 8. App instalable y caché
- `sw.js`: primero red (con `cache: 'no-cache'`, para ver una versión recién publicada al recargar) y, sin conexión, lo guardado. Al cambiar la lista `FILES`, subir `CACHE`.
- `manifest.webmanifest`: "Hello English", sin orientación fija.
