// Diálogo de confirmación con <dialog> (foco atrapado y Esc para cancelar, de serie).
// Con `palabra`, el botón de aceptar solo se activa al escribirla (HU-5, borrar progreso).
import { h } from './dom.js';
import { t } from '../i18n/textos.js';

/**
 * @param {{ titulo: string, texto: string, aceptar?: string, peligro?: boolean, palabra?: string }} opciones
 * @returns {Promise<boolean>}
 */
export function confirmar({ titulo, texto, aceptar = t('comun.aceptar'), peligro = false, palabra = null }) {
  return new Promise((resolver) => {
    const campo = palabra && h('input', {
      class: 'campo',
      type: 'text',
      autocomplete: 'off',
      autocapitalize: 'characters',
      spellcheck: 'false',
      'aria-label': t('dialogo.escribe', { palabra }),
    });

    const botonAceptar = h('button', {
      class: peligro ? 'boton boton-peligro' : 'boton boton-principal',
      type: 'submit',
      value: 'si',
      disabled: Boolean(palabra),
    }, aceptar);

    const dialogo = h('dialog', { class: 'dialogo', 'aria-labelledby': 'dialogo-titulo' },
      h('form', { method: 'dialog' },
        h('h2', { id: 'dialogo-titulo', class: 'dialogo-titulo' }, titulo),
        h('p', {}, texto),
        palabra && h('label', { class: 'dialogo-palabra' },
          h('span', {}, t('dialogo.escribe', { palabra })), campo),
        h('div', { class: 'dialogo-botones' },
          h('button', { class: 'boton', type: 'submit', value: 'no' }, t('comun.cancelar')),
          botonAceptar)));

    campo?.addEventListener('input', () => {
      botonAceptar.disabled = campo.value.trim().toUpperCase() !== palabra.toUpperCase();
    });

    dialogo.addEventListener('close', () => {
      resolver(dialogo.returnValue === 'si');
      dialogo.remove();
    });

    document.body.append(dialogo);
    if (typeof dialogo.showModal === 'function') {
      dialogo.showModal();
      (campo ?? dialogo.querySelector('button[value="no"]')).focus();
    } else {
      // Navegadores sin <dialog>: confirmación nativa
      dialogo.remove();
      resolver(window.confirm(`${titulo}\n\n${texto}`));
    }
  });
}
