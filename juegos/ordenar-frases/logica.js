// Reglas de Ordenar frases (spec 008). Puras: sin DOM.
import { barajar } from '../../src/contenido/azar.js';

export const trocear = (frase) => frase.trim().split(/\s+/);

/** Las palabras desordenadas (nunca en el orden bueno si hay otra forma de ponerlas). */
export function desordenar(frase, azar) {
  const palabras = trocear(frase).map((texto, id) => ({ id, texto }));
  const distintas = new Set(palabras.map((p) => p.texto)).size > 1;
  let r = barajar(palabras, azar);
  for (let intento = 0; distintas && intento < 10 && r.map((p) => p.texto).join(' ') === frase.trim(); intento++) {
    r = barajar(palabras, azar);
  }
  return r;
}

/** ¿Las palabras elegidas forman la frase? Palabras repetidas valen en cualquier orden. */
export function comprobar(frase, elegidas) {
  return elegidas.join(' ') === trocear(frase).join(' ');
}
