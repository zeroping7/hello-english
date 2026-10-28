// ¿Educado o borde? (spec 020): una situación de trabajo y tres mensajes; se elige el que
// tiene el tono adecuado. La explicación del tono se ve siempre.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, preguntaOpciones, botonAltavoz } from '../../src/ui/ronda.js';

export const BANCO = 'educado-o-borde';
export const EJERCICIOS = 6;

export function montar(raiz, partida) {
  const { azar, idioma } = partida;
  return ronda(raiz, partida, (item, { responder }) => {
    const lista = preguntaOpciones(item.opciones, 0, azar, (acierto) => responder(acierto, [
      h('p', { lang: 'en' }, h('strong', {}, item.opciones[0]), ' ', botonAltavoz(item.opciones[0])),
      item.explicacion[idioma],
    ]));

    return {
      nodos: [
        h('p', { class: 'eb-situacion' }, h('span', { class: 'eb-etiqueta' }, t('eb.situacion')), item.situacion[idioma]),
        h('p', { class: 'ejercicio-pregunta' }, t('eb.instruccion')),
        lista.elemento,
      ],
      teclas: { alNumero: (n) => lista.elegir(n) },
      alMostrar: lista.enfocar,
    };
  });
}
