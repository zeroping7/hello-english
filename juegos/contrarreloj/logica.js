// Reglas de Contrarreloj (spec 019). Puras: sin DOM.

export const SEGUNDOS = 60;

/** Las dos traducciones en orden al azar; correcta = posición de la buena (0 o 1). */
export function prepararPregunta(item, azar) {
  const buenaPrimero = azar() < 0.5;
  return {
    opciones: buenaPrimero ? [item.es, item.incorrecta] : [item.incorrecta, item.es],
    correcta: buenaPrimero ? 0 : 1,
  };
}

/** Segundos que quedan (nunca menos de 0). */
export const quedan = (usados) => Math.max(0, SEGUNDOS - usados);
