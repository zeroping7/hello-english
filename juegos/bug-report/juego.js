// Bug report (spec 021): un informe de bug con sus cuatro partes desordenadas; se toca cada
// texto para ponerlo en el siguiente campo vacío y se comprueba. Tocar un campo lo vacía.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda } from '../../src/ui/ronda.js';
import { barajar } from '../../src/contenido/azar.js';
import { CAMPOS, corregir } from './logica.js';

export const BANCO = 'bug-report';
export const EJERCICIOS = 3;

// Nombres de los campos como en GitHub o Jira (en inglés en los dos idiomas)
const NOMBRE = { titulo: 'Title', pasos: 'Steps to reproduce', esperado: 'Expected result', actual: 'Actual result' };

export function montar(raiz, partida) {
  const { azar } = partida;
  return ronda(raiz, partida, (item, { responder, respondida }) => {
    const trozos = barajar(CAMPOS, azar);       // de qué campo es cada texto
    const colocados = {};                        // campo → campo del texto puesto
    const zonaCampos = h('div', { class: 'br-informe', lang: 'en' });
    const zonaTrozos = h('div', { class: 'br-trozos', lang: 'en' });
    const comprobarBoton = h('button', { class: 'boton boton-principal', type: 'button', onclick: comprobar, disabled: true }, t('comun.comprobar'));

    function pintar(resultado = null) {
      zonaCampos.replaceChildren(...CAMPOS.map((c) => {
        const de = colocados[c];
        const marca = resultado ? (resultado.bien.includes(c) ? 'bien' : 'mal') : '';
        return h('div', { class: `br-campo ${marca}` },
          h('span', { class: 'br-nombre' }, NOMBRE[c], h('span', { class: 'br-ayuda', lang: partida.idioma }, ` · ${t(`br.${c}`)}`)),
          de
            ? h('button', { class: 'br-texto', type: 'button', disabled: !!resultado, onclick: () => { delete colocados[c]; pintar(); }, 'aria-label': t('br.quitar', { campo: NOMBRE[c] }) }, item.partes[de])
            : h('span', { class: 'br-hueco' }, t('br.vacio')));
      }));
      const usados = new Set(Object.values(colocados));
      const libres = trozos.filter((c) => !usados.has(c));
      zonaTrozos.replaceChildren(...libres.map((c, n) => h('button', { class: 'ficha br-trozo', type: 'button', disabled: !!resultado, onclick: () => poner(c) },
        h('span', { class: 'of-tecla', 'aria-hidden': 'true' }, String(n + 1)), item.partes[c])));
      comprobarBoton.disabled = !!resultado || libres.length > 0;
      if (!resultado) (zonaTrozos.querySelector('button') ?? comprobarBoton).focus({ preventScroll: true });
    }

    function poner(c) {
      if (respondida()) return;
      const vacio = CAMPOS.find((k) => !colocados[k]);
      if (!vacio) return;
      colocados[vacio] = c;
      pintar();
    }

    function comprobar() {
      if (respondida() || Object.keys(colocados).length < CAMPOS.length) return false;
      const r = corregir(colocados);
      pintar(r);
      comprobarBoton.disabled = true;
      responder(r.todo, [
        !r.todo && h('p', {}, t('br.bien', { n: r.bien.length, total: CAMPOS.length })),
        !r.todo && h('dl', { class: 'br-solucion', lang: 'en' }, CAMPOS.flatMap((c) => [h('dt', {}, NOMBRE[c]), h('dd', {}, item.partes[c])])),
        item.explicacion?.[partida.idioma],
      ]);
      return true;
    }

    pintar();
    return {
      nodos: [h('p', { class: 'ejercicio-pregunta' }, t('br.instruccion')), zonaCampos, zonaTrozos, h('div', { class: 'of-acciones' }, comprobarBoton)],
      teclas: {
        alNumero: (n) => {
          const usados = new Set(Object.values(colocados));
          const libres = trozos.filter((c) => !usados.has(c));
          if (!libres[n]) return false;
          poner(libres[n]);
          return true;
        },
        alEnter: comprobar,
      },
      alMostrar: () => zonaTrozos.querySelector('button')?.focus({ preventScroll: true }),
    };
  });
}
