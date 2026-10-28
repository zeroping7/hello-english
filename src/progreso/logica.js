// Reglas puras del progreso (constitución A1): no tocan el DOM ni el almacenamiento, y la
// fecha llega desde fuera como texto 'AAAA-MM-DD' en hora local (plan de 000, §3; D-010).

export const VERSION_PROGRESO = 1;
export const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1'];
const MULTIPLICADOR = { A1: 1, A2: 1.2, B1: 1.5, B2: 1.8, C1: 2 };
const DIAS_GUARDADOS = 60;

/** Progreso de un usuario nuevo (formato en el plan de 000, §3). */
export function progresoNuevo() {
  return {
    v: VERSION_PROGRESO,
    nivel: 'A1',
    nivelProbado: false,
    puntos: 0,
    dias: {},
    ultimoDiaCumplido: null,
    racha: 0,
  };
}

/** Puntos de un acierto: round(10 × nivel × dificultad). */
export function puntosPorAcierto(nivel, dificultad = 1) {
  return Math.round(10 * (MULTIPLICADOR[nivel] ?? 1) * dificultad);
}

export function sumarPuntos(progreso, puntos) {
  return { ...progreso, puntos: progreso.puntos + Math.max(0, Math.round(puntos)) };
}

// --- Fechas como texto 'AAAA-MM-DD' (sin horas: un cambio de hora no mueve el día) ---

function aNumeroDeDia(fecha) {
  const [a, m, d] = fecha.split('-').map(Number);
  return Date.UTC(a, m - 1, d) / 86400000;
}

function deNumeroDeDia(n) {
  return new Date(n * 86400000).toISOString().slice(0, 10);
}

export function sumarDias(fecha, n) {
  return deNumeroDeDia(aNumeroDeDia(fecha) + n);
}

export function diaAnterior(fecha) {
  return sumarDias(fecha, -1);
}

// --- Objetivo diario y racha (HU-4) ---

export function segundosHoy(progreso, hoy) {
  return progreso.dias[hoy] ?? 0;
}

/** La racha si se cumplió hoy o ayer; si no, 0 ("vuelve a 0 al día siguiente"). */
export function rachaVisible(progreso, hoy) {
  const ultimo = progreso.ultimoDiaCumplido;
  return ultimo === hoy || ultimo === diaAnterior(hoy) ? progreso.racha : 0;
}

/** Deja solo los últimos 60 días. */
export function podarDias(dias, hoy) {
  const limite = aNumeroDeDia(hoy) - DIAS_GUARDADOS;
  return Object.fromEntries(Object.entries(dias).filter(([fecha]) => aNumeroDeDia(fecha) > limite));
}

/**
 * Suma segundos de práctica a un día. Si con eso se llega al objetivo y ese día aún no
 * contaba, actualiza la racha.
 * @returns {{ progreso: object, cumplidoAhora: boolean }}
 */
export function sumarSegundos(progreso, fecha, segundos, objetivoMin) {
  const total = segundosHoy(progreso, fecha) + Math.max(0, Math.round(segundos));
  let nuevo = { ...progreso, dias: podarDias({ ...progreso.dias, [fecha]: total }, fecha) };

  const cumplidoAhora = total >= objetivoMin * 60 && progreso.ultimoDiaCumplido !== fecha;
  if (cumplidoAhora) {
    const seguida = progreso.ultimoDiaCumplido === diaAnterior(fecha);
    nuevo = { ...nuevo, racha: seguida ? progreso.racha + 1 : 1, ultimoDiaCumplido: fecha };
  }
  return { progreso: nuevo, cumplidoAhora };
}

// --- Exportar e importar (HU-5) ---

export const FORMATO_EXPORTACION = 1;
const ES_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const esEnteroNoNegativo = (n) => Number.isInteger(n) && n >= 0;

export function crearExportacion(ajustes, progreso, ahora = new Date()) {
  return {
    app: 'hello-english',
    formato: FORMATO_EXPORTACION,
    exportado: ahora.toISOString(),
    ajustes,
    progreso,
  };
}

/** Lleva un progreso antiguo a la versión actual. Hoy solo existe la v1. */
export const MIGRACIONES_PROGRESO = {};

function progresoValido(p) {
  return p && typeof p === 'object'
    && NIVELES.includes(p.nivel)
    && typeof p.nivelProbado === 'boolean'
    && esEnteroNoNegativo(p.puntos)
    && esEnteroNoNegativo(p.racha)
    && (p.ultimoDiaCumplido === null || ES_FECHA.test(p.ultimoDiaCumplido))
    && p.dias && typeof p.dias === 'object' && !Array.isArray(p.dias)
    && Object.entries(p.dias).every(([f, s]) => ES_FECHA.test(f) && esEnteroNoNegativo(s));
}

/**
 * Comprueba un archivo importado. No sustituye nada: devuelve lo que habría que guardar.
 * @returns {{ ok: true, ajustes: object, progreso: object } | { ok: false, motivo: string }}
 */
export function validarImportacion(datos) {
  if (!datos || typeof datos !== 'object' || datos.app !== 'hello-english') return { ok: false, motivo: 'otra-app' };
  if (!Number.isInteger(datos.formato) || datos.formato > FORMATO_EXPORTACION) return { ok: false, motivo: 'formato' };
  if (!datos.ajustes || typeof datos.ajustes !== 'object') return { ok: false, motivo: 'ajustes' };

  let p = datos.progreso;
  if (!p || typeof p !== 'object' || !Number.isInteger(p.v) || p.v > VERSION_PROGRESO) return { ok: false, motivo: 'progreso' };
  while (p.v < VERSION_PROGRESO) {
    const migrar = MIGRACIONES_PROGRESO[p.v];
    if (!migrar) return { ok: false, motivo: 'progreso' };
    p = { ...migrar(p), v: p.v + 1 };
  }
  if (!progresoValido(p)) return { ok: false, motivo: 'progreso' };

  // Solo los campos conocidos: lo demás que traiga el archivo se descarta
  const { nivel, nivelProbado, puntos, dias, ultimoDiaCumplido, racha } = p;
  return {
    ok: true,
    ajustes: datos.ajustes,
    progreso: { v: VERSION_PROGRESO, nivel, nivelProbado, puntos, dias: { ...dias }, ultimoDiaCumplido, racha },
  };
}
