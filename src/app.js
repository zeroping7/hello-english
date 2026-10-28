// Arranque de la app: idioma del navegador y router. Los ajustes guardados llegan en T011.
import { VERSION } from './version.js';
import { cargarIdioma, idiomaDelNavegador } from './i18n/textos.js';
import { iniciarRouter } from './router.js';

const RUTAS = [
  { patron: /^\/inicio$/, cargar: () => import('./pantallas/inicio.js') },
  { patron: /^\/ajustes$/, cargar: () => import('./pantallas/ajustes.js') },
  { patron: /^\/juego\/([a-z0-9-]+)$/, cargar: () => import('./pantallas/proximamente.js') },
];

async function arrancar() {
  document.documentElement.dataset.version = VERSION;
  await cargarIdioma(idiomaDelNavegador());
  await iniciarRouter(document.getElementById('app'), RUTAS, '/inicio');
}

arrancar();
