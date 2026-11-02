// Llamadas a la API del ranking (servidor/LEEME.md). Cada función devuelve
// { ok: true, datos } o { ok: false, motivo } con un motivo que la interfaz sabe traducir:
// 'sin-servidor', 'sin-red', 'alias-usado', 'alias-no-valido', 'vetado', 'codigo',
// 'imposible', 'tope', 'ya-jugado', 'sin-version' (servidor antiguo) o 'servidor'.
import { API } from './config.js';

const ESPERA_MS = 8000;

async function pedir(metodo, ruta, { codigo = null, cuerpo = null } = {}) {
  if (!API) return { ok: false, motivo: 'sin-servidor' };
  if (globalThis.navigator?.onLine === false) return { ok: false, motivo: 'sin-red' };
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_MS);
  const cabeceras = {};
  if (codigo) cabeceras.Authorization = `Bearer ${codigo}`;
  if (cuerpo) cabeceras['Content-Type'] = 'application/json';
  try {
    const r = await fetch(`${API}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      signal: control.signal,
      cache: 'no-store',
    });
    const datos = r.status === 204 ? null : await r.json().catch(() => null);
    if (r.ok) return { ok: true, datos };
    return { ok: false, motivo: motivoDe(r.status, datos) };
  } catch {
    return { ok: false, motivo: 'sin-red' };
  } finally {
    clearTimeout(reloj);
  }
}

function motivoDe(estado, datos) {
  const error = datos?.error;
  if (error === 'alias-no-valido' && datos.motivo === 'vetado') return 'vetado';
  if (['alias-usado', 'alias-no-valido', 'codigo', 'imposible', 'tope', 'ya-jugado'].includes(error)) return error;
  if (estado === 404) return 'sin-version'; // servidor sin actualizar a la v2
  if (estado === 401) return 'codigo';
  if (estado === 429) return 'tope';
  return 'servidor';
}

export const unirse = (alias) => pedir('POST', '/unirse', { cuerpo: { alias } });
export const enviarPuntos = (codigo, envio) => pedir('POST', '/puntos', { codigo, cuerpo: envio });
export const clasificacion = (periodo, codigo = null, liga = null) =>
  pedir('GET', `/ranking?periodo=${periodo}${liga ? `&liga=${liga}` : ''}`, { codigo });
export const rachas = (codigo = null) => pedir('GET', '/rachas', { codigo });
export const reto = (codigo = null) => pedir('GET', '/reto', { codigo });
export const enviarReto = (codigo, resultado) => pedir('POST', '/reto', { codigo, cuerpo: resultado });
// Recordatorios (spec 032): no necesitan estar en el ranking
export const claveRecordatorio = () => pedir('GET', '/recordatorio/clave');
export const guardarRecordatorio = (datos) => pedir('POST', '/recordatorio', { cuerpo: datos });
export const borrarRecordatorio = (endpoint) => pedir('DELETE', '/recordatorio', { cuerpo: { endpoint } });
export const recordatorioHecho = (endpoint, dia) => pedir('POST', '/recordatorio/hecho', { cuerpo: { endpoint, dia } });
export const recuperar = (codigo) => pedir('POST', '/recuperar', { codigo });
export const salir = (codigo) => pedir('DELETE', '/yo', { codigo });
