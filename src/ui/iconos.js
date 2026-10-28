// Iconos de interfaz propios (constitución E4): trazos sobre una rejilla de 24×24 que
// toman el color del texto (currentColor). Son decorativos: el texto o aria-label va aparte.

const SVG = 'http://www.w3.org/2000/svg';

const TRAZOS = {
  atras: ['M19 12H5', 'M11 6l-6 6 6 6'],
  ajustes: ['M4 6h9', 'M17 6h3', 'M4 12h3', 'M11 12h9', 'M4 18h11', 'M19 18h1',
    { circulo: [15, 6, 2] }, { circulo: [9, 12, 2] }, { circulo: [17, 18, 2] }],
  practica: ['M8 5l11 7-11 7z'],
  racha: ['M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z'],
  puntos: ['M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6l-5.4 2.9 1.2-6-4.5-4.2 6.1-.7z'],
  objetivo: ['M12 7v5l3 2', { circulo: [12, 12, 9] }],
  nivel: ['M5 20v-5', 'M12 20V10', 'M19 20V4'],
  lectura: ['M6 3h9l4 4v14H6z', 'M15 3v4h4', 'M9 12h7', 'M9 16h7'],
  escucha: ['M4 15v-3a8 8 0 0 1 16 0v3', 'M4 15h3v5H4z', 'M17 15h3v5h-3z'],
  vocabulario: [
    'M9 4C7 4 6 5 6 7v2c0 1.5-1 3-2.5 3C5 12 6 13.5 6 15v2c0 2 1 3 3 3',
    'M15 4c2 0 3 1 3 3v2c0 1.5 1 3 2.5 3-1.5 0-2.5 1.5-2.5 3v2c0 2-1 3-3 3',
  ],
  profesional: ['M4 8h16v11H4z', 'M9 8V5h6v3', 'M4 13h16'],
};

/** Devuelve un <svg> con el icono pedido. */
export function icono(nombre, { clase = 'icono' } = {}) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', clase);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  for (const trazo of TRAZOS[nombre] ?? []) {
    let el;
    if (typeof trazo === 'string') {
      el = document.createElementNS(SVG, 'path');
      el.setAttribute('d', trazo);
    } else {
      const [cx, cy, r] = trazo.circulo;
      el = document.createElementNS(SVG, 'circle');
      el.setAttribute('cx', cx);
      el.setAttribute('cy', cy);
      el.setAttribute('r', r);
    }
    svg.append(el);
  }
  return svg;
}
