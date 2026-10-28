// Jerga dev (spec 016): expresiones de programadores (rubber duck, yak shaving...) con un
// ejemplo de uso; se elige qué significan.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, preguntaOpciones, botonAltavoz } from '../../src/ui/ronda.js';

export const BANCO = 'jerga-dev';
export const EJERCICIOS = 6;

export function montar(raiz, partida) {
  const { azar, idioma } = partida;
  return ronda(raiz, partida, (item, { responder }) => {
    const textos = item.opciones.map((o) => o[idioma] ?? o.es);
    const lista = preguntaOpciones(textos, 0, azar, (acierto) => responder(acierto, [
      h('p', {}, h('strong', { lang: 'en' }, item.expresion), ' → ', textos[0]),
      item.explicacion?.[idioma],
    ]), { lang: idioma });

    return {
      nodos: [
        h('p', { class: 'ejercicio-pregunta' }, t('jd.instruccion')),
        h('p', { class: 'jd-expresion', lang: 'en' }, item.expresion, ' ', botonAltavoz(item.expresion)),
        h('blockquote', { class: 'jd-ejemplo', lang: 'en' }, `“${item.ejemplo}”`, ' ', botonAltavoz(item.ejemplo, t('fa.escucharEjemplo'))),
        lista.elemento,
      ],
      teclas: { alNumero: (n) => lista.elegir(n) },
      alMostrar: lista.enfocar,
    };
  });
}
