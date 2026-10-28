// Aleatoriedad con semilla (constitución A6): con la misma semilla sale siempre lo mismo,
// así las pruebas pueden repetir una partida. Generador mulberry32.

/** Devuelve una función que da números en [0, 1). */
export function crearAzar(semilla = Date.now()) {
  let a = semilla >>> 0;
  return function azar() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Copia barajada (Fisher-Yates). No modifica la lista original. */
export function barajar(lista, azar) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
