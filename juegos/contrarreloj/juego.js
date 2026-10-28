// Contrarreloj (spec 019): 60 segundos para traducir todas las palabras que se pueda,
// eligiendo entre dos. El tiempo solo corre con la pestaña visible.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { panelResultado, teclas } from '../../src/ui/ejercicio.js';
import { prepararPregunta, quedan, SEGUNDOS } from './logica.js';

export const BANCO = 'contrarreloj';
export const EJERCICIOS = 40;
const PAUSA_MS = 350;

export function montar(raiz, { ejercicios, azar, ponerContador, alResponder, alTerminar }) {
  let i = 0;
  let usados = 0;
  let bloqueado = false;
  let acabado = false;
  let pregunta = null;
  const falladas = [];
  let aciertos = 0;

  const reloj = h('p', { class: 'cr-reloj', role: 'timer', 'aria-live': 'off' });
  const barra = h('progress', { class: 'cr-barra', max: SEGUNDOS, value: SEGUNDOS, 'aria-hidden': 'true' });
  const palabra = h('p', { class: 'cr-palabra', lang: 'en' });
  const botones = [0, 1].map((k) => h('button', { class: 'boton cr-opcion', type: 'button', lang: 'es', onclick: () => responder(k) }));
  const marcador = h('p', { class: 'cr-marcador', 'aria-live': 'polite' });

  function pintarReloj() {
    const q = quedan(usados);
    reloj.textContent = `${q}s`;
    reloj.classList.toggle('poco', q <= 10);
    barra.value = q;
  }

  function pintarPregunta() {
    const item = ejercicios[i];
    pregunta = prepararPregunta(item, azar);
    palabra.textContent = item.en;
    botones.forEach((b, k) => {
      b.className = 'boton cr-opcion';
      b.replaceChildren(h('span', { class: 'opcion-tecla', 'aria-hidden': 'true' }, String(k + 1)), pregunta.opciones[k]);
    });
    ponerContador(i + 1, ejercicios.length);
  }

  function responder(k) {
    if (bloqueado || acabado) return;
    const item = ejercicios[i];
    const acierto = k === pregunta.correcta;
    bloqueado = true;
    botones[k].classList.add(acierto ? 'bien' : 'mal');
    if (!acierto) {
      botones[pregunta.correcta].classList.add('bien');
      falladas.push(item);
    } else {
      aciertos++;
    }
    marcador.textContent = t('cr.marcador', { n: aciertos });
    alResponder(item, acierto);
    setTimeout(() => {
      bloqueado = false;
      i++;
      if (acabado) return;
      if (i >= ejercicios.length) terminar();
      else pintarPregunta();
    }, acierto ? PAUSA_MS : PAUSA_MS * 3);
  }

  const intervalo = setInterval(() => {
    if (acabado || document.visibilityState !== 'visible') return;
    usados++;
    pintarReloj();
    if (quedan(usados) === 0) terminar();
  }, 1000);

  function terminar() {
    if (acabado) return;
    acabado = true;
    clearInterval(intervalo);
    const seguir = h('button', { class: 'boton boton-principal', type: 'button', onclick: alTerminar }, t('juego.verResumen'));
    raiz.replaceChildren(
      panelResultado({
        acierto: falladas.length === 0,
        lineas: [
          h('p', {}, t(quedan(usados) === 0 ? 'cr.tiempo' : 'cr.todas', { n: aciertos })),
          falladas.length > 0 && h('p', {}, t('cr.repasa')),
          falladas.length > 0 && h('ul', { class: 'cr-falladas' }, falladas.map((f) => h('li', {}, h('strong', { lang: 'en' }, f.en), ' = ', f.es))),
        ],
      }),
      h('div', { class: 'zona-resultado' }, seguir));
    seguir.focus({ preventScroll: true });
  }

  const quitarTeclas = teclas({
    alNumero: (n) => (n < 2 && !acabado ? responder(n) : false),
    alIzquierda: () => (!acabado ? responder(0) : false),
    alDerecha: () => (!acabado ? responder(1) : false),
  });

  pintarReloj();
  pintarPregunta();
  raiz.replaceChildren(
    h('div', { class: 'cr-cabecera' }, reloj, marcador),
    barra,
    h('p', { class: 'ejercicio-pregunta' }, t('cr.instruccion')),
    palabra,
    h('div', { class: 'cr-opciones' }, botones));
  botones[0].focus({ preventScroll: true });

  return {
    desmontar() {
      acabado = true;
      clearInterval(intervalo);
      quitarTeclas();
    },
  };
}
