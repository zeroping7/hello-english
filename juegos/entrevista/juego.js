// Entrevista de trabajo (spec 013): la entrevistadora pregunta y se elige (o se dice) la
// mejor respuesta. Pantalla común de escuchar y elegir (src/ui/escucha-elige.js).
import { t } from '../../src/i18n/textos.js';
import { ronda } from '../../src/ui/ronda.js';
import { pintarEscuchaElige } from '../../src/ui/escucha-elige.js';

export const BANCO = 'entrevista';
export const EJERCICIOS = 5;

export function montar(raiz, partida) {
  const { azar, idioma } = partida;
  return ronda(raiz, partida, (item, ctx) => pintarEscuchaElige(item, ctx, {
    azar,
    idioma,
    quien: 'Emma',
    rol: t('et.rol'),
    pregunta: { texto: t('et.pregunta'), lang: idioma },
  }));
}
