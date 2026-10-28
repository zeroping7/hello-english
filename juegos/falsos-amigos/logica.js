// Reglas de Falsos amigos (spec 003). Puras: sin DOM.

/** ¿Acierta quien dice que la tarjeta es verdad (true) o falso amigo (false)? */
export function comprobar(tarjeta, diceVerdad) {
  return tarjeta.verdadero === diceVerdad;
}

/** Píxeles que hay que deslizar para que cuente: 25 % del ancho, mínimo 80 (plan §4). */
export function umbralDeslizar(ancho) {
  return Math.max(80, Math.round(ancho * 0.25));
}

/** Qué dice un deslizamiento: true (derecha), false (izquierda) o null (no llega). */
export function leerDeslizamiento(dx, ancho) {
  const umbral = umbralDeslizar(ancho);
  if (dx >= umbral) return true;
  if (dx <= -umbral) return false;
  return null;
}
