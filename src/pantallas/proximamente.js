// '#/juego/<id>' de un minijuego no disponible o desconocido: nombre, icono y descripción
// del registro, y el aviso de que llegará pronto.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { barraConVolver } from '../ui/barra.js';
import { icono } from '../ui/iconos.js';
import { buscarJuego, iconoDe } from '../../juegos/registro.js';

export function montar(raiz, [id]) {
  const juego = buscarJuego(id);

  raiz.append(
    barraConVolver(juego ? t(juego.titulo) : t('comun.proximamente')),
    h('main', { class: 'contenido proximamente' },
      juego && h('span', { class: `proximamente-icono cat-${juego.categoria}` }, icono(iconoDe(juego))),
      juego
        ? h('p', { class: 'proximamente-desc' }, t(juego.descripcion))
        : h('p', {}, h('code', {}, id)),
      h('p', { class: 'etiqueta' }, t('comun.proximamente')),
      h('p', { class: 'tenue' }, t('proximamente.texto')),
    ),
  );
  return { desmontar() {} };
}
