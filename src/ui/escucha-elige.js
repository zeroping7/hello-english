// Escuchar y responder (Daily standup y Entrevista, specs 012 y 013): se oye a alguien, se
// puede ver el texto si hace falta y se elige la mejor respuesta, tocando o diciéndola en
// voz alta (el reconocimiento elige la opción que más se parece).
import { h } from './dom.js';
import { t } from '../i18n/textos.js';
import { preguntaOpciones, botonesEscucha, botonAltavoz } from './ronda.js';
import { icono } from './iconos.js';
import { hablar } from '../voz/voz.js';
import { hayReconocimiento, reconocer, parar } from '../voz/reconocer.js';
import { masParecida } from '../contenido/texto.js';

/**
 * @param {object} item con audio, opciones (la primera, la buena), traduccion y explicacion
 * @param {{ quien: string, rol: string, pregunta: string }} cabecera
 */
export function pintarEscuchaElige(item, { responder, respondida }, { azar, idioma, quien, rol, pregunta }) {
  const texto = h('p', { class: 'ee-texto', lang: 'en', hidden: true }, `“${item.audio}”`);
  const verTexto = h('button', { class: 'boton-enlace', type: 'button', onclick: () => { texto.hidden = false; verTexto.remove(); } }, t('voz.verTexto'));
  const estadoVoz = h('p', { class: 'db-estado', 'aria-live': 'polite' });

  const lista = preguntaOpciones(item.opciones, 0, azar, (acierto) => {
    parar();
    texto.hidden = false;
    verTexto.remove();
    microBoton?.remove();
    responder(acierto, [
      h('p', { lang: 'en' }, h('strong', {}, item.opciones[0]), ' ', botonAltavoz(item.opciones[0])),
      h('p', { class: 'traduccion' }, item.traduccion),
      item.explicacion?.[idioma],
    ]);
  });

  async function decir() {
    if (respondida()) return;
    microBoton.disabled = true;
    estadoVoz.textContent = t('db.escuchando');
    const r = await reconocer();
    if (respondida()) return;
    microBoton.disabled = false;
    if (!r.ok) {
      estadoVoz.textContent = t(`db.error.${r.motivo}`);
      return;
    }
    const i = masParecida(r.textos, item.opciones);
    if (i === -1) {
      estadoVoz.textContent = `${t('db.entendido', { texto: r.textos[0] })} ${t('ee.noCoincide')}`;
      return;
    }
    estadoVoz.textContent = t('db.entendido', { texto: r.textos[0] });
    lista.elegirTexto(i);
  }

  const microBoton = hayReconocimiento()
    ? h('button', { class: 'boton', type: 'button', onclick: decir }, icono('microfono'), t('ee.decir'))
    : null;

  return {
    nodos: [
      h('div', { class: 'ee-cabecera' },
        h('span', { class: 'ee-avatar', 'aria-hidden': 'true' }, quien.slice(0, 1)),
        h('span', { class: 'ee-quien' }, h('strong', {}, quien), h('span', { class: 'tenue' }, rol))),
      botonesEscucha(item.audio),
      h('div', { class: 'ee-burbuja' }, texto, verTexto),
      h('p', { class: 'ejercicio-pregunta ee-pregunta', lang: pregunta.lang }, pregunta.texto),
      lista.elemento,
      microBoton && h('div', { class: 'ee-voz' }, microBoton, estadoVoz, h('p', { class: 'nota-privacidad' }, t('db.privacidad'))),
    ],
    teclas: { alNumero: (n) => lista.elegir(n) },
    alMostrar: () => {
      lista.enfocar();
      hablar(item.audio);
    },
    desmontar: parar,
  };
}
