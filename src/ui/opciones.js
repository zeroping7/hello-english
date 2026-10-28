// Grupo de opciones excluyentes con radios nativos (teclado y lector de pantalla gratis, C1 y C3),
// dibujado como botones segmentados.
import { h } from './dom.js';

/**
 * @param {{ nombre: string, leyenda: string, valor: any,
 *           opciones: { valor: any, texto: string, lang?: string }[],
 *           alCambiar: (valor: any) => void }} config
 */
export function grupoOpciones({ nombre, leyenda, valor, opciones, alCambiar }) {
  return h('fieldset', { class: 'opciones' },
    h('legend', { class: 'opciones-leyenda' }, leyenda),
    h('div', { class: 'opciones-lista' },
      opciones.map((o) => h('label', { class: 'opcion', lang: o.lang },
        h('input', {
          type: 'radio',
          name: nombre,
          value: String(o.valor),
          checked: o.valor === valor,
          onchange: () => alCambiar(o.valor),
        }),
        h('span', {}, o.texto),
      )),
    ),
  );
}
