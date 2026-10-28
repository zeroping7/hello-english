// Piezas comunes de los ejercicios (prueba de nivel y minijuegos): contador, opciones,
// panel de acierto o fallo, resumen final y teclas.
import { h } from './dom.js';
import { t } from '../i18n/textos.js';

/** "3 de 10" con una barra fina de avance. */
export function contador(n, total) {
  return h('div', { class: 'contador' },
    h('span', { class: 'contador-texto' }, t('ejercicio.contador', { n, total })),
    h('progress', { class: 'contador-barra', max: total, value: n - 1, 'aria-hidden': 'true' }));
}

/**
 * Botones de opción numerados. marcar() enseña la elegida y la correcta y los desactiva.
 * @param {string[]} textos
 * @param {(indice: number) => void} alElegir
 */
export function opciones(textos, alElegir) {
  const botones = textos.map((texto, i) =>
    h('button', { class: 'opcion-respuesta', type: 'button', lang: 'en', onclick: () => alElegir(i) },
      h('span', { class: 'opcion-tecla', 'aria-hidden': 'true' }, String(i + 1)),
      h('span', { class: 'opcion-texto' }, texto),
      h('span', { class: 'opcion-marca', 'aria-hidden': 'true' })));

  return {
    elemento: h('div', { class: 'opciones-respuesta' }, botones),
    marcar(elegida, correcta) {
      botones.forEach((b, i) => {
        b.disabled = true;
        if (i === correcta) {
          b.classList.add('es-correcta');
          b.querySelector('.opcion-marca').textContent = '✓';
        } else if (i === elegida) {
          b.classList.add('es-incorrecta');
          b.querySelector('.opcion-marca').textContent = '✗';
        }
      });
    },
  };
}

/**
 * Panel tras responder: ✓ o ✗ con texto (constitución C4) y líneas de explicación.
 * @param {{ acierto: boolean, lineas?: (string|Node|null)[] }} opciones
 */
export function panelResultado({ acierto, lineas = [] }) {
  return h('div', { class: `panel-resultado ${acierto ? 'ok' : 'mal'}`, role: 'status' },
    h('p', { class: 'panel-resultado-titulo' },
      h('span', { 'aria-hidden': 'true' }, acierto ? '✓ ' : '✗ '),
      t(acierto ? 'ejercicio.correcto' : 'ejercicio.incorrecto')),
    lineas.filter(Boolean).map((l) => (l instanceof Node ? l : h('p', {}, l))));
}

/** Pantalla final de una partida. */
export function resumen({ titulo, aciertos, total, puntos = null, botones = [] }) {
  return h('section', { class: 'resumen-final', role: 'status' },
    h('h2', { class: 'resumen-final-titulo' }, titulo),
    h('p', { class: 'resumen-final-dato' }, t('ejercicio.aciertos', { n: aciertos, total })),
    puntos !== null && h('p', { class: 'resumen-final-dato puntos' }, t('ejercicio.puntos', { n: puntos })),
    h('div', { class: 'resumen-final-botones' }, botones));
}

/**
 * Teclas de los ejercicios: 1-9 eligen opción, Enter sigue, flechas para respuestas de dos lados.
 * Devuelve la función que las quita.
 */
export function teclas({ alNumero, alEnter, alIzquierda, alDerecha, alArriba, alAbajo }) {
  function alPulsar(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.('input, textarea, dialog')) return;
    let accion = null;
    if (/^[1-9]$/.test(e.key)) accion = alNumero && (() => alNumero(Number(e.key) - 1));
    else if (e.key === 'Enter' && !e.target.closest?.('button, a')) accion = alEnter;
    else accion = { ArrowLeft: alIzquierda, ArrowRight: alDerecha, ArrowUp: alArriba, ArrowDown: alAbajo }[e.key];
    // Si la acción devuelve false (p. ej. ya respondida), la tecla hace lo de siempre (scroll)
    if (accion && accion() !== false) e.preventDefault();
  }
  document.addEventListener('keydown', alPulsar);
  return () => document.removeEventListener('keydown', alPulsar);
}

/** Un enunciado con '___' convertido en un hueco visible; con relleno, se ve la respuesta. */
export function frase(enunciado, relleno = null) {
  const [antes, despues = ''] = enunciado.split('___');
  return h('p', { class: 'frase', lang: 'en' },
    antes,
    h('span', { class: relleno ? 'hueco lleno' : 'hueco' }, relleno ?? '_____'),
    despues);
}
