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
  logros: ['M8 4h8v5a4 4 0 0 1-8 0z', 'M8 6H5a3 3 0 0 0 3 4', 'M16 6h3a3 3 0 0 1-3 4', 'M12 13v4', 'M8 20h8', 'M10 17h4'],
  repaso: ['M20 12a8 8 0 1 1-2.3-5.7', 'M20 4v4h-4'],
  microfono: ['M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0z', 'M5 11a7 7 0 0 0 14 0', 'M12 18v3'],
  texto: ['M5 6h14', 'M5 12h14', 'M5 18h9'],
  // Minijuegos
  'merge-conflict': [{ circulo: [6, 5, 2] }, { circulo: [6, 19, 2] }, { circulo: [18, 12, 2] }, 'M6 7v10', 'M6 9c0 2 2 3 4 3h6'],
  'caza-el-bug': ['M8 11a4 4 0 0 1 8 0v3a4 4 0 0 1-8 0z', 'M12 11v7', 'M4 13h4', 'M16 13h4', 'M5 8l3 2', 'M19 8l-3 2', 'M5 19l3-2', 'M19 19l-3-2', 'M10 7L9 4', 'M14 7l1-3'],
  prompt: ['M3 5h18v14H3z', 'M7 10l3 2-3 2', 'M12 15h5'],
  incidente: ['M12 4l9 16H3z', 'M12 10v4', 'M12 17v.01'],
  'ordenar-frases': ['M4 6h6', 'M4 12h11', 'M4 18h16'],
  ahorcado: ['M4 21h9', 'M7 21V3h9v3', { circulo: [16, 8.5, 2.5] }, 'M16 11v5', 'M14 13.5h4', 'M16 16l-2 3', 'M16 16l2 3'],
  'dictado-codigo': ['M8 7l-5 5 5 5', 'M16 7l5 5-5 5', 'M13.5 5l-3 14'],
  'dilo-bien': ['M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0z', 'M5 11a7 7 0 0 0 14 0', 'M12 18v3'],
  'daily-standup': [{ circulo: [8, 8, 3] }, { circulo: [17, 9, 2.5] }, 'M2 20c0-4 2.7-6 6-6s6 2 6 6', 'M15 15c3 0 6 2 6 5'],
  entrevista: ['M4 5h16v11H10l-5 4v-4H4z', 'M8 9h8', 'M8 12h5'],
  'dictado-audio': ['M4 9h4l5-4v14l-5-4H4z', 'M16 9a4 4 0 0 1 0 6', 'M19 6a8 8 0 0 1 0 12'],
  'falsos-amigos': ['M5 9h14', 'M5 15h14', 'M16 4L8 20'],
  acronimos: ['M3 12l9-9h8v8l-9 9z', { circulo: [16, 8, 1.5] }],
  'jerga-dev': ['M4 5h16v11H10l-5 4v-4H4z', 'M9 9v3', 'M14 9v3'],
  'sopa-crucigrama': ['M4 4h16v16H4z', 'M4 9.3h16', 'M4 14.6h16', 'M9.3 4v16', 'M14.6 4v16'],
  emparejar: ['M10 14a4 4 0 0 1 0-5.6l2.5-2.5a4 4 0 0 1 5.6 5.6l-1.2 1.2', 'M14 10a4 4 0 0 1 0 5.6l-2.5 2.5a4 4 0 0 1-5.6-5.6l1.2-1.2'],
  contrarreloj: [{ circulo: [12, 13, 8] }, 'M12 13V9', 'M10 2h4', 'M12 2v3'],
  'educado-o-borde': [{ circulo: [12, 12, 9] }, 'M8.5 14.5a4.5 4.5 0 0 0 7 0', 'M9 9.5v.01', 'M15 9.5v.01'],
  'bug-report': ['M8 3h8v4H8z', 'M8 5H5v16h14V5h-3', 'M9 11h6', 'M9 15h4'],
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
