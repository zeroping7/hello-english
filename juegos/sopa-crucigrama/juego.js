// Sopa y crucigrama (spec 017): las mismas palabras con pistas en inglés, en una sopa de
// letras (se toca la primera y la última letra) o en un crucigrama (se toca la pista y se
// escribe la palabra). Cada palabra encontrada es un acierto; al rendirse, las que faltan son fallos.
import { h } from '../../src/ui/dom.js';
import { t } from '../../src/i18n/textos.js';
import { panelResultado } from '../../src/ui/ejercicio.js';
import { formularioRespuesta } from '../../src/ui/ronda.js';
import { avisar } from '../../src/ui/aviso.js';
import { crearSopa, buscarPalabra, lineaEntre, crearCrucigrama, celdasDe } from './logica.js';

export const BANCO = 'sopa-crucigrama';
export const EJERCICIOS = 6;
const INTENTOS = 2;

export function montar(raiz, { ejercicios, azar, ponerContador, alResponder, alTerminar }) {
  let quitar = () => {};

  function elegirModo() {
    ponerContador(0, ejercicios.length);
    const sopa = h('button', { class: 'eleccion', type: 'button', onclick: () => jugarSopa() },
      h('span', { class: 'eleccion-titulo' }, t('sc.sopa')), h('span', { class: 'tenue' }, t('sc.sopa.desc')));
    raiz.replaceChildren(
      h('p', { class: 'ejercicio-pregunta' }, t('sc.elige')),
      h('div', { class: 'bienvenida-elecciones' },
        sopa,
        h('button', { class: 'eleccion', type: 'button', onclick: () => jugarCrucigrama() },
          h('span', { class: 'eleccion-titulo' }, t('sc.crucigrama')), h('span', { class: 'tenue' }, t('sc.crucigrama.desc')))));
    sopa.focus({ preventScroll: true });
  }

  /** Panel final con todas las palabras y sus pistas. */
  function terminar(zona, lista, encontradas) {
    const boton = h('button', { class: 'boton boton-principal', type: 'button', onclick: alTerminar }, t('juego.verResumen'));
    zona.replaceChildren(
      panelResultado({
        acierto: encontradas === lista.length,
        lineas: [h('ul', { class: 'sc-repaso' }, lista.map((p) => h('li', {},
          h('strong', { lang: 'en' }, p.palabra), ' — ', h('span', { lang: 'en' }, ejercicios[p.indice].pista))))],
      }),
      boton);
    boton.focus({ preventScroll: true });
  }

  // --- Sopa de letras ---
  function jugarSopa() {
    const sopa = crearSopa(ejercicios.map((e) => e.palabra), azar);
    const hallada = new Set();
    let resuelta = false;
    let inicio = null;
    const botones = [];
    const estado = h('p', { class: 'nota', 'aria-live': 'polite' });
    const zona = h('div', { class: 'zona-resultado' });

    const pistas = h('ol', { class: 'sc-pistas', lang: 'en' });
    function pintarPistas() {
      pistas.replaceChildren(...sopa.colocadas.map((p, k) => h('li', { class: hallada.has(k) ? 'hallada' : '' },
        h('span', {}, ejercicios[p.indice].pista), ' ',
        h('span', { class: 'sc-largo' }, hallada.has(k) || resuelta ? p.palabra : `(${p.palabra.length})`))));
      ponerContador(hallada.size, sopa.colocadas.length);
    }

    const rejilla = h('div', { class: 'sc-sopa', role: 'grid', 'aria-label': t('sc.sopa'), style: `--tam: ${sopa.tam}` },
      sopa.celdas.map((fila, f) => h('div', { class: 'sc-fila', role: 'row' }, fila.map((letra, c) => {
        const b = h('button', {
          class: 'sc-celda', type: 'button', role: 'gridcell', tabindex: f === 0 && c === 0 ? '0' : '-1',
          'aria-label': `${letra}, ${t('sc.posicion', { f: f + 1, c: c + 1 })}`,
          onclick: () => tocar(f, c),
          onkeydown: (e) => mover(e, f, c),
        }, letra);
        (botones[f] ??= [])[c] = b;
        return b;
      }))));

    function mover(e, f, c) {
      const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
      if (!d) return;
      e.preventDefault();
      e.stopPropagation();
      const nf = Math.min(sopa.tam - 1, Math.max(0, f + d[0]));
      const nc = Math.min(sopa.tam - 1, Math.max(0, c + d[1]));
      botones[f][c].tabIndex = -1;
      botones[nf][nc].tabIndex = 0;
      botones[nf][nc].focus();
    }

    function tocar(f, c) {
      if (resuelta) return;
      if (!inicio) {
        inicio = [f, c];
        botones[f][c].classList.add('elegida');
        estado.textContent = t('sc.ahoraUltima');
        return;
      }
      const [f0, c0] = inicio;
      botones[f0][c0].classList.remove('elegida');
      inicio = null;
      if (f0 === f && c0 === c) { estado.textContent = ''; return; }
      const k = buscarPalabra(sopa, [f0, c0], [f, c]);
      if (k === -1 || hallada.has(k)) {
        estado.textContent = t('sc.nada');
        (lineaEntre([f0, c0], [f, c]) ?? []).forEach(([a, b]) => {
          botones[a][b].classList.add('fallida');
          setTimeout(() => botones[a][b].classList.remove('fallida'), 600);
        });
        return;
      }
      hallada.add(k);
      sopa.colocadas[k].celdas.forEach(([a, b]) => botones[a][b].classList.add('hallada'));
      estado.textContent = t('sc.encontrada', { palabra: sopa.colocadas[k].palabra });
      alResponder(ejercicios[sopa.colocadas[k].indice], true);
      pintarPistas();
      if (hallada.size === sopa.colocadas.length) cerrar();
    }

    function rendirse() {
      if (resuelta) return;
      sopa.colocadas.forEach((p, k) => {
        if (hallada.has(k)) return;
        p.celdas.forEach(([a, b]) => botones[a][b].classList.add('revelada'));
        alResponder(ejercicios[p.indice], false, { sonido: k === 0 });
      });
      cerrar();
    }

    function cerrar() {
      resuelta = true;
      botonRendirse.disabled = true;
      pintarPistas();
      terminar(zona, sopa.colocadas, hallada.size);
    }

    const botonRendirse = h('button', { class: 'boton', type: 'button', onclick: rendirse }, t('sc.rendirse'));
    pintarPistas();
    raiz.replaceChildren(
      h('p', { class: 'ejercicio-pregunta' }, t('sc.sopa.instruccion')),
      rejilla, estado, pistas, h('div', { class: 'sc-acciones' }, botonRendirse), zona);
    botones[0][0].focus({ preventScroll: true });
  }

  // --- Crucigrama ---
  function jugarCrucigrama() {
    const cruci = crearCrucigrama(ejercicios.map((e) => e.palabra), azar);
    const resueltas = new Map();   // índice en cruci.palabras → true (bien) o false (revelada)
    const fallos = new Map();
    let actual = 0;
    let terminado = false;
    const celdas = new Map();
    const zona = h('div', { class: 'zona-resultado' });
    const estado = h('p', { class: 'nota', 'aria-live': 'polite' });
    const zonaCampo = h('div', {});
    const pistas = h('ol', { class: 'sc-pistas sc-pistas-cruci', lang: 'en' });

    const numeros = new Map(cruci.palabras.map((p) => [`${p.f},${p.c}`, p.numero]));
    const tablero = h('div', { class: 'sc-cruci', style: `--columnas: ${cruci.columnas}`, 'aria-hidden': 'true' },
      Array.from({ length: cruci.filas * cruci.columnas }, (_, n) => {
        const k = `${Math.floor(n / cruci.columnas)},${n % cruci.columnas}`;
        if (!cruci.letras.has(k)) return h('span', { class: 'sc-vacia' });
        const letra = h('span', { class: 'sc-letra' });
        const celda = h('span', { class: 'sc-casilla' }, numeros.has(k) && h('span', { class: 'sc-numero' }, String(numeros.get(k))), letra);
        celdas.set(k, { celda, letra });
        return celda;
      }));

    function pintar() {
      ponerContador([...resueltas.values()].filter(Boolean).length, cruci.palabras.length);
      for (const { celda } of celdas.values()) celda.classList.remove('actual');
      cruci.palabras.forEach((p, i) => {
        if (resueltas.has(i)) celdasDe(p).forEach((k, n) => {
          celdas.get(k).letra.textContent = p.palabra[n];
          celdas.get(k).celda.classList.add(resueltas.get(i) ? 'bien' : 'revelada');
        });
      });
      if (!terminado) celdasDe(cruci.palabras[actual]).forEach((k) => celdas.get(k).celda.classList.add('actual'));
      pistas.replaceChildren(...cruci.palabras.map((p, i) => h('li', {},
        h('button', {
          class: `sc-pista ${i === actual && !terminado ? 'actual' : ''} ${resueltas.has(i) ? 'hallada' : ''}`,
          type: 'button', disabled: terminado || resueltas.has(i), onclick: () => elegir(i),
        },
        h('span', { class: 'sc-num' }, `${p.numero} ${p.dir === 'h' ? '→' : '↓'}`), ' ',
        ejercicios[p.indice].pista, ' ',
        h('span', { class: 'sc-largo' }, resueltas.has(i) ? p.palabra : `(${p.palabra.length})`)))));
      pintarCampo();
    }

    function pintarCampo() {
      if (terminado) { zonaCampo.replaceChildren(); return; }
      const p = cruci.palabras[actual];
      const formulario = formularioRespuesta({
        etiqueta: t('sc.escribe', { n: p.numero }),
        ancho: p.palabra.length + 4,
        alEnviar(escrito) {
          if (escrito.trim().toUpperCase() === p.palabra) {
            resueltas.set(actual, true);
            alResponder(ejercicios[p.indice], true);
            estado.textContent = t('sc.encontrada', { palabra: p.palabra });
            siguiente();
          } else {
            const n = (fallos.get(actual) ?? 0) + 1;
            fallos.set(actual, n);
            if (n >= INTENTOS) {
              resueltas.set(actual, false);
              alResponder(ejercicios[p.indice], false);
              estado.textContent = t('sc.era', { palabra: p.palabra });
              siguiente();
            } else {
              estado.textContent = t('sc.noEsa');
              formulario.campo.select();
            }
          }
        },
      });
      formulario.campo.maxLength = p.palabra.length;
      zonaCampo.replaceChildren(h('p', { class: 'sc-actual', lang: 'en' },
        h('strong', {}, `${p.numero} ${p.dir === 'h' ? '→' : '↓'} `), ejercicios[p.indice].pista), formulario.form);
      setTimeout(() => formulario.campo.focus({ preventScroll: true }));
    }

    function elegir(i) {
      actual = i;
      estado.textContent = '';
      pintar();
    }

    function siguiente() {
      const libre = cruci.palabras.findIndex((_, i) => !resueltas.has(i));
      if (libre === -1) return cerrar();
      actual = libre;
      pintar();
    }

    function rendirse() {
      if (terminado) return;
      let primero = true;
      cruci.palabras.forEach((p, i) => {
        if (resueltas.has(i)) return;
        resueltas.set(i, false);
        alResponder(ejercicios[p.indice], false, { sonido: primero });
        primero = false;
      });
      cerrar();
    }

    function cerrar() {
      terminado = true;
      botonRendirse.disabled = true;
      pintar();
      terminar(zona, cruci.palabras, [...resueltas.values()].filter(Boolean).length);
    }

    const botonRendirse = h('button', { class: 'boton', type: 'button', onclick: rendirse }, t('sc.rendirse'));
    pintar();
    raiz.replaceChildren(
      h('p', { class: 'ejercicio-pregunta' }, t('sc.crucigrama.instruccion')),
      h('div', { class: 'sc-cruci-marco' }, tablero),
      zonaCampo, estado, pistas, h('div', { class: 'sc-acciones' }, botonRendirse), zona);
  }

  elegirModo();
  return { desmontar: () => quitar() };
}
