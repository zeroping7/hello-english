// Progreso del usuario: une las reglas de logica.js con el almacén ('he-progreso') y avisa
// de los cambios. La pantalla de minijuego llama a registrarResultado() y registrarPartida().
import { almacen } from './almacen.js';
import { hoy } from './reloj.js';
import {
  VERSION_PROGRESO, MIGRACIONES_PROGRESO, progresoNuevo, puntosPorAcierto, sumarPuntos,
  sumarSegundos, rachaVisible, segundosHoy, anotarRepaso, repasosPendientes, anotarNivel, anotarPartida,
} from './logica.js';
import { comprobarLogros } from './logros.js';
import { practicaDeHoy, marcarHecho } from './practica.js';
import { leerAjustes } from '../ajustes/ajustes.js';
import { JUEGOS } from '../../juegos/registro.js';

const CLAVE = 'he-progreso';
const eventos = new EventTarget();
let actual = null;

export function leerProgreso() {
  if (!actual) actual = almacen.leer(CLAVE, VERSION_PROGRESO, progresoNuevo, MIGRACIONES_PROGRESO);
  return actual;
}

function guardar(nuevo) {
  // Cada cambio puede desbloquear un logro (spec 023)
  const { progreso, nuevos } = comprobarLogros(nuevo, hoy(), { juegos: JUEGOS });
  actual = progreso;
  almacen.guardar(CLAVE, progreso);
  eventos.dispatchEvent(new Event('cambio'));
  if (nuevos.length) eventos.dispatchEvent(new CustomEvent('logro', { detail: { ids: nuevos } }));
}

/** Lo que muestra el inicio. */
export function resumen() {
  const p = leerProgreso();
  const dia = hoy();
  return {
    nivel: p.nivel,
    puntos: p.puntos,
    racha: rachaVisible(p, dia),
    segundosHoy: segundosHoy(p, dia),
    objetivoSegundos: leerAjustes().objetivoMin * 60,
  };
}

/** Suma tiempo de práctica de hoy. Avisa con 'objetivo' si con esto se cumple. */
export function sumarTiempo(segundos) {
  if (segundos <= 0) return;
  const r = sumarSegundos(leerProgreso(), hoy(), segundos, leerAjustes().objetivoMin);
  guardar(r.progreso);
  if (r.cumplidoAhora) {
    eventos.dispatchEvent(new CustomEvent('objetivo', { detail: { racha: r.progreso.racha } }));
  }
}

/** Un acierto en un ejercicio de cierto nivel y un minijuego de cierta dificultad. */
export function registrarAcierto(nivel, dificultad = 1) {
  const puntos = puntosPorAcierto(nivel, dificultad);
  guardar(sumarPuntos(leerProgreso(), puntos));
  return puntos;
}

/**
 * Resultado de un ejercicio: puntos si acierta, repaso espaciado y subida de nivel.
 * @returns {number} puntos ganados
 */
export function registrarResultado(item, acierto, dificultad = 1) {
  const dia = hoy();
  const puntos = acierto ? puntosPorAcierto(item.nivel, dificultad) : 0;
  let p = sumarPuntos(leerProgreso(), puntos);
  p = anotarRepaso(p, item.id, acierto, dia);
  const r = anotarNivel(p, item.nivel, acierto);
  guardar(r.progreso);
  if (r.sube) eventos.dispatchEvent(new CustomEvent('nivel', { detail: { nivel: r.progreso.nivel } }));
  return puntos;
}

/** Fin de una partida (estadísticas y, si venía de la Práctica de hoy, ese paso hecho). */
export function registrarPartida(juegoId, aciertos, total, { practica = false } = {}) {
  let p = anotarPartida(leerProgreso(), juegoId, aciertos, total);
  let completa = false;
  if (practica && p.practica?.dia === hoy()) {
    const r = marcarHecho(p.practica, juegoId);
    completa = r.completaAhora;
    p = { ...p, practica: r.practica, stats: { ...p.stats, practicas: p.stats.practicas + (completa ? 1 : 0) } };
  }
  guardar(p);
  return { practicaCompleta: completa };
}

/** Repasos pendientes hoy de un banco (por su prefijo) o de todos. */
export function pendientes(prefijo = null) {
  return repasosPendientes(leerProgreso(), hoy(), prefijo);
}

/** La Práctica de hoy; si aún no hay, la crea con elegir(). */
export function leerPractica(elegir) {
  const p = leerProgreso();
  const practica = practicaDeHoy(p.practica, hoy(), elegir);
  if (practica !== p.practica) guardar({ ...p, practica });
  return practica;
}

/** Nivel que da la prueba de nivel (spec 002). */
export function fijarNivel(nivel) {
  guardar({ ...leerProgreso(), nivel, nivelProbado: true, ventana: [] });
}

/** Sustituye todo el progreso (importar) o lo vuelve a crear (borrar). */
export function reemplazarProgreso(nuevo = progresoNuevo()) {
  guardar(nuevo);
}

function escuchar(tipo, fn) {
  const escucha = (e) => fn(e.detail);
  eventos.addEventListener(tipo, escucha);
  return () => eventos.removeEventListener(tipo, escucha);
}

export const alCambiarProgreso = (fn) => escuchar('cambio', fn);
export const alCumplirObjetivo = (fn) => escuchar('objetivo', fn);
export const alConseguirLogro = (fn) => escuchar('logro', fn);
export const alSubirNivel = (fn) => escuchar('nivel', fn);
