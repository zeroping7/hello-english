// Dilo bien (spec 011): términos que los hispanohablantes suelen pronunciar mal. Con
// micrófono, se dice y lo comprueba el reconocimiento de voz (2 intentos); sin él, o si el
// usuario lo prefiere, se elige cómo suena entre tres opciones.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { ronda, preguntaOpciones, botonAltavoz } from '../../src/ui/ronda.js';
import { icono } from '../../src/ui/iconos.js';
import { hayReconocimiento, reconocer, parar } from '../../src/voz/reconocer.js';
import { reconocido, opcionesDe, INTENTOS } from './logica.js';

export const BANCO = 'dilo-bien';
export const EJERCICIOS = 6;

export function montar(raiz, partida) {
  const { azar, idioma } = partida;
  let conMicro = hayReconocimiento();   // se puede cambiar durante la partida

  return ronda(raiz, partida, (item, { responder, respondida }) => {
    const zonaModo = h('div', { class: 'db-modo' });
    let lista = null;
    let intentos = 0;

    const lineasFinales = (acierto) => [
      h('p', { lang: 'en' }, h('strong', {}, item.termino), ' ', h('span', { class: 'db-ipa' }, item.ipa), ' ', botonAltavoz(item.termino)),
      h('p', {}, t('db.suena', { suena: item.suena })),
      !acierto && h('p', {}, h('span', { class: 'db-mal' }, '✗ '), t('db.noAsi', { error: item.otras[0] })),
      item.explicacion[idioma],
    ];

    function modoMicro() {
      const estado = h('p', { class: 'db-estado', 'aria-live': 'polite' });
      const hablarBoton = h('button', { class: 'boton boton-principal boton-grande db-micro', type: 'button', onclick: escuchar },
        icono('microfono'), t('db.decir'));

      async function escuchar() {
        if (respondida()) return;
        hablarBoton.disabled = true;
        hablarBoton.classList.add('escuchando');
        estado.textContent = t('db.escuchando');
        const r = await reconocer();
        hablarBoton.classList.remove('escuchando');
        if (respondida()) return;
        if (!r.ok) {
          hablarBoton.disabled = false;
          estado.textContent = t(`db.error.${r.motivo}`);
          if (r.motivo === 'permiso' || r.motivo === 'no-disponible') { conMicro = false; modoElegir(); }
          return;
        }
        intentos++;
        const bien = reconocido(item, r.textos);
        if (bien || intentos >= INTENTOS) {
          estado.textContent = t('db.entendido', { texto: r.textos[0] });
          responder(bien, lineasFinales(bien));
          return;
        }
        hablarBoton.disabled = false;
        estado.textContent = `${t('db.entendido', { texto: r.textos[0] })} ${t('db.otraVez')}`;
      }

      zonaModo.replaceChildren(
        hablarBoton,
        estado,
        h('p', { class: 'nota-privacidad' }, t('db.privacidad')),
        h('button', { class: 'boton-enlace', type: 'button', onclick: () => { conMicro = false; parar(); modoElegir(); } }, t('db.sinMicro')));
    }

    function modoElegir() {
      lista = preguntaOpciones(opcionesDe(item), 0, azar, (acierto) => responder(acierto, lineasFinales(acierto)), { lang: 'es' });
      zonaModo.replaceChildren(
        h('p', { class: 'ejercicio-pregunta' }, t('db.comoSuena')),
        lista.elemento);
      if (hayReconocimiento()) {
        zonaModo.append(h('button', { class: 'boton-enlace', type: 'button', onclick: () => { conMicro = true; modoMicro(); } }, t('db.conMicro')));
      }
    }

    if (conMicro) modoMicro();
    else modoElegir();

    return {
      nodos: [
        h('p', { class: 'ejercicio-pregunta' }, t('db.instruccion')),
        h('p', { class: 'db-termino', lang: 'en' }, item.termino),
        zonaModo,
      ],
      teclas: { alNumero: (n) => (lista && !conMicro ? lista.elegir(n) : false) },
      alMostrar: () => zonaModo.querySelector('button')?.focus({ preventScroll: true }),
      desmontar: parar,
    };
  });
}
