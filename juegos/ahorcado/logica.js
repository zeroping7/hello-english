// Reglas del Ahorcado (spec 009). Puras: sin DOM.

export const FALLOS_MAX = 6;

export function crearEstado(palabra) {
  return { palabra: palabra.toLowerCase(), probadas: [], fallos: 0 };
}

/** Prueba una letra. Una letra ya probada no cuenta otra vez. */
export function probar(estado, letra) {
  const l = letra.toLowerCase();
  if (!/^[a-z]$/.test(l) || estado.probadas.includes(l) || terminado(estado)) return estado;
  return {
    ...estado,
    probadas: [...estado.probadas, l],
    fallos: estado.fallos + (estado.palabra.includes(l) ? 0 : 1),
  };
}

export const ganado = (e) => [...e.palabra].every((l) => e.probadas.includes(l));
export const perdido = (e) => e.fallos >= FALLOS_MAX;
export const terminado = (e) => ganado(e) || perdido(e);

/** La palabra con huecos: 'c_ch_'. */
export const mascara = (e) => [...e.palabra].map((l) => (e.probadas.includes(l) ? l : '_')).join('');
