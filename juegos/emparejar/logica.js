// Reglas de Emparejar (spec 018). Puras: sin DOM.

export const POR_TABLERO = 5;

/** Reparte los ejercicios en tableros de 5 (el último puede tener menos, pero nunca 1 solo). */
export function tableros(items) {
  const r = [];
  for (let i = 0; i < items.length; i += POR_TABLERO) r.push(items.slice(i, i + POR_TABLERO));
  if (r.length > 1 && r[r.length - 1].length === 1) r[r.length - 2].push(...r.pop());
  return r;
}

/** Estado de un tablero: qué parejas están hechas y qué palabras han tenido algún fallo. */
export function crearTablero(items) {
  return { items, hechas: new Set(), falladas: new Set() };
}

/**
 * Intenta unir la palabra del item a con la definición del item b.
 * @returns {{ bien: boolean, primeraVez: boolean }} primeraVez = sin fallos antes con esa palabra
 */
export function unir(tablero, idPalabra, idDefinicion) {
  if (idPalabra === idDefinicion) {
    tablero.hechas.add(idPalabra);
    return { bien: true, primeraVez: !tablero.falladas.has(idPalabra) };
  }
  tablero.falladas.add(idPalabra);
  return { bien: false, primeraVez: false };
}

export const completo = (tablero) => tablero.hechas.size === tablero.items.length;
