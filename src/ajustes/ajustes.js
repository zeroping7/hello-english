// Ajustes del usuario (HU-3), guardados en 'he-ajustes' a través del almacén (constitución A4).
// cambiar() valida, guarda, aplica el tema o el idioma y avisa a quien escuche con alCambiar().
import { almacen } from '../progreso/almacen.js';
import { cargarIdioma, idiomaDelNavegador } from '../i18n/textos.js';

const CLAVE = 'he-ajustes';
const VERSION = 1;

/** Valores permitidos de cada ajuste; el primero es el valor por defecto (salvo idioma). */
export const OPCIONES = {
  idioma: ['es', 'en'],
  tema: ['sistema', 'claro', 'oscuro'],
  acento: ['gb', 'us'],
  velocidad: ['normal', 'lenta'],
  sonido: [true, false],
  vibracion: [true, false],
  objetivoMin: [10, 5, 20],
  bienvenidaHecha: [false, true],
};

const COLOR_BARRA = { claro: '#fafafa', oscuro: '#0f1117' };

const eventos = new EventTarget();
let actuales = null;

function porDefecto() {
  const datos = { v: VERSION };
  for (const [clave, valores] of Object.entries(OPCIONES)) datos[clave] = valores[0];
  datos.idioma = idiomaDelNavegador();
  return datos;
}

/** Deja solo claves conocidas con valores permitidos; lo demás toma el valor por defecto. */
export function normalizarAjustes(datos, base = porDefecto()) {
  const limpio = { v: VERSION };
  for (const [clave, valores] of Object.entries(OPCIONES)) {
    limpio[clave] = valores.includes(datos?.[clave]) ? datos[clave] : base[clave];
  }
  return limpio;
}

export function leerAjustes() {
  if (!actuales) actuales = normalizarAjustes(almacen.leer(CLAVE, VERSION, porDefecto));
  return { ...actuales };
}

/** Cambia un ajuste. Devuelve una promesa que se cumple cuando ya está aplicado. */
export async function cambiarAjuste(clave, valor) {
  if (!OPCIONES[clave]?.includes(valor)) throw new Error(`Ajuste no válido: ${clave} = ${valor}`);
  const anteriores = leerAjustes();
  if (anteriores[clave] === valor) return;
  actuales = { ...anteriores, [clave]: valor };
  almacen.guardar(CLAVE, actuales);
  await aplicar(clave, valor);
  eventos.dispatchEvent(new CustomEvent('cambio', { detail: { clave, valor } }));
}

/** Escucha cambios: fn({ clave, valor }). Devuelve la función para dejar de escuchar. */
export function alCambiarAjuste(fn) {
  const escucha = (e) => fn(e.detail);
  eventos.addEventListener('cambio', escucha);
  return () => eventos.removeEventListener('cambio', escucha);
}

/** Aplica al arrancar el tema y el idioma guardados. */
export async function aplicarAjustesGuardados() {
  const { tema, idioma } = leerAjustes();
  aplicarTema(tema);
  await cargarIdioma(idioma);
}

async function aplicar(clave, valor) {
  if (clave === 'tema') aplicarTema(valor);
  if (clave === 'idioma') await cargarIdioma(valor);
}

function aplicarTema(tema) {
  const html = document.documentElement;
  if (tema === 'sistema') delete html.dataset.theme;
  else html.dataset.theme = tema;
  // La barra del navegador en el móvil sigue al tema elegido, no solo al del sistema
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    if (!meta.dataset.original) meta.dataset.original = meta.content;
    meta.content = tema === 'sistema' ? meta.dataset.original : COLOR_BARRA[tema];
  }
}
