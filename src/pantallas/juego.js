// Pantalla común de minijuego (spec 003, plan §3): antes de jugar (tema), partida y resumen.
// Carga el banco, elige los ejercicios (con los repasos de hoy), cuenta el tiempo y los puntos
// y pide confirmación al salir a medias. Si el minijuego no está disponible, enseña
// "Próximamente". Con '#/juego/<id>/practica' es un paso de la Práctica de hoy (spec 024) y
// con '#/juego/<id>/reto', el reto del día (spec 033): ejercicios fijos y un solo intento.
import { h } from '../ui/dom.js';
import { t, idiomaActual } from '../i18n/textos.js';
import { navegar, volver } from '../router.js';
import { barraConVolver } from '../ui/barra.js';
import { contador, resumen } from '../ui/ejercicio.js';
import { grupoOpciones } from '../ui/opciones.js';
import { confirmar } from '../ui/confirmar.js';
import { avisoFijo } from '../ui/aviso.js';
import { icono } from '../ui/iconos.js';
import { buscarJuego, iconoDe, ESFUERZO } from '../../juegos/registro.js';
import { sumarPartida, guardarReto, disponible as hayRanking, yo as enRanking } from '../ranking/ranking.js';
import { diaMadrid } from '../ranking/logica.js';
import { RETO_N, juegoDelReto, elegirReto } from '../reto/logica.js';
import { tiempo } from './ranking.js';
import { cargarBanco } from '../contenido/cargar.js';
import { elegirConRepaso } from '../contenido/elegir.js';
import { TEMAS, PREFIJO } from '../contenido/esquema.js';
import { crearAzar } from '../contenido/azar.js';
import { leerProgreso, registrarResultado, registrarPartida, registrarReto, pendientes } from '../progreso/progreso.js';
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
  const enReto = params[1] === 'reto';
  const sinVoz = juego.necesita.includes('voz') && !hayVoz();
  const diaReto = diaMadrid();
  if (enReto && juego.id !== juegoDelReto(diaReto)) {
    // Un enlace de otro día: lleva al reto de hoy
    queueMicrotask(() => navegar(`/juego/${juegoDelReto(diaReto)}/reto`, { reemplazar: true }));
    return { desmontar() {} };
  }

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
  let inicioReto = 0;

  /** El reto cuenta al terminarlo o al salir a medias: solo vale el primer intento. */
  function cerrarReto() {
    if (!enReto || !inicioReto) return;
    const segundos = Math.min(3600, Math.max(10, Math.round((Date.now() - inicioReto) / 1000)));
    inicioReto = 0;
    const resultado = { juego: juego.id, aciertos, total: RETO_N, segundos };
    if (registrarReto({ ...resultado, dia: diaReto }).nuevo) guardarReto(resultado);
  }

  function terminarPartida() {
    // Lo jugado cuenta para el ranking aunque se salga a medias, igual que para los puntos (spec 027 HU-2)
    if (partida) sumarPartida(puntos, respuestas);
    if (partida) cerrarReto();
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
      const si = await confirmar({ titulo: t('juego.salir'), texto: t(enReto ? 'reto.salir.texto' : 'juego.salir.texto'), aceptar: t('juego.salir') });
      if (!si) return;
    }
    terminarPartida();
    volver();
  }

  /** Reto ya jugado hoy: se enseña el resultado en lugar de dejar repetirlo. */
  function pintarRetoHecho() {
    const r = leerProgreso().reto;
    cuerpo.replaceChildren(
      h('section', { class: 'juego-inicio' },
        h('span', { class: 'juego-inicio-icono cat-reto' }, icono('reto')),
        h('p', { class: 'juego-inicio-desc' }, t('reto.yaHecho')),
        h('p', { class: 'reto-resultado' }, t('reto.resultado', { aciertos: r.aciertos, total: r.total, tiempo: tiempo(r.segundos) })),
        ...botonesReto()));
  }

  function botonesReto() {
    const conRanking = hayRanking() && enRanking();
    return [
      conRanking && h('button', { class: 'boton boton-principal', type: 'button', onclick: () => navegar('/ranking/reto', { reemplazar: true }) },
        icono('ranking'), t('reto.verClasificacion')),
      h('button', { class: conRanking ? 'boton' : 'boton boton-principal', type: 'button', onclick: () => navegar('/inicio') }, t('juego.alInicio')),
      !conRanking && hayRanking() && h('p', { class: 'tenue nota' }, t('reto.unete')),
    ];
  }

  /** Antes del reto: qué es y que solo cuenta el primer intento. */
  function pintarInicioReto() {
    zonaContador.replaceChildren();
    cuerpo.replaceChildren(
      h('section', { class: 'juego-inicio' },
        h('span', { class: `juego-inicio-icono cat-${juego.categoria}` }, icono(iconoDe(juego))),
        h('p', { class: 'juego-inicio-desc' }, t(juego.descripcion)),
        avisoFijo(t('reto.antes', { n: RETO_N })),
        h('button', { class: 'boton boton-principal boton-grande', type: 'button', onclick: empezar },
          icono('reto'), t('reto.empezar'))));
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
      if (enReto) {
        if (leerProgreso().reto?.dia === diaReto) return pintarRetoHecho();
        jugar(elegirReto(items, diaReto, RETO_N), azar);
        inicioReto = Date.now();
        return;
      }
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
      // hablado: la respuesta se dio en voz alta, que vale ESFUERZO.alto (D-023).
      alResponder(item, acierto, { sonido = true, hablado = false } = {}) {
        if (sonido) efecto(acierto ? 'acierto' : 'fallo');
        respuestas++;
        if (acierto) aciertos++;
        puntos += registrarResultado(item, acierto, hablado ? ESFUERZO.alto : juego.dificultad, juego.id);
      },
      alTerminar: () => pintarResumen(),
    });
  }

  function pintarResumen() {
    terminarPartida();
    zonaContador.replaceChildren();
    efecto('meta');
    const { practicaCompleta } = registrarPartida(juego.id, aciertos, respuestas, { practica: enPractica });
    if (enReto) {
      const r = leerProgreso().reto;
      const titulo = r?.dia === diaReto ? `${t('reto.titulo')} · ${t('reto.tiempo', { tiempo: tiempo(r.segundos) })}` : t('reto.titulo');
      cuerpo.replaceChildren(resumen({ titulo, aciertos, total: respuestas, puntos, botones: botonesReto() }));
      cuerpo.querySelector('.boton-principal')?.focus({ preventScroll: true });
      return;
    }
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

  raiz.append(barraConVolver(enReto ? t('reto.tituloCon', { juego: t(juego.titulo) }) : t(juego.titulo), { alVolver: salir, extra: zonaContador }), cuerpo);
  if (enReto) {
    if (leerProgreso().reto?.dia === diaReto) pintarRetoHecho();
    else pintarInicioReto();
  } else if (enPractica && !sinVoz) empezar();
  else pintarInicio();

  return {
    desmontar() {
      terminarPartida();
      quitarEstilos();
      document.removeEventListener('keydown', alPulsarEsc);
    },
  };
}
