// Pantalla de inicio (HU-2). En T003 solo tiene el logo y el acceso a Ajustes;
// el resumen y las categorías llegan en T012 y T021.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { navegar } from '../router.js';

function logo() {
  // La marca no se traduce: es la misma en todos los idiomas
  return h('h1', { class: 'logo', 'aria-label': t('app.nombre') },
    h('span', { class: 'logo-prompt' }, '>_'),
    ' hello',
    h('span', { class: 'logo-cursor', 'aria-hidden': 'true' }),
  );
}

export function montar(raiz) {
  raiz.append(
    h('header', { class: 'barra barra-inicio' },
      logo(),
      h('button', {
        class: 'boton boton-icono',
        type: 'button',
        onclick: () => navegar('/ajustes'),
        'aria-label': t('inicio.abrirAjustes'),
      }, h('span', { 'aria-hidden': 'true' }, '⚙')),
    ),
    h('main', { class: 'contenido' },
      h('p', { class: 'lema' }, t('app.lema')),
    ),
  );
  return { desmontar() {} };
}
