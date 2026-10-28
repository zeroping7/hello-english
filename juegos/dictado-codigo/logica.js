// Reglas de Dictado de código (spec 010). Puras: sin DOM.

/** Cómo se dicen los símbolos en inglés (británico / americano cuando cambia). */
export const SIMBOLOS = {
  '.': 'dot',
  ',': 'comma',
  ';': 'semicolon',
  ':': 'colon',
  '(': 'open bracket (UK) / open parenthesis (US)',
  ')': 'close bracket (UK) / close parenthesis (US)',
  '[': 'open square bracket',
  ']': 'close square bracket',
  '{': 'open curly brace',
  '}': 'close curly brace',
  '<': 'less than',
  '>': 'greater than',
  '=': 'equals',
  '!': 'exclamation mark (UK) / exclamation point (US), also "bang" or "not"',
  '"': 'double quote',
  "'": 'single quote',
  '`': 'backtick',
  '_': 'underscore',
  '-': 'minus / hyphen / dash',
  '+': 'plus',
  '*': 'asterisk (or "star")',
  '/': 'slash (forward slash)',
  '\\': 'backslash',
  '#': 'hash (UK) / pound sign (US)',
  '@': 'at',
  '&': 'ampersand',
  '|': 'pipe',
  '%': 'percent',
  '$': 'dollar sign',
  '^': 'caret',
  '~': 'tilde',
  '?': 'question mark',
};

/** Sin espacios y con las comillas unificadas: así no importa cómo se separe. */
export const normalizarCodigo = (c) => String(c).replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/["'`]/g, '"').replace(/\s+/g, '');

export const comprobar = (escrito, codigo) => normalizarCodigo(escrito) === normalizarCodigo(codigo);

/** Los símbolos que aparecen en el código, en orden de aparición y sin repetir. */
export function simbolosDe(codigo) {
  return [...new Set([...codigo].filter((c) => c in SIMBOLOS))].map((s) => ({ simbolo: s, nombre: SIMBOLOS[s] }));
}
