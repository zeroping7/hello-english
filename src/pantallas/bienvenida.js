// Bienvenida (HU-1): idioma → objetivo diario → nivel. Los pasos no son rutas: el paso
// se guarda en el módulo para que sobreviva al repintado que provoca cambiar de idioma.
import { h } from '../ui/dom.js';
import { t } from '../i18n/textos.js';
import { navegar } from '../router.js';
import { grupoOpciones } from '../ui/opciones.js';
import { icono } from '../ui/iconos.js';
import { leerAjustes, cambiarAjuste } from '../ajustes/ajustes.js';

const TOTAL = 3;
let paso = 1;

function logo() {
  return h('p', { class: 'logo bienvenida-logo', 'aria-hidden': 'true' },
    h('span', { class: 'logo-prompt' }, '>_'), ' hello',
    h('span', { class: 'logo-cursor' }));
}

function pasoIdioma(ajustes) {
  return [
    h('h1', { class: 'bienvenida-titulo' }, t('bienvenida.idioma.titulo')),
    grupoOpciones({
      nombre: 'idioma',
      leyenda: t('ajustes.idioma'),
      valor: ajustes.idioma,
      opciones: [
        { valor: 'es', texto: 'Español', lang: 'es' },
        { valor: 'en', texto: 'English', lang: 'en' },
      ],
      alCambiar: (v) => cambiarAjuste('idioma', v),
    }),
  ];
}

function pasoObjetivo(ajustes) {
  return [
    h('h1', { class: 'bienvenida-titulo' }, t('bienvenida.objetivo.titulo')),
    h('p', { class: 'tenue' }, t('bienvenida.objetivo.texto')),
    grupoOpciones({
      nombre: 'objetivoMin',
      leyenda: t('ajustes.objetivo'),
      valor: ajustes.objetivoMin,
      opciones: [5, 10, 20].map((min) => ({ valor: min, texto: t(`objetivo.${min}`) })),
      alCambiar: (v) => cambiarAjuste('objetivoMin', v),
    }),
  ];
}

function pasoNivel() {
  return [
    h('h1', { class: 'bienvenida-titulo' }, t('bienvenida.nivel.titulo')),
    h('p', { class: 'tenue' }, t('bienvenida.nivel.texto')),
    h('div', { class: 'bienvenida-elecciones' },
      // La prueba de nivel llega con su spec (002)
      h('button', { class: 'eleccion', type: 'button', disabled: true },
        h('span', { class: 'eleccion-titulo' }, t('bienvenida.nivel.prueba')),
        h('span', { class: 'tenue' }, t('bienvenida.nivel.prueba.desc')),
        h('span', { class: 'etiqueta' }, t('comun.proximamente'))),
      h('button', { class: 'eleccion', type: 'button', onclick: terminar },
        h('span', { class: 'eleccion-titulo' }, t('bienvenida.nivel.a1')),
        h('span', { class: 'tenue' }, t('bienvenida.nivel.a1.desc')))),
  ];
}

async function terminar() {
  await cambiarAjuste('bienvenidaHecha', true);
  paso = 1;
  navegar('/inicio', { reemplazar: true });
}

export function montar(raiz) {
  const ajustes = leerAjustes();
  const contenedor = h('main', { class: 'contenido bienvenida', 'data-esc-propio': true });

  function irA(n) {
    paso = n;
    pintar();
    const titulo = contenedor.querySelector('h1');
    document.title = t('app.tituloPestana', { pantalla: titulo.textContent });
    titulo.focus({ preventScroll: true });
  }

  function pintar() {
    const cuerpo = paso === 1 ? pasoIdioma(ajustes) : paso === 2 ? pasoObjetivo(leerAjustes()) : pasoNivel();
    contenedor.replaceChildren(
      logo(),
      h('p', { class: 'bienvenida-paso' }, t('bienvenida.paso', { n: paso, total: TOTAL })),
      ...cuerpo,
      h('div', { class: 'bienvenida-botones' },
        paso > 1 && h('button', { class: 'boton', type: 'button', onclick: () => irA(paso - 1) },
          icono('atras'), t('comun.atras')),
        paso < TOTAL && h('button', { class: 'boton boton-principal', type: 'button', onclick: () => irA(paso + 1) },
          t('comun.siguiente')),
      ),
    );
    contenedor.querySelector('h1')?.setAttribute('tabindex', '-1');
  }

  // Esc vuelve al paso anterior (el router no lo gestiona aquí: data-esc-propio)
  function alPulsar(e) {
    if (e.key === 'Escape' && paso > 1) irA(paso - 1);
  }

  pintar();
  raiz.append(contenedor);
  document.addEventListener('keydown', alPulsar);
  return { desmontar() { document.removeEventListener('keydown', alPulsar); } };
}
