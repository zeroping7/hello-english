// Registro de minijuegos (docs/arquitectura.md §3, docs/vision.md).
// titulo y descripcion son claves de i18n: 'juego.<id>.titulo' y 'juego.<id>.desc'.
// icono null = se usa el de su categoría hasta que el minijuego tenga el suyo.

/** Orden de las categorías en el inicio; cada una con su icono de src/ui/iconos.js. */
export const CATEGORIAS = [
  { id: 'lectura', icono: 'lectura' },
  { id: 'escucha', icono: 'escucha' },
  { id: 'vocabulario', icono: 'vocabulario' },
  { id: 'profesional', icono: 'profesional' },
];

function juego(id, categoria, habilidades, { necesita = [], dificultad = 1 } = {}) {
  return {
    id,
    titulo: `juego.${id}.titulo`,
    descripcion: `juego.${id}.desc`,
    categoria,
    habilidades,
    icono: null,
    necesita,
    dificultad,
    disponible: false,
  };
}

export const JUEGOS = [
  // Lectura y gramática
  juego('merge-conflict', 'lectura', ['gramatica', 'lectura']),
  juego('caza-el-bug', 'lectura', ['gramatica', 'lectura']),
  juego('prompt', 'lectura', ['escritura', 'vocabulario']),
  juego('incidente', 'lectura', ['lectura'], { dificultad: 1.5 }),
  juego('ordenar-frases', 'lectura', ['gramatica']),
  juego('ahorcado', 'lectura', ['vocabulario', 'escritura']),

  // Escucha y habla
  juego('dictado-codigo', 'escucha', ['escucha', 'escritura'], { necesita: ['voz'], dificultad: 1.5 }),
  juego('dilo-bien', 'escucha', ['pronunciacion'], { necesita: ['voz', 'microfono'], dificultad: 1.5 }),
  juego('daily-standup', 'escucha', ['escucha', 'pronunciacion'], { necesita: ['voz'] }),
  juego('entrevista', 'escucha', ['escucha', 'pronunciacion'], { necesita: ['voz'] }),
  juego('dictado-audio', 'escucha', ['escucha', 'escritura'], { necesita: ['voz'], dificultad: 1.5 }),

  // Vocabulario
  juego('falsos-amigos', 'vocabulario', ['vocabulario']),
  juego('acronimos', 'vocabulario', ['vocabulario', 'pronunciacion'], { necesita: ['voz'] }),
  juego('jerga-dev', 'vocabulario', ['vocabulario']),
  juego('sopa-crucigrama', 'vocabulario', ['vocabulario', 'escritura']),
  juego('emparejar', 'vocabulario', ['vocabulario']),
  juego('contrarreloj', 'vocabulario', ['vocabulario']),

  // Inglés profesional
  juego('educado-o-borde', 'profesional', ['lectura']),
  juego('bug-report', 'profesional', ['escritura', 'lectura']),
];

export function buscarJuego(id) {
  return JUEGOS.find((j) => j.id === id) ?? null;
}

export function juegosDe(categoria) {
  return JUEGOS.filter((j) => j.categoria === categoria);
}

export function iconoDe(juego) {
  return juego.icono ?? CATEGORIAS.find((c) => c.id === juego.categoria).icono;
}
