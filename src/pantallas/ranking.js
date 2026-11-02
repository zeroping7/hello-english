// Ranking (specs 027-033): unirse con un alias, ver el código y las clasificaciones: día (hoy o
// ayer), mes (este o el pasado), rachas y reto del día; con filtro por liga y las medallas.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { barraConVolver } from '../ui/barra.js';
import { avisoFijo, avisar } from '../ui/aviso.js';
import { icono } from '../ui/iconos.js';
import { grupoOpciones } from '../ui/opciones.js';
import { problemaAlias, ALIAS, diaMadrid } from '../ranking/logica.js';
import {
  disponible, yo, unirse, recuperar, clasificacion, rachas, clasificacionReto, servidorActualizado,
} from '../ranking/ranking.js';
import { leerProgreso } from '../progreso/progreso.js';
import { juegoDelReto } from '../reto/logica.js';
import { buscarJuego } from '../../juegos/registro.js';

const numero = (n) => n.toLocaleString(document.documentElement.lang);

/** Mensaje de un motivo de error de la API (src/ranking/api.js). */
export function textoError(motivo) {
  const conocidos = ['sin-red', 'alias-usado', 'alias-no-valido', 'vetado', 'codigo', 'tope', 'sin-servidor', 'sin-version'];
  return t(`ranking.error.${conocidos.includes(motivo) ? motivo : 'servidor'}`);
}

/** Campo con su etiqueta y una línea de ayuda o error debajo. */
function campo({ id, etiqueta, ayuda, atributos }) {
  const entrada = h('input', { class: 'campo', id, 'aria-describedby': `${id}-ayuda`, ...atributos });
  const linea = h('p', { class: 'tenue nota', id: `${id}-ayuda`, 'aria-live': 'polite' }, ayuda);
  return {
    nodo: h('div', { class: 'ranking-campo' }, h('label', { for: id, class: 'opciones-leyenda' }, etiqueta), entrada, linea),
    entrada,
    error(texto) {
      linea.textContent = texto ?? ayuda;
      linea.classList.toggle('ranking-error', Boolean(texto));
      entrada.setAttribute('aria-invalid', texto ? 'true' : 'false');
    },
  };
}

/** Botón que se desactiva mientras espera a la red. */
async function ocupado(boton, accion) {
  boton.disabled = true;
  boton.setAttribute('aria-busy', 'true');
  try {
    return await accion();
  } finally {
    boton.disabled = false;
    boton.removeAttribute('aria-busy');
  }
}

/** HU-1: qué se envía, elegir alias y unirse. */
function vistaUnirse(pintar) {
  const alias = campo({
    id: 'ranking-alias',
    etiqueta: t('ranking.alias'),
    ayuda: t('ranking.aliasReglas', { min: ALIAS.min, max: ALIAS.max }),
    atributos: {
      type: 'text', maxlength: ALIAS.max, autocomplete: 'nickname', autocapitalize: 'off', spellcheck: 'false', required: true,
    },
  });
  const boton = h('button', { class: 'boton boton-principal', type: 'submit' }, icono('ranking'), t('ranking.unirme'));

  async function enviar(e) {
    e.preventDefault();
    const valor = alias.entrada.value.trim();
    const problema = problemaAlias(valor);
    if (problema) {
      alias.error(t(`ranking.alias.${problema}`, { min: ALIAS.min, max: ALIAS.max }));
      alias.entrada.focus();
      return;
    }
    const r = await ocupado(boton, () => unirse(valor));
    if (!r.ok) {
      alias.error(textoError(r.motivo));
      alias.entrada.focus();
      return;
    }
    pintar('codigo');
  }

  return [
    h('p', {}, t('ranking.intro')),
    avisoFijo(t('ranking.queSeEnvia')),
    h('form', { class: 'ranking-form', onsubmit: enviar, novalidate: true },
      alias.nodo,
      h('p', { class: 'nota ranking-fijo' }, t('ranking.aliasFijo')),
      boton),
    h('button', { class: 'boton-enlace', type: 'button', onclick: () => pintar('recuperar') }, t('ranking.tengoCodigo')),
  ];
}

/** HU-4: entrar con el código de otro dispositivo. Se usa aquí y en Ajustes. */
export function formularioRecuperar(alTerminar) {
  const codigo = campo({
    id: 'ranking-codigo',
    etiqueta: t('ranking.codigo'),
    ayuda: t('ranking.codigo.ayuda'),
    atributos: { type: 'text', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: 'HE-XXXX-XXXX-XXXX' },
  });
  const boton = h('button', { class: 'boton boton-principal', type: 'submit' }, t('ranking.recuperar'));

  async function enviar(e) {
    e.preventDefault();
    const r = await ocupado(boton, () => recuperar(codigo.entrada.value));
    if (!r.ok) {
      codigo.error(textoError(r.motivo));
      codigo.entrada.focus();
      return;
    }
    avisar(t('ranking.recuperado', { alias: r.datos.alias }), { tipo: 'exito' });
    alTerminar();
  }

  return h('form', { class: 'ranking-form', onsubmit: enviar, novalidate: true }, codigo.nodo, boton);
}

/** El código, para copiarlo y guardarlo. Se usa tras unirse y en Ajustes. */
export function bloqueCodigo(texto) {
  const boton = h('button', { class: 'boton', type: 'button' }, t('ranking.copiar'));
  boton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(texto);
      avisar(t('ranking.copiado'), { tipo: 'exito' });
    } catch {
      avisar(t('ranking.copiar.error'), { tipo: 'error' });
    }
  });
  return h('div', { class: 'ranking-codigo' },
    h('code', { class: 'ranking-codigo-texto', 'aria-label': t('ranking.codigo') }, texto),
    boton);
}

function vistaCodigo(pintar) {
  const datos = yo();
  return [
    h('p', {}, t('ranking.bienvenida', { alias: datos.alias })),
    avisoFijo(t('ranking.codigo.aviso')),
    bloqueCodigo(datos.codigo),
    h('button', { class: 'boton boton-principal ranking-continuar', type: 'button', onclick: () => pintar('clasificacion') },
      t('ranking.verClasificacion')),
  ];
}

function vistaRecuperar(pintar) {
  return [
    h('p', {}, t('ranking.recuperar.intro')),
    formularioRecuperar(() => pintar('clasificacion')),
    h('button', { class: 'boton-enlace', type: 'button', onclick: () => pintar('unirse') }, t('ranking.volverUnirse')),
  ];
}

/** Tiempo en m:ss. */
export function tiempo(segundos) {
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;
}

/** Medallas ganadas (spec 029), si hay alguna. */
export function filaMedallas(medallas) {
  const lista = [
    ['oro', '🥇'], ['plata', '🥈'], ['bronce', '🥉'], ['top10Mes', '🏅'], ['campeonMes', '🏆'],
  ].filter(([k]) => medallas[k] > 0);
  if (!lista.length) return null;
  return h('ul', { class: 'medallas', 'aria-label': t('medallas.titulo') },
    lista.map(([k, emoji]) => h('li', { class: 'medalla' },
      h('span', { 'aria-hidden': 'true' }, emoji),
      h('span', {}, t(`medallas.${k}`, { n: medallas[k] })))));
}

const PESTANAS = ['dia', 'mes', 'rachas', 'reto'];

/** HU-3 y specs 028-033: pestañas Día / Mes / Rachas / Reto con el top 50 y mi posición. */
function vistaClasificacion(estado) {
  const panel = h('div', { class: 'ranking-panel', role: 'tabpanel', id: 'ranking-panel', tabindex: '0' });
  const pestanas = PESTANAS.map((p) => h('button', {
    class: 'ranking-pestana',
    type: 'button',
    role: 'tab',
    id: `ranking-tab-${p}`,
    'aria-controls': 'ranking-panel',
    onclick: () => elegir(p, false),
  }, t(`ranking.pestana.${p}`)));
  const controles = h('div', { class: 'ranking-controles' });
  const lista = h('div', { class: 'ranking-resultado', 'aria-live': 'polite' });
  panel.append(controles, lista);

  let turno = 0;
  async function cargar() {
    const p = estado.pestana;
    lista.setAttribute('aria-busy', 'true');
    panel.setAttribute('aria-busy', 'true');
    lista.replaceChildren(h('p', { class: 'tenue' }, t('ranking.cargando')));
    const mio = ++turno;
    const liga = estado.liga ? leerProgreso().nivel : null;
    let r;
    if (p === 'rachas') r = await rachas();
    else if (p === 'reto') r = await clasificacionReto();
    else r = await clasificacion(periodoDe(p, estado.anterior), { liga });
    if (mio !== turno) return; // ha cambiado de pestaña mientras tanto
    lista.removeAttribute('aria-busy');
    panel.removeAttribute('aria-busy');
    if (!r.ok) {
      lista.replaceChildren(avisoFijo(textoError(r.motivo), { tipo: 'error' }));
      return;
    }
    pintarControles(); // la liga solo se ofrece si el servidor ya la entiende
    if (p === 'rachas') lista.replaceChildren(...listaRachas(r.datos));
    else if (p === 'reto') lista.replaceChildren(...listaReto(r.datos));
    else lista.replaceChildren(...listaPuntos(r.datos, periodoDe(p, estado.anterior), liga));
  }

  function pintarControles() {
    const p = estado.pestana;
    const nodos = [];
    if (p === 'dia' || p === 'mes') {
      nodos.push(grupoOpciones({
        nombre: 'ranking-periodo',
        leyenda: t('ranking.periodo'),
        valor: estado.anterior,
        opciones: [
          { valor: false, texto: t(`ranking.periodo.${p}`) },
          { valor: true, texto: t(`ranking.periodo.${p}Anterior`) },
        ],
        alCambiar: (v) => { estado.anterior = v; cargar(); },
      }));
      if (servidorActualizado() !== false) {
        const nivel = leerProgreso().nivel;
        nodos.push(grupoOpciones({
          nombre: 'ranking-liga',
          leyenda: t('ranking.liga'),
          valor: estado.liga,
          opciones: [
            { valor: false, texto: t('ranking.liga.todas') },
            { valor: true, texto: t('ranking.liga.mia', { nivel }) },
          ],
          alCambiar: (v) => { estado.liga = v; cargar(); },
        }));
      }
    } else if (p === 'reto') {
      const id = juegoDelReto(diaMadrid());
      const hecho = leerProgreso().reto?.dia === diaMadrid();
      nodos.push(h('p', { class: 'ranking-reto-juego' },
        icono('reto'), t('reto.deHoy', { juego: t(buscarJuego(id).titulo) })));
      if (!hecho) {
        nodos.push(h('a', { class: 'boton boton-principal', href: `#/juego/${id}/reto` }, icono('practica'), t('reto.jugar')));
      }
    } else {
      nodos.push(h('p', { class: 'tenue nota' }, t('ranking.rachas.explica')));
    }
    // Repintar los radios mueve el foco: se conserva si estaba dentro de los controles
    const conFoco = controles.contains(document.activeElement) ? document.activeElement.name : null;
    controles.replaceChildren(...nodos);
    if (conFoco) controles.querySelector(`input[name="${conFoco}"]:checked`)?.focus();
  }

  function elegir(pestana, enfocar) {
    if (estado.pestana !== pestana) estado.anterior = false;
    estado.pestana = pestana;
    history.replaceState(null, '', `#/ranking/${pestana}`);
    pestanas.forEach((b, i) => {
      const activa = PESTANAS[i] === pestana;
      b.setAttribute('aria-selected', String(activa));
      b.tabIndex = activa ? 0 : -1;
      if (activa && enfocar) b.focus();
    });
    panel.setAttribute('aria-labelledby', `ranking-tab-${pestana}`);
    pintarControles();
    cargar();
  }

  // Flechas, Inicio y Fin para moverse entre pestañas (patrón de pestañas de WAI-ARIA)
  function teclas(e) {
    const i = PESTANAS.indexOf(estado.pestana);
    const destino = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: PESTANAS.length - 1 }[e.key];
    if (destino === undefined) return;
    e.preventDefault();
    elegir(PESTANAS[(destino + PESTANAS.length) % PESTANAS.length], true);
  }

  const tira = h('div', { class: 'ranking-pestanas', role: 'tablist', 'aria-label': t('ranking.titulo'), onkeydown: teclas }, pestanas);
  elegir(estado.pestana, false);
  return [filaMedallas(leerProgreso().medallas), tira, panel];
}

const periodoDe = (pestana, anterior) => (pestana === 'dia' ? (anterior ? 'ayer' : 'dia') : (anterior ? 'mesAnterior' : 'mes'));

/** Una fila del top: posición, alias (y "tú") y el valor. */
function fila(f, esYo, valor) {
  return h('li', { class: `ranking-fila${esYo ? ' yo' : ''}`, 'aria-current': esYo ? 'true' : null },
    h('span', { class: 'ranking-pos' }, `#${f.pos}`),
    h('span', { class: 'ranking-alias' },
      h('span', { class: 'ranking-alias-nombre' }, f.alias),
      esYo && h('span', { class: 'ranking-tu' }, t('ranking.tu'))),
    h('span', { class: 'ranking-puntos' }, valor));
}

function fecha(dia, opciones) {
  const [a, m, d] = dia.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString(document.documentElement.lang, opciones);
}

function listaPuntos({ top, yo: mio, jugadores, dia, liga: ligaServidor }, periodo, liga) {
  const nodos = [];
  // Qué se está viendo: "Ayer, 1 nov." o "Octubre de 2026"
  if (periodo === 'ayer') nodos.push(h('p', { class: 'tenue nota' }, t('ranking.viendo.ayer', { fecha: fecha(dia, { day: 'numeric', month: 'long' }) })));
  if (periodo === 'mesAnterior') nodos.push(h('p', { class: 'tenue nota' }, t('ranking.viendo.mes', { mes: fecha(dia, { month: 'long', year: 'numeric' }) })));
  if (liga && ligaServidor) nodos.push(h('p', { class: 'tenue nota' }, t('ranking.viendo.liga', { nivel: liga })));
  if (!top.length) {
    nodos.push(h('p', { class: 'tenue ranking-vacio' }, t(`ranking.vacio.${periodo}`)));
  } else {
    nodos.push(h('ol', { class: 'ranking-lista' }, top.map((f) => fila(f, mio && f.alias === mio.alias, t('ranking.puntos', { n: numero(f.puntos) })))));
  }
  if (mio && !top.some((f) => f.alias === mio.alias)) {
    nodos.push(h('p', { class: 'ranking-mia' },
      mio.pos ? t('ranking.tuPosicion', { pos: mio.pos, n: numero(mio.puntos) }) : t(`ranking.sinPuntos.${periodo}`)));
  }
  if (jugadores > 0) nodos.push(h('p', { class: 'tenue nota' }, t('ranking.jugadores', { n: numero(jugadores) })));
  return nodos;
}

function listaRachas({ top, yo: mio, jugadores }) {
  const nodos = [];
  const dias = (n) => (n === 1 ? t('inicio.racha.uno') : t('inicio.racha.varios', { n }));
  if (!top.length) nodos.push(h('p', { class: 'tenue ranking-vacio' }, t('ranking.vacio.rachas')));
  else nodos.push(h('ol', { class: 'ranking-lista' }, top.map((f) => fila(f, mio && f.alias === mio.alias, dias(f.racha)))));
  if (mio && !top.some((f) => f.alias === mio.alias)) {
    nodos.push(h('p', { class: 'ranking-mia' }, mio.pos ? t('ranking.tuRacha', { pos: mio.pos, dias: dias(mio.racha) }) : t('ranking.sinRacha')));
  }
  if (jugadores > 0) nodos.push(h('p', { class: 'tenue nota' }, t('ranking.jugadoresRacha', { n: numero(jugadores) })));
  return nodos;
}

function listaReto({ top, yo: mio, jugadores }) {
  const nodos = [];
  const valor = (f) => t('reto.resultado', { aciertos: f.aciertos, total: f.total, tiempo: tiempo(f.segundos) });
  if (!top.length) nodos.push(h('p', { class: 'tenue ranking-vacio' }, t('ranking.vacio.reto')));
  else nodos.push(h('ol', { class: 'ranking-lista ranking-lista-reto' }, top.map((f) => fila(f, mio && f.alias === mio.alias, valor(f)))));
  if (mio && !top.some((f) => f.alias === mio.alias)) {
    nodos.push(h('p', { class: 'ranking-mia' }, mio.pos ? t('ranking.tuReto', { pos: mio.pos, resultado: valor(mio) }) : t('ranking.sinReto')));
  }
  if (jugadores > 0) nodos.push(h('p', { class: 'tenue nota' }, t('ranking.jugadoresReto', { n: numero(jugadores) })));
  nodos.push(h('p', { class: 'tenue nota' }, t('reto.reglas')));
  return nodos;
}

export function montar(raiz, params = []) {
  const cuerpo = h('main', { class: 'contenido ranking' });
  const estado = { pestana: PESTANAS.includes(params[0]) ? params[0] : 'dia', anterior: false, liga: false };

  // Al cambiar de vista se lleva el foco a lo primero que se puede usar; al entrar, lo pone el router en el h1
  function pintar(vista, { enfocar = true } = {}) {
    if (!disponible()) {
      cuerpo.replaceChildren(avisoFijo(t('ranking.noDisponible')));
      return;
    }
    const elegida = !yo() && vista !== 'recuperar' ? 'unirse' : vista;
    const vistas = { unirse: vistaUnirse, codigo: vistaCodigo, recuperar: vistaRecuperar };
    cuerpo.replaceChildren(...(vistas[elegida] ? vistas[elegida](pintar) : vistaClasificacion(estado)).filter(Boolean));
    if (enfocar) cuerpo.querySelector('input, [role="tab"][aria-selected="true"], button')?.focus();
  }

  raiz.append(barraConVolver(t('ranking.titulo')), cuerpo);
  pintar(yo() ? 'clasificacion' : 'unirse', { enfocar: false });
  return { desmontar() {} };
}
