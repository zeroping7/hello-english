// Caza el bug (spec 005): un email, un commit o un mensaje con un error; se toca la palabra
// que está mal y se ve corregida.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, botonAltavoz } from '../../src/ui/ronda.js';
import { prepararTexto, corregido, comprobar } from './logica.js';

export const BANCO = 'caza-el-bug';
export const EJERCICIOS = 8;

// Cabecera del texto según de dónde viene (como se vería en esa herramienta)
const CABECERA = { email: 'From: alex@company.com', commit: '$ git commit -m', slack: '#dev-team', docs: 'README.md', ticket: 'JIRA-142' };

export function montar(raiz, partida) {
  const { idioma } = partida;
  return ronda(raiz, partida, (item, { responder }) => {
    const palabras = prepararTexto(item.texto);
    const botones = palabras.map((p, i) => h('button', {
      class: 'cb-palabra', type: 'button', onclick: () => tocar(i),
    }, p.mal));

    function tocar(i) {
      const acierto = comprobar(palabras, i);
      botones.forEach((b, k) => {
        b.disabled = true;
        if (palabras[k].bug) {
          b.classList.add('bien');
          b.replaceChildren(h('del', {}, palabras[k].mal), ' ', h('ins', {}, palabras[k].bien));
        } else if (k === i) {
          b.classList.add('mal');
        }
      });
      const bien = corregido(palabras);
      responder(acierto, [
        h('p', { lang: 'en' }, h('strong', {}, bien), ' ', botonAltavoz(bien)),
        h('p', { class: 'traduccion' }, item.traduccion),
        item.explicacion[idioma],
      ]);
    }

    return {
      nodos: [
        h('p', { class: 'ejercicio-pregunta' }, t('cb.instruccion')),
        h('div', { class: 'cb-texto', lang: 'en' },
          h('p', { class: 'cb-cabecera' }, CABECERA[item.formato] ?? CABECERA.slack),
          h('p', { class: 'cb-palabras' }, botones)),
      ],
      alMostrar: () => botones[0]?.focus({ preventScroll: true }),
    };
  });
}
