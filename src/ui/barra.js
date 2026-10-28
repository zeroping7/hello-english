// Barra superior de las pantallas secundarias: botón Volver + título (h1) y, a la derecha,
// algo opcional (p. ej. el contador de un ejercicio).
import { h } from './dom.js';
import { t } from '../i18n/textos.js';
import { volver } from '../router.js';
import { icono } from './iconos.js';

export function barraConVolver(titulo, { alVolver = volver, extra = null } = {}) {
  return h('header', { class: 'barra' },
    h('button', { class: 'boton boton-icono', type: 'button', onclick: alVolver, 'aria-label': t('comun.volver') },
      icono('atras')),
    h('h1', { class: 'barra-titulo' }, titulo),
    extra && h('div', { class: 'barra-extra' }, extra),
  );
}
