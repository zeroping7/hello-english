// Panel de ?debug=1 (constitución Q1, plan de 000 §9). Es una herramienta para probar, no
// parte de la interfaz del usuario, así que sus rótulos van en español sin pasar por i18n.
import { h } from './dom.js';
import { VERSION } from '../version.js';
import { idiomaActual, clavesQueFaltan } from '../i18n/textos.js';
import { leerAjustes, alCambiarAjuste } from '../ajustes/ajustes.js';
import { leerProgreso, sumarTiempo, alCambiarProgreso } from '../progreso/progreso.js';
import { hoy, diasDeDesplazamiento } from '../progreso/reloj.js';
import { rachaVisible, segundosHoy } from '../progreso/logica.js';
import { almacen } from '../progreso/almacen.js';

/** Datos extra que otros módulos quieren enseñar (p. ej. la voz elegida). */
const extras = new Map();
let repintarPanel = () => {};

export function anotarDebug(nombre, valor) {
  extras.set(nombre, valor);
  repintarPanel();
}

function fila(nombre, valor) {
  return h('tr', {}, h('th', {}, nombre), h('td', {}, String(valor)));
}

function irADia(n) {
  const url = new URL(location.href);
  url.searchParams.set('debug', '1');
  url.searchParams.set('dias', String(n));
  location.href = url.toString();
}

export function montarDebug() {
  const tabla = h('table', {});
  const json = h('pre', { class: 'debug-json', hidden: true });

  function pintar() {
    const a = leerAjustes();
    const p = leerProgreso();
    const dia = hoy();
    const faltan = clavesQueFaltan();
    tabla.replaceChildren(
      fila('versión', VERSION),
      fila('datos', `ajustes v${a.v} · progreso v${p.v} · ${almacen.persistente() ? 'disco' : 'memoria'}`),
      fila('idioma', idiomaActual()),
      fila('tema', a.tema),
      fila('acento', `${a.acento} · ${a.velocidad}`),
      ...[...extras].map(([k, v]) => fila(k, v)),
      fila('hoy', `${dia}${diasDeDesplazamiento() ? ` (+${diasDeDesplazamiento()} d)` : ''}`),
      fila('segundos hoy', `${segundosHoy(p, dia)} / ${a.objetivoMin * 60}`),
      fila('racha', `guardada ${p.racha} · visible ${rachaVisible(p, dia)} · último ${p.ultimoDiaCumplido ?? '—'}`),
      fila('faltan en i18n', faltan.length ? faltan.join(', ') : '—'),
    );
    if (!json.hidden) json.textContent = JSON.stringify({ ajustes: a, progreso: p }, null, 2);
  }

  const panel = h('details', { class: 'debug' },
    h('summary', {}, 'debug'),
    tabla,
    h('div', { class: 'debug-botones' },
      h('button', { type: 'button', onclick: () => sumarTiempo(60) }, '+1 min'),
      h('button', { type: 'button', onclick: () => irADia(diasDeDesplazamiento() + 1) }, '+1 día'),
      h('button', { type: 'button', onclick: () => irADia(0) }, 'hoy real'),
      h('button', { type: 'button', onclick: () => { json.hidden = !json.hidden; pintar(); } }, 'ver JSON')),
    json,
  );

  repintarPanel = pintar;
  pintar();
  alCambiarProgreso(pintar);
  alCambiarAjuste(pintar);
  window.addEventListener('hashchange', () => setTimeout(pintar, 50));
  document.body.append(panel);
}
