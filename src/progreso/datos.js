// "Mis datos" (HU-5): exportar, importar y borrar el progreso y los ajustes.
import { almacen } from './almacen.js';
import { hoy } from './reloj.js';
import { crearExportacion, validarImportacion, progresoNuevo } from './logica.js';
import { leerProgreso, reemplazarProgreso } from './progreso.js';
import { leerAjustes, reemplazarAjustes } from '../ajustes/ajustes.js';

/** Descarga 'hello-english-AAAA-MM-DD.json' sin servidor. */
export function exportarArchivo() {
  const datos = crearExportacion(leerAjustes(), leerProgreso());
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `hello-english-${hoy()}.json`;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Lee y valida un archivo. No cambia nada hasta llamar a aplicar(). */
export async function leerArchivo(archivo) {
  try {
    if (archivo.size > 1_000_000) return { ok: false, motivo: 'tamaño' };
    return validarImportacion(JSON.parse(await archivo.text()));
  } catch {
    return { ok: false, motivo: 'json' };
  }
}

/** Sustituye todo por lo importado. */
export async function aplicarImportacion({ ajustes, progreso }) {
  // La bienvenida ya está hecha: quien importa viene de otro dispositivo
  await reemplazarAjustes({ ...ajustes, bienvenidaHecha: true });
  reemplazarProgreso(progreso);
}

/** Borra todo lo de la app en este dispositivo y vuelve a los valores de un usuario nuevo. */
export async function borrarTodo() {
  almacen.borrarTodo();
  await reemplazarAjustes({});
  reemplazarProgreso(progresoNuevo());
  almacen.borrarTodo();
}
