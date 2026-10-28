// Textos de interfaz (constitución A3, D-009).
// Las claves son planas ('comun.volver') y las variables van entre llaves: 'Versión {v}'.
// Si una clave falta en el idioma activo se usa la española y se anota para ?debug=1.

const IDIOMAS = ['es', 'en'];
const BASE = 'es';

let actual = BASE;
let textos = {};
let base = {};
const faltan = new Set();

async function leer(id) {
  // no-cache: GitHub Pages deja guardar 10 min y mezclaría textos viejos con código nuevo
  const respuesta = await fetch(new URL(`./${id}.json`, import.meta.url), { cache: 'no-cache' });
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${id}.json (${respuesta.status})`);
  return respuesta.json();
}

/** Carga los textos de un idioma ('es' | 'en') y lo deja activo. */
export async function cargarIdioma(id) {
  if (!IDIOMAS.includes(id)) id = BASE;
  const [deBase, delIdioma] = await Promise.all([
    leer(BASE),
    id === BASE ? null : leer(id),
  ]);
  definirTextos(id, delIdioma ?? deBase, deBase);
}

/** Deja activos unos textos ya cargados. La usan cargarIdioma y las pruebas. */
export function definirTextos(id, delIdioma, deBase = delIdioma) {
  actual = id;
  textos = delIdioma;
  base = deBase;
  faltan.clear();
  if (typeof document !== 'undefined') document.documentElement.lang = id;
}

/** Texto de una clave con sus variables sustituidas. */
export function t(clave, variables = {}) {
  let texto = textos[clave];
  if (texto === undefined) {
    faltan.add(clave);
    texto = base[clave] ?? clave;
  }
  return texto.replace(/\{(\w+)\}/g, (marca, nombre) =>
    nombre in variables ? String(variables[nombre]) : marca);
}

export function idiomaActual() {
  return actual;
}

/** Primer idioma del navegador que la app tiene; si no hay ninguno, español. */
export function idiomaDelNavegador(preferidos = navigator.languages ?? [navigator.language]) {
  for (const etiqueta of preferidos) {
    const id = String(etiqueta).toLowerCase().split('-')[0];
    if (IDIOMAS.includes(id)) return id;
  }
  return BASE;
}

/** Claves pedidas que no existen en el idioma activo (para ?debug=1). */
export function clavesQueFaltan() {
  return [...faltan];
}
