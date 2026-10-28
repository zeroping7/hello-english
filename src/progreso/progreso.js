// Progreso del usuario: une las reglas de logica.js con el almacén ('he-progreso') y avisa
// de los cambios. Los minijuegos solo llaman a registrarAcierto() y al cronómetro.
import { almacen } from './almacen.js';
import { hoy } from './reloj.js';
import {
  VERSION_PROGRESO, progresoNuevo, puntosPorAcierto, sumarPuntos, sumarSegundos,
  rachaVisible, segundosHoy,
} from './logica.js';
import { leerAjustes } from '../ajustes/ajustes.js';

const CLAVE = 'he-progreso';
const eventos = new EventTarget();
let actual = null;

export function leerProgreso() {
  if (!actual) actual = almacen.leer(CLAVE, VERSION_PROGRESO, progresoNuevo);
  return actual;
}

function guardar(nuevo) {
  actual = nuevo;
  almacen.guardar(CLAVE, nuevo);
  eventos.dispatchEvent(new Event('cambio'));
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
