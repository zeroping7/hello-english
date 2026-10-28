// Logros (spec 023): los conseguidos, con su fecha, y los que faltan.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { barraConVolver } from '../ui/barra.js';
import { icono } from '../ui/iconos.js';
import { LOGROS } from '../progreso/logros.js';
import { leerProgreso } from '../progreso/progreso.js';

function fecha(dia) {
  const [a, m, d] = dia.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString(document.documentElement.lang, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function montar(raiz) {
  const { logros } = leerProgreso();
  const conseguidos = LOGROS.filter((l) => logros[l.id]).length;

  raiz.append(
    barraConVolver(t('logros.titulo')),
    h('main', { class: 'contenido' },
      h('p', { class: 'tenue' }, t('logros.cuenta', { n: conseguidos, total: LOGROS.length })),
      h('ul', { class: 'logros' }, LOGROS.map((l) => {
        const dia = logros[l.id];
        return h('li', { class: `logro ${dia ? 'conseguido' : 'bloqueado'}` },
          h('span', { class: 'logro-icono' }, icono(l.icono)),
          h('span', { class: 'logro-texto' },
            h('span', { class: 'logro-titulo' }, t(`logro.${l.id}.titulo`)),
            h('span', { class: 'logro-desc' }, t(`logro.${l.id}.desc`)),
            h('span', { class: 'logro-estado' }, dia ? `✓ ${fecha(dia)}` : t('logros.bloqueado'))));
      })),
    ),
  );
  return { desmontar() {} };
}
