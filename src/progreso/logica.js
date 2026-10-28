// Reglas puras del progreso (constitución A1): no tocan el DOM ni el almacenamiento, y la
// fecha llega desde fuera como texto 'AAAA-MM-DD' en hora local (plan de 000, §3; D-010).

export const VERSION_PROGRESO = 2;
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
    ...camposV2(),
  };
}

/** Lo que añade la v2 del formato (specs 022-025): repaso, estadísticas, logros, nivel y práctica. */
function camposV2() {
  return {
    repaso: {},
    stats: statsNuevas(),
    logros: {},
    ventana: [],
    practica: null,
  };
}

function statsNuevas() {
  return { partidas: 0, perfectas: 0, juegos: {}, practicas: 0, aprendidos: 0, rachaMax: 0 };
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
    const racha = seguida ? progreso.racha + 1 : 1;
    const stats = { ...progreso.stats, rachaMax: Math.max(progreso.stats?.rachaMax ?? 0, racha) };
    nuevo = { ...nuevo, racha, ultimoDiaCumplido: fecha, stats };
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

/** Lleva un progreso antiguo a la versión actual: migraciones[n] pasa de la v n a la n+1. */
export const MIGRACIONES_PROGRESO = {
  1: (p) => ({ ...p, ...camposV2(), stats: { ...statsNuevas(), rachaMax: esEnteroNoNegativo(p.racha) ? p.racha : 0 } }),
};

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
    progreso: { v: VERSION_PROGRESO, nivel, nivelProbado, puntos, dias: { ...dias }, ultimoDiaCumplido, racha, ...limpiarV2(p) },
  };
}

/** Los campos de la v2 de un archivo importado: lo que no tenga la forma esperada se descarta. */
function limpiarV2(p) {
  const esObjeto = (o) => o && typeof o === 'object' && !Array.isArray(o);
  const repaso = {};
  if (esObjeto(p.repaso)) {
    for (const [id, r] of Object.entries(p.repaso)) {
      if (esObjeto(r) && esEnteroNoNegativo(r.c) && r.c < CAJAS && ES_FECHA.test(r.p)) repaso[id] = { c: r.c, p: r.p };
    }
  }
  const stats = statsNuevas();
  if (esObjeto(p.stats)) {
    for (const k of ['partidas', 'perfectas', 'practicas', 'aprendidos', 'rachaMax']) {
      if (esEnteroNoNegativo(p.stats[k])) stats[k] = p.stats[k];
    }
    if (esObjeto(p.stats.juegos)) {
      for (const [id, n] of Object.entries(p.stats.juegos)) if (esEnteroNoNegativo(n)) stats.juegos[id] = n;
    }
  }
  const logros = {};
  if (esObjeto(p.logros)) for (const [id, f] of Object.entries(p.logros)) if (ES_FECHA.test(f)) logros[id] = f;
  const ventana = Array.isArray(p.ventana) ? p.ventana.filter((x) => x === 0 || x === 1).slice(-VENTANA) : [];
  const pr = p.practica;
  const practica = esObjeto(pr) && ES_FECHA.test(pr.dia) && Array.isArray(pr.juegos) && Array.isArray(pr.hechos)
    ? { dia: pr.dia, juegos: pr.juegos.filter((j) => typeof j === 'string'), hechos: pr.hechos.filter((j) => typeof j === 'string') }
    : null;
  return { repaso, stats, logros, ventana, practica };
}

// --- Repaso espaciado (spec 022, D-018): solo lo que se ha fallado ---

/** Días hasta el siguiente repaso según la caja: mañana, a los 3 días y a la semana. Al acertar el último, queda aprendido. */
export const INTERVALOS = [1, 3, 7];
const CAJAS = INTERVALOS.length;

/**
 * Anota el resultado de un ejercicio para el repaso.
 * Fallo → caja 0 y se repasa mañana. Acierto de uno pendiente → sube de caja.
 */
export function anotarRepaso(progreso, id, acierto, hoy) {
  const antes = progreso.repaso[id];
  if (!acierto) return { ...progreso, repaso: { ...progreso.repaso, [id]: { c: 0, p: sumarDias(hoy, INTERVALOS[0]) } } };
  if (!antes || antes.p > hoy) return progreso;
  const repaso = { ...progreso.repaso };
  const c = antes.c + 1;
  let { aprendidos } = progreso.stats;
  if (c >= CAJAS) {
    delete repaso[id];
    aprendidos++;
  } else {
    repaso[id] = { c, p: sumarDias(hoy, INTERVALOS[c]) };
  }
  return { ...progreso, repaso, stats: { ...progreso.stats, aprendidos } };
}

/** Ids que toca repasar hoy, de un banco (por su prefijo, p. ej. 'fa') o de todos. */
export function repasosPendientes(progreso, hoy, prefijo = null) {
  return Object.entries(progreso.repaso)
    .filter(([id, r]) => r.p <= hoy && (!prefijo || id.startsWith(`${prefijo}-`)))
    .map(([id]) => id);
}

// --- Subida de nivel con el uso (spec 025, D-019) ---

export const VENTANA = 20;
export const PARA_SUBIR = 16;

/** Anota un ejercicio del nivel del usuario; con 16 de los últimos 20 bien, sube un nivel. */
export function anotarNivel(progreso, nivelItem, acierto) {
  if (nivelItem !== progreso.nivel) return { progreso, sube: false };
  const ventana = [...progreso.ventana, acierto ? 1 : 0].slice(-VENTANA);
  const pos = NIVELES.indexOf(progreso.nivel);
  const bien = ventana.reduce((a, b) => a + b, 0);
  if (ventana.length >= VENTANA && bien >= PARA_SUBIR && pos < NIVELES.length - 1) {
    return { progreso: { ...progreso, nivel: NIVELES[pos + 1], ventana: [] }, sube: true };
  }
  return { progreso: { ...progreso, ventana }, sube: false };
}

// --- Estadísticas de partidas (spec 023) ---

export function anotarPartida(progreso, juegoId, aciertos, total) {
  const s = progreso.stats;
  return {
    ...progreso,
    stats: {
      ...s,
      partidas: s.partidas + 1,
      perfectas: s.perfectas + (total > 0 && aciertos === total ? 1 : 0),
      juegos: { ...s.juegos, [juegoId]: (s.juegos[juegoId] ?? 0) + 1 },
    },
  };
}
