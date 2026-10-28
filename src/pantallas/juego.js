// Pantalla común de minijuego (spec 003, plan §3): antes de jugar (tema), partida y resumen.
// Carga el banco, elige los ejercicios (con los repasos de hoy), cuenta el tiempo y los puntos
// y pide confirmación al salir a medias. Si el minijuego no está disponible, enseña
// "Próximamente". Con '#/juego/<id>/practica' es un paso de la Práctica de hoy (spec 024).
import { h } from '../ui/dom.js';
import { t, idiomaActual } from '../i18n/textos.js';
import { navegar, volver } from '../router.js';
import { barraConVolver } from '../ui/barra.js';
import { contador, resumen } from '../ui/ejercicio.js';
import { grupoOpciones } from '../ui/opciones.js';
import { confirmar } from '../ui/confirmar.js';
import { avisoFijo } from '../ui/aviso.js';
import { icono } from '../ui/iconos.js';
import { buscarJuego, iconoDe } from '../../juegos/registro.js';
import { cargarBanco } from '../contenido/cargar.js';
import { elegirConRepaso } from '../contenido/elegir.js';
import { TEMAS, PREFIJO } from '../contenido/esquema.js';
import { crearAzar } from '../contenido/azar.js';
import { leerProgreso, registrarResultado, registrarPartida, pendientes } from '../progreso/progreso.js';
import { hayVoz, callar } from '../voz/voz.js';
import { parar as pararReconocimiento } from '../voz/reconocer.js';
import { iniciarCronometro } from '../progreso/cronometro.js';
import { efecto } from '../sonido/sonido.js';
import * as proximamente from './proximamente.js';

let temaElegido = null; // se recuerda mientras dure la sesión

function cargarEstilos(id) {
  const enlace = h('link', { rel: 'stylesheet', href: `juegos/${id}/juego.css` });
  document.head.append(enlace);
  return () => enlace.remove();
}

export function montar(raiz, params) {
  const juego = buscarJuego(params[0]);
  if (!juego?.disponible) return proximamente.montar(raiz, params);
  const enPractica = params[1] === 'practica';
  const sinVoz = juego.necesita.includes('voz') && !hayVoz();

  const zonaContador = h('div', {});
  const cuerpo = h('main', { class: 'contenido ejercicio', 'data-esc-propio': true });
  const quitarEstilos = cargarEstilos(juego.id);
  let modulo = null;
  let partida = null;       // { desmontar } del minijuego
  let cronometro = null;
  let enCurso = false;
  let aciertos = 0;
  let respuestas = 0;
  let puntos = 0;

  function terminarPartida() {
    callar();
    pararReconocimiento();
    partida?.desmontar?.();
    partida = null;
    cronometro?.parar();
    cronometro = null;
    enCurso = false;
  }

  async function salir() {
    if (enCurso) {
      const si = await confirmar({ titulo: t('juego.salir'), texto: t('juego.salir.texto'), aceptar: t('juego.salir') });
      if (!si) return;
    }
    terminarPartida();
    volver();
  }

  function pintarInicio() {
    zonaContador.replaceChildren();
    const repasos = pendientes(PREFIJO[juego.id]).length;
    cuerpo.replaceChildren(
      h('section', { class: 'juego-inicio' },
        h('span', { class: `juego-inicio-icono cat-${juego.categoria}` }, icono(iconoDe(juego))),
        h('p', { class: 'juego-inicio-desc' }, t(juego.descripcion)),
        sinVoz && avisoFijo(t('juego.necesitaVoz'), { tipo: 'error' }),
        repasos > 0 && h('p', { class: 'juego-repasos' }, icono('repaso'),
          repasos === 1 ? t('juego.repasos.uno') : t('juego.repasos.varios', { n: repasos })),
        grupoOpciones({
          nombre: 'tema',
          leyenda: t('juego.tema'),
          valor: temaElegido,
          opciones: [{ valor: null, texto: t('tema.todos') }, ...TEMAS.map((id) => ({ valor: id, texto: t(`tema.${id}`) }))],
          alCambiar: (v) => { temaElegido = v; },
        }),
        h('button', { class: 'boton boton-principal boton-grande', type: 'button', onclick: empezar, disabled: sinVoz },
          icono('practica'), t('juego.jugar'))));
  }

  async function empezar() {
    cuerpo.replaceChildren(h('p', { class: 'tenue' }, '…'));
    try {
      modulo ??= await import(`../../juegos/${juego.id}/juego.js`);
      const items = await cargarBanco(modulo.BANCO);
      const azar = crearAzar();
      const ejercicios = elegirConRepaso(items, {
        nivel: leerProgreso().nivel,
        n: modulo.EJERCICIOS,
        azar,
        tema: enPractica ? null : temaElegido,
        pendientes: pendientes(PREFIJO[juego.id]),
      });
      jugar(ejercicios, azar);
    } catch {
      cuerpo.replaceChildren(avisoFijo(t('ejercicio.errorCarga'), { tipo: 'error' }));
    }
  }

  function jugar(ejercicios, azar) {
    aciertos = 0;
    respuestas = 0;
    puntos = 0;
    enCurso = true;
    cronometro = iniciarCronometro();
    cuerpo.replaceChildren();
    const zona = h('div', { class: 'juego-zona' });
    cuerpo.append(zona);
    partida = modulo.montar(zona, {
      ejercicios,
      azar,
      idioma: idiomaActual(),
      ponerContador: (n, total = ejercicios.length) => zonaContador.replaceChildren(contador(n, total)),
      alResponder(item, acierto, { sonido = true } = {}) {
        if (sonido) efecto(acierto ? 'acierto' : 'fallo');
        respuestas++;
        if (acierto) aciertos++;
        puntos += registrarResultado(item, acierto, juego.dificultad);
      },
      alTerminar: () => pintarResumen(),
    });
  }

  function pintarResumen() {
    terminarPartida();
    zonaContador.replaceChildren();
    efecto('meta');
    const { practicaCompleta } = registrarPartida(juego.id, aciertos, respuestas, { practica: enPractica });
    const botones = enPractica
      ? [h('button', { class: 'boton boton-principal', type: 'button', onclick: () => navegar('/practica', { reemplazar: true }) },
          t(practicaCompleta ? 'practica.verHecha' : 'practica.continuar'))]
      : [
          h('button', { class: 'boton boton-principal', type: 'button', onclick: empezar }, t('juego.otraVez')),
          h('button', { class: 'boton', type: 'button', onclick: () => navegar('/inicio') }, t('juego.alInicio')),
        ];
    cuerpo.replaceChildren(resumen({ titulo: t('juego.resumen'), aciertos, total: respuestas, puntos, botones }));
    cuerpo.querySelector('.boton-principal').focus({ preventScroll: true });
  }

  function alPulsarEsc(e) {
    if (e.key === 'Escape' && !e.target.closest?.('dialog')) salir();
  }
  document.addEventListener('keydown', alPulsarEsc);

  raiz.append(barraConVolver(t(juego.titulo), { alVolver: salir, extra: zonaContador }), cuerpo);
  if (enPractica && !sinVoz) empezar();
  else pintarInicio();

  return {
    desmontar() {
      terminarPartida();
      quitarEstilos();
      document.removeEventListener('keydown', alPulsarEsc);
    },
  };
}
