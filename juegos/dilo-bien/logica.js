// Reglas de Dilo bien (spec 011). Puras: sin DOM.
import { palabras, normalizar } from '../../src/contenido/texto.js';

export const INTENTOS = 2;

/** ¿Alguna de las transcripciones contiene el término (o una forma aceptada)? */
export function reconocido(item, textos) {
  const buscadas = [item.termino, ...(item.aceptadas ?? [])].map(normalizar);
  return textos.some((texto) => {
    const dicho = normalizar(texto);
    const sueltas = palabras(texto);
    return buscadas.some((b) => (b.includes(' ') ? dicho.includes(b) : sueltas.includes(b)));
  });
}

/** Opciones del modo sin micrófono: la buena (índice 0) y las dos que no. */
export const opcionesDe = (item) => [item.suena, ...item.otras];
