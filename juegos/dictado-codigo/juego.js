// Dictado de código (spec 010): se oye una línea de código leída en inglés y se escribe.
// Al responder, se enseña cómo se dice cada símbolo.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, botonesEscucha, formularioRespuesta } from '../../src/ui/ronda.js';
import { hablar } from '../../src/voz/voz.js';
import { comprobar, simbolosDe } from './logica.js';

export const BANCO = 'dictado-codigo';
export const EJERCICIOS = 5;

export function montar(raiz, partida) {
  return ronda(raiz, partida, (item, { responder }) => {
    const texto = h('p', { class: 'terminal-linea tenue', lang: 'en', hidden: true }, `"${item.dictado}"`);
    const verTexto = h('button', { class: 'boton-enlace', type: 'button', onclick: () => { texto.hidden = false; verTexto.remove(); } }, t('voz.verTexto'));

    const formulario = formularioRespuesta({
      etiqueta: t('dc.campo'),
      alEnviar(escrito) {
        const acierto = comprobar(escrito, item.codigo);
        formulario.cerrar(acierto);
        texto.hidden = false;
        verTexto.remove();
        const simbolos = simbolosDe(item.codigo);
        responder(acierto, [
          h('pre', { class: 'terminal dc-codigo' }, h('code', {}, item.codigo)),
          !acierto && h('p', {}, t('dc.escribiste'), ' ', h('code', { class: 'dc-tuyo' }, escrito)),
          simbolos.length > 0 && h('table', { class: 'dc-simbolos' },
            h('caption', {}, t('dc.simbolos')),
            simbolos.map((s) => h('tr', {}, h('th', { scope: 'row' }, h('code', {}, s.simbolo)), h('td', { lang: 'en' }, s.nombre)))),
          item.explicacion?.[partida.idioma],
        ]);
      },
    });

    return {
      nodos: [
        h('p', { class: 'ejercicio-pregunta' }, t('dc.instruccion')),
        botonesEscucha(item.dictado),
        h('div', { class: 'terminal' }, texto, verTexto),
        formulario.form,
      ],
      alMostrar: () => {
        formulario.campo.focus({ preventScroll: true });
        hablar(item.dictado);
      },
    };
  });
}
