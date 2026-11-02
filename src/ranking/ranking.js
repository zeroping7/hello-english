// Ranking (spec 027): une la lógica pura, la API y la identidad guardada en el progreso.
// Las pantallas solo usan este módulo.
import * as api from './api.js';
import { API } from './config.js';
import {
  rankingNuevo, normalizarCodigo, diaMadrid, acumular, pendienteDeHoy, trocear, restar,
  diaAnterior, mesAnterior, retoValido,
} from './logica.js';
import { leerRanking, guardarRanking, alCambiarRanking, resumen, registrarPuesto, puestoRevisado } from '../progreso/progreso.js';

export { alCambiarRanking };

const eventos = new EventTarget();

/** Puesto final de ayer o del mes pasado, al abrir la app (spec 028): fn({ tipo, pos, jugadores, medalla }). */
export function alVerResultado(fn) {
  const escucha = (e) => fn(e.detail);
  eventos.addEventListener('resultado', escucha);
  return () => eventos.removeEventListener('resultado', escucha);
}

// El servidor ya tiene la v2 (ligas, rachas, reto): lo dice cada clasificación con api: 2
let servidorV2 = null;
export const servidorActualizado = () => servidorV2;

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
    // Lo de antes de unirse no cuenta para las medallas
    const hoy = diaMadrid();
    registrarPuesto('dia', diaAnterior(hoy), null);
    registrarPuesto('mes', mesAnterior(hoy), null);
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
  await enviarReto();
  const datos = leerRanking();
  if (!datos?.pendiente) return;
  const pendiente = pendienteDeHoy(datos.pendiente, diaMadrid());
  if (!pendiente) {
    guardarRanking({ ...datos, pendiente: null });
    return;
  }
  // Con cada envío van la liga (nivel) y la racha actuales (specs 030 y 031)
  const { nivel, racha } = resumen();
  for (const envio of trocear(pendiente)) {
    const r = await api.enviarPuntos(datos.codigo, { ...envio, nivel, racha });
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

/** Envía el resultado del reto de hoy si quedó pendiente (spec 033). */
async function enviarReto() {
  const datos = leerRanking();
  if (!datos?.reto) return;
  if (!retoValido(datos.reto, diaMadrid())) {
    guardarRanking({ ...datos, reto: null });
    return;
  }
  const r = await api.enviarReto(datos.codigo, datos.reto);
  if (!r.ok && REINTENTAR.includes(r.motivo)) return;
  if (!r.ok && r.motivo === 'codigo') {
    guardarRanking(null);
    return;
  }
  const actual = leerRanking();
  if (actual) guardarRanking({ ...actual, reto: null }); // enviado, repetido o rechazado: ya no se reintenta
}

/** Guarda el resultado del reto de hoy para el ranking y lo intenta enviar. */
export function guardarReto(resultado) {
  const datos = leerRanking();
  if (!datos) return;
  guardarRanking({ ...datos, reto: { ...resultado, dia: diaMadrid() } });
  enviarPendientes();
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

/** Tras una petición con código: si el servidor no lo conoce, se sale del ranking. */
function comprobar(r) {
  if (!r.ok && r.motivo === 'codigo') guardarRanking(null);
  if (r.ok) servidorV2 = r.datos?.api === 2;
  return r;
}

/**
 * Top 50 y mi posición (HU-3). periodo: 'dia', 'ayer', 'mes' o 'mesAnterior' (spec 028);
 * liga: un nivel para ver solo esa liga (spec 030). Antes envía lo pendiente, para verse al día.
 * @returns {Promise<{ ok: true, datos: { top, yo, jugadores } } | { ok: false, motivo: string }>}
 */
export async function clasificacion(periodo, { liga = null } = {}) {
  await enviarPendientes();
  const datos = leerRanking();
  const r = await api.clasificacion(periodo, datos?.codigo, liga);
  if (r.ok && periodo === 'dia' && !liga && r.datos.yo) {
    posicionHoy = { dia: r.datos.dia, pos: r.datos.yo.pos, puntos: r.datos.yo.puntos };
  }
  return comprobar(r);
}

/** Rachas activas (spec 031). */
export async function rachas() {
  await enviarPendientes();
  return comprobar(await api.rachas(leerRanking()?.codigo));
}

/** Clasificación del reto de hoy (spec 033). */
export async function clasificacionReto() {
  await enviarPendientes();
  return comprobar(await api.reto(leerRanking()?.codigo));
}

/**
 * Puesto final de ayer y del mes pasado (specs 028 y 029): se mira una vez por periodo, se
 * anota la medalla si la hay y se avisa con alVerResultado. Sin red, se vuelve a intentar otro día.
 */
export async function comprobarResultados() {
  if (!leerRanking()) return;
  const hoy = diaMadrid();
  const periodos = [
    { tipo: 'dia', periodo: diaAnterior(hoy), consulta: 'ayer' },
    { tipo: 'mes', periodo: mesAnterior(hoy), consulta: 'mesAnterior' },
  ];
  for (const { tipo, periodo, consulta } of periodos) {
    if (puestoRevisado(tipo, periodo)) continue;
    const datos = leerRanking();
    if (!datos) return;
    const r = comprobar(await api.clasificacion(consulta, datos.codigo));
    if (!r.ok) return;
    const pos = r.datos.yo?.pos ?? null;
    const medalla = registrarPuesto(tipo, periodo, pos);
    if (pos) eventos.dispatchEvent(new CustomEvent('resultado', { detail: { tipo, pos, jugadores: r.datos.jugadores, medalla } }));
  }
}

let iniciado = false;

/** Al abrir la app y al volver la red, se envía lo pendiente (HU-2). */
export function iniciarRanking() {
  if (iniciado || !disponible()) return;
  iniciado = true;
  enviarPendientes().then(() => comprobarResultados());
  globalThis.addEventListener?.('online', () => enviarPendientes());
}
