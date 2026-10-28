// Carga los bancos de contenido/ (con no-cache, como los textos de interfaz, D-009) y se
// queda con los items válidos.
import { itemsValidos } from './esquema.js';

const cargados = new Map();

/** @returns {Promise<object[]>} items válidos del banco */
export function cargarBanco(nombre) {
  if (!cargados.has(nombre)) {
    const url = new URL(`../../contenido/${nombre}.json`, import.meta.url);
    cargados.set(nombre, fetch(url, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error(`No se pudo cargar ${nombre}.json (${r.status})`);
        return r.json();
      })
      .then((datos) => itemsValidos(nombre, datos))
      .catch((e) => {
        cargados.delete(nombre);
        throw e;
      }));
  }
  return cargados.get(nombre);
}
