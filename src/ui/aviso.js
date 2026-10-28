// Avisos: breves (desaparecen solos) en una zona aria-live común, o fijos dentro de una pantalla.
import { h } from './dom.js';

let zona = null;

function zonaDeAvisos() {
  if (!zona || !zona.isConnected) {
    zona = h('div', { class: 'avisos', role: 'status', 'aria-live': 'polite' });
    document.body.append(zona);
  }
  return zona;
}

/**
 * Aviso breve abajo de la pantalla.
 * @param {string} texto
 * @param {{ tipo?: 'info'|'exito'|'error', duracion?: number }} opciones
 */
export function avisar(texto, { tipo = 'info', duracion = 4000 } = {}) {
  const aviso = h('p', { class: `aviso aviso-${tipo}` }, texto);
  zonaDeAvisos().append(aviso);
  setTimeout(() => aviso.remove(), duracion);
  return aviso;
}

/** Aviso que se queda en la pantalla (p. ej. "no se puede guardar tu progreso"). */
export function avisoFijo(texto, { tipo = 'info' } = {}) {
  return h('p', { class: `aviso aviso-fijo aviso-${tipo}`, role: 'status' },
    h('span', { class: 'aviso-icono', 'aria-hidden': 'true' }, tipo === 'error' ? '!' : 'i'),
    h('span', {}, texto));
}
