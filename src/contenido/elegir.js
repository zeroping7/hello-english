// Elige los ejercicios de una partida (plan de 001, §4): 60 % del nivel del usuario,
// 30 % del anterior y 10 % del siguiente, completando con los niveles más cercanos.
import { barajar } from './azar.js';

export const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1'];

/**
 * @param {object[]} items ejercicios con nivel y tema
 * @param {{ nivel: string, n: number, azar: () => number, tema?: string|null }} opciones
 */
export function elegirEjercicios(items, { nivel, n, azar, tema = null }) {
  const disponibles = tema ? items.filter((i) => i.tema === tema) : items;
  const pos = Math.max(0, NIVELES.indexOf(nivel));

  // Cuántos de cada nivel; las partes sin nivel (antes de A1, después de C1) van al del usuario
  const cuotas = new Map();
  const sumar = (indice, cantidad) => {
    const i = indice < 0 || indice >= NIVELES.length ? pos : indice;
    cuotas.set(i, (cuotas.get(i) ?? 0) + cantidad);
  };
  const anterior = Math.round(n * 0.3);
  const siguiente = Math.round(n * 0.1);
  sumar(pos - 1, anterior);
  sumar(pos + 1, siguiente);
  sumar(pos, n - anterior - siguiente);

  const porNivel = NIVELES.map((nv) => barajar(disponibles.filter((i) => i.nivel === nv), azar));
  const elegidos = [];
  for (const [i, cantidad] of cuotas) elegidos.push(...porNivel[i].splice(0, cantidad));

  // Si faltan, se completa con los niveles más cercanos al del usuario
  const porCercania = NIVELES.map((_, i) => i).sort((a, b) => Math.abs(a - pos) - Math.abs(b - pos) || a - b);
  for (const i of porCercania) {
    if (elegidos.length >= n) break;
    elegidos.push(...porNivel[i].splice(0, n - elegidos.length));
  }

  return barajar(elegidos, azar).slice(0, n);
}

/**
 * Como elegirEjercicios, pero antes mete los que toca repasar hoy (spec 022): como mucho
 * un 40 % de la partida, para que siga habiendo ejercicios nuevos.
 * @param {Set<string>|string[]} pendientes ids que toca repasar
 */
export function elegirConRepaso(items, { nivel, n, azar, tema = null, pendientes = [] }) {
  const ids = new Set(pendientes);
  const repasar = barajar(items.filter((i) => ids.has(i.id) && (!tema || i.tema === tema)), azar)
    .slice(0, Math.floor(n * 0.4));
  const usados = new Set(repasar.map((i) => i.id));
  const resto = elegirEjercicios(items.filter((i) => !usados.has(i.id)), { nivel, n: n - repasar.length, azar, tema });
  return barajar([...repasar, ...resto], azar);
}
