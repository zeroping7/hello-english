// Pantalla de inicio (HU-2): Práctica de hoy y las cuatro categorías con sus minijuegos.
// El resumen de nivel, puntos, racha y objetivo llega en T021.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { navegar } from '../router.js';
import { almacen } from '../progreso/almacen.js';
import { avisoFijo } from '../ui/aviso.js';
import { icono } from '../ui/iconos.js';
import { CATEGORIAS, juegosDe, iconoDe } from '../../juegos/registro.js';

function logo() {
  // La marca no se traduce: es la misma en todos los idiomas
  return h('h1', { class: 'logo', 'aria-label': t('app.nombre') },
    h('span', { class: 'logo-prompt' }, '>_'),
    ' hello',
    h('span', { class: 'logo-cursor', 'aria-hidden': 'true' }),
  );
}

function etiquetaProximamente() {
  return h('span', { class: 'etiqueta' }, t('comun.proximamente'));
}

function practicaDeHoy() {
  // Hasta que exista su spec se ve pero no se puede usar
  return h('button', { class: 'practica', type: 'button', disabled: true },
    h('span', { class: 'practica-icono' }, icono('practica')),
    h('span', { class: 'practica-texto' },
      h('span', { class: 'practica-titulo' }, t('inicio.practica')),
      h('span', { class: 'practica-desc' }, t('inicio.practica.desc')),
      etiquetaProximamente(),
    ),
  );
}

function tarjeta(juego) {
  return h('li', {},
    h('a', { class: 'tarjeta', href: `#/juego/${juego.id}` },
      h('span', { class: `tarjeta-icono cat-${juego.categoria}` }, icono(iconoDe(juego))),
      h('span', { class: 'tarjeta-titulo' }, t(juego.titulo)),
      h('span', { class: 'tarjeta-desc' }, t(juego.descripcion)),
      !juego.disponible && etiquetaProximamente(),
    ),
  );
}

function categoria({ id, icono: nombreIcono }) {
  const idTitulo = `cat-${id}`;
  return h('section', { class: 'categoria', 'aria-labelledby': idTitulo },
    h('h2', { class: 'categoria-titulo', id: idTitulo },
      icono(nombreIcono),
      t(`categoria.${id}`)),
    h('ul', { class: 'rejilla' }, juegosDe(id).map(tarjeta)),
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
      }, icono('ajustes')),
    ),
    h('main', { class: 'contenido' },
      !almacen.persistente() && avisoFijo(t('aviso.sinAlmacen'), { tipo: 'error' }),
      practicaDeHoy(),
      CATEGORIAS.map(categoria),
    ),
  );
  return { desmontar() {} };
}
