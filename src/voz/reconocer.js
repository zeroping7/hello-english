// Reconocimiento de voz del navegador (Web Speech API, D-017). Solo lo usan Dilo bien,
// Daily standup y Entrevista, y siempre con una alternativa sin micrófono (constitución C1).
// Aviso: en Chrome el audio se procesa en los servidores de Google; la pantalla lo dice.
import { leerAjustes } from '../ajustes/ajustes.js';

const IDIOMA = { gb: 'en-GB', us: 'en-US' };
const ESPERA = 8000;

const Reconocedor = () => globalThis.SpeechRecognition ?? globalThis.webkitSpeechRecognition;

export function hayReconocimiento() {
  return typeof Reconocedor() === 'function';
}

let enCurso = null;

/**
 * Escucha una frase en inglés.
 * @returns {Promise<{ ok: true, textos: string[] } | { ok: false, motivo: 'no-disponible'|'permiso'|'nada'|'error' }>}
 */
export function reconocer({ acento = leerAjustes().acento } = {}) {
  if (!hayReconocimiento()) return Promise.resolve({ ok: false, motivo: 'no-disponible' });
  parar();
  return new Promise((resolver) => {
    const r = new (Reconocedor())();
    enCurso = r;
    r.lang = IDIOMA[acento] ?? 'en-GB';
    r.interimResults = false;
    r.maxAlternatives = 5;
    let hecho = false;
    const acabar = (resultado) => {
      if (hecho) return;
      hecho = true;
      clearTimeout(limite);
      if (enCurso === r) enCurso = null;
      resolver(resultado);
    };
    const limite = setTimeout(() => { r.abort(); acabar({ ok: false, motivo: 'nada' }); }, ESPERA);
    r.onresult = (e) => {
      const textos = Array.from(e.results[0] ?? [], (alt) => alt.transcript);
      acabar(textos.length ? { ok: true, textos } : { ok: false, motivo: 'nada' });
    };
    r.onerror = (e) => acabar({ ok: false, motivo: e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'permiso' : e.error === 'no-speech' ? 'nada' : 'error' });
    r.onend = () => acabar({ ok: false, motivo: 'nada' });
    try {
      r.start();
    } catch {
      acabar({ ok: false, motivo: 'error' });
    }
  });
}

export function parar() {
  try { enCurso?.abort(); } catch { /* ya parado */ }
  enCurso = null;
}
