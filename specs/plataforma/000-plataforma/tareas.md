# Tareas: Plataforma (inicio, ajustes, progreso y app instalable)

> **Plan:** `specs/plataforma/000-plataforma/plan.md` · **Estado:** Aprobadas
> Reglas: cada tarea cabe en una sesión con Claude, deja todo funcionando en `main` y se prueba abriendo https://zeroping7.github.io/hello-english/ en el móvil o en el PC (tarda 1-2 min en publicarse tras cada push).
> Cada tarea sube `src/version.js` (0.0.1, 0.0.2… y 0.1.0 al cerrar la spec).

Formato de cada tarea:
```
- [ ] TNNN — Título
  - Archivos:
  - Hecho cuando:
  - Probar:
```

## Fase 0 — Esqueleto
- [x] T001 — Página base, estilo y fuentes
  - Archivos: `index.html`, `css/tokens.css`, `css/app.css`, `fuentes/`, `iconos/icono.svg`, `src/version.js`, `src/app.js`, `docs/creditos.md`
  - Hecho cuando: la web muestra el logo `>_ hello` con el cursor parpadeante en JetBrains Mono, sobre el fondo del tema del sistema; la pestaña del navegador lleva el favicon
  - Probar: abrir la web en el móvil y en el PC, y cambiar el modo oscuro del sistema: la web cambia de tema
- [x] T002 — Mini ejecutor de pruebas e idiomas
  - Archivos: `src/pruebas/mini.js`, `src/i18n/textos.js`, `src/i18n/es.json`, `src/i18n/en.json`, `src/i18n/tests.html`
  - Hecho cuando: `t()` devuelve textos con variables y, si falta una clave en inglés, usa la española; `src/i18n/tests.html` sale en verde
  - Probar: abrir `…/src/i18n/tests.html`
- [x] T003 — Router y pantallas vacías
  - Archivos: `src/router.js`, `src/ui/dom.js`, `src/pantallas/inicio.js`, `src/pantallas/ajustes.js`, `src/pantallas/proximamente.js`, `src/app.js`
  - Hecho cuando: `#/inicio`, `#/ajustes` y `#/juego/x` muestran su título; una ruta desconocida lleva al inicio; el foco va al título y el título de la pestaña cambia
  - Probar: ir a Ajustes desde el inicio y volver con el botón atrás del móvil o del navegador

## Fase 1 — Usable
- [x] T010 — Almacén con versión y respaldo en memoria
  - Archivos: `src/progreso/almacen.js`, `src/ui/aviso.js`, `src/progreso/tests.html`
  - Hecho cuando: guarda y lee con campo `v` y migraciones; si `localStorage` falla, sigue en memoria y el inicio muestra el aviso "Este navegador no deja guardar tu progreso"
  - Probar: abrir `…/?debug=1&sinAlmacen=1` y ver el aviso; sin esos parámetros no aparece. `…/src/progreso/tests.html` en verde
  - Nota: las ventanas privadas actuales de Safari, Chrome y Firefox sí dejan guardar mientras están abiertas, así que no sirven para ver el aviso; por eso existe `sinAlmacen=1`
- [x] T011 — Ajustes generales: idioma y tema
  - Archivos: `src/ajustes/ajustes.js`, `src/pantallas/ajustes.js`, `index.html` (script de tema antes de pintar), i18n
  - Hecho cuando: cambiar el idioma repinta la pantalla al momento; el tema sistema, claro u oscuro se aplica y se guarda; al recargar no hay destello de otro color; la versión sale al final de Ajustes
  - Probar: cambiar idioma y tema, recargar y comprobar que se mantienen
- [ ] T012 — Registro de minijuegos e inicio
  - Archivos: `juegos/registro.js`, `src/ui/iconos.js`, `src/pantallas/inicio.js`, `src/pantallas/proximamente.js`, `css/app.css`, i18n (19 títulos y descripciones)
  - Hecho cuando: el inicio muestra "Práctica de hoy" (*Próximamente*) y las 4 categorías con sus minijuegos en rejilla (2 columnas en móvil, 3-4 en PC); al tocar uno se abre su pantalla "Próximamente" con su nombre e icono
  - Probar: recorrer el inicio en vertical, en horizontal y en el PC; entrar en un minijuego y volver
- [ ] T013 — Bienvenida
  - Archivos: `src/pantallas/bienvenida.js`, `src/app.js`, i18n
  - Hecho cuando: la primera visita lleva a la bienvenida (idioma → objetivo → empezar en A1, con la prueba de nivel como *Próximamente*), con Atrás e indicador "1/3"; al terminar va al inicio y no vuelve a salir
  - Probar: abrir la web en una ventana privada (o con los datos borrados) y completar los tres pasos; probar Atrás en el paso 2

## Fase 2 — Progreso y servicios
- [ ] T020 — Lógica del progreso y sus pruebas
  - Archivos: `src/progreso/logica.js`, `src/progreso/tests.html`
  - Hecho cuando: están las funciones del plan §3 (puntos, sumar segundos, racha visible, segundos de hoy, poda de 60 días) y sus pruebas salen en verde
  - Probar: abrir `…/src/progreso/tests.html`
- [ ] T021 — Progreso en el inicio y cronómetro
  - Archivos: `src/progreso/progreso.js`, `src/progreso/reloj.js`, `src/progreso/cronometro.js`, `src/pantallas/inicio.js`, i18n
  - Hecho cuando: el inicio muestra nivel, puntos, racha y la barra del objetivo de hoy, y se repinta con el evento `cambio`; el cronómetro solo cuenta con la pestaña visible y guarda cada 15 s y al ocultarse
  - Probar: ver el resumen en el inicio con valores a 0. El cronómetro se prueba de verdad en T022 y con el primer minijuego
- [ ] T022 — `?debug=1` y aviso de objetivo cumplido
  - Archivos: `src/ui/debug.js`, `src/progreso/reloj.js`, `src/progreso/progreso.js`, i18n
  - Hecho cuando: el panel muestra lo del plan §9 y funcionan **+1 min**, **+1 día** y **Ver JSON**; al cumplir el objetivo aparece "¡Objetivo de hoy cumplido!" y la racha sube
  - Probar: con objetivo de 5 min, pulsar **+1 min** cinco veces (aviso y racha 1); **+1 día** y repetir (racha 2); **+1 día** dos veces sin cumplir (racha 0)
- [ ] T023 — Exportar, importar y borrar
  - Archivos: `src/progreso/logica.js` (crear, validar, migrar), `src/progreso/tests.html`, `src/ui/confirmar.js`, `src/pantallas/ajustes.js`, i18n
  - Hecho cuando: exportar descarga `hello-english-AAAA-MM-DD.json`; importar valida, pide confirmación y lo sustituye todo; un archivo inválido da error sin cambiar nada; borrar exige escribir `BORRAR` / `DELETE` y lleva a la bienvenida; las pruebas nuevas salen en verde
  - Probar: sumar minutos con `?debug=1`, exportar, borrar, comprobar que todo vuelve a 0 e importar el archivo. Importar también un `.json` cualquiera y ver el error
- [ ] T024 — Voz
  - Archivos: `src/voz/voz.js`, `src/pantallas/ajustes.js`, i18n
  - Hecho cuando: Ajustes permite elegir acento (británico por defecto) y velocidad, y "Escuchar prueba" lee la frase con esa voz; si no hay voz del acento elegido, usa otra inglesa y lo indica
  - Probar: en el móvil y en el PC, escuchar la prueba con los dos acentos y las dos velocidades
- [ ] T025 — Sonido y vibración
  - Archivos: `src/sonido/sonido.js`, `src/pantallas/ajustes.js`, `src/progreso/progreso.js`, i18n
  - Hecho cuando: los efectos `acierto`, `fallo` y `meta` suenan con Web Audio y vibra en el móvil; Ajustes los activa y desactiva por separado y tiene botones para probarlos; el aviso de objetivo cumplido suena y vibra
  - Probar: probar los efectos en Ajustes; desactivar el sonido y cumplir el objetivo con `?debug=1`: solo vibra

## Fase 3 — Pulido
- [ ] T030 — App instalable y sin conexión
  - Archivos: `manifest.webmanifest`, `sw.js`, `iconos/icono-192.png`, `iconos/icono-512.png`, `iconos/icono-maskable-512.png`, `src/app.js`, `index.html`
  - Hecho cuando: Chrome ofrece instalar "Hello English" con su icono; instalada, abre a pantalla completa; en modo avión abre y se navega; al publicar una versión nueva se ve al recargar
  - Probar: instalar en el móvil, activar el modo avión y abrirla; en el PC, instalar desde el icono de la barra de direcciones
- [ ] T031 — Accesibilidad y diseño adaptable
  - Archivos: los que haga falta corregir
  - Hecho cuando: todo se usa solo con teclado (Tab, Enter, Esc); TalkBack lee bien el inicio y Ajustes; contraste AA en los dos temas; con "reducir movimiento" no parpadea el cursor ni hay animaciones; no hay scroll horizontal a 320 px
  - Probar: recorrer la app solo con teclado en el PC; activar TalkBack y "quitar animaciones" en el móvil
- [ ] T032 — Cierre de la spec
  - Archivos: `spec.md` (casillas y estado *Implementada*), `README.md`, `docs/arquitectura.md` si algo cambió, `src/version.js` → `0.1.0`
  - Hecho cuando: todas las historias de usuario están marcadas o explicado por qué no
  - Probar: repasar la lista de pruebas manuales del plan §13
