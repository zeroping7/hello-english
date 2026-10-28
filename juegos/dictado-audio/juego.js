// Dictado (spec 014): se oye una frase y se escribe. Se compara palabra a palabra, sin
// contar mayúsculas ni puntuación.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, botonesEscucha, formularioRespuesta } from '../../src/ui/ronda.js';
import { hablar } from '../../src/voz/voz.js';
import { compararPalabras } from '../../src/contenido/texto.js';

export const BANCO = 'dictado-audio';
export const EJERCICIOS = 6;

export function montar(raiz, partida) {
  return ronda(raiz, partida, (item, { responder }) => {
    const formulario = formularioRespuesta({
      etiqueta: t('da.campo'),
      mono: false,
      alEnviar(escrito) {
        const comparacion = compararPalabras(escrito, item.frase);
        const acierto = comparacion.every((p) => p.bien) && comparacion.length > 0;
        formulario.cerrar(acierto);
        const fallos = comparacion.filter((p) => !p.bien).length;
        responder(acierto, [
          h('p', { lang: 'en' }, h('strong', {}, item.frase)),
          !acierto && h('p', { class: 'comparacion', lang: 'en' },
            comparacion.flatMap((p) => [h('span', { class: p.bien ? 'bien' : 'mal' }, p.palabra), ' '])),
          !acierto && h('p', { class: 'tenue' }, t('da.fallos', { n: fallos })),
          h('p', { class: 'traduccion' }, item.traduccion),
          item.explicacion?.[partida.idioma],
        ]);
      },
    });

    return {
      nodos: [
        h('p', { class: 'ejercicio-pregunta' }, t('da.instruccion')),
        botonesEscucha(item.frase),
        formulario.form,
      ],
      alMostrar: () => {
        formulario.campo.focus({ preventScroll: true });
        hablar(item.frase);
      },
    };
  });
}
