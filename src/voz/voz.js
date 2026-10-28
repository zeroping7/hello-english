// Leer en voz alta con la voz del navegador (D-005): británica por defecto, americana en
// Ajustes, velocidad normal o lenta. Se prefieren las voces locales, que no envían el texto
// fuera del dispositivo (constitución PR1). El reconocimiento de voz llegará con el primer
// minijuego que lo use.
import { leerAjustes } from '../ajustes/ajustes.js';

const IDIOMA = { gb: 'en-GB', us: 'en-US' };
const VELOCIDAD = { normal: 1, lenta: 0.75 };
const ESPERA_VOCES = 2000;

let promesaVoces = null;

export function hayVoz() {
  return 'speechSynthesis' in globalThis && 'SpeechSynthesisUtterance' in globalThis;
}

/** Las voces se cargan tarde en algunos navegadores: se espera a voiceschanged, como mucho 2 s. */
function voces() {
  if (!hayVoz()) return Promise.resolve([]);
  const ya = speechSynthesis.getVoices();
  if (ya.length) return Promise.resolve(ya);
  promesaVoces ??= new Promise((resolver) => {
    const listo = () => resolver(speechSynthesis.getVoices());
    speechSynthesis.addEventListener('voiceschanged', listo, { once: true });
    setTimeout(listo, ESPERA_VOCES);
  });
  return promesaVoces;
}

const idiomaDe = (voz) => voz.lang.replace('_', '-').toLowerCase();

/**
 * La mejor voz para un acento.
 * @returns {Promise<{ voz: SpeechSynthesisVoice|null, exacta: boolean }>}
 */
export async function elegirVoz(acento = leerAjustes().acento) {
  const lista = await voces();
  const buscado = IDIOMA[acento].toLowerCase();
  const porPreferencia = (a, b) => Number(b.localService) - Number(a.localService);

  const exactas = lista.filter((v) => idiomaDe(v) === buscado).sort(porPreferencia);
  if (exactas.length) return { voz: exactas[0], exacta: true };

  const inglesas = lista.filter((v) => idiomaDe(v).startsWith('en')).sort(porPreferencia);
  return { voz: inglesas[0] ?? null, exacta: false };
}

/** Lee un texto en inglés. Se cumple al terminar (o al fallar, sin lanzar). */
export async function hablar(texto, { acento, velocidad } = leerAjustes()) {
  if (!hayVoz()) return;
  const { voz } = await elegirVoz(acento);
  speechSynthesis.cancel();
  const frase = new SpeechSynthesisUtterance(texto);
  frase.lang = voz?.lang ?? IDIOMA[acento];
  if (voz) frase.voice = voz;
  frase.rate = VELOCIDAD[velocidad] ?? 1;
  await new Promise((resolver) => {
    frase.onend = resolver;
    frase.onerror = resolver;
    speechSynthesis.speak(frase);
  });
}

export function callar() {
  if (hayVoz()) speechSynthesis.cancel();
}
