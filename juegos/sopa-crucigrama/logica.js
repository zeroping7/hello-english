// Reglas de Sopa y crucigrama (spec 017): generar los tableros y comprobar. Puras: sin DOM.

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIRECCIONES = [[0, 1], [1, 0], [1, 1]];   // derecha, abajo, diagonal
const clave = (f, c) => `${f},${c}`;

// --- Sopa de letras ---

/**
 * Coloca las palabras en una cuadrícula y rellena el resto con letras al azar.
 * @returns {{ tam: number, celdas: string[][], colocadas: { indice: number, palabra: string, celdas: [number, number][] }[] }}
 */
export function crearSopa(palabras, azar) {
  const lista = palabras.map((p, indice) => ({ indice, palabra: p.toUpperCase() }));
  const tam = Math.min(12, Math.max(8, ...lista.map((p) => p.palabra.length + 1)));
  const celdas = Array.from({ length: tam }, () => new Array(tam).fill(''));
  const colocadas = [];

  for (const { indice, palabra } of [...lista].sort((a, b) => b.palabra.length - a.palabra.length)) {
    for (let intento = 0; intento < 300; intento++) {
      const [df, dc] = DIRECCIONES[Math.floor(azar() * DIRECCIONES.length)];
      const f0 = Math.floor(azar() * (tam - df * (palabra.length - 1)));
      const c0 = Math.floor(azar() * (tam - dc * (palabra.length - 1)));
      const posiciones = [...palabra].map((_, i) => [f0 + df * i, c0 + dc * i]);
      if (posiciones.every(([f, c], i) => celdas[f][c] === '' || celdas[f][c] === palabra[i])) {
        posiciones.forEach(([f, c], i) => { celdas[f][c] = palabra[i]; });
        colocadas.push({ indice, palabra, celdas: posiciones });
        break;
      }
    }
  }
  for (const fila of celdas) {
    for (let c = 0; c < tam; c++) if (!fila[c]) fila[c] = LETRAS[Math.floor(azar() * LETRAS.length)];
  }
  colocadas.sort((a, b) => a.indice - b.indice);
  return { tam, celdas, colocadas };
}

/** Las celdas en línea recta entre a y b (fila, columna o diagonal), o null si no lo están. */
export function lineaEntre([f1, c1], [f2, c2]) {
  const df = Math.sign(f2 - f1);
  const dc = Math.sign(c2 - c1);
  const largo = Math.max(Math.abs(f2 - f1), Math.abs(c2 - c1));
  if ((f1 !== f2 && c1 !== c2 && Math.abs(f2 - f1) !== Math.abs(c2 - c1))) return null;
  return Array.from({ length: largo + 1 }, (_, i) => [f1 + df * i, c1 + dc * i]);
}

/** La palabra colocada que va de a a b (en cualquier sentido), o -1. */
export function buscarPalabra(sopa, a, b) {
  const linea = lineaEntre(a, b);
  if (!linea) return -1;
  const texto = linea.map(([f, c]) => clave(f, c)).join(';');
  const reves = [...linea].reverse().map(([f, c]) => clave(f, c)).join(';');
  return sopa.colocadas.findIndex((p) => {
    const suya = p.celdas.map(([f, c]) => clave(f, c)).join(';');
    return suya === texto || suya === reves;
  });
}

// --- Crucigrama ---

/**
 * Cruza las palabras que se puedan; las que no encajan se quedan fuera.
 * @returns {{ filas: number, columnas: number, letras: Map<string, string>, palabras: { indice: number, palabra: string, f: number, c: number, dir: 'h'|'v', numero: number }[] }}
 */
export function crearCrucigrama(palabras, azar) {
  const lista = palabras.map((p, indice) => ({ indice, palabra: p.toUpperCase() }))
    .sort((a, b) => b.palabra.length - a.palabra.length || azar() - 0.5);
  const letras = new Map();       // 'f,c' → letra
  const sentidos = new Map();     // 'f,c' → Set('h'|'v')
  const puestas = [];
  const paso = { h: [0, 1], v: [1, 0] };

  function cabe(palabra, f0, c0, dir) {
    const [df, dc] = paso[dir];
    const [pf, pc] = [dc, df];    // perpendicular
    if (letras.has(clave(f0 - df, c0 - dc)) || letras.has(clave(f0 + df * palabra.length, c0 + dc * palabra.length))) return -1;
    let cruces = 0;
    for (let i = 0; i < palabra.length; i++) {
      const f = f0 + df * i;
      const c = c0 + dc * i;
      const hay = letras.get(clave(f, c));
      if (hay) {
        if (hay !== palabra[i] || sentidos.get(clave(f, c)).has(dir)) return -1;
        cruces++;
      } else if (letras.has(clave(f + pf, c + pc)) || letras.has(clave(f - pf, c - pc))) {
        return -1;
      }
    }
    return cruces;
  }

  function poner(item, f0, c0, dir) {
    const [df, dc] = paso[dir];
    [...item.palabra].forEach((l, i) => {
      const k = clave(f0 + df * i, c0 + dc * i);
      letras.set(k, l);
      if (!sentidos.has(k)) sentidos.set(k, new Set());
      sentidos.get(k).add(dir);
    });
    puestas.push({ ...item, f: f0, c: c0, dir });
  }

  for (const item of lista) {
    if (!puestas.length) { poner(item, 0, 0, 'h'); continue; }
    const candidatos = [];
    for (const [k, l] of letras) {
      const [f, c] = k.split(',').map(Number);
      [...item.palabra].forEach((letra, i) => {
        if (letra !== l) return;
        for (const dir of ['h', 'v']) {
          const [df, dc] = paso[dir];
          const cruces = cabe(item.palabra, f - df * i, c - dc * i, dir);
          if (cruces > 0) candidatos.push({ f: f - df * i, c: c - dc * i, dir, cruces, azar: azar() });
        }
      });
    }
    if (!candidatos.length) continue;
    candidatos.sort((a, b) => b.cruces - a.cruces || a.azar - b.azar);
    poner(item, candidatos[0].f, candidatos[0].c, candidatos[0].dir);
  }

  // Mover todo a (0, 0) y numerar los comienzos de arriba abajo y de izquierda a derecha
  const fs = [...letras.keys()].map((k) => Number(k.split(',')[0]));
  const cs = [...letras.keys()].map((k) => Number(k.split(',')[1]));
  const f0 = Math.min(...fs);
  const c0 = Math.min(...cs);
  const movidas = new Map([...letras].map(([k, l]) => {
    const [f, c] = k.split(',').map(Number);
    return [clave(f - f0, c - c0), l];
  }));
  const conPos = puestas.map((p) => ({ ...p, f: p.f - f0, c: p.c - c0 }));
  const comienzos = [...new Set(conPos.map((p) => clave(p.f, p.c)))]
    .map((k) => k.split(',').map(Number))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .map(([f, c]) => clave(f, c));
  const numerada = conPos.map((p) => ({ ...p, numero: comienzos.indexOf(clave(p.f, p.c)) + 1 }))
    .sort((a, b) => a.numero - b.numero || (a.dir === 'h' ? -1 : 1));

  return { filas: Math.max(...fs) - f0 + 1, columnas: Math.max(...cs) - c0 + 1, letras: movidas, palabras: numerada };
}

/** Celdas de una palabra del crucigrama. */
export function celdasDe(p) {
  const [df, dc] = p.dir === 'h' ? [0, 1] : [1, 0];
  return [...p.palabra].map((_, i) => clave(p.f + df * i, p.c + dc * i));
}
