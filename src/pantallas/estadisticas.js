// Estadísticas (spec 034): resumen, tiempo de los últimos 14 días, puntos flojos y aciertos por
// minijuego y por tema. Los puntos flojos también orientan la Práctica de hoy.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { barraConVolver } from '../ui/barra.js';
import { icono } from '../ui/iconos.js';
import { leerProgreso } from '../progreso/progreso.js';
import { hoy } from '../progreso/reloj.js';
import { calcularEstadisticas, MIN_RESPUESTAS } from '../progreso/estadisticas.js';
import { TEMAS } from '../contenido/esquema.js';
import { JUEGOS, buscarJuego, iconoDe } from '../../juegos/registro.js';
import { filaMedallas } from './ranking.js';

const numero = (n) => n.toLocaleString(document.documentElement.lang);

function cifra(etiqueta, valor) {
  return h('div', { class: 'cifra' },
    h('span', { class: 'cifra-valor' }, valor),
    h('span', { class: 'cifra-etiqueta' }, etiqueta));
}

/** Barra de porcentaje con su número al lado (no solo color, C4). */
function barra(pct) {
  if (pct === null) return h('span', { class: 'tenue' }, '—');
  const nivel = pct >= 75 ? 'bien' : pct >= 50 ? 'medio' : 'mal';
  return h('span', { class: 'porcentaje' },
    h('span', { class: 'porcentaje-barra', 'aria-hidden': 'true' },
      h('span', { class: `porcentaje-relleno ${nivel}`, style: `transform: scaleX(${pct / 100})` })),
    h('span', { class: 'porcentaje-texto' }, `${pct} %`));
}

function diaCorto(dia) {
  const [a, m, d] = dia.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString(document.documentElement.lang, { weekday: 'narrow' });
}

function diaLargo(dia) {
  const [a, m, d] = dia.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString(document.documentElement.lang, { weekday: 'long', day: 'numeric', month: 'long' });
}

/** Minutos de cada uno de los últimos 14 días, como barras. Para el lector, cada barra dice su día y sus minutos. */
function historial(dias) {
  const max = Math.max(1, ...dias.map((d) => d.minutos));
  return h('ol', { class: 'historial', 'aria-label': t('stats.historial') },
    dias.map((d) => h('li', { class: 'historial-dia' },
      h('span', { class: 'historial-barra', 'aria-hidden': 'true' },
        h('span', { class: `historial-relleno${d.minutos ? '' : ' vacio'}`, style: `transform: scaleY(${Math.max(d.minutos / max, 0.02)})` })),
      h('span', { class: 'historial-etiqueta', 'aria-hidden': 'true' }, diaCorto(d.dia)),
      h('span', { class: 'solo-lector' }, t('stats.historial.dia', { dia: diaLargo(d.dia), n: d.minutos })))));
}

function seccion(titulo, ...hijos) {
  return h('section', { class: 'seccion' }, h('h2', { class: 'seccion-titulo' }, titulo), ...hijos);
}

export function montar(raiz) {
  const p = leerProgreso();
  const e = calcularEstadisticas(p, JUEGOS, TEMAS, hoy());
  const minutosTotales = e.historial.reduce((s, d) => s + d.minutos, 0);

  const flojos = e.flojos.length
    ? h('ul', { class: 'flojos' }, e.flojos.slice(0, 3).map((id) => {
        const juego = buscarJuego(id);
        const fila = e.porJuego.find((r) => r.id === id);
        return h('li', {},
          h('a', { class: 'flojo', href: `#/juego/${id}` },
            h('span', { class: `paso-icono cat-${juego.categoria}` }, icono(iconoDe(juego))),
            h('span', { class: 'flojo-texto' },
              h('span', { class: 'flojo-titulo' }, t(juego.titulo)),
              h('span', { class: 'tenue' }, t('stats.flojo.pct', { pct: fila.pct }))),
            h('span', { class: 'flojo-ir' }, t('stats.practicar'))));
      }))
    : h('p', { class: 'tenue' }, t('stats.flojos.vacio', { n: MIN_RESPUESTAS }));

  raiz.append(
    barraConVolver(t('stats.titulo')),
    h('main', { class: 'contenido estadisticas' },
      h('div', { class: 'cifras' },
        cifra(t('stats.partidas'), numero(e.partidas)),
        cifra(t('stats.aciertos'), e.pct === null ? '—' : `${e.pct} %`),
        cifra(t('stats.aprendidos'), numero(e.aprendidos)),
        cifra(t('stats.rachaMax'), numero(e.rachaMax)),
        cifra(t('stats.perfectas'), numero(e.perfectas)),
        cifra(t('stats.retos'), numero(e.retos))),
      filaMedallas(p.medallas),
      seccion(t('stats.historial'),
        historial(e.historial),
        h('p', { class: 'tenue nota' }, t('stats.historial.total', { n: minutosTotales }))),
      seccion(t('stats.flojos'),
        h('p', { class: 'tenue nota' }, t('stats.flojos.texto')),
        flojos),
      seccion(t('stats.porJuego'),
        e.porJuego.length
          ? h('ul', { class: 'stats-lista' }, e.porJuego.map((r) => h('li', { class: 'stats-fila' },
              h('a', { href: `#/juego/${r.id}`, class: 'stats-nombre' }, t(buscarJuego(r.id).titulo)),
              h('span', { class: 'tenue stats-partidas' }, r.partidas === 1 ? t('stats.partida.uno') : t('stats.partida.varias', { n: r.partidas })),
              barra(r.pct))))
          : h('p', { class: 'tenue' }, t('stats.vacio'))),
      seccion(t('stats.porTema'),
        h('ul', { class: 'stats-lista' }, e.porTema.map((r) => h('li', { class: 'stats-fila' },
          h('span', { class: 'stats-nombre' }, t(`tema.${r.id}`)),
          h('span', { class: 'tenue stats-partidas' }, t('stats.respuestas', { n: numero(r.aciertos + r.fallos) })),
          barra(r.pct))))),
      h('p', { class: 'tenue nota' }, t('stats.desde')),
    ),
  );
  return { desmontar() {} };
}
