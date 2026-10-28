// Router por hash (D-002): '#/inicio', '#/ajustes', '#/juego/<id>'.
// Cada pantalla es un módulo con montar(raiz, params) que devuelve { desmontar }.
// Al cambiar de pantalla: desmonta la anterior, monta la nueva, sube al principio,
// lleva el foco a su h1 y pone su texto en el título de la pestaña (constitución C3).
import { t } from './i18n/textos.js';

let raiz = null;
let rutas = [];
let porDefecto = '/inicio';
let actual = null;      // { desmontar }
let turno = 0;          // descarta cargas que llegan después de otra navegación
const pila = [];        // rutas visitadas en esta sesión, para saber si "volver" puede ir atrás

/**
 * @param {HTMLElement} elemento donde se montan las pantallas
 * @param {{ patron: RegExp, cargar: () => Promise<any> }[]} lista
 * @param {string} rutaPorDefecto a la que van las rutas desconocidas
 */
export function iniciarRouter(elemento, lista, rutaPorDefecto = '/inicio') {
  raiz = elemento;
  rutas = lista;
  porDefecto = rutaPorDefecto;
  window.addEventListener('hashchange', mostrar);
  document.addEventListener('keydown', alPulsarTecla);
  return mostrar();
}

export function rutaActual() {
  return location.hash.replace(/^#/, '') || porDefecto;
}

/** Va a una ruta ('/ajustes'). Con reemplazar no deja entrada en el historial. */
export function navegar(ruta, { reemplazar = false } = {}) {
  if (reemplazar) {
    history.replaceState(null, '', `#${ruta}`);
    if (pila.length) pila[pila.length - 1] = ruta;
    mostrar();
  } else {
    location.hash = ruta;
  }
}

/** Vuelve a la pantalla anterior de la app o, si se entró directamente, al inicio. */
export function volver() {
  if (pila.length > 1) history.back();
  else navegar(porDefecto, { reemplazar: true });
}

async function mostrar() {
  const ruta = rutaActual();
  const encontrada = buscar(ruta);
  if (!encontrada) {
    navegar(porDefecto, { reemplazar: true });
    return;
  }

  apuntar(ruta);
  const miTurno = ++turno;
  const modulo = await encontrada.ruta.cargar();
  if (miTurno !== turno) return;

  actual?.desmontar?.();
  raiz.replaceChildren();
  actual = modulo.montar(raiz, encontrada.params) ?? null;
  window.scrollTo(0, 0);
  enfocarTitulo();
}

function buscar(ruta) {
  for (const r of rutas) {
    const m = ruta.match(r.patron);
    if (m) return { ruta: r, params: m.slice(1) };
  }
  return null;
}

function apuntar(ruta) {
  if (pila.length > 1 && pila[pila.length - 2] === ruta) pila.pop();
  else if (pila[pila.length - 1] !== ruta) pila.push(ruta);
}

function enfocarTitulo() {
  const titulo = raiz.querySelector('h1');
  if (!titulo) return;
  const nombre = titulo.getAttribute('aria-label') || titulo.textContent.trim();
  document.title = rutaActual() === porDefecto
    ? t('app.nombre')
    : t('app.tituloPestana', { pantalla: nombre });
  titulo.setAttribute('tabindex', '-1');
  titulo.focus({ preventScroll: true });
}

function alPulsarTecla(e) {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  if (e.target.closest?.('input, textarea, select, dialog')) return;
  if (rutaActual() !== porDefecto) volver();
}
