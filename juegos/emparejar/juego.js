// Emparejar (spec 018): tableros de 5 palabras y 5 definiciones (o dibujos); se toca una
// palabra y luego su definición. Cuenta como acierto la pareja hecha sin fallos antes.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { panelResultado } from '../../src/ui/ejercicio.js';
import { barajar } from '../../src/contenido/azar.js';
import { efecto } from '../../src/sonido/sonido.js';
import { tableros, crearTablero, unir, completo } from './logica.js';

export const BANCO = 'emparejar';
export const EJERCICIOS = 10;

export function montar(raiz, { ejercicios, azar, ponerContador, alResponder, alTerminar }) {
  const lista = tableros(ejercicios);
  let n = 0;

  function pintarTablero() {
    const tablero = crearTablero(lista[n]);
    ponerContador(n + 1, lista.length);
    let elegida = null;     // { lado, id, boton }
    const estado = h('p', { class: 'nota', 'aria-live': 'polite' });
    const zona = h('div', { class: 'zona-resultado' });

    const boton = (lado, item, contenido, lang) => h('button', {
      class: `ficha em-${lado}`, type: 'button', lang, 'data-id': item.id,
      onclick: (e) => tocar(lado, item, e.currentTarget),
    }, contenido);

    const palabras = barajar(tablero.items, azar).map((i) => boton('palabra', i, i.palabra, 'en'));
    const definiciones = barajar(tablero.items, azar).map((i) => boton('definicion', i,
      i.emoji ? h('span', { class: 'em-dibujo', role: 'img', 'aria-label': i.definicion }, i.emoji) : i.definicion, 'en'));

    function tocar(lado, item, b) {
      if (b.disabled) return;
      if (!elegida || elegida.lado === lado) {
        elegida?.boton.classList.remove('elegida');
        elegida = { lado, item, boton: b };
        b.classList.add('elegida');
        return;
      }
      const [p, d] = lado === 'palabra' ? [{ item, b }, { item: elegida.item, b: elegida.boton }] : [{ item: elegida.item, b: elegida.boton }, { item, b }];
      elegida.boton.classList.remove('elegida');
      elegida = null;
      const r = unir(tablero, p.item.id, d.item.id);
      if (r.bien) {
        for (const x of [p.b, d.b]) { x.disabled = true; x.classList.add('bien'); }
        estado.textContent = t('em.bien', { palabra: p.item.palabra });
        alResponder(p.item, r.primeraVez, { sonido: false });
        efecto('acierto');
        if (completo(tablero)) cerrar();
      } else {
        estado.textContent = t('em.mal');
        efecto('fallo');
        for (const x of [p.b, d.b]) {
          x.classList.add('mal');
          setTimeout(() => x.classList.remove('mal'), 600);
        }
      }
    }

    function cerrar() {
      const ultimo = n === lista.length - 1;
      const sinFallos = tablero.falladas.size === 0;
      const seguir = h('button', { class: 'boton boton-principal', type: 'button', onclick: () => {
        n++;
        if (n < lista.length) pintarTablero();
        else alTerminar();
      } }, t(ultimo ? 'juego.verResumen' : 'comun.siguiente'));
      zona.replaceChildren(panelResultado({
        acierto: sinFallos,
        lineas: [
          h('p', {}, t('em.tableroHecho')),
          h('ul', { class: 'em-repaso', lang: 'en' }, tablero.items.map((i) => h('li', {},
            h('strong', {}, i.palabra), ' — ', i.definicion, tablero.falladas.has(i.id) ? ' ✗' : ''))),
        ],
      }), seguir);
      seguir.focus({ preventScroll: true });
    }

    raiz.replaceChildren(
      h('p', { class: 'ejercicio-pregunta' }, t('em.instruccion')),
      h('div', { class: 'em-columnas' },
        h('div', { class: 'em-columna' }, palabras),
        h('div', { class: 'em-columna' }, definiciones)),
      estado,
      zona);
    palabras[0]?.focus({ preventScroll: true });
  }

  pintarTablero();
  return { desmontar() {} };
}
