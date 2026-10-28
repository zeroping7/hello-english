// Arranque de la app: ajustes guardados (tema e idioma), avisos comunes y router.
import { VERSION } from './version.js';
import { aplicarAjustesGuardados, alCambiarAjuste, leerAjustes } from './ajustes/ajustes.js';
import { alCumplirObjetivo } from './progreso/progreso.js';
import { iniciarRouter, repintar } from './router.js';
import { t } from './i18n/textos.js';
import { avisar } from './ui/aviso.js';

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
    if (clave === 'idioma' || clave === '*') repintar();
  });

  // Objetivo del día cumplido (HU-4)
  alCumplirObjetivo(({ racha }) => {
    const textoRacha = racha === 1 ? t('inicio.racha.uno') : t('inicio.racha.varios', { n: racha });
    avisar(t('aviso.objetivo', { racha: textoRacha }), { tipo: 'exito', duracion: 6000 });
  });

  await iniciarRouter(document.getElementById('app'), RUTAS, '/inicio', redirigir);

  if (new URLSearchParams(location.search).get('debug') === '1') {
    (await import('./ui/debug.js')).montarDebug();
  }
}

arrancar();
