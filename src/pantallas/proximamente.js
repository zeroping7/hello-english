// '#/juego/<id>' de un minijuego no disponible o desconocido. En T012 mostrará
// el nombre y el icono del registro; por ahora, el id.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { barraConVolver } from '../ui/barra.js';

export function montar(raiz, [id]) {
  raiz.append(
    barraConVolver(t('comun.proximamente')),
    h('main', { class: 'contenido' },
      h('p', {}, h('code', {}, id)),
      h('p', { class: 'tenue' }, t('proximamente.texto')),
    ),
  );
  return { desmontar() {} };
}
