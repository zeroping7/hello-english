// Incidente en producción (spec 007): una historia por pasos. En cada uno se leen logs y
// mensajes en inglés y se decide qué hacer; el final depende de las decisiones.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { panelResultado, teclas } from '../../src/ui/ejercicio.js';
import { preguntaOpciones } from '../../src/ui/ronda.js';
import { tipoDeLinea, final } from './logica.js';

export const BANCO = 'incidente';
export const EJERCICIOS = 2;

export function montar(raiz, { ejercicios, azar, idioma, ponerContador, alResponder, alTerminar }) {
  let i = 0;          // historia
  let paso = 0;
  let bienEnEsta = 0;
  let respondida = false;
  let lista = null;
  let seguir = null;

  function pintarPaso() {
    const item = ejercicios[i];
    const p = item.pasos[paso];
    respondida = false;
    ponerContador(paso + 1, item.pasos.length);

    const zona = h('div', { class: 'zona-resultado' });
    lista = preguntaOpciones(p.opciones.map((o) => o.texto), p.opciones.findIndex((o) => o.bien), azar, (acierto, k) => {
      respondida = true;
      if (acierto) bienEnEsta++;
      alResponder(item, acierto);
      const ultimo = paso === item.pasos.length - 1;
      const boton = h('button', { class: 'boton boton-principal', type: 'button', onclick: () => seguir() },
        t(ultimo ? 'in.verFinal' : 'comun.siguiente'));
      zona.replaceChildren(panelResultado({ acierto, lineas: [p.opciones[k].nota[idioma]] }), boton);
      boton.focus({ preventScroll: true });
    });

    seguir = () => {
      paso++;
      if (paso < item.pasos.length) pintarPaso();
      else pintarFinal();
    };

    raiz.replaceChildren(
      h('p', { class: 'in-titulo' }, h('span', { class: 'in-alerta' }, '● '), h('span', { lang: 'en' }, item.titulo),
        ejercicios.length > 1 && h('span', { class: 'tenue' }, ` · ${t('in.historia', { n: i + 1, total: ejercicios.length })}`)),
      h('div', { class: 'terminal in-log', lang: 'en', role: 'log' },
        p.log.map((linea) => h('p', { class: `terminal-linea in-${tipoDeLinea(linea)}` }, linea))),
      h('p', { class: 'ejercicio-pregunta in-pregunta', lang: 'en' }, p.pregunta),
      lista.elemento,
      zona);
    if (paso === 0) window.scrollTo(0, 0);
  }

  function pintarFinal() {
    const item = ejercicios[i];
    const como = final(bienEnEsta, item.pasos.length);
    const ultima = i === ejercicios.length - 1;
    const boton = h('button', { class: 'boton boton-principal', type: 'button', onclick: () => seguir() },
      t(ultima ? 'juego.verResumen' : 'in.siguienteHistoria'));
    seguir = () => {
      i++;
      paso = 0;
      bienEnEsta = 0;
      if (i < ejercicios.length) pintarPaso();
      else alTerminar();
    };
    respondida = true;
    raiz.replaceChildren(
      h('section', { class: `in-final ${como}`, role: 'status' },
        h('h2', { class: 'in-final-titulo' }, t(`in.final.${como}`)),
        h('p', {}, t(`in.final.${como}.texto`, { n: bienEnEsta, total: item.pasos.length })),
        h('p', { class: 'in-causa' }, h('strong', {}, t('in.causa')), ' ', h('span', { lang: 'en' }, item.causa)),
        item.explicacion && h('p', {}, item.explicacion[idioma])),
      h('div', { class: 'zona-resultado' }, boton));
    boton.focus({ preventScroll: true });
  }

  const quitarTeclas = teclas({
    alNumero: (n) => (!respondida ? lista?.elegir(n) : false),
    alEnter: () => respondida && seguir?.(),
  });

  pintarPaso();
  return { desmontar: quitarTeclas };
}
