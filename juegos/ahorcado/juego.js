// Ahorcado (spec 009): adivinar una palabra técnica letra a letra con una definición en
// inglés como pista. 6 fallos y se pierde. Letras con el teclado en pantalla o el físico.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, botonAltavoz } from '../../src/ui/ronda.js';
import { crearEstado, probar, ganado, perdido, terminado, mascara, FALLOS_MAX } from './logica.js';

export const BANCO = 'ahorcado';
export const EJERCICIOS = 5;

const FILAS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

export function montar(raiz, partida) {
  return ronda(raiz, partida, (item, { responder, respondida }) => {
    let estado = crearEstado(item.palabra);
    const hueco = h('p', { class: 'ah-palabra', lang: 'en', 'aria-live': 'polite' });
    const vidas = h('p', { class: 'ah-vidas' });
    const teclasPantalla = new Map();
    const teclado = h('div', { class: 'ah-teclado', lang: 'en' }, FILAS.map((fila) => h('div', { class: 'ah-fila' },
      [...fila].map((l) => {
        const b = h('button', { class: 'ah-tecla', type: 'button', onclick: () => jugar(l), 'aria-label': l.toUpperCase() }, l);
        teclasPantalla.set(l, b);
        return b;
      }))));

    function pintar() {
      hueco.textContent = mascara(estado).split('').join(' ');
      hueco.setAttribute('aria-label', t('ah.letrasQueFaltan', { palabra: mascara(estado).replaceAll('_', '…'), n: [...mascara(estado)].filter((c) => c === '_').length }));
      const quedan = FALLOS_MAX - estado.fallos;
      vidas.replaceChildren(
        h('span', { class: 'ah-barra', 'aria-hidden': 'true' }, `[${'#'.repeat(quedan)}${'.'.repeat(estado.fallos)}]`),
        ` ${t('ah.vidas', { n: quedan })}`);
      for (const l of estado.probadas) {
        const b = teclasPantalla.get(l);
        b.disabled = true;
        b.classList.add(estado.palabra.includes(l) ? 'bien' : 'mal');
      }
    }

    function jugar(letra) {
      if (respondida() || terminado(estado)) return;
      estado = probar(estado, letra);
      pintar();
      if (!terminado(estado)) return;
      const acierto = ganado(estado);
      teclasPantalla.forEach((b) => { b.disabled = true; });
      hueco.textContent = item.palabra.toLowerCase().split('').join(' ');
      hueco.classList.add(acierto ? 'bien' : 'mal');
      responder(acierto, [
        h('p', { lang: 'en' }, h('strong', {}, item.palabra), ' ', botonAltavoz(item.palabra)),
        h('p', { class: 'traduccion' }, item.traduccion),
        perdido(estado) && item.explicacion?.[partida.idioma],
      ]);
    }

    function alPulsar(e) {
      if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input, textarea, dialog')) return;
      if (/^[a-z]$/i.test(e.key)) {
        e.preventDefault();
        jugar(e.key);
      }
    }
    document.addEventListener('keydown', alPulsar);
    pintar();

    return {
      nodos: [
        h('p', { class: 'ejercicio-pregunta' }, t('ah.instruccion')),
        h('div', { class: 'terminal ah-pista', lang: 'en' },
          h('p', { class: 'terminal-linea' }, h('span', { class: 'terminal-prompt' }, '$ '), 'define ', h('span', { class: 'tenue' }, '???')),
          h('p', { class: 'terminal-linea' }, item.pista)),
        hueco,
        vidas,
        teclado,
      ],
      alMostrar: () => teclasPantalla.get('e')?.focus({ preventScroll: true }),
      desmontar: () => document.removeEventListener('keydown', alPulsar),
    };
  });
}
