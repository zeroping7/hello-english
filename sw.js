// Service worker (constitución P5, plan de 000 §8): primero red y, sin conexión, lo guardado.
// Es un script que el navegador ejecuta aparte de la página y que intercepta sus peticiones.
// Al cambiar FILES, sube CACHE para que se guarde la lista nueva.
const CACHE = 'he-v1.0.0';

const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './css/tokens.css',
  './fuentes/jetbrains-mono-latin-400.woff2',
  './fuentes/jetbrains-mono-latin-700.woff2',
  './iconos/icono-192.png',
  './iconos/icono-512.png',
  './iconos/icono-maskable-512.png',
  './iconos/icono.svg',
  './juegos/registro.js',
  './src/app.js',
  './src/router.js',
  './src/version.js',
  './src/ajustes/ajustes.js',
  './src/i18n/textos.js',
  './src/i18n/es.json',
  './src/i18n/en.json',
  './src/pantallas/ajustes.js',
  './src/pantallas/bienvenida.js',
  './src/pantallas/inicio.js',
  './src/pantallas/proximamente.js',
  './src/progreso/almacen.js',
  './src/progreso/cronometro.js',
  './src/progreso/datos.js',
  './src/progreso/logica.js',
  './src/progreso/progreso.js',
  './src/progreso/reloj.js',
  './src/sonido/sonido.js',
  './src/ui/aviso.js',
  './src/ui/barra.js',
  './src/ui/confirmar.js',
  './src/ui/debug.js',
  './src/ui/dom.js',
  './src/ui/iconos.js',
  './src/ui/opciones.js',
  './src/voz/voz.js',
  './contenido/temas.json',
  './contenido/prueba-nivel.json',
  './contenido/falsos-amigos.json',
  './contenido/merge-conflict.json',
  './src/contenido/azar.js',
  './src/contenido/cargar.js',
  './src/contenido/elegir.js',
  './src/contenido/esquema.js',
  './src/prueba/logica.js',
  './src/pantallas/prueba-nivel.js',
  './src/ui/ejercicio.js',
  './src/pantallas/juego.js',
  './juegos/falsos-amigos/juego.js',
  './juegos/falsos-amigos/logica.js',
  './juegos/falsos-amigos/juego.css',
  './juegos/merge-conflict/juego.js',
  './juegos/merge-conflict/logica.js',
  './juegos/merge-conflict/juego.css',
  './src/ui/ronda.js',
  './src/ui/escucha-elige.js',
  './src/voz/reconocer.js',
  './src/contenido/texto.js',
  './src/progreso/logros.js',
  './src/progreso/practica.js',
  './src/pantallas/practica.js',
  './src/pantallas/logros.js',
  './juegos/caza-el-bug/juego.js',
  './juegos/caza-el-bug/logica.js',
  './juegos/caza-el-bug/juego.css',
  './contenido/caza-el-bug.json',
  './juegos/prompt/juego.js',
  './juegos/prompt/logica.js',
  './juegos/prompt/juego.css',
  './contenido/prompt.json',
  './juegos/incidente/juego.js',
  './juegos/incidente/logica.js',
  './juegos/incidente/juego.css',
  './contenido/incidente.json',
  './juegos/ordenar-frases/juego.js',
  './juegos/ordenar-frases/logica.js',
  './juegos/ordenar-frases/juego.css',
  './contenido/ordenar-frases.json',
  './juegos/ahorcado/juego.js',
  './juegos/ahorcado/logica.js',
  './juegos/ahorcado/juego.css',
  './contenido/ahorcado.json',
  './juegos/dictado-codigo/juego.js',
  './juegos/dictado-codigo/logica.js',
  './juegos/dictado-codigo/juego.css',
  './contenido/dictado-codigo.json',
  './juegos/dilo-bien/juego.js',
  './juegos/dilo-bien/logica.js',
  './juegos/dilo-bien/juego.css',
  './contenido/dilo-bien.json',
  './juegos/daily-standup/juego.js',
  './juegos/daily-standup/juego.css',
  './contenido/daily-standup.json',
  './juegos/entrevista/juego.js',
  './juegos/entrevista/juego.css',
  './contenido/entrevista.json',
  './juegos/dictado-audio/juego.js',
  './juegos/dictado-audio/juego.css',
  './contenido/dictado-audio.json',
  './juegos/acronimos/juego.js',
  './juegos/acronimos/juego.css',
  './contenido/acronimos.json',
  './juegos/jerga-dev/juego.js',
  './juegos/jerga-dev/juego.css',
  './contenido/jerga-dev.json',
  './juegos/sopa-crucigrama/juego.js',
  './juegos/sopa-crucigrama/logica.js',
  './juegos/sopa-crucigrama/juego.css',
  './contenido/sopa-crucigrama.json',
  './juegos/emparejar/juego.js',
  './juegos/emparejar/logica.js',
  './juegos/emparejar/juego.css',
  './contenido/emparejar.json',
  './juegos/contrarreloj/juego.js',
  './juegos/contrarreloj/logica.js',
  './juegos/contrarreloj/juego.css',
  './contenido/contrarreloj.json',
  './juegos/educado-o-borde/juego.js',
  './juegos/educado-o-borde/juego.css',
  './contenido/educado-o-borde.json',
  './juegos/bug-report/juego.js',
  './juegos/bug-report/logica.js',
  './juegos/bug-report/juego.css',
  './contenido/bug-report.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((c) => c.startsWith('he-') && c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const peticion = e.request;
  if (peticion.method !== 'GET' || new URL(peticion.url).origin !== self.location.origin) return;
  e.respondWith(primeroRed(peticion));
});

async function primeroRed(peticion) {
  const cache = await caches.open(CACHE);
  try {
    // no-cache: siempre se pregunta al servidor, así una versión recién publicada se ve al recargar
    const respuesta = await fetch(peticion, { cache: 'no-cache' });
    if (respuesta.ok) cache.put(peticion, respuesta.clone());
    return respuesta;
  } catch {
    const guardada = await cache.match(peticion, { ignoreSearch: peticion.mode === 'navigate' });
    if (guardada) return guardada;
    if (peticion.mode === 'navigate') {
      const inicio = await cache.match('./index.html');
      if (inicio) return inicio;
    }
    return Response.error();
  }
}
