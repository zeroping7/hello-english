// Reglas puras del ranking en la app (spec 027, constitución A1): alias, código, pendientes
// y día de Madrid. Sin DOM, almacenamiento ni red. Las reglas que deciden de verdad están en
// el servidor (servidor/worker.js); estas solo evitan peticiones que el servidor rechazaría.

export const VERSION_RANKING = 1;
export const ALIAS = { min: 3, max: 16 };
/** Lo que el servidor acepta en un envío (servidor/worker.js, REGLAS). */
export const ENVIO = { maxEjercicios: 40, maxPorAcierto: 30 };

/** @returns {null | 'corto' | 'largo' | 'caracteres'} motivo por el que no vale, o null */
export function problemaAlias(alias) {
  const a = String(alias ?? '');
  if (a.length < ALIAS.min) return 'corto';
  if (a.length > ALIAS.max) return 'largo';
  if (!/^[A-Za-z0-9_-]+$/.test(a) || !/[A-Za-z]/.test(a)) return 'caracteres';
  return null;
}

const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/** Igual que en el servidor: acepta el código con o sin guiones, espacios o minúsculas. */
export function normalizarCodigo(texto) {
  if (typeof texto !== 'string') return null;
  let c = texto.toUpperCase().replace(/[\s-]/g, '');
  if (c.startsWith('HE')) c = c.slice(2);
  c = c.replace(/O/g, '0').replace(/[IL]/g, '1');
  if (!new RegExp(`^[${ALFABETO}]{12}$`).test(c)) return null;
  return `HE-${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8)}`;
}

/** Día 'AAAA-MM-DD' en hora de España, el mismo que usa el servidor. */
export function diaMadrid(fecha = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(fecha);
}

/** Datos guardados al unirse o recuperar. */
export function rankingNuevo(alias, codigo) {
  return { v: VERSION_RANKING, alias, codigo, pendiente: null };
}

/** Suma una partida a lo pendiente de enviar; lo de otro día se descarta (spec HU-2). */
export function acumular(pendiente, dia, puntos, ejercicios) {
  const base = pendiente?.dia === dia ? pendiente : { dia, puntos: 0, ejercicios: 0 };
  return { dia, puntos: base.puntos + puntos, ejercicios: base.ejercicios + ejercicios };
}

/** Lo pendiente que aún se puede enviar hoy, o null. */
export function pendienteDeHoy(pendiente, dia) {
  return pendiente && pendiente.dia === dia && pendiente.puntos > 0 && pendiente.ejercicios > 0 ? pendiente : null;
}

/**
 * Parte lo pendiente en envíos que el servidor acepta (≤ 40 ejercicios, ≤ 30 puntos por ejercicio).
 * Si los puntos no caben en los ejercicios (no debería pasar), se recortan al máximo posible.
 * @returns {{ puntos: number, ejercicios: number }[]}
 */
export function trocear({ puntos, ejercicios }) {
  const envios = [];
  let quedanP = Math.min(puntos, ejercicios * ENVIO.maxPorAcierto);
  let quedanE = ejercicios;
  while (quedanE > 0 && quedanP > 0) {
    const e = Math.min(ENVIO.maxEjercicios, quedanE);
    // reparto proporcional, sin pasarse del máximo del trozo ni dejar al resto más de lo que cabe
    let p = quedanE === e ? quedanP : Math.round((quedanP * e) / quedanE);
    p = Math.min(p, e * ENVIO.maxPorAcierto);
    p = Math.max(p, quedanP - (quedanE - e) * ENVIO.maxPorAcierto);
    if (p > 0) envios.push({ puntos: p, ejercicios: e });
    quedanP -= p;
    quedanE -= e;
  }
  return envios;
}

/** Quita de lo pendiente un envío ya hecho (o descartado). */
export function restar(pendiente, envio) {
  const puntos = pendiente.puntos - envio.puntos;
  const ejercicios = pendiente.ejercicios - envio.ejercicios;
  return puntos > 0 && ejercicios > 0 ? { ...pendiente, puntos, ejercicios } : null;
}

/** Comprueba unos datos de ranking (guardados o importados); null si no tienen la forma esperada. */
export function limpiarRanking(r) {
  if (!r || typeof r !== 'object' || r.v !== VERSION_RANKING) return null;
  const codigo = normalizarCodigo(r.codigo);
  if (!codigo || problemaAlias(r.alias)) return null;
  const p = r.pendiente;
  const pendiente = p && typeof p === 'object' && /^\d{4}-\d{2}-\d{2}$/.test(p.dia)
    && Number.isInteger(p.puntos) && p.puntos > 0 && Number.isInteger(p.ejercicios) && p.ejercicios > 0
    ? { dia: p.dia, puntos: p.puntos, ejercicios: p.ejercicios }
    : null;
  return { v: VERSION_RANKING, alias: r.alias, codigo, pendiente };
}
