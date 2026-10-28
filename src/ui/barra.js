// Barra superior de las pantallas secundarias: botón Volver + título (h1).
import { h } from './dom.js';
import { t } from '../i18n/textos.js';
import { volver } from '../router.js';
import { icono } from './iconos.js';

export function barraConVolver(titulo) {
  return h('header', { class: 'barra' },
    h('button', { class: 'boton boton-icono', type: 'button', onclick: volver, 'aria-label': t('comun.volver') },
      icono('atras')),
    h('h1', { class: 'barra-titulo' }, titulo),
  );
}
