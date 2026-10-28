// Reglas de Prompt (spec 006). Puras: sin DOM.
import { normalizar } from '../../src/contenido/texto.js';

/** ¿Lo escrito es la respuesta (o una de las aceptadas)? Sin contar mayúsculas ni espacios. */
export function comprobar(item, escrito) {
  const dicho = normalizar(escrito);
  return [item.respuesta, ...(item.aceptadas ?? [])].some((r) => normalizar(r) === dicho);
}

/** Pista (Tab): lo escrito que ya va bien más la letra siguiente de la respuesta. */
export function pista(escrito, respuesta) {
  let bien = 0;
  const a = escrito.toLowerCase();
  const b = respuesta.toLowerCase();
  while (bien < a.length && bien < b.length && a[bien] === b[bien]) bien++;
  return respuesta.slice(0, Math.min(bien + 1, respuesta.length));
}

/** Partes del enunciado alrededor del hueco. */
export function partes(enunciado) {
  const [antes, despues = ''] = enunciado.split('___');
  return { antes, despues };
}
