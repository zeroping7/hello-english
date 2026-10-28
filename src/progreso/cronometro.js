// Cuenta el tiempo de práctica (HU-4): solo mientras la pestaña está visible. Guarda cada
// 15 s, al ocultarse la pestaña y al parar, para no escribir en el almacén cada segundo.
import { sumarTiempo } from './progreso.js';

const CADA = 15;

/** Empieza a contar. Llama a parar() al salir del minijuego. */
export function iniciarCronometro() {
  let pendientes = 0;

  function volcar() {
    if (pendientes > 0) sumarTiempo(pendientes);
    pendientes = 0;
  }

  const intervalo = setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    pendientes++;
    if (pendientes >= CADA) volcar();
  }, 1000);

  function alCambiarVisibilidad() {
    if (document.visibilityState === 'hidden') volcar();
  }

  document.addEventListener('visibilitychange', alCambiarVisibilidad);
  window.addEventListener('pagehide', volcar);

  return {
    parar() {
      clearInterval(intervalo);
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      window.removeEventListener('pagehide', volcar);
      volcar();
    },
  };
}
