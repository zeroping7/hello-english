// Ordenar frases (spec 008): se tocan las palabras en orden para formar la frase. Tocar una
// ya puesta la devuelve. Teclado: 1-9 pone la palabra n, Retroceso quita la última, Enter comprueba.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, botonAltavoz } from '../../src/ui/ronda.js';
import { desordenar, comprobar } from './logica.js';

export const BANCO = 'ordenar-frases';
export const EJERCICIOS = 8;

export function montar(raiz, partida) {
  const { azar } = partida;
  return ronda(raiz, partida, (item, { responder, respondida }) => {
    const fichas = desordenar(item.frase, azar);
    const puestas = [];       // ids en orden
    const zonaFrase = h('div', { class: 'of-frase', lang: 'en', 'aria-live': 'polite' });
    const zonaBanco = h('div', { class: 'fichas of-banco', lang: 'en' });
    const comprobarBoton = h('button', { class: 'boton boton-principal', type: 'button', onclick: comprobarAhora, disabled: true }, t('comun.comprobar'));
    const textoDe = (id) => fichas.find((f) => f.id === id).texto;

    function pintar() {
      zonaFrase.replaceChildren(
        ...puestas.map((id, n) => h('button', { class: 'ficha elegida', type: 'button', onclick: () => quitar(n), 'aria-label': t('of.quitar', { palabra: textoDe(id) }) }, textoDe(id))),
        ...(puestas.length ? [] : [h('span', { class: 'tenue' }, t('of.vacia'))]));
      const libres = fichas.filter((f) => !puestas.includes(f.id));
      zonaBanco.replaceChildren(...libres.map((f, n) => h('button', { class: 'ficha', type: 'button', onclick: () => poner(f.id) },
        h('span', { class: 'of-tecla', 'aria-hidden': 'true' }, n < 9 ? String(n + 1) : ''), f.texto)));
      comprobarBoton.disabled = libres.length > 0;
    }

    function poner(id) {
      if (respondida()) return;
      puestas.push(id);
      pintar();
      (zonaBanco.querySelector('button') ?? comprobarBoton).focus({ preventScroll: true });
    }

    function quitar(n) {
      if (respondida()) return;
      puestas.splice(n, 1);
      pintar();
    }

    function comprobarAhora() {
      if (respondida() || puestas.length < fichas.length) return false;
      const acierto = comprobar(item.frase, puestas.map(textoDe));
      zonaFrase.querySelectorAll('button').forEach((b) => { b.disabled = true; b.classList.add(acierto ? 'bien' : 'mal'); });
      comprobarBoton.disabled = true;
      responder(acierto, [
        h('p', { lang: 'en' }, h('strong', {}, item.frase), ' ', botonAltavoz(item.frase)),
        h('p', { class: 'traduccion' }, item.traduccion),
        item.explicacion?.[partida.idioma],
      ]);
      return true;
    }

    function alPulsar(e) {
      if (e.key === 'Backspace' && !respondida() && puestas.length && !e.target.closest('input, textarea')) {
        e.preventDefault();
        quitar(puestas.length - 1);
      }
    }
    document.addEventListener('keydown', alPulsar);
    pintar();

    return {
      nodos: [
        h('p', { class: 'ejercicio-pregunta' }, t('of.instruccion')),
        h('p', { class: 'traduccion of-pista' }, item.traduccion),
        zonaFrase,
        zonaBanco,
        h('div', { class: 'of-acciones' }, comprobarBoton),
      ],
      teclas: {
        alNumero: (n) => {
          const libres = fichas.filter((f) => !puestas.includes(f.id));
          if (!libres[n]) return false;
          poner(libres[n].id);
          return true;
        },
        alEnter: comprobarAhora,
      },
      alMostrar: () => zonaBanco.querySelector('button')?.focus({ preventScroll: true }),
      desmontar: () => document.removeEventListener('keydown', alPulsar),
    };
  });
}
