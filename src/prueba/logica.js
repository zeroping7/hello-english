// Lógica de la prueba de nivel (plan de 002, §3): 10 preguntas que empiezan en A2 y suben o
// bajan un nivel según se acierte o se falle. Pura: no toca el DOM ni el almacenamiento.
import { NIVELES } from '../contenido/elegir.js';
import { barajar } from '../contenido/azar.js';

export const TOTAL = 10;
const INICIO = 1; // A2

export function crearPrueba(preguntas, azar) {
  return { pos: INICIO, preguntas: barajar(preguntas, azar), respondidas: [], actual: null };
}

export function terminada(estado) {
  return estado.respondidas.length >= TOTAL;
}

/** Elige la siguiente pregunta: del nivel actual o, si no quedan, del más cercano. */
export function siguiente(estado) {
  if (terminada(estado)) return { ...estado, actual: null };
  const usadas = new Set(estado.respondidas.map((r) => r.id));
  const libres = estado.preguntas.filter((p) => !usadas.has(p.id));
  const distancia = (p) => Math.abs(NIVELES.indexOf(p.nivel) - estado.pos);
  // Ante la misma distancia se prefiere el nivel más bajo (no frustrar)
  const actual = [...libres].sort((a, b) =>
    distancia(a) - distancia(b) || NIVELES.indexOf(a.nivel) - NIVELES.indexOf(b.nivel))[0] ?? null;
  return { ...estado, actual };
}

export function responder(estado, acierto) {
  const p = estado.actual;
  if (!p) return estado;
  const pos = Math.min(NIVELES.length - 1, Math.max(0, estado.pos + (acierto ? 1 : -1)));
  return { ...estado, pos, actual: null, respondidas: [...estado.respondidas, { id: p.id, nivel: p.nivel, acierto }] };
}

/** Nivel final y aciertos. */
export function resultado(estado) {
  const cuenta = NIVELES.map((nivel) => {
    const del = estado.respondidas.filter((r) => r.nivel === nivel);
    const aciertos = del.filter((r) => r.acierto).length;
    return { nivel, aciertos, fallos: del.length - aciertos };
  });
  const deArribaAbajo = [...cuenta].reverse();
  const elegido =
    deArribaAbajo.find((c) => c.aciertos >= 2 && c.fallos <= c.aciertos) ??
    deArribaAbajo.find((c) => c.aciertos >= 1 && c.fallos === 0) ??
    cuenta[0];
  return { nivel: elegido.nivel, aciertos: estado.respondidas.filter((r) => r.acierto).length };
}
