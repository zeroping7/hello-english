// Pantalla de ajustes (HU-3). En T003 está vacía; las opciones llegan desde T011.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { barraConVolver } from '../ui/barra.js';

export function montar(raiz) {
  raiz.append(
    barraConVolver(t('ajustes.titulo')),
    h('main', { class: 'contenido' },
      h('p', { class: 'tenue' }, t('comun.proximamente')),
    ),
  );
  return { desmontar() {} };
}
