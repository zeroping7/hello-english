// Reglas de Incidente en producción (spec 007). Puras: sin DOM.

/** Tipo de una línea del log para darle color: error, aviso, info o mensaje de alguien. */
export function tipoDeLinea(linea) {
  if (/^@[\w.-]+:/.test(linea)) return 'mensaje';
  if (/\b(ERROR|FATAL|CRITICAL)\b/.test(linea)) return 'error';
  if (/\bWARN(ING)?\b/.test(linea)) return 'aviso';
  return 'info';
}

/** Final de la historia según las decisiones acertadas: 'bien' (todas), 'regular' (la mitad o más) o 'mal'. */
export function final(aciertos, total) {
  if (aciertos === total) return 'bien';
  if (aciertos * 2 >= total) return 'regular';
  return 'mal';
}
