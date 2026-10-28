// Acrónimos (spec 015): qué significa una sigla y cómo se dice (letra a letra o como palabra).
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, preguntaOpciones, botonAltavoz } from '../../src/ui/ronda.js';

export const BANCO = 'acronimos';
export const EJERCICIOS = 8;

const letrasDe = (sigla) => [...sigla].filter((c) => /[a-z]/i.test(c));

/** Lo que lee la voz: las letras separadas si se deletrea. */
export const comoSeLee = (item) => (item.letras ? letrasDe(item.sigla).join(' ') : item.sigla);

export function montar(raiz, partida) {
  const { azar } = partida;
  return ronda(raiz, partida, (item, { responder }) => {
    const lista = preguntaOpciones([item.significa, ...item.otras], 0, azar, (acierto) => responder(acierto, [
      h('p', { lang: 'en' }, h('strong', {}, item.sigla), ' = ', item.significa),
      h('p', { class: 'traduccion' }, item.traduccion),
      h('p', {}, item.letras
        ? t('ac.deletrea', { letras: letrasDe(item.sigla).join('-') })
        : t('ac.palabra', { suena: item.suena }), ' ', botonAltavoz(comoSeLee(item))),
      item.explicacion?.[partida.idioma],
    ]));

    return {
      nodos: [
        h('p', { class: 'ejercicio-pregunta' }, t('ac.instruccion')),
        h('p', { class: 'ac-sigla', lang: 'en' }, item.sigla),
        lista.elemento,
      ],
      teclas: { alNumero: (n) => lista.elegir(n) },
      alMostrar: lista.enfocar,
    };
  });
}
