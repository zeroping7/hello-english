// Arranque de la app: ajustes guardados (tema e idioma) y router.
import { VERSION } from './version.js';
import { aplicarAjustesGuardados, alCambiarAjuste } from './ajustes/ajustes.js';
import { iniciarRouter, repintar } from './router.js';

const RUTAS = [
  { patron: /^\/inicio$/, cargar: () => import('./pantallas/inicio.js') },
  { patron: /^\/ajustes$/, cargar: () => import('./pantallas/ajustes.js') },
  { patron: /^\/juego\/([a-z0-9-]+)$/, cargar: () => import('./pantallas/proximamente.js') },
];

async function arrancar() {
  document.documentElement.dataset.version = VERSION;
  await aplicarAjustesGuardados();
  // Al cambiar de idioma la pantalla se vuelve a pintar sin recargar (HU-3)
  alCambiarAjuste(({ clave }) => {
    if (clave === 'idioma') repintar();
  });
  await iniciarRouter(document.getElementById('app'), RUTAS, '/inicio');
}

arrancar();
