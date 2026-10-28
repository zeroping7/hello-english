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
