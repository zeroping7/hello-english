// Pantalla de ajustes (HU-3): general, aprendizaje y versión; voz, sonido y mis datos
// llegan en T023-T025.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { barraConVolver } from '../ui/barra.js';
import { grupoOpciones } from '../ui/opciones.js';
import { leerAjustes, cambiarAjuste } from '../ajustes/ajustes.js';
import { VERSION } from '../version.js';

function seccion(titulo, ...hijos) {
  return h('section', { class: 'seccion' },
    h('h2', { class: 'seccion-titulo' }, titulo),
    ...hijos);
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
      seccion(t('ajustes.aprendizaje'),
        grupoOpciones({
          nombre: 'objetivoMin',
          leyenda: t('ajustes.objetivo'),
          valor: ajustes.objetivoMin,
          opciones: [5, 10, 20].map((min) => ({ valor: min, texto: t(`objetivo.${min}`) })),
          alCambiar: (v) => cambiarAjuste('objetivoMin', v),
        }),
        // La prueba de nivel llega con su spec (002)
        h('button', { class: 'boton', type: 'button', disabled: true },
          t('ajustes.repetirPrueba'), h('span', { class: 'etiqueta' }, t('comun.proximamente'))),
      ),
      h('p', { class: 'version' }, t('comun.version', { v: VERSION })),
    ),
  );
  return { desmontar() {} };
}
