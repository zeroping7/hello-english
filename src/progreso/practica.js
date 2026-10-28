// Práctica de hoy (spec 024, D-020): tres minijuegos elegidos para el día. Puras: sin DOM.
import { crearAzar, barajar } from '../contenido/azar.js';

export const PASOS = 3;

/** Semilla estable para un día: la práctica no cambia al recargar. */
function semillaDe(dia) {
  return Number(dia.replaceAll('-', '')) % 2147483647;
}

/**
 * Elige los minijuegos del día: primero el que más repasos tenga pendientes; luego, de
 * categorías distintas, los menos jugados.
 * @param {{ id: string, categoria: string, prefijo: string }[]} juegos disponibles (ya sin los que necesitan voz si no la hay)
 * @param {{ [prefijo: string]: number }} pendientes repasos de hoy por banco
 * @param {{ [id: string]: number }} jugados partidas por minijuego
 */
export function elegirPractica(dia, juegos, pendientes, jugados) {
  const azar = crearAzar(semillaDe(dia));
  const lista = barajar(juegos, azar);
  const elegidos = [];
  const conRepaso = [...lista].sort((a, b) => (pendientes[b.prefijo] ?? 0) - (pendientes[a.prefijo] ?? 0));
  if (conRepaso.length && (pendientes[conRepaso[0].prefijo] ?? 0) > 0) elegidos.push(conRepaso[0]);

  const porUso = [...lista].sort((a, b) => (jugados[a.id] ?? 0) - (jugados[b.id] ?? 0));
  for (const j of porUso) {
    if (elegidos.length >= PASOS) break;
    if (elegidos.some((e) => e.id === j.id || e.categoria === j.categoria)) continue;
    elegidos.push(j);
  }
  // Si hay menos categorías que pasos, se completa con cualquiera
  for (const j of porUso) {
    if (elegidos.length >= PASOS) break;
    if (!elegidos.some((e) => e.id === j.id)) elegidos.push(j);
  }
  return elegidos.map((j) => j.id);
}

/** La práctica guardada si es de hoy; si no, una nueva. */
export function practicaDeHoy(guardada, dia, elegir) {
  if (guardada?.dia === dia && guardada.juegos.length) return guardada;
  return { dia, juegos: elegir(), hechos: [] };
}

/** Marca un minijuego como hecho. completaAhora = era el último que faltaba. */
export function marcarHecho(practica, juegoId) {
  if (!practica.juegos.includes(juegoId) || practica.hechos.includes(juegoId)) return { practica, completaAhora: false };
  const hechos = [...practica.hechos, juegoId];
  return { practica: { ...practica, hechos }, completaAhora: hechos.length === practica.juegos.length };
}

export const siguientePaso = (practica) => practica.juegos.find((id) => !practica.hechos.includes(id)) ?? null;
