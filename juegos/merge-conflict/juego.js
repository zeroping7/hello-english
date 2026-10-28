// Merge Conflict (spec 004): dos versiones de una frase en un conflicto de git; se acepta
// la que está bien escrita.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { panelResultado, teclas } from '../../src/ui/ejercicio.js';
import { hayVoz, hablar } from '../../src/voz/voz.js';
import { icono } from '../../src/ui/iconos.js';
import { prepararConflicto, comprobar } from './logica.js';

export const BANCO = 'merge-conflict';
export const EJERCICIOS = 8;

function linea(numero, clase, ...contenido) {
  return h('div', { class: `mc-linea ${clase}` },
    h('span', { class: 'mc-numero', 'aria-hidden': 'true' }, String(numero)),
    h('span', { class: 'mc-texto' }, ...contenido));
}

export function montar(raiz, { ejercicios, idioma, azar, ponerContador, alResponder, alTerminar }) {
  let i = 0;
  let respondida = false;
  let responderActual = null;
  let seguirActual = null;

  function pintar() {
    const item = ejercicios[i];
    const conflicto = prepararConflicto(item, azar);
    respondida = false;
    ponerContador(i + 1);

    const bloque = h('div', { class: 'mc-bloque', role: 'group', 'aria-label': t('mc.instruccion') },
      linea(12, 'mc-marca', '<<<<<<< HEAD ', h('span', { class: 'mc-nota' }, '(Current Change)')),
      linea(13, 'mc-arriba', h('span', { lang: 'en' }, conflicto.arriba)),
      linea(14, 'mc-marca', '======='),
      linea(15, 'mc-abajo', h('span', { lang: 'en' }, conflicto.abajo)),
      linea(16, 'mc-marca', `>>>>>>> ${conflicto.rama} `, h('span', { class: 'mc-nota' }, '(Incoming Change)')));

    const botones = h('div', { class: 'mc-botones' },
      h('button', { class: 'boton mc-boton mc-boton-arriba', type: 'button', onclick: () => responder('arriba') },
        h('span', { class: 'opcion-tecla', 'aria-hidden': 'true' }, '1'),
        h('span', { class: 'mc-boton-texto' },
          h('span', { lang: 'en' }, t('mc.aceptarArriba')),
          h('span', { class: 'mc-ayuda' }, t('mc.ayudaArriba')))),
      h('button', { class: 'boton mc-boton mc-boton-abajo', type: 'button', onclick: () => responder('abajo') },
        h('span', { class: 'opcion-tecla', 'aria-hidden': 'true' }, '2'),
        h('span', { class: 'mc-boton-texto' },
          h('span', { lang: 'en' }, t('mc.aceptarAbajo')),
          h('span', { class: 'mc-ayuda' }, t('mc.ayudaAbajo')))));

    const zonaResultado = h('div', { class: 'zona-resultado' });

    function responder(lado) {
      if (respondida) return;
      respondida = true;
      const acierto = comprobar(conflicto, lado);
      alResponder(item, acierto);
      botones.querySelectorAll('button').forEach((b) => { b.disabled = true; });

      // El bloque se "fusiona": queda solo la versión correcta
      bloque.replaceChildren(
        linea(12, `mc-fusionada ${acierto ? 'ok' : 'mal'}`,
          h('span', { lang: 'en' }, item.correcta),
          hayVoz() && h('button', {
            class: 'boton-enlace', type: 'button', 'aria-label': t('mc.escuchar'), onclick: () => hablar(item.correcta),
          }, icono('escucha'))));
      bloque.classList.add('resuelto');

      const ultima = i === ejercicios.length - 1;
      const siguiente = h('button', { class: 'boton boton-principal', type: 'button', onclick: seguir },
        t(ultima ? 'juego.verResumen' : 'comun.siguiente'));
      zonaResultado.replaceChildren(
        panelResultado({
          acierto,
          lineas: [
            h('p', { class: 'traduccion' }, item.traduccion),
            !acierto && h('p', {}, h('span', { class: 'mc-elegida', lang: 'en' }, `✗ ${lado === 'arriba' ? conflicto.arriba : conflicto.abajo}`)),
            !acierto && item.explicacion[idioma],
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
    raiz.replaceChildren(
      h('p', { class: 'ejercicio-pregunta' }, t('mc.instruccion')),
      bloque, botones, zonaResultado);
  }

  const quitarTeclas = teclas({
    alNumero: (n) => !respondida && n < 2 && responderActual?.(n === 0 ? 'arriba' : 'abajo'),
    alArriba: () => !respondida && responderActual?.('arriba'),
    alAbajo: () => !respondida && responderActual?.('abajo'),
    alEnter: () => respondida && seguirActual?.(),
  });

  pintar();
  return { desmontar: quitarTeclas };
}
