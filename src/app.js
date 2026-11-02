// Arranque de la app: ajustes guardados (tema e idioma), avisos comunes y router.
import { VERSION } from './version.js';
import { aplicarAjustesGuardados, alCambiarAjuste, leerAjustes } from './ajustes/ajustes.js';
import { alCumplirObjetivo, alConseguirLogro, alSubirNivel } from './progreso/progreso.js';
import { iniciarRouter, repintar } from './router.js';
import { t } from './i18n/textos.js';
import { avisar } from './ui/aviso.js';
import { efecto } from './sonido/sonido.js';
import { iniciarRanking, alVerResultado } from './ranking/ranking.js';
import { avisarObjetivoCumplido, actualizarIdioma } from './recordatorio/recordatorio.js';

const RUTAS = [
  { patron: /^\/inicio$/, cargar: () => import('./pantallas/inicio.js') },
  { patron: /^\/bienvenida$/, cargar: () => import('./pantallas/bienvenida.js') },
  { patron: /^\/ajustes$/, cargar: () => import('./pantallas/ajustes.js') },
  { patron: /^\/prueba-nivel$/, cargar: () => import('./pantallas/prueba-nivel.js') },
  { patron: /^\/juego\/([a-z0-9-]+)(?:\/(practica|reto))?$/, cargar: () => import('./pantallas/juego.js') },
  { patron: /^\/practica$/, cargar: () => import('./pantallas/practica.js') },
  { patron: /^\/logros$/, cargar: () => import('./pantallas/logros.js') },
  { patron: /^\/ranking(?:\/(dia|mes|rachas|reto))?$/, cargar: () => import('./pantallas/ranking.js') },
  { patron: /^\/estadisticas$/, cargar: () => import('./pantallas/estadisticas.js') },
];

/** Sin bienvenida hecha todo lleva a ella (salvo la prueba de nivel, que es su paso 3); hecha, ya no vuelve a salir. */
function redirigir(ruta) {
  const hecha = leerAjustes().bienvenidaHecha;
  if (!hecha && ruta !== '/bienvenida' && ruta !== '/prueba-nivel') return '/bienvenida';
  if (hecha && ruta === '/bienvenida') return '/inicio';
  return null;
}

async function arrancar() {
  document.documentElement.dataset.version = VERSION;
  await aplicarAjustesGuardados();

  // Al cambiar de idioma la pantalla se vuelve a pintar sin recargar (HU-3)
  alCambiarAjuste(({ clave }) => {
    if (clave === 'idioma' || clave === '*') {
      repintar();
      actualizarIdioma(); // el texto del recordatorio va en el idioma de la app (spec 032)
    }
  });

  // Objetivo del día cumplido (HU-4)
  alCumplirObjetivo(({ racha }) => {
    const textoRacha = racha === 1 ? t('inicio.racha.uno') : t('inicio.racha.varios', { n: racha });
    avisar(t('aviso.objetivo', { racha: textoRacha }), { tipo: 'exito', duracion: 6000 });
    efecto('meta');
    avisarObjetivoCumplido(); // hoy ya no hace falta recordatorio (spec 032)
  });

  // Puesto final de ayer y del mes pasado, con su medalla si la hay (specs 028 y 029)
  alVerResultado(({ tipo, pos, jugadores, medalla }) => {
    const texto = t(`aviso.resultado.${tipo}`, { pos, n: jugadores });
    avisar(medalla ? `${texto} ${t(`aviso.medalla.${medalla}`)}` : texto, { tipo: medalla ? 'exito' : 'info', duracion: 7000 });
    if (medalla) efecto('meta');
  });

  // Logros nuevos (spec 023) y subida de nivel con el uso (spec 025)
  alConseguirLogro(({ ids }) => {
    for (const id of ids) avisar(t('aviso.logro', { logro: t(`logro.${id}.titulo`) }), { tipo: 'exito', duracion: 5000 });
  });
  alSubirNivel(({ nivel }) => {
    avisar(t('aviso.nivel', { nivel, nombre: t(`nivel.${nivel}`) }), { tipo: 'exito', duracion: 6000 });
    efecto('meta');
  });

  await iniciarRouter(document.getElementById('app'), RUTAS, '/inicio', redirigir);

  if (new URLSearchParams(location.search).get('debug') === '1') {
    (await import('./ui/debug.js')).montarDebug();
  }

  registrarServiceWorker();
  // Puntos del ranking que quedaron sin enviar (spec 027 HU-2)
  iniciarRanking();
}

/** App instalable y sin conexión (HU-6). */
function registrarServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  // updateViaCache 'none': el propio sw.js tampoco se toma de la caché del navegador
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {});
}

arrancar();
