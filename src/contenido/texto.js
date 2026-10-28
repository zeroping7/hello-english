// Comparar lo que escribe o dice el usuario con lo esperado. Puras: sin DOM.

/** Minúsculas, apóstrofos y comillas unificados, sin puntuación de frase y espacios simples. */
export function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.,;:!?¡¿"()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const palabras = (texto) => normalizar(texto).split(' ').filter(Boolean);

/** ¿Dice lo mismo (sin contar mayúsculas, puntuación ni espacios de más)? */
export function mismaFrase(a, b) {
  return normalizar(a) === normalizar(b);
}

/** Parecido entre dos frases, de 0 a 1, por las palabras que comparten. */
export function parecido(a, b) {
  const pa = new Set(palabras(a));
  const pb = new Set(palabras(b));
  if (!pa.size || !pb.size) return 0;
  let comunes = 0;
  for (const p of pa) if (pb.has(p)) comunes++;
  return comunes / Math.max(pa.size, pb.size);
}

/**
 * La opción que más se parece a lo que se ha reconocido (varias alternativas).
 * @returns {number} índice, o -1 si ninguna se parece lo bastante
 */
export function masParecida(textos, opciones, minimo = 0.34) {
  let mejor = -1;
  let puntos = 0;
  for (const texto of textos) {
    opciones.forEach((op, i) => {
      const p = parecido(texto, op);
      if (p >= minimo && p > puntos) { mejor = i; puntos = p; }
    });
  }
  return mejor;
}

/**
 * Compara palabra a palabra lo escrito con lo esperado.
 * @returns {{ palabra: string, bien: boolean }[]} las palabras esperadas, marcando las que faltan o están mal
 */
export function compararPalabras(escrito, esperado) {
  const dichas = palabras(escrito);
  const buscadas = palabras(esperado);
  // Subsecuencia común más larga: así una palabra de más o de menos no estropea el resto
  const m = buscadas.length;
  const n = dichas.length;
  const tabla = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let a = m - 1; a >= 0; a--) {
    for (let b = n - 1; b >= 0; b--) {
      tabla[a][b] = buscadas[a] === dichas[b] ? tabla[a + 1][b + 1] + 1 : Math.max(tabla[a + 1][b], tabla[a][b + 1]);
    }
  }
  const resultado = [];
  let a = 0;
  let b = 0;
  while (a < m) {
    if (b < n && buscadas[a] === dichas[b]) { resultado.push({ palabra: buscadas[a], bien: true }); a++; b++; }
    else if (b < n && tabla[a][b + 1] >= tabla[a + 1][b]) b++;
    else { resultado.push({ palabra: buscadas[a], bien: false }); a++; }
  }
  return resultado;
}
