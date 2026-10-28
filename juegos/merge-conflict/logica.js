// Reglas de Merge Conflict (spec 004). Puras: sin DOM.

/** Coloca la versión correcta arriba o abajo al azar. */
export function prepararConflicto(item, azar) {
  const correctaArriba = azar() < 0.5;
  return {
    arriba: correctaArriba ? item.correcta : item.incorrecta,
    abajo: correctaArriba ? item.incorrecta : item.correcta,
    correcta: correctaArriba ? 'arriba' : 'abajo',
    rama: `feature/${item.tema}-fix`,
  };
}

/** ¿Acierta quien acepta ese lado ('arriba' | 'abajo')? */
export function comprobar(conflicto, lado) {
  return conflicto.correcta === lado;
}
