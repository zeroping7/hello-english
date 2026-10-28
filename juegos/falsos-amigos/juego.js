// Falsos amigos (spec 003): ¿la palabra inglesa significa lo que parece? Se responde
// deslizando la tarjeta, con los botones o con las flechas.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { panelResultado, teclas } from '../../src/ui/ejercicio.js';
import { hayVoz, hablar } from '../../src/voz/voz.js';
import { icono } from '../../src/ui/iconos.js';
import { comprobar, leerDeslizamiento } from './logica.js';

export const BANCO = 'falsos-amigos';
export const EJERCICIOS = 10;

const sinMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function montar(raiz, { ejercicios, idioma, ponerContador, alResponder, alTerminar }) {
  let i = 0;
  let respondida = false;
  let responderActual = null;
  let seguirActual = null;

  function pintar() {
    const tarjeta = ejercicios[i];
    respondida = false;
    ponerContador(i + 1);

    const pista = h('span', { class: 'fa-pista', 'aria-hidden': 'true' });
    const carta = h('div', { class: 'fa-carta', role: 'group', 'aria-label': t('fa.pregunta', { en: tarjeta.en, es: tarjeta.es }) },
      pista,
      h('p', { class: 'fa-en', lang: 'en' }, tarjeta.en),
      h('p', { class: 'fa-igual' }, '='),
      h('p', { class: 'fa-es', lang: 'es' }, `${tarjeta.es}?`),
      hayVoz() && h('button', {
        class: 'boton boton-icono fa-escuchar', type: 'button', 'aria-label': t('fa.escuchar'),
        onclick: (e) => { e.stopPropagation(); hablar(tarjeta.en); },
      }, icono('escucha')));

    const botones = h('div', { class: 'fa-botones' },
      h('button', { class: 'boton fa-boton fa-no', type: 'button', onclick: () => responder(false) },
        h('span', { 'aria-hidden': 'true' }, '✗ '), t('fa.falso')),
      h('button', { class: 'boton fa-boton fa-si', type: 'button', onclick: () => responder(true) },
        t('fa.verdad'), h('span', { 'aria-hidden': 'true' }, ' ✓')));

    const zonaResultado = h('div', { class: 'zona-resultado' });

    function responder(diceVerdad) {
      if (respondida) return;
      respondida = true;
      const acierto = comprobar(tarjeta, diceVerdad);
      alResponder(tarjeta, acierto);
      carta.classList.add(diceVerdad ? 'fuera-derecha' : 'fuera-izquierda', acierto ? 'ok' : 'mal');
      botones.querySelectorAll('button').forEach((b) => { b.disabled = true; });

      const ultima = i === ejercicios.length - 1;
      const siguiente = h('button', { class: 'boton boton-principal', type: 'button', onclick: seguir },
        t(ultima ? 'juego.verResumen' : 'comun.siguiente'));
      zonaResultado.replaceChildren(
        panelResultado({
          acierto,
          lineas: [
            h('p', { class: 'fa-significa' },
              h('strong', { lang: 'en' }, tarjeta.en), ' → ', tarjeta.significa[idioma] ?? tarjeta.significa.es),
            h('p', { class: 'fa-ejemplo', lang: 'en' }, `“${tarjeta.ejemplo}”`,
              hayVoz() && h('button', {
                class: 'boton-enlace', type: 'button', 'aria-label': t('fa.escucharEjemplo'),
                onclick: () => hablar(tarjeta.ejemplo),
              }, icono('escucha'))),
            !acierto && tarjeta.explicacion[idioma],
          ],
        }),
        siguiente);
      siguiente.focus({ preventScroll: true });
    }

    function seguir() {
      if (!respondida) return;
      i++;
      if (i >= ejercicios.length) alTerminar();
      else pintar();
    }

    responderActual = responder;
    seguirActual = seguir;
    activarGesto(carta, pista, responder);

    raiz.replaceChildren(
      h('p', { class: 'ejercicio-pregunta' }, t('fa.instruccion')),
      carta, botones, zonaResultado);
  }

  const quitarTeclas = teclas({
    alIzquierda: () => !respondida && responderActual?.(false),
    alDerecha: () => !respondida && responderActual?.(true),
    alEnter: () => respondida && seguirActual?.(),
  });

  pintar();
  return { desmontar: quitarTeclas };
}

/** Arrastrar la tarjeta a un lado u otro (plan §4). */
function activarGesto(carta, pista, responder) {
  let inicioX = null;
  let dx = 0;

  carta.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || carta.classList.contains('ok') || carta.classList.contains('mal')) return;
    inicioX = e.clientX;
    dx = 0;
    carta.setPointerCapture(e.pointerId);
    carta.classList.add('arrastrando');
  });

  carta.addEventListener('pointermove', (e) => {
    if (inicioX === null) return;
    dx = e.clientX - inicioX;
    if (!sinMovimiento()) carta.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
    const lado = leerDeslizamiento(dx, carta.offsetWidth);
    pista.textContent = lado === true ? `✓ ${t('fa.verdad')}` : lado === false ? `✗ ${t('fa.falso')}` : '';
    pista.className = `fa-pista ${lado === true ? 'derecha' : lado === false ? 'izquierda' : ''}`;
  });

  function soltar() {
    if (inicioX === null) return;
    inicioX = null;
    carta.classList.remove('arrastrando');
    carta.style.transform = '';
    pista.textContent = '';
    const lado = leerDeslizamiento(dx, carta.offsetWidth);
    if (lado !== null) responder(lado);
  }

  carta.addEventListener('pointerup', soltar);
  carta.addEventListener('pointercancel', () => { dx = 0; soltar(); });
}
