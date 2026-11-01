// Ranking (spec 027): une la lógica pura, la API y la identidad guardada en el progreso.
// Las pantallas solo usan este módulo.
import * as api from './api.js';
import { API } from './config.js';
import { rankingNuevo, normalizarCodigo, diaMadrid, acumular, pendienteDeHoy, trocear, restar } from './logica.js';
import { leerRanking, guardarRanking, alCambiarRanking } from '../progreso/progreso.js';

export { alCambiarRanking };

/** Hay servidor configurado: si no, el ranking no aparece en la app. */
export const disponible = () => Boolean(API);

/** { alias, codigo, pendiente } o null si no está apuntado. */
export const yo = () => leerRanking();

// Última posición de hoy que se ha visto, para pintar el inicio sin esperar a la red
let posicionHoy = null; // { dia, pos, puntos }

export function posicionGuardada() {
  return posicionHoy?.dia === diaMadrid() ? posicionHoy : null;
}

export async function unirse(alias) {
  const r = await api.unirse(alias);
  if (r.ok) {
    posicionHoy = null;
    guardarRanking(rankingNuevo(r.datos.alias, r.datos.codigo));
  }
  return r;
}

/** Entra con un código de otro dispositivo (HU-4). */
export async function recuperar(texto) {
  const codigo = normalizarCodigo(texto);
  if (!codigo) return { ok: false, motivo: 'codigo' };
  const r = await api.recuperar(codigo);
  if (r.ok) {
    posicionHoy = null;
    guardarRanking(rankingNuevo(r.datos.alias, codigo));
  }
  return r;
}

/** Sale del ranking y borra sus datos del servidor (HU-5). Si el servidor ya no lo conoce, sale igual. */
export async function salir() {
  const datos = leerRanking();
  if (!datos) return { ok: true };
  const r = await api.salir(datos.codigo);
  if (r.ok || r.motivo === 'codigo') {
    posicionHoy = null;
    guardarRanking(null);
    return { ok: true };
  }
  return r;
}

/** Suma una partida terminada (HU-2) y la intenta enviar. */
export function sumarPartida(puntos, ejercicios) {
  const datos = leerRanking();
  if (!datos || puntos <= 0 || ejercicios <= 0) return;
  guardarRanking({ ...datos, pendiente: acumular(datos.pendiente, diaMadrid(), puntos, ejercicios) });
  enviarPendientes();
}

let enviando = null;
let repetir = false;

const REINTENTAR = ['sin-red', 'servidor', 'sin-servidor'];

async function enviar() {
  const datos = leerRanking();
  if (!datos?.pendiente) return;
  const pendiente = pendienteDeHoy(datos.pendiente, diaMadrid());
  if (!pendiente) {
    guardarRanking({ ...datos, pendiente: null });
    return;
  }
  for (const envio of trocear(pendiente)) {
    const r = await api.enviarPuntos(datos.codigo, envio);
    if (!r.ok && REINTENTAR.includes(r.motivo)) return;
    if (!r.ok && r.motivo === 'codigo') { // el alias ya no existe (salió desde otro dispositivo)
      posicionHoy = null;
      guardarRanking(null);
      return;
    }
    // Enviado, o rechazado por imposible o tope: en los dos casos ya no se reintenta.
    // Se resta de lo guardado ahora, que puede traer otra partida sumada mientras tanto.
    const actual = leerRanking();
    if (!actual) return;
    guardarRanking({ ...actual, pendiente: actual.pendiente && restar(actual.pendiente, envio) });
  }
}

/** Envía lo pendiente de hoy, en trozos que el servidor acepte. Lo de otro día se descarta. */
export function enviarPendientes() {
  if (enviando) {
    repetir = true; // ha llegado otra partida mientras se enviaba: se envía al acabar
    return enviando;
  }
  // .finally() siempre corre después de esta asignación, aunque enviar() acabe enseguida
  enviando = enviar().finally(() => {
    enviando = null;
    if (repetir) {
      repetir = false;
      enviarPendientes();
    }
  });
  return enviando;
}

/**
 * Top 50 y mi posición de 'dia' o 'mes' (HU-3). Antes envía lo pendiente, para verse al día.
 * @returns {Promise<{ ok: true, datos: { top, yo, jugadores } } | { ok: false, motivo: string }>}
 */
export async function clasificacion(periodo) {
  await enviarPendientes();
  const datos = leerRanking();
  const r = await api.clasificacion(periodo, datos?.codigo);
  if (r.ok && periodo === 'dia' && r.datos.yo) {
    posicionHoy = { dia: r.datos.dia, pos: r.datos.yo.pos, puntos: r.datos.yo.puntos };
  }
  if (!r.ok && r.motivo === 'codigo') guardarRanking(null);
  return r;
}

let iniciado = false;

/** Al abrir la app y al volver la red, se envía lo pendiente (HU-2). */
export function iniciarRanking() {
  if (iniciado || !disponible()) return;
  iniciado = true;
  enviarPendientes();
  globalThis.addEventListener?.('online', () => enviarPendientes());
}
