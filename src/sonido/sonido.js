// Efectos de sonido sintetizados con Web Audio (sin archivos, constitución E4) y vibración
// en el móvil. Cada uno se activa o desactiva por separado en Ajustes.
import { leerAjustes } from '../ajustes/ajustes.js';

// Notas: [frecuencia Hz, inicio s, duración s, forma]
const RECETAS = {
  acierto: [[660, 0, 0.08, 'sine'], [990, 0.08, 0.14, 'sine']],
  fallo: [[196, 0, 0.12, 'triangle'], [147, 0.1, 0.2, 'triangle']],
  meta: [[523, 0, 0.1, 'sine'], [659, 0.1, 0.1, 'sine'], [784, 0.2, 0.1, 'sine'], [1047, 0.3, 0.3, 'sine']],
};

const VIBRACION = {
  acierto: 20,
  fallo: [40, 60, 40],
  meta: [60, 40, 60, 40, 120],
};

const VOLUMEN = 0.18;
let contexto = null;

function audio() {
  const Contexto = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!Contexto) return null;
  contexto ??= new Contexto();
  // Los navegadores lo crean suspendido hasta que el usuario toca algo
  if (contexto.state === 'suspended') contexto.resume();
  return contexto;
}

export function sonar(nombre) {
  if (!leerAjustes().sonido) return;
  const ctx = audio();
  const receta = RECETAS[nombre];
  if (!ctx || !receta) return;

  const ahora = ctx.currentTime + 0.01;
  for (const [frecuencia, inicio, duracion, forma] of receta) {
    const osc = ctx.createOscillator();
    const volumen = ctx.createGain();
    osc.type = forma;
    osc.frequency.value = frecuencia;
    // Subida y caída cortas para que no "chasquee"
    volumen.gain.setValueAtTime(0, ahora + inicio);
    volumen.gain.linearRampToValueAtTime(VOLUMEN, ahora + inicio + 0.01);
    volumen.gain.exponentialRampToValueAtTime(0.0001, ahora + inicio + duracion);
    osc.connect(volumen).connect(ctx.destination);
    osc.start(ahora + inicio);
    osc.stop(ahora + inicio + duracion + 0.02);
  }
}

export function puedeVibrar() {
  return typeof navigator.vibrate === 'function';
}

export function vibrar(nombre) {
  if (!leerAjustes().vibracion || !puedeVibrar()) return;
  navigator.vibrate(VIBRACION[nombre] ?? 0);
}

/** Sonido y vibración a la vez, según los ajustes. */
export function efecto(nombre) {
  sonar(nombre);
  vibrar(nombre);
}
