// Práctica de hoy (spec 024): tres minijuegos elegidos para el día, empezando por el que
// tiene más repasos pendientes. Cada paso se juega con la pantalla común de minijuego.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { navegar } from '../router.js';
import { barraConVolver } from '../ui/barra.js';
import { icono } from '../ui/iconos.js';
import { JUEGOS, buscarJuego, iconoDe } from '../../juegos/registro.js';
import { PREFIJO } from '../contenido/esquema.js';
import { leerProgreso, leerPractica, pendientes } from '../progreso/progreso.js';
import { elegirPractica, siguientePaso } from '../progreso/practica.js';
import { hoy } from '../progreso/reloj.js';
import { hayVoz } from '../voz/voz.js';

/** Minijuegos que se pueden jugar en este dispositivo. */
function disponibles() {
  return JUEGOS
    .filter((j) => j.disponible && (!j.necesita.includes('voz') || hayVoz()))
    .map((j) => ({ id: j.id, categoria: j.categoria, prefijo: PREFIJO[j.id] }));
}

function pendientesPorBanco() {
  const cuenta = {};
  for (const id of pendientes()) {
    const prefijo = id.split('-')[0];
    cuenta[prefijo] = (cuenta[prefijo] ?? 0) + 1;
  }
  return cuenta;
}

/** La práctica de hoy (la crea si aún no existe). La usa también el inicio. */
export function practicaActual() {
  return leerPractica(() => elegirPractica(hoy(), disponibles(), pendientesPorBanco(), leerProgreso().stats.juegos));
}

export function montar(raiz) {
  const practica = practicaActual();
  const siguiente = siguientePaso(practica);
  const repasos = pendientes().length;

  const pasos = practica.juegos.map((id, n) => {
    const juego = buscarJuego(id);
    const hecho = practica.hechos.includes(id);
    return h('li', { class: `paso ${hecho ? 'hecho' : ''} ${id === siguiente ? 'actual' : ''}` },
      h('span', { class: 'paso-numero', 'aria-hidden': 'true' }, hecho ? '✓' : String(n + 1)),
      h('span', { class: `paso-icono cat-${juego.categoria}` }, icono(iconoDe(juego))),
      h('span', { class: 'paso-texto' },
        h('span', { class: 'paso-titulo' }, t(juego.titulo)),
        h('span', { class: 'paso-estado' }, t(hecho ? 'practica.hecho' : 'practica.pendiente'))));
  });

  raiz.append(
    barraConVolver(t('inicio.practica')),
    h('main', { class: 'contenido practica-pantalla' },
      h('p', { class: 'tenue' }, t('practica.texto')),
      repasos > 0 && h('p', { class: 'juego-repasos' }, icono('repaso'),
        repasos === 1 ? t('practica.repasos.uno') : t('practica.repasos.varios', { n: repasos })),
      h('ol', { class: 'pasos' }, pasos),
      siguiente
        ? h('button', { class: 'boton boton-principal boton-grande', type: 'button', onclick: () => navegar(`/juego/${siguiente}/practica`) },
            icono('practica'), t(practica.hechos.length ? 'practica.continuar' : 'practica.empezar'))
        : h('div', { class: 'panel-resultado ok', role: 'status' },
            h('p', { class: 'panel-resultado-titulo' }, `✓ ${t('practica.completada')}`),
            h('p', {}, t('practica.completada.texto'))),
      !siguiente && h('button', { class: 'boton', type: 'button', onclick: () => navegar('/inicio') }, t('juego.alInicio')),
    ),
  );
  return { desmontar() {} };
}
