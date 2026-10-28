// Daily standup (spec 012): un compañero habla en la reunión y hay que entenderle y
// responder. Pantalla común de escuchar y elegir (src/ui/escucha-elige.js).
import { t } from '../../src/i18n/textos.js';
import { ronda } from '../../src/ui/ronda.js';
import { pintarEscuchaElige } from '../../src/ui/escucha-elige.js';

export const BANCO = 'daily-standup';
export const EJERCICIOS = 5;

export function montar(raiz, partida) {
  const { azar, idioma } = partida;
  return ronda(raiz, partida, (item, ctx) => pintarEscuchaElige(item, ctx, {
    azar,
    idioma,
    quien: item.quien,
    rol: t('ds.rol'),
    pregunta: { texto: item.pregunta, lang: 'en' },
  }));
}
