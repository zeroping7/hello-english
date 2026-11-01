// Registro de minijuegos (docs/arquitectura.md §3, docs/vision.md).
// titulo y descripcion son claves de i18n: 'juego.<id>.titulo' y 'juego.<id>.desc'.
// Cada minijuego tiene su icono en src/ui/iconos.js con su mismo id; su banco de contenido
// también se llama como su id (contenido/<id>.json).

/** Orden de las categorías en el inicio; cada una con su icono de src/ui/iconos.js. */
export const CATEGORIAS = [
  { id: 'lectura', icono: 'lectura' },
  { id: 'escucha', icono: 'escucha' },
  { id: 'vocabulario', icono: 'vocabulario' },
  { id: 'profesional', icono: 'profesional' },
];

/**
 * Multiplicador de puntos según cómo se responde (D-023, spec 027 §4):
 * bajo = elegir, tocar o deslizar; medio = ordenar, corregir o escribir;
 * alto = escribir lo que se oye, hablar o leer textos largos.
 */
export const ESFUERZO = { bajo: 1, medio: 1.3, alto: 1.5 };

// necesita: ['voz'] = sin voz en inglés no se puede jugar (la pantalla común lo avisa).
// dificultad: un valor de ESFUERZO. Responder hablando vale siempre ESFUERZO.alto.
function juego(id, categoria, habilidades, { necesita = [], dificultad = ESFUERZO.bajo, disponible = true } = {}) {
  return {
    id,
    titulo: `juego.${id}.titulo`,
    descripcion: `juego.${id}.desc`,
    categoria,
    habilidades,
    icono: id,
    necesita,
    dificultad,
    disponible,
  };
}

export const JUEGOS = [
  // Lectura y gramática
  juego('merge-conflict', 'lectura', ['gramatica', 'lectura']),
  juego('caza-el-bug', 'lectura', ['gramatica', 'lectura'], { dificultad: ESFUERZO.medio }),
  juego('prompt', 'lectura', ['escritura', 'vocabulario'], { dificultad: ESFUERZO.medio }),
  juego('incidente', 'lectura', ['lectura'], { dificultad: ESFUERZO.alto }),
  juego('ordenar-frases', 'lectura', ['gramatica'], { dificultad: ESFUERZO.medio }),
  juego('ahorcado', 'lectura', ['vocabulario', 'escritura'], { dificultad: ESFUERZO.medio }),

  // Escucha y habla
  juego('dictado-codigo', 'escucha', ['escucha', 'escritura'], { necesita: ['voz'], dificultad: ESFUERZO.alto }),
  juego('dilo-bien', 'escucha', ['pronunciacion'], { dificultad: ESFUERZO.alto }),
  juego('daily-standup', 'escucha', ['escucha', 'pronunciacion'], { necesita: ['voz'] }),
  juego('entrevista', 'escucha', ['escucha', 'pronunciacion'], { necesita: ['voz'] }),
  juego('dictado-audio', 'escucha', ['escucha', 'escritura'], { necesita: ['voz'], dificultad: ESFUERZO.alto }),

  // Vocabulario
  juego('falsos-amigos', 'vocabulario', ['vocabulario']),
  juego('acronimos', 'vocabulario', ['vocabulario', 'pronunciacion']),
  juego('jerga-dev', 'vocabulario', ['vocabulario']),
  juego('sopa-crucigrama', 'vocabulario', ['vocabulario', 'escritura'], { dificultad: ESFUERZO.medio }),
  juego('emparejar', 'vocabulario', ['vocabulario']),
  juego('contrarreloj', 'vocabulario', ['vocabulario']),

  // Inglés profesional
  juego('educado-o-borde', 'profesional', ['lectura']),
  juego('bug-report', 'profesional', ['escritura', 'lectura'], { dificultad: ESFUERZO.medio }),
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
