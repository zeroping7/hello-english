// Reglas de Bug report (spec 021). Puras: sin DOM.

/** Campos del informe, en el orden en que se escriben. */
export const CAMPOS = ['titulo', 'pasos', 'esperado', 'actual'];

/** Cuántos campos tienen su texto (colocados: campo → campo del que viene el texto). */
export function corregir(colocados) {
  const bien = CAMPOS.filter((c) => colocados[c] === c);
  return { bien, todo: bien.length === CAMPOS.length };
}
