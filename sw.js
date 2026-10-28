// Service worker (constitución P5, plan de 000 §8): primero red y, sin conexión, lo guardado.
// Es un script que el navegador ejecuta aparte de la página y que intercepta sus peticiones.
// Al cambiar FILES, sube CACHE para que se guarde la lista nueva.
const CACHE = 'he-v0.3.0';

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
