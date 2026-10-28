// Prompt (spec 006): una terminal con una frase con hueco; se escribe la palabra que falta.
// La traducción va como comentario; Tab (o el botón Pista) completa una letra.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, botonAltavoz } from '../../src/ui/ronda.js';
import { comprobar, pista, partes } from './logica.js';

export const BANCO = 'prompt';
export const EJERCICIOS = 8;

export function montar(raiz, partida) {
  const { idioma } = partida;
  return ronda(raiz, partida, (item, { responder, respondida }) => {
    const { antes, despues } = partes(item.enunciado);
    let pistas = 0;

    const campo = h('input', {
      class: 'pr-campo', type: 'text', lang: 'en', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
      'aria-label': t('pr.campo'), size: Math.max(4, item.respuesta.length + 1),
      onkeydown: (e) => {
        if (e.key === 'Tab' && !e.shiftKey && !respondida()) {
          e.preventDefault();
          darPista();
        }
      },
    });
    const notaPista = h('p', { class: 'nota tenue', 'aria-live': 'polite' });

    function darPista() {
      campo.value = pista(campo.value, item.respuesta);
      pistas++;
      notaPista.textContent = t('pr.letras', { n: item.respuesta.length });
      campo.focus();
    }

    function enviar(e) {
      e.preventDefault();
      if (respondida() || !campo.value.trim()) return;
      const acierto = comprobar(item, campo.value);
      campo.disabled = true;
      botonPista.disabled = true;
      botonEnviar.disabled = true;
      campo.classList.add(acierto ? 'bien' : 'mal');
      const frase = `${antes}${item.respuesta}${despues}`;
      responder(acierto, [
        h('p', { lang: 'en' }, h('strong', {}, frase), ' ', botonAltavoz(frase)),
        !acierto && h('p', {}, t('pr.era', { palabra: item.respuesta })),
        pistas > 0 && h('p', { class: 'tenue' }, t('pr.conPistas', { n: pistas })),
        item.explicacion[idioma],
      ]);
    }

    const botonPista = h('button', { class: 'boton', type: 'button', onclick: darPista }, t('pr.pista'));
    const botonEnviar = h('button', { class: 'boton boton-principal', type: 'submit' }, t('comun.comprobar'));

    return {
      nodos: [
        h('p', { class: 'ejercicio-pregunta' }, t('pr.instruccion')),
        h('form', { class: 'terminal pr-terminal', onsubmit: enviar },
          h('p', { class: 'terminal-linea pr-comentario' }, `# ${item.traduccion}`),
          h('p', { class: 'terminal-linea', lang: 'en' },
            h('span', { class: 'terminal-prompt', 'aria-hidden': 'true' }, '$ '),
            antes, campo, despues),
          h('div', { class: 'pr-botones' }, botonPista, botonEnviar)),
        notaPista,
      ],
      alMostrar: () => campo.focus({ preventScroll: true }),
    };
  });
}
