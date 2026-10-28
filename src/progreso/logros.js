// Logros (spec 023): cada uno es una condición sobre el progreso. Puras: sin DOM.
// Textos en i18n: 'logro.<id>.titulo' y 'logro.<id>.desc'.

const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1'];
const jugadosDe = (p) => Object.keys(p.stats.juegos).filter((id) => p.stats.juegos[id] > 0);

/**
 * @type {{ id: string, icono: string, cumple: (p: object, ctx: { juegos: { id: string, categoria: string }[] }) => boolean }[]}
 */
export const LOGROS = [
  { id: 'primera-partida', icono: 'practica', cumple: (p) => p.stats.partidas >= 1 },
  { id: 'diez-partidas', icono: 'practica', cumple: (p) => p.stats.partidas >= 10 },
  { id: 'cincuenta-partidas', icono: 'practica', cumple: (p) => p.stats.partidas >= 50 },
  { id: 'perfecta', icono: 'puntos', cumple: (p) => p.stats.perfectas >= 1 },
  { id: 'diez-perfectas', icono: 'puntos', cumple: (p) => p.stats.perfectas >= 10 },
  { id: 'racha-3', icono: 'racha', cumple: (p) => p.stats.rachaMax >= 3 },
  { id: 'racha-7', icono: 'racha', cumple: (p) => p.stats.rachaMax >= 7 },
  { id: 'racha-30', icono: 'racha', cumple: (p) => p.stats.rachaMax >= 30 },
  { id: 'puntos-500', icono: 'nivel', cumple: (p) => p.puntos >= 500 },
  { id: 'puntos-5000', icono: 'nivel', cumple: (p) => p.puntos >= 5000 },
  { id: 'nivel-b1', icono: 'nivel', cumple: (p) => NIVELES.indexOf(p.nivel) >= 2 },
  { id: 'nivel-c1', icono: 'nivel', cumple: (p) => p.nivel === 'C1' },
  { id: 'explorador', icono: 'vocabulario', cumple: (p, { juegos }) => new Set(juegos.filter((j) => jugadosDe(p).includes(j.id)).map((j) => j.categoria)).size >= 4 },
  { id: 'todos-los-juegos', icono: 'vocabulario', cumple: (p, { juegos }) => juegos.every((j) => jugadosDe(p).includes(j.id)) },
  { id: 'practica-1', icono: 'objetivo', cumple: (p) => p.stats.practicas >= 1 },
  { id: 'practica-7', icono: 'objetivo', cumple: (p) => p.stats.practicas >= 7 },
  { id: 'repaso-10', icono: 'repaso', cumple: (p) => p.stats.aprendidos >= 10 },
  { id: 'repaso-50', icono: 'repaso', cumple: (p) => p.stats.aprendidos >= 50 },
];

/**
 * Apunta los logros recién conseguidos.
 * @returns {{ progreso: object, nuevos: string[] }}
 */
export function comprobarLogros(progreso, hoy, ctx) {
  const nuevos = LOGROS.filter((l) => !progreso.logros[l.id] && l.cumple(progreso, ctx)).map((l) => l.id);
  if (!nuevos.length) return { progreso, nuevos };
  const logros = { ...progreso.logros };
  for (const id of nuevos) logros[id] = hoy;
  return { progreso: { ...progreso, logros }, nuevos };
}
