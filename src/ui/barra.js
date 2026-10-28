// Barra superior de las pantallas secundarias: botón Volver + título (h1).
import { h } from './dom.js';
import { t } from '../i18n/textos.js';
import { volver } from '../router.js';

export function barraConVolver(titulo) {
  return h('header', { class: 'barra' },
    h('button', { class: 'boton boton-icono', type: 'button', onclick: volver, 'aria-label': t('comun.volver') },
      h('span', { 'aria-hidden': 'true' }, '←')),
    h('h1', { class: 'barra-titulo' }, titulo),
  );
}
