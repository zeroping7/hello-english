// Único acceso a localStorage (constitución A4). Cada bloque se guarda en una clave 'he-*'
// con un campo v (versión del formato). Si el navegador no deja guardar, todo sigue en
// memoria y persistente() devuelve false para que la app lo avise (HU-5).
// Con ?debug=1&sinAlmacen=1 se simula un navegador que no deja guardar.

const PREFIJO = 'he-';

function localStorageSiFunciona() {
  const params = new URLSearchParams(globalThis.location?.search ?? '');
  if (params.get('debug') === '1' && params.get('sinAlmacen') === '1') return null;
  try {
    const s = globalThis.localStorage;
    s.setItem(`${PREFIJO}prueba`, '1');
    s.removeItem(`${PREFIJO}prueba`);
    return s;
  } catch {
    return null;
  }
}

/**
 * @param {Storage|null} almacenamiento null = solo memoria
 */
export function crearAlmacen(almacenamiento = localStorageSiFunciona()) {
  let disco = almacenamiento;
  const memoria = new Map();

  function leerTexto(clave) {
    if (memoria.has(clave)) return memoria.get(clave);
    if (!disco) return null;
    try {
      return disco.getItem(clave);
    } catch {
      return null;
    }
  }

  return {
    /** true si lo guardado sobrevive al cerrar el navegador. */
    persistente() {
      return disco !== null;
    },

    /**
     * Lee un bloque y lo lleva a la versión actual.
     * @param {string} clave p. ej. 'he-progreso'
     * @param {number} version versión actual del formato
     * @param {() => object} porDefecto datos nuevos (con su v)
     * @param {Object<number, (datos: object) => object>} migraciones migraciones[n] pasa de v n a n+1
     */
    leer(clave, version, porDefecto, migraciones = {}) {
      let datos;
      try {
        datos = JSON.parse(leerTexto(clave));
      } catch {
        datos = null;
      }
      if (!datos || typeof datos !== 'object' || !Number.isInteger(datos.v)) return porDefecto();
      // Datos de una versión futura de la app: no se tocan ni se interpretan
      if (datos.v > version) return porDefecto();
      while (datos.v < version) {
        const migrar = migraciones[datos.v];
        if (!migrar) return porDefecto();
        datos = { ...migrar(datos), v: datos.v + 1 };
      }
      return datos;
    },

    /** Guarda un bloque. Si el disco falla (lleno, bloqueado), pasa a memoria. */
    guardar(clave, datos) {
      const texto = JSON.stringify(datos);
      if (disco) {
        try {
          disco.setItem(clave, texto);
          memoria.delete(clave);
          return;
        } catch {
          disco = null;
        }
      }
      memoria.set(clave, texto);
    },

    /** Borra todos los bloques de la app (HU-5, "Borrar progreso"). */
    borrarTodo() {
      for (const clave of [...memoria.keys()]) if (clave.startsWith(PREFIJO)) memoria.delete(clave);
      if (!disco) return;
      try {
        const claves = [];
        for (let i = 0; i < disco.length; i++) {
          const clave = disco.key(i);
          if (clave?.startsWith(PREFIJO)) claves.push(clave);
        }
        for (const clave of claves) disco.removeItem(clave);
      } catch {
        // si no se puede borrar del disco, al menos la memoria queda limpia
      }
    },
  };
}

export const almacen = crearAlmacen();
