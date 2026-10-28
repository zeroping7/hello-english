// Validación de los bancos de contenido (plan de 001, §3). Devuelve una lista de errores
// legibles; vacía si todo está bien.
import { NIVELES } from './elegir.js';

export const TEMAS = ['programacion', 'web', 'equipo'];

const PREFIJO = { 'prueba-nivel': 'pn', 'falsos-amigos': 'fa', 'merge-conflict': 'mc' };

const texto = (v) => typeof v === 'string' && v.trim().length > 0;
const bilingue = (v) => v && texto(v.es) && texto(v.en);

const CAMPOS = {
  'prueba-nivel': (i) => [
    texto(i.enunciado) && i.enunciado.includes('___') || 'enunciado sin hueco ___',
    Array.isArray(i.opciones) && i.opciones.length === 4 && i.opciones.every(texto) || 'opciones: hacen falta 4 textos',
    Array.isArray(i.opciones) && new Set(i.opciones).size === i.opciones.length || 'opciones repetidas',
    Number.isInteger(i.correcta) && i.correcta >= 0 && i.correcta < 4 || 'correcta: índice 0-3',
    texto(i.traduccion) || 'falta traduccion',
  ],
  'falsos-amigos': (i) => [
    texto(i.en) || 'falta en',
    texto(i.es) || 'falta es',
    typeof i.verdadero === 'boolean' || 'verdadero debe ser true o false',
    bilingue(i.significa) || 'significa necesita es y en',
    texto(i.ejemplo) || 'falta ejemplo',
  ],
  'merge-conflict': (i) => [
    texto(i.correcta) || 'falta correcta',
    texto(i.incorrecta) || 'falta incorrecta',
    i.correcta !== i.incorrecta || 'correcta e incorrecta son iguales',
    texto(i.traduccion) || 'falta traduccion',
  ],
};

/**
 * @param {string} nombre banco esperado
 * @param {any} datos contenido del JSON
 * @returns {string[]}
 */
export function validarBanco(nombre, datos) {
  const errores = [];
  if (!datos || datos.banco !== nombre) return [`${nombre}: el campo banco no coincide`];
  if (datos.v !== 1) errores.push(`${nombre}: versión desconocida`);
  if (!Array.isArray(datos.items) || !datos.items.length) return [...errores, `${nombre}: sin items`];

  const vistos = new Set();
  for (const [n, item] of datos.items.entries()) {
    const donde = `${nombre}[${n}] ${item?.id ?? ''}`.trim();
    const comprobaciones = [
      texto(item.id) && item.id.startsWith(`${PREFIJO[nombre]}-`) || `id debe empezar por ${PREFIJO[nombre]}-`,
      !vistos.has(item.id) || 'id repetido',
      NIVELES.includes(item.nivel) || 'nivel no válido',
      TEMAS.includes(item.tema) || 'tema no válido',
      bilingue(item.explicacion) || 'explicacion necesita es y en',
      ...(CAMPOS[nombre]?.(item) ?? ['banco desconocido']),
    ];
    for (const c of comprobaciones) if (c !== true) errores.push(`${donde}: ${c}`);
    vistos.add(item.id);
  }
  return errores;
}

/** Solo los items válidos (los minijuegos ignoran los que estén mal, plan de 001 §6). */
export function itemsValidos(nombre, datos) {
  if (!Array.isArray(datos?.items)) return [];
  return datos.items.filter((item) => validarBanco(nombre, { ...datos, items: [item] }).length === 0);
}
