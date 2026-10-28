// Prueba de nivel (spec 002): 10 preguntas adaptativas y el nivel resultante.
// Se llega desde la bienvenida (sin terminar) o desde Ajustes.
import { h } from '../ui/dom.js';
import { t, idiomaActual } from '../i18n/textos.js';
import { navegar, volver } from '../router.js';
import { barraConVolver } from '../ui/barra.js';
import { contador, opciones, panelResultado, resumen, teclas, frase } from '../ui/ejercicio.js';
import { confirmar } from '../ui/confirmar.js';
import { avisoFijo } from '../ui/aviso.js';
import { cargarBanco } from '../contenido/cargar.js';
import { crearAzar, barajar } from '../contenido/azar.js';
import { crearPrueba, siguiente, responder, resultado, terminada, TOTAL } from '../prueba/logica.js';
import { fijarNivel } from '../progreso/progreso.js';
import { iniciarCronometro } from '../progreso/cronometro.js';
import { leerAjustes, cambiarAjuste } from '../ajustes/ajustes.js';
import { efecto } from '../sonido/sonido.js';

export function montar(raiz) {
  const desdeBienvenida = !leerAjustes().bienvenidaHecha;
  const azar = crearAzar();
  const cronometro = iniciarCronometro();
  let estado = null;
  let fase = 'cargando';        // 'pregunta' | 'respondida' | 'resultado'
  let alSeguir = null;
  let elegir = null;

  const zonaContador = h('div', {});
  const cuerpo = h('main', { class: 'contenido ejercicio', 'data-esc-propio': true, 'aria-live': 'polite' });

  async function salir() {
    if (fase !== 'resultado') {
      const si = await confirmar({ titulo: t('prueba.salir'), texto: t('prueba.salir.texto'), aceptar: t('prueba.salir') });
      if (!si) return;
    }
    if (desdeBienvenida) navegar('/bienvenida', { reemplazar: true });
    else volver();
  }

  function pintarPregunta() {
    estado = siguiente(estado);
    const p = estado.actual;
    const orden = barajar([0, 1, 2, 3], azar);
    const correcta = orden.indexOf(p.correcta);
    fase = 'pregunta';
    zonaContador.replaceChildren(contador(estado.respondidas.length + 1, TOTAL));

    const lista = opciones(orden.map((i) => p.opciones[i]), (i) => {
      if (fase !== 'pregunta') return;
      const acierto = i === correcta;
      lista.marcar(i, correcta);
      efecto(acierto ? 'acierto' : 'fallo');
      estado = responder(estado, acierto);
      pintarRespondida(p, acierto);
    });
    elegir = (i) => i < 4 && lista.elemento.querySelectorAll('button')[i]?.click();

    cuerpo.replaceChildren(
      h('p', { class: 'ejercicio-pregunta' }, t('prueba.instruccion')),
      frase(p.enunciado),
      lista.elemento,
      h('div', { class: 'zona-resultado' }));
    cuerpo.querySelector('.opcion-respuesta')?.focus({ preventScroll: true });
  }

  function pintarRespondida(p, acierto) {
    fase = 'respondida';
    cuerpo.querySelector('.frase').replaceWith(frase(p.enunciado, p.opciones[p.correcta]));
    const ultima = terminada(estado);
    const boton = h('button', { class: 'boton boton-principal', type: 'button', onclick: () => seguir() },
      t(ultima ? 'prueba.verResultado' : 'comun.siguiente'));
    cuerpo.querySelector('.zona-resultado').replaceChildren(
      panelResultado({
        acierto,
        lineas: [
          h('p', { class: 'traduccion' }, p.traduccion),
          !acierto && p.explicacion[idiomaActual()],
        ],
      }),
      boton);
    boton.focus({ preventScroll: true });
    alSeguir = seguir;
  }

  function seguir() {
    if (fase !== 'respondida') return;
    if (terminada(estado)) pintarResultado();
    else pintarPregunta();
  }

  function pintarResultado() {
    fase = 'resultado';
    const r = resultado(estado);
    zonaContador.replaceChildren();
    cuerpo.replaceChildren(
      resumen({
        titulo: t('prueba.tuNivel'),
        aciertos: r.aciertos,
        total: TOTAL,
        botones: [h('button', { class: 'boton boton-principal', type: 'button', onclick: () => empezar(r.nivel) }, t('prueba.empezar'))],
      }));
    cuerpo.querySelector('.resumen-final-titulo').after(
      h('p', { class: 'nivel-resultado' }, h('span', { class: 'nivel-codigo' }, r.nivel), ' · ', t(`nivel.${r.nivel}`)));
    efecto('meta');
    cuerpo.querySelector('.boton-principal').focus({ preventScroll: true });
  }

  async function empezar(nivel) {
    fijarNivel(nivel);
    if (desdeBienvenida) await cambiarAjuste('bienvenidaHecha', true);
    navegar('/inicio', { reemplazar: true });
  }

  const quitarTeclas = teclas({
    alNumero: (i) => fase === 'pregunta' && elegir?.(i),
    alEnter: () => fase === 'respondida' && alSeguir?.(),
  });
  function alPulsarEsc(e) {
    if (e.key === 'Escape' && !e.target.closest?.('dialog')) salir();
  }
  document.addEventListener('keydown', alPulsarEsc);

  raiz.append(barraConVolver(t('prueba.titulo'), { alVolver: salir, extra: zonaContador }), cuerpo);

  cargarBanco('prueba-nivel')
    .then((preguntas) => {
      estado = crearPrueba(preguntas, azar);
      pintarPregunta();
    })
    .catch(() => cuerpo.replaceChildren(avisoFijo(t('ejercicio.errorCarga'), { tipo: 'error' })));

  return {
    desmontar() {
      quitarTeclas();
      document.removeEventListener('keydown', alPulsarEsc);
      cronometro.parar();
    },
  };
}
