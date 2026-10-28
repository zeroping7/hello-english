// Bucle común de los minijuegos por ejercicios (D-016): pinta uno, espera la respuesta,
// enseña el panel de acierto o fallo con "Siguiente" y pasa al siguiente. Enter sigue.
// Cada minijuego solo dice cómo se pinta un ejercicio y cuándo se ha respondido.
import { h } from './dom.js';
import { t } from '../i18n/textos.js';
import { panelResultado, teclas, opciones } from './ejercicio.js';
import { icono } from './iconos.js';
import { barajar } from '../contenido/azar.js';
import { hayVoz, hablar } from '../voz/voz.js';
import { leerAjustes } from '../ajustes/ajustes.js';

/**
 * @param {HTMLElement} raiz
 * @param {{ ejercicios: object[], ponerContador: Function, alResponder: Function, alTerminar: Function }} partida
 * @param {(item: object, ctx: { responder: (acierto: boolean, lineas?: any[]) => void, respondida: () => boolean, indice: number })
 *   => { nodos: (Node|null|false)[], teclas?: object, alMostrar?: Function, desmontar?: Function }} pintar
 */
export function ronda(raiz, { ejercicios, ponerContador, alResponder, alTerminar }, pintar) {
  let i = 0;
  let respondida = false;
  let actual = {};
  let zona = null;

  function responder(acierto, lineas = []) {
    if (respondida) return;
    respondida = true;
    alResponder(ejercicios[i], acierto);
    const ultima = i === ejercicios.length - 1;
    const boton = h('button', { class: 'boton boton-principal', type: 'button', onclick: seguir },
      t(ultima ? 'juego.verResumen' : 'comun.siguiente'));
    zona.replaceChildren(panelResultado({ acierto, lineas }), boton);
    boton.focus({ preventScroll: true });
  }

  function seguir() {
    if (!respondida) return;
    actual.desmontar?.();
    i++;
    if (i >= ejercicios.length) alTerminar();
    else pintarActual();
  }

  function pintarActual() {
    respondida = false;
    ponerContador(i + 1, ejercicios.length);
    zona = h('div', { class: 'zona-resultado' });
    actual = pintar(ejercicios[i], { responder, respondida: () => respondida, indice: i }) ?? {};
    raiz.replaceChildren(...(actual.nodos ?? []).filter(Boolean), zona);
    actual.alMostrar?.();
  }

  // Las teclas del ejercicio solo valen mientras no se ha respondido
  const delEjercicio = (nombre) => (...args) => {
    const fn = actual.teclas?.[nombre];
    return !respondida && fn ? fn(...args) : false;
  };
  const quitarTeclas = teclas({
    alNumero: delEjercicio('alNumero'),
    alIzquierda: delEjercicio('alIzquierda'),
    alDerecha: delEjercicio('alDerecha'),
    alArriba: delEjercicio('alArriba'),
    alAbajo: delEjercicio('alAbajo'),
    alEnter: () => (respondida ? seguir() : delEjercicio('alEnter')()),
  });

  pintarActual();
  return {
    desmontar() {
      quitarTeclas();
      actual.desmontar?.();
    },
  };
}

/** Botón de opción numerado, como los de opciones() pero suelto. */
export function botonOpcion(numero, contenido, onclick, { lang = 'en' } = {}) {
  return h('button', { class: 'opcion-respuesta', type: 'button', lang, onclick },
    h('span', { class: 'opcion-tecla', 'aria-hidden': 'true' }, String(numero)),
    h('span', { class: 'opcion-texto' }, contenido),
    h('span', { class: 'opcion-marca', 'aria-hidden': 'true' }));
}

/**
 * Opciones barajadas con una correcta. Al elegir, marca la elegida y la buena y avisa.
 * @param {string[]} textos
 * @param {number} correcta índice en textos
 * @param {(acierto: boolean, indice: number) => void} alElegir indice = el de textos
 */
export function preguntaOpciones(textos, correcta, azar, alElegir, { lang = 'en' } = {}) {
  const orden = barajar(textos.map((_, i) => i), azar);
  const pos = orden.indexOf(correcta);
  const lista = opciones(orden.map((i) => textos[i]), (k) => {
    lista.marcar(k, pos);
    alElegir(k === pos, orden[k]);
  }, { lang });
  const botones = () => lista.elemento.querySelectorAll('button');
  return {
    elemento: lista.elemento,
    /** Elige la opción n (0, 1, 2...) como si se tocara; false si no existe. */
    elegir(n) {
      const b = botones()[n];
      if (!b || b.disabled) return false;
      b.click();
      return true;
    },
    /** Elige la opción con este texto (p. ej. la reconocida por voz). */
    elegirTexto(i) {
      return this.elegir(orden.indexOf(i));
    },
    enfocar: () => botones()[0]?.focus({ preventScroll: true }),
  };
}

/** Botones para escuchar un texto en inglés, normal y lento. */
export function botonesEscucha(texto, { lento = true } = {}) {
  if (!hayVoz()) return null;
  return h('div', { class: 'botones-voz' },
    h('button', { class: 'boton', type: 'button', onclick: () => hablar(texto) }, icono('escucha'), t('voz.escuchar')),
    lento && h('button', { class: 'boton', type: 'button', onclick: () => hablar(texto, { ...leerAjustes(), velocidad: 'lenta' }) },
      icono('escucha'), t('voz.escucharLento')));
}

/** Botón pequeño de altavoz para poner junto a una palabra o frase. */
export function botonAltavoz(texto, etiqueta = t('voz.escuchar')) {
  if (!hayVoz()) return null;
  return h('button', { class: 'boton-enlace', type: 'button', 'aria-label': etiqueta, onclick: () => hablar(texto) }, icono('escucha'));
}

/** Campo de texto con botón de comprobar. alEnviar recibe lo escrito. */
export function formularioRespuesta({ etiqueta, alEnviar, mono = true, ancho = null, lang = 'en' }) {
  const campo = h('input', {
    class: 'campo', type: 'text', lang, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
    'aria-label': etiqueta, style: ancho ? `max-width: ${ancho}ch` : null,
  });
  if (!mono) campo.style.fontFamily = 'var(--fuente-texto)';
  const boton = h('button', { class: 'boton boton-principal', type: 'submit' }, t('comun.comprobar'));
  const form = h('form', {
    class: 'formulario-respuesta',
    onsubmit: (e) => {
      e.preventDefault();
      if (campo.disabled || !campo.value.trim()) return;
      alEnviar(campo.value);
    },
  }, campo, boton);
  return {
    form,
    campo,
    cerrar(bien) {
      campo.disabled = true;
      boton.disabled = true;
      campo.classList.add(bien ? 'bien' : 'mal');
    },
  };
}
