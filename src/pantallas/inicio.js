// Pantalla de inicio (HU-2): resumen del progreso, Práctica de hoy y las cuatro categorías.
import { h } from '../ui/dom.js';
import { resumen, alCambiarProgreso } from '../progreso/progreso.js';
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

function dato(nombreIcono, clase, etiqueta, valor) {
  return h('div', { class: `dato ${clase}` },
    icono(nombreIcono),
    h('span', { class: 'dato-texto' },
      h('span', { class: 'dato-etiqueta' }, etiqueta),
      h('span', { class: 'dato-valor' }, valor)));
}

function textoRacha(n) {
  return n === 1 ? t('inicio.racha.uno') : t('inicio.racha.varios', { n });
}

/** Nivel, puntos, racha y objetivo de hoy (HU-2, HU-4). */
function pintarResumen(contenedor) {
  const r = resumen();
  const hechos = Math.min(Math.floor(r.segundosHoy / 60), r.objetivoSegundos / 60);
  const total = r.objetivoSegundos / 60;
  const cumplido = r.segundosHoy >= r.objetivoSegundos;

  contenedor.replaceChildren(
    h('div', { class: 'datos' },
      dato('nivel', 'dato-nivel', t('inicio.nivel'), r.nivel),
      dato('puntos', 'dato-puntos', t('inicio.puntos'), r.puntos.toLocaleString(document.documentElement.lang)),
      dato('racha', 'dato-racha', t('inicio.racha'), textoRacha(r.racha))),
    h('div', { class: 'objetivo' },
      h('div', { class: 'objetivo-cabecera' },
        h('span', { id: 'objetivo-etiqueta' }, t('inicio.objetivo')),
        h('span', { class: cumplido ? 'objetivo-valor ok' : 'objetivo-valor' },
          cumplido ? `✓ ${t('inicio.objetivo.cumplido')}` : t('inicio.objetivo.valor', { hecho: hechos, total }))),
      h('progress', {
        class: 'objetivo-barra',
        max: r.objetivoSegundos,
        value: Math.min(r.segundosHoy, r.objetivoSegundos),
        'aria-labelledby': 'objetivo-etiqueta',
      })),
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
  const zonaResumen = h('section', { class: 'resumen-progreso', 'aria-label': t('inicio.tuProgreso') });
  pintarResumen(zonaResumen);
  const dejarDeEscuchar = alCambiarProgreso(() => pintarResumen(zonaResumen));

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
      zonaResumen,
      practicaDeHoy(),
      CATEGORIAS.map(categoria),
    ),
  );
  return { desmontar: dejarDeEscuchar };
}
