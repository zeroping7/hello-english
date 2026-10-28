// Pantalla de ajustes (HU-3): general, voz, sonido, aprendizaje, mis datos y versión.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { barraConVolver } from '../ui/barra.js';
import { grupoOpciones } from '../ui/opciones.js';
import { leerAjustes, cambiarAjuste } from '../ajustes/ajustes.js';
import { VERSION } from '../version.js';
import { icono } from '../ui/iconos.js';
import { hayVoz, elegirVoz, hablar } from '../voz/voz.js';
import { efecto, puedeVibrar } from '../sonido/sonido.js';
import { navegar } from '../router.js';
import { avisar } from '../ui/aviso.js';
import { confirmar } from '../ui/confirmar.js';
import { exportarArchivo, leerArchivo, aplicarImportacion, borrarTodo } from '../progreso/datos.js';
import { leerProgreso } from '../progreso/progreso.js';

function seccion(titulo, ...hijos) {
  return h('section', { class: 'seccion' },
    h('h2', { class: 'seccion-titulo' }, titulo),
    ...hijos);
}

/** Voz (HU-3): acento, velocidad y frase de prueba. */
function seccionVoz(ajustes) {
  const nota = h('p', { class: 'tenue nota', 'aria-live': 'polite' });

  async function comprobarAcento(acento) {
    if (!hayVoz()) {
      nota.textContent = t('voz.noDisponible');
      return;
    }
    const { voz, exacta } = await elegirVoz(acento);
    nota.textContent = !voz ? t('voz.sinIngles') : exacta ? '' : t(`voz.sinAcento.${acento}`);
    anotarVozEnDebug(voz);
  }
  comprobarAcento(ajustes.acento);

  return seccion(t('ajustes.voz'),
    grupoOpciones({
      nombre: 'acento',
      leyenda: t('ajustes.acento'),
      valor: ajustes.acento,
      opciones: [
        { valor: 'gb', texto: t('ajustes.acento.gb') },
        { valor: 'us', texto: t('ajustes.acento.us') },
      ],
      alCambiar: async (v) => { await cambiarAjuste('acento', v); comprobarAcento(v); },
    }),
    grupoOpciones({
      nombre: 'velocidad',
      leyenda: t('ajustes.velocidad'),
      valor: ajustes.velocidad,
      opciones: [
        { valor: 'normal', texto: t('ajustes.velocidad.normal') },
        { valor: 'lenta', texto: t('ajustes.velocidad.lenta') },
      ],
      alCambiar: (v) => cambiarAjuste('velocidad', v),
    }),
    h('button', {
      class: 'boton',
      type: 'button',
      disabled: !hayVoz(),
      // La frase es inglés para escuchar, igual en los dos idiomas de la interfaz
      onclick: () => hablar(t('ajustes.voz.frase'), leerAjustes()),
    }, icono('escucha'), t('ajustes.voz.probar')),
    nota,
  );
}

/** Sonido y vibración (HU-3), con botones para probar los efectos. */
function seccionSonido(ajustes) {
  const siNo = (nombre, leyenda, valor) => grupoOpciones({
    nombre,
    leyenda,
    valor,
    opciones: [
      { valor: true, texto: t('comun.activado') },
      { valor: false, texto: t('comun.desactivado') },
    ],
    alCambiar: (v) => cambiarAjuste(nombre, v),
  });

  return seccion(t('ajustes.sonido'),
    siNo('sonido', t('ajustes.efectos'), ajustes.sonido),
    siNo('vibracion', t('ajustes.vibracion'), ajustes.vibracion),
    !puedeVibrar() && h('p', { class: 'tenue nota' }, t('ajustes.vibracion.no')),
    h('p', { class: 'opciones-leyenda' }, t('ajustes.probarEfectos')),
    h('div', { class: 'botones-datos' },
      ['acierto', 'fallo', 'meta'].map((nombre) =>
        h('button', { class: 'boton', type: 'button', onclick: () => efecto(nombre) }, t(`efecto.${nombre}`)))),
  );
}

async function anotarVozEnDebug(voz) {
  if (new URLSearchParams(location.search).get('debug') !== '1') return;
  const { anotarDebug } = await import('../ui/debug.js');
  anotarDebug('voz', voz ? `${voz.name} (${voz.lang}${voz.localService ? ', local' : ', en línea'})` : '—');
}

/** Mis datos (HU-5): exportar, importar y borrar. */
function seccionDatos() {
  const selector = h('input', { type: 'file', accept: '.json,application/json', hidden: true });

  selector.addEventListener('change', async () => {
    const archivo = selector.files?.[0];
    selector.value = '';
    if (!archivo) return;
    const r = await leerArchivo(archivo);
    if (!r.ok) {
      avisar(t('datos.importar.error'), { tipo: 'error' });
      return;
    }
    const si = await confirmar({ titulo: t('datos.importar'), texto: t('datos.importar.confirmar'), aceptar: t('datos.importar') });
    if (!si) return;
    await aplicarImportacion(r);
    avisar(t('datos.importar.hecho'), { tipo: 'exito' });
  });

  async function borrar() {
    const palabra = t('datos.borrar.palabra');
    const si = await confirmar({
      titulo: t('datos.borrar'),
      texto: t('datos.borrar.confirmar'),
      aceptar: t('datos.borrar'),
      peligro: true,
      palabra,
    });
    if (!si) return;
    await borrarTodo();
    navegar('/bienvenida', { reemplazar: true });
  }

  return seccion(t('datos.titulo'),
    h('p', { class: 'tenue' }, t('datos.texto')),
    h('div', { class: 'botones-datos' },
      h('button', { class: 'boton', type: 'button', onclick: () => {
        exportarArchivo();
        avisar(t('datos.exportar.hecho'), { tipo: 'exito' });
      } }, t('datos.exportar')),
      h('button', { class: 'boton', type: 'button', onclick: () => selector.click() }, t('datos.importar')),
      h('button', { class: 'boton boton-peligro-borde', type: 'button', onclick: borrar }, t('datos.borrar')),
      selector),
  );
}

export function montar(raiz) {
  const ajustes = leerAjustes();

  raiz.append(
    barraConVolver(t('ajustes.titulo')),
    h('main', { class: 'contenido' },
      seccion(t('ajustes.general'),
        grupoOpciones({
          nombre: 'idioma',
          leyenda: t('ajustes.idioma'),
          valor: ajustes.idioma,
          // Cada idioma se escribe en su propio idioma, como en cualquier selector de idioma
          opciones: [
            { valor: 'es', texto: 'Español', lang: 'es' },
            { valor: 'en', texto: 'English', lang: 'en' },
          ],
          alCambiar: (v) => cambiarAjuste('idioma', v),
        }),
        grupoOpciones({
          nombre: 'tema',
          leyenda: t('ajustes.tema'),
          valor: ajustes.tema,
          opciones: [
            { valor: 'sistema', texto: t('ajustes.tema.sistema') },
            { valor: 'claro', texto: t('ajustes.tema.claro') },
            { valor: 'oscuro', texto: t('ajustes.tema.oscuro') },
          ],
          alCambiar: (v) => cambiarAjuste('tema', v),
        }),
      ),
      seccionVoz(ajustes),
      seccionSonido(ajustes),
      seccion(t('ajustes.aprendizaje'),
        grupoOpciones({
          nombre: 'objetivoMin',
          leyenda: t('ajustes.objetivo'),
          valor: ajustes.objetivoMin,
          opciones: [5, 10, 20].map((min) => ({ valor: min, texto: t(`objetivo.${min}`) })),
          alCambiar: (v) => cambiarAjuste('objetivoMin', v),
        }),
        h('button', { class: 'boton', type: 'button', onclick: () => navegar('/prueba-nivel') },
          t('ajustes.repetirPrueba')),
        h('p', { class: 'tenue nota' }, t('ajustes.nivelActual', { nivel: leerProgreso().nivel })),
      ),
      seccionDatos(),
      h('p', { class: 'version' }, t('comun.version', { v: VERSION })),
    ),
  );
  return { desmontar() {} };
}
