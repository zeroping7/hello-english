# Spec de funcionalidad: Plataforma (inicio, ajustes, progreso y app instalable)

> **ID:** 000-plataforma · **Estado:** Implementada (v0.1.0; quedan 3 comprobaciones en el móvil, marcadas abajo) · **Fecha:** 2026-10-28

## 1. Problema
Antes de tener minijuegos hace falta la base común: una pantalla de inicio desde la que llegar a todo, unos ajustes, el progreso guardado y que la web se pueda usar como una app en cualquier dispositivo.

## 2. Objetivo
Abrir la web en el móvil o en el PC, elegir idioma y objetivo la primera vez y llegar a un inicio claro con las cuatro categorías de minijuegos, el nivel, los puntos y la racha. Todo se guarda en el dispositivo y funciona sin conexión.

## 3. Historias de usuario

**HU-1 — Bienvenida.** Como usuario nuevo, quiero configurar lo básico en pocos pasos para empezar enseguida.
- [x] Dado que abro la web por primera vez, cuando carga, entonces elijo el idioma de la interfaz (español o inglés). Por defecto viene marcado el del navegador.
- [x] Después elijo el objetivo diario: 5, 10 o 20 minutos.
- [x] Después se me ofrece la prueba de nivel o empezar en A1. Mientras la prueba no exista (spec 002), se empieza en A1.
- [x] En cualquier paso puedo volver al anterior.
- [x] La bienvenida no vuelve a salir una vez terminada.

**HU-2 — Inicio.** Como usuario, quiero ver de un vistazo cómo voy y llegar a cualquier minijuego.
- [x] Arriba veo mi nivel (A1–C1), mis puntos, mi racha y lo que llevo del objetivo de hoy.
- [x] Veo un botón grande "Práctica de hoy". Mientras no exista (spec propia), aparece como "Próximamente".
- [x] Debajo veo las cuatro categorías: Lectura y gramática, Escucha y habla, Vocabulario e Inglés profesional. Cada una muestra sus minijuegos con icono y nombre.
- [x] Los minijuegos que aún no existen se ven como "Próximamente" y no se pueden abrir. *(abren su ficha con «Próximamente», como se decidió en T012)*
- [x] Al tocar un minijuego disponible entro en él; el botón "atrás" del navegador o del móvil me devuelve al inicio.
- [x] Hay un acceso a Ajustes siempre visible.

**HU-3 — Ajustes.** Como usuario, quiero cambiar la app a mi gusto en cualquier momento.
- [x] Idioma de la interfaz: español o inglés. Al cambiarlo, la pantalla cambia al momento sin recargar.
- [x] Tema: sistema (por defecto), claro u oscuro.
- [x] Voz: británica (por defecto) o americana, y velocidad normal o lenta, con un botón para escuchar una frase de prueba.
- [x] Sonido de efectos y vibración, que se activan o desactivan por separado.
- [x] Objetivo diario: 5, 10 o 20 minutos.
- [x] Repetir la prueba de nivel (cuando exista). *(aparece como «Próximamente»)*
- [x] Exportar, importar y borrar el progreso (HU-5).
- [x] Al final, la versión de la app.

**HU-4 — Puntos, objetivo diario y racha.** Como usuario, quiero ver que avanzo para tener ganas de volver.
- [x] Cada respuesta correcta en un minijuego suma puntos. *(listo en `registrarAcierto`; se verá con el primer minijuego)*
- [x] El tiempo que paso jugando cuenta para el objetivo de hoy. Si salgo de la app o cambio de pestaña, deja de contar.
- [x] Al cumplir el objetivo del día veo un aviso de felicitación, y la racha suma un día.
- [x] Si un día no cumplo el objetivo, la racha vuelve a 0 al día siguiente. El día cambia a medianoche en mi hora local.
- [x] El nivel no cambia en esta spec: lo fijan la prueba de nivel y la progresión (specs propias).

**HU-5 — Mi progreso es mío.** Como usuario, quiero guardar mi progreso y poder llevármelo.
- [x] Todo se guarda en el dispositivo sin cuenta ni registro.
- [x] "Exportar" descarga un archivo con todo mi progreso y mis ajustes.
- [x] "Importar" carga ese archivo en otro dispositivo o navegador. Antes de sustituir nada, me pide confirmación; si el archivo no es válido, me lo dice y no cambia nada.
- [x] "Borrar progreso" pide confirmación escribiendo una palabra y vuelve a la bienvenida.
- [x] Si el navegador no deja guardar (modo privado), la app funciona igual y avisa de que el progreso no se guardará.
- [x] Al actualizar la app, nunca pierdo el progreso.

**HU-6 — App instalable y sin conexión.** Como usuario, quiero usarla como una app aunque no tenga datos.
- [ ] Se puede instalar desde el navegador ("Instalar" / "Añadir a pantalla de inicio") con el nombre "Hello English" y su icono. *(pendiente de comprobar en el móvil y en el PC)*
- [ ] Después de la primera visita, funciona sin conexión. *(el service worker guarda los 38 archivos en GitHub Pages; falta probarlo en modo avión)*
- [x] Al publicar una versión nueva, la veo al recargar.

**HU-7 — En cualquier pantalla y con cualquier control.**
- [x] Se usa bien en vertical y en horizontal, desde un móvil pequeño hasta un monitor grande.
- [x] Todo se puede hacer solo con teclado (Tab, Enter, Esc para volver) y solo con táctil.
- [ ] Funciona con el lector de pantalla del móvil y respeta "reducir movimiento". *(estructura accesible y "reducir movimiento" hechos; falta probarlo con TalkBack)*

## 4. Requisitos no funcionales
- Inicio interactivo en < 3 s con 4G (constitución R1).
- Sin cuentas, sin cookies y sin estadísticas (PR1).
- Contraste AA en los dos temas y nunca solo el color (C3, C4).
- `?debug=1` muestra la versión de los datos guardados y el idioma y el tema activos (Q1).

## 5. Fuera de alcance
- Los minijuegos, la prueba de nivel, la Práctica de hoy, los logros y el repaso espaciado (cada uno tiene su spec).
- Sincronizar entre dispositivos (D-004).
- Recordatorios o notificaciones.
- Más idiomas de interfaz que español e inglés.

## 6. Preguntas abiertas
- [x] **Ortografía del contenido:** ¿británica o americana? → **Británica** (*colour*, *organise*), para ir con la voz británica, salvo los nombres técnicos que se escriben siempre igual (`color` en CSS, `initialize` en una API).
- [x] **Bienvenida:** ¿un paso para elegir temas favoritos? → **No en la v1**; se puede filtrar por tema dentro de cada minijuego.
- [x] **Racha:** ¿"congelar" la racha un día al mes? → **No en la v1**; se puede añadir con los logros.
- [x] **Puntos:** ¿más puntos en minijuegos difíciles o niveles altos? → **Sí**; los valores se fijan en el plan.
- [x] **Icono de la app:** → el símbolo de terminal `>_` con la palabra *hello* en el color de acento.
