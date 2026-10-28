// Arranque de la app: ajustes guardados (tema e idioma) y router.
import { VERSION } from './version.js';
import { aplicarAjustesGuardados, alCambiarAjuste, leerAjustes } from './ajustes/ajustes.js';
import { iniciarRouter, repintar } from './router.js';

const RUTAS = [
  { patron: /^\/inicio$/, cargar: () => import('./pantallas/inicio.js') },
  { patron: /^\/bienvenida$/, cargar: () => import('./pantallas/bienvenida.js') },
  { patron: /^\/ajustes$/, cargar: () => import('./pantallas/ajustes.js') },
  { patron: /^\/juego\/([a-z0-9-]+)$/, cargar: () => import('./pantallas/proximamente.js') },
];

/** Sin bienvenida hecha todo lleva a ella; hecha, ya no vuelve a salir (HU-1). */
function redirigir(ruta) {
  const hecha = leerAjustes().bienvenidaHecha;
  if (!hecha && ruta !== '/bienvenida') return '/bienvenida';
  if (hecha && ruta === '/bienvenida') return '/inicio';
  return null;
}

async function arrancar() {
  document.documentElement.dataset.version = VERSION;
  await aplicarAjustesGuardados();
  // Al cambiar de idioma la pantalla se vuelve a pintar sin recargar (HU-3)
  alCambiarAjuste(({ clave }) => {
    if (clave === 'idioma') repintar();
  });
  await iniciarRouter(document.getElementById('app'), RUTAS, '/inicio', redirigir);
}

arrancar();
