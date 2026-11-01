// Ranking (spec 027): unirse con un alias, ver el código y la clasificación de hoy y del mes.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { barraConVolver } from '../ui/barra.js';
import { avisoFijo, avisar } from '../ui/aviso.js';
import { icono } from '../ui/iconos.js';
import { problemaAlias, ALIAS } from '../ranking/logica.js';
import { disponible, yo, unirse, recuperar, clasificacion } from '../ranking/ranking.js';

const numero = (n) => n.toLocaleString(document.documentElement.lang);

/** Mensaje de un motivo de error de la API (src/ranking/api.js). */
export function textoError(motivo) {
  const conocidos = ['sin-red', 'alias-usado', 'alias-no-valido', 'vetado', 'codigo', 'tope', 'sin-servidor'];
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

/** HU-3: pestañas Hoy / Este mes con el top 50 y mi posición. */
function vistaClasificacion(estado) {
  const periodos = ['dia', 'mes'];
  const panel = h('div', { class: 'ranking-panel', role: 'tabpanel', id: 'ranking-panel', tabindex: '0' });
  const pestanas = periodos.map((p) => h('button', {
    class: 'ranking-pestana',
    type: 'button',
    role: 'tab',
    id: `ranking-tab-${p}`,
    'aria-controls': 'ranking-panel',
    onclick: () => elegir(p, false),
  }, t(`ranking.${p}`)));

  let turno = 0;
  async function elegir(periodo, enfocar) {
    estado.periodo = periodo;
    pestanas.forEach((b, i) => {
      const activa = periodos[i] === periodo;
      b.setAttribute('aria-selected', String(activa));
      b.tabIndex = activa ? 0 : -1;
      if (activa && enfocar) b.focus();
    });
    panel.setAttribute('aria-labelledby', `ranking-tab-${periodo}`);
    panel.setAttribute('aria-busy', 'true');
    panel.replaceChildren(h('p', { class: 'tenue' }, t('ranking.cargando')));
    const mio = ++turno;
    const r = await clasificacion(periodo);
    if (mio !== turno) return; // ha cambiado de pestaña mientras tanto
    panel.removeAttribute('aria-busy');
    panel.replaceChildren(...(r.ok ? lista(r.datos, periodo) : [avisoFijo(textoError(r.motivo), { tipo: 'error' })]));
  }

  // Flechas, Inicio y Fin para moverse entre pestañas (patrón de pestañas de WAI-ARIA)
  function teclas(e) {
    const i = periodos.indexOf(estado.periodo);
    const destino = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: periodos.length - 1 }[e.key];
    if (destino === undefined) return;
    e.preventDefault();
    elegir(periodos[(destino + periodos.length) % periodos.length], true);
  }

  const tira = h('div', { class: 'ranking-pestanas', role: 'tablist', 'aria-label': t('ranking.titulo'), onkeydown: teclas }, pestanas);
  elegir(estado.periodo, false);
  return [tira, panel];
}

function lista({ top, yo: mio, jugadores }, periodo) {
  const nodos = [];
  if (!top.length) {
    nodos.push(h('p', { class: 'tenue ranking-vacio' }, t(`ranking.vacio.${periodo}`)));
  } else {
    nodos.push(h('ol', { class: 'ranking-lista' }, top.map((f) => {
      const esYo = mio && f.alias === mio.alias;
      return h('li', { class: `ranking-fila${esYo ? ' yo' : ''}`, 'aria-current': esYo ? 'true' : null },
        h('span', { class: 'ranking-pos' }, `#${f.pos}`),
        h('span', { class: 'ranking-alias' },
          h('span', { class: 'ranking-alias-nombre' }, f.alias),
          esYo && h('span', { class: 'ranking-tu' }, t('ranking.tu'))),
        h('span', { class: 'ranking-puntos' }, t('ranking.puntos', { n: numero(f.puntos) })));
    })));
  }
  if (mio && !top.some((f) => f.alias === mio.alias)) {
    nodos.push(h('p', { class: 'ranking-mia' },
      mio.pos ? t('ranking.tuPosicion', { pos: mio.pos, n: numero(mio.puntos) }) : t(`ranking.sinPuntos.${periodo}`)));
  }
  if (jugadores > 0) nodos.push(h('p', { class: 'tenue nota' }, t('ranking.jugadores', { n: numero(jugadores) })));
  return nodos;
}

export function montar(raiz) {
  const cuerpo = h('main', { class: 'contenido ranking' });
  const estado = { periodo: 'dia' };

  // Al cambiar de vista se lleva el foco a lo primero que se puede usar; al entrar, lo pone el router en el h1
  function pintar(vista, { enfocar = true } = {}) {
    if (!disponible()) {
      cuerpo.replaceChildren(avisoFijo(t('ranking.noDisponible')));
      return;
    }
    const elegida = !yo() && vista !== 'recuperar' ? 'unirse' : vista;
    const vistas = { unirse: vistaUnirse, codigo: vistaCodigo, recuperar: vistaRecuperar };
    cuerpo.replaceChildren(...(vistas[elegida] ? vistas[elegida](pintar) : vistaClasificacion(estado)));
    if (enfocar) cuerpo.querySelector('input, [role="tab"][aria-selected="true"], button')?.focus();
  }

  raiz.append(barraConVolver(t('ranking.titulo')), cuerpo);
  pintar(yo() ? 'clasificacion' : 'unirse', { enfocar: false });
  return { desmontar() {} };
}
