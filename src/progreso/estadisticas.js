// Estadísticas (spec 034): qué minijuegos y temas cuestan más y el tiempo de los últimos días.
// Puras: reciben el progreso y devuelven datos para pintar (constitución A1).
import { sumarDias } from './logica.js';

/** Respuestas mínimas en un minijuego para opinar sobre él. */
export const MIN_RESPUESTAS = 10;
/** Por debajo de este porcentaje, un minijuego es un punto flojo. */
export const UMBRAL_FLOJO = 75;
export const DIAS_HISTORIAL = 14;

export const porcentaje = ([a, f] = [0, 0]) => (a + f ? Math.round((100 * a) / (a + f)) : null);

/**
 * @param {object} progreso
 * @param {{ id: string }[]} juegos
 * @param {string[]} temas
 * @param {string} hoy 'AAAA-MM-DD'
 */
export function calcularEstadisticas(progreso, juegos, temas, hoy) {
  const s = progreso.stats;
  const porJuego = juegos
    .map((j) => {
      const [a, f] = s.aciertos[j.id] ?? [0, 0];
      return { id: j.id, partidas: s.juegos[j.id] ?? 0, aciertos: a, fallos: f, pct: porcentaje([a, f]) };
    })
    .filter((r) => r.partidas > 0 || r.aciertos + r.fallos > 0)
    // Primero los que más cuestan; los que aún no tienen respuestas, al final
    .sort((x, y) => (x.pct ?? 101) - (y.pct ?? 101) || y.partidas - x.partidas);

  const total = Object.values(s.aciertos).reduce(([a, f], [x, y]) => [a + x, f + y], [0, 0]);
  const porTema = temas.map((id) => {
    const par = s.temas[id] ?? [0, 0];
    return { id, aciertos: par[0], fallos: par[1], pct: porcentaje(par) };
  });

  const historial = [];
  for (let i = DIAS_HISTORIAL - 1; i >= 0; i--) {
    const dia = sumarDias(hoy, -i);
    historial.push({ dia, minutos: Math.round((progreso.dias[dia] ?? 0) / 60) });
  }

  return {
    partidas: s.partidas,
    perfectas: s.perfectas,
    respuestas: total[0] + total[1],
    pct: porcentaje(total),
    aprendidos: s.aprendidos,
    rachaMax: s.rachaMax,
    retos: s.retos,
    porJuego,
    porTema,
    historial,
    flojos: juegosFlojos(progreso),
  };
}

/** Minijuegos con pocos aciertos (al menos MIN_RESPUESTAS respuestas), del peor al menos malo. */
export function juegosFlojos(progreso) {
  return Object.entries(progreso.stats.aciertos ?? {})
    .filter(([, [a, f]]) => a + f >= MIN_RESPUESTAS && porcentaje([a, f]) < UMBRAL_FLOJO)
    .sort(([, x], [, y]) => porcentaje(x) - porcentaje(y))
    .map(([id]) => id);
}
