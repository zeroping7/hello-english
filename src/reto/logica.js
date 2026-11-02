// Reto del día (spec 033, D-026): la misma ronda para todos. El minijuego y los ejercicios
// salen de una semilla con la fecha de Madrid, así todos los dispositivos eligen lo mismo
// sin preguntar al servidor. Puras: sin DOM, almacenamiento ni red (constitución A1).
import { crearAzar, barajar } from '../contenido/azar.js';
import { NIVELES } from '../contenido/elegir.js';

/** Ejercicios del reto: 2 de cada nivel, de A1 a C1. */
export const RETO_N = 10;

/**
 * Minijuegos que entran en el reto: de un ejercicio cada vez, sin voz (para que todos puedan)
 * y con bastantes ejercicios por nivel en su banco.
 */
export const JUEGOS_RETO = [
  'merge-conflict', 'caza-el-bug', 'prompt', 'ordenar-frases',
  'falsos-amigos', 'acronimos', 'jerga-dev', 'educado-o-borde',
];

/** Semilla de un día ('2026-11-02' → 20261102), distinta de la de la Práctica de hoy. */
export function semillaReto(dia) {
  return (Number(dia.replaceAll('-', '')) * 7919) % 2147483647;
}

/** El minijuego del reto de un día. */
export function juegoDelReto(dia, juegos = JUEGOS_RETO) {
  const azar = crearAzar(semillaReto(dia));
  return juegos[Math.floor(azar() * juegos.length)];
}

/**
 * Los ejercicios del reto: los mismos para todos, repartidos por igual entre niveles y en orden
 * de dificultad. Si a un nivel le faltan, se completa con los de los niveles vecinos.
 * @param {object[]} items banco completo (con nivel)
 */
export function elegirReto(items, dia, n = RETO_N) {
  const azar = crearAzar(semillaReto(dia) + 1);
  // Orden estable antes de barajar: el banco puede llegar en cualquier orden
  const ordenados = [...items].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const porNivel = NIVELES.map((nv) => barajar(ordenados.filter((i) => i.nivel === nv), azar));
  const cuota = Math.floor(n / NIVELES.length);
  const elegidos = porNivel.map((lista) => lista.splice(0, cuota));
  // Lo que falte (niveles cortos o n no divisible) sale de los niveles del medio hacia fuera
  const orden = [2, 1, 3, 0, 4];
  let faltan = n - elegidos.flat().length;
  while (faltan > 0 && orden.some((i) => porNivel[i].length)) {
    for (const i of orden) {
      if (faltan > 0 && porNivel[i].length) {
        elegidos[i].push(porNivel[i].shift());
        faltan--;
      }
    }
  }
  return elegidos.flat();
}
