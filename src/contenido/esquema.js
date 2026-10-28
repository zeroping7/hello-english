// Validación de los bancos de contenido (plan de 001, §3). Devuelve una lista de errores
// legibles; vacía si todo está bien.
import { NIVELES } from './elegir.js';

export const TEMAS = ['programacion', 'web', 'equipo'];

/** Prefijo de los ids de cada banco; el banco de un minijuego se llama como su id. */
export const PREFIJO = {
  'prueba-nivel': 'pn', 'falsos-amigos': 'fa', 'merge-conflict': 'mc',
  'caza-el-bug': 'cb', prompt: 'pr', incidente: 'in', 'ordenar-frases': 'of', ahorcado: 'ah',
  'dictado-codigo': 'dc', 'dilo-bien': 'db', 'daily-standup': 'ds', entrevista: 'et', 'dictado-audio': 'da',
  acronimos: 'ac', 'jerga-dev': 'jd', 'sopa-crucigrama': 'sc', emparejar: 'em', contrarreloj: 'cr',
  'educado-o-borde': 'eb', 'bug-report': 'br',
};

/** Bancos en los que la explicación es opcional: el propio ejercicio ya enseña la respuesta. */
const EXPLICACION_OPCIONAL = new Set([
  'incidente', 'ordenar-frases', 'ahorcado', 'dictado-codigo', 'dictado-audio', 'acronimos',
  'jerga-dev', 'sopa-crucigrama', 'emparejar', 'contrarreloj', 'bug-report',
]);

const texto = (v) => typeof v === 'string' && v.trim().length > 0;
const bilingue = (v) => v && texto(v.es) && texto(v.en);
const textos = (v, n) => Array.isArray(v) && v.length === n && v.every(texto) && new Set(v).size === n;
const soloLetras = (v) => texto(v) && /^[a-z]+$/i.test(v);

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
  'caza-el-bug': (i) => [
    texto(i.texto) && (i.texto.match(/\{[^{}|\s]+\|[^{}|\s]+\}/g) ?? []).length === 1 || 'texto: hace falta un solo {mal|bien} sin espacios',
    texto(i.traduccion) || 'falta traduccion',
  ],
  prompt: (i) => [
    texto(i.enunciado) && i.enunciado.split('___').length === 2 || 'enunciado: hace falta un hueco ___',
    texto(i.respuesta) && !/\s/.test(i.respuesta.trim()) || 'respuesta: una palabra',
    i.aceptadas === undefined || (Array.isArray(i.aceptadas) && i.aceptadas.every(texto)) || 'aceptadas: lista de textos',
    texto(i.traduccion) || 'falta traduccion',
  ],
  incidente: (i) => [
    texto(i.titulo) || 'falta titulo',
    texto(i.causa) || 'falta causa',
    Array.isArray(i.pasos) && i.pasos.length >= 2 || 'pasos: al menos 2',
    ...(i.pasos ?? []).map((paso, n) => (
      Array.isArray(paso.log) && paso.log.length > 0 && paso.log.every(texto)
      && texto(paso.pregunta)
      && Array.isArray(paso.opciones) && paso.opciones.length === 3
      && paso.opciones.every((o) => texto(o.texto) && typeof o.bien === 'boolean' && bilingue(o.nota))
      && paso.opciones.filter((o) => o.bien).length === 1
    ) || `paso ${n + 1}: log, pregunta y 3 opciones (una bien) con nota es/en`),
  ],
  'ordenar-frases': (i) => [
    texto(i.frase) && i.frase.trim().split(/\s+/).length >= 3 || 'frase: al menos 3 palabras',
    texto(i.traduccion) || 'falta traduccion',
  ],
  ahorcado: (i) => [
    soloLetras(i.palabra) && i.palabra.length >= 3 || 'palabra: solo letras, 3 o más',
    texto(i.pista) || 'falta pista',
    texto(i.traduccion) || 'falta traduccion',
  ],
  'dictado-codigo': (i) => [
    texto(i.codigo) || 'falta codigo',
    texto(i.dictado) || 'falta dictado',
  ],
  'dilo-bien': (i) => [
    texto(i.termino) || 'falta termino',
    texto(i.suena) || 'falta suena',
    texto(i.ipa) || 'falta ipa',
    textos(i.otras, 2) && !i.otras.includes(i.suena) || 'otras: 2 pronunciaciones distintas de suena',
    i.aceptadas === undefined || (Array.isArray(i.aceptadas) && i.aceptadas.every(texto)) || 'aceptadas: lista de textos',
  ],
  'daily-standup': (i) => [
    texto(i.quien) || 'falta quien',
    texto(i.audio) || 'falta audio',
    texto(i.pregunta) || 'falta pregunta',
    textos(i.opciones, 3) || 'opciones: 3 textos distintos (la primera, la buena)',
    texto(i.traduccion) || 'falta traduccion',
  ],
  entrevista: (i) => [
    texto(i.audio) || 'falta audio',
    textos(i.opciones, 3) || 'opciones: 3 textos distintos (la primera, la buena)',
    texto(i.traduccion) || 'falta traduccion',
  ],
  'dictado-audio': (i) => [
    texto(i.frase) || 'falta frase',
    texto(i.traduccion) || 'falta traduccion',
  ],
  acronimos: (i) => [
    texto(i.sigla) || 'falta sigla',
    texto(i.significa) || 'falta significa',
    textos(i.otras, 3) && !i.otras.includes(i.significa) || 'otras: 3 significados falsos distintos',
    typeof i.letras === 'boolean' || 'letras: true (se deletrea) o false (se lee como palabra)',
    i.letras || texto(i.suena) || 'suena: cómo se lee si no se deletrea',
    texto(i.traduccion) || 'falta traduccion',
  ],
  'jerga-dev': (i) => [
    texto(i.expresion) || 'falta expresion',
    texto(i.ejemplo) || 'falta ejemplo',
    Array.isArray(i.opciones) && i.opciones.length === 3 && i.opciones.every(bilingue) || 'opciones: 3 con es y en (la primera, la buena)',
  ],
  'sopa-crucigrama': (i) => [
    soloLetras(i.palabra) && i.palabra.length >= 3 && i.palabra.length <= 9 || 'palabra: solo letras, de 3 a 9',
    texto(i.pista) || 'falta pista',
  ],
  emparejar: (i) => [
    texto(i.palabra) || 'falta palabra',
    texto(i.definicion) || 'falta definicion',
  ],
  contrarreloj: (i) => [
    texto(i.en) || 'falta en',
    texto(i.es) || 'falta es',
    texto(i.incorrecta) && i.incorrecta !== i.es || 'incorrecta: distinta de es',
  ],
  'educado-o-borde': (i) => [
    bilingue(i.situacion) || 'situacion necesita es y en',
    textos(i.opciones, 3) || 'opciones: 3 textos distintos (la primera, la buena)',
  ],
  'bug-report': (i) => [
    ['titulo', 'pasos', 'esperado', 'actual'].every((k) => texto(i.partes?.[k])) || 'partes: titulo, pasos, esperado y actual',
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
      bilingue(item.explicacion) || (EXPLICACION_OPCIONAL.has(nombre) && item.explicacion === undefined) || 'explicacion necesita es y en',
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
