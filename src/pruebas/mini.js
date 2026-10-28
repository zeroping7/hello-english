// Mini ejecutor de pruebas para los tests.html (constitución Q2), sin frameworks.
// Uso:
//   import { prueba, igual, verdadero, ejecutar } from '../pruebas/mini.js';
//   prueba('suma', () => igual(1 + 1, 2));
//   ejecutar();

const pruebas = [];

export function prueba(nombre, fn) {
  pruebas.push({ nombre, fn });
}

export function igual(obtenido, esperado, mensaje = '') {
  const a = JSON.stringify(obtenido);
  const b = JSON.stringify(esperado);
  if (a !== b) throw new Error(`${mensaje ? mensaje + ': ' : ''}se esperaba ${b} y salió ${a}`);
}

export function verdadero(valor, mensaje = 'se esperaba verdadero') {
  if (!valor) throw new Error(mensaje);
}

export async function ejecutar(raiz = document.body) {
  const lista = document.createElement('ol');
  lista.className = 'pruebas';
  let fallos = 0;

  for (const { nombre, fn } of pruebas) {
    const fila = document.createElement('li');
    try {
      await fn();
      fila.className = 'ok';
      fila.textContent = `✓ ${nombre}`;
    } catch (e) {
      fallos++;
      fila.className = 'fallo';
      fila.textContent = `✗ ${nombre} — ${e.message}`;
      console.error(nombre, e);
    }
    lista.append(fila);
  }

  const resumen = document.createElement('p');
  resumen.className = fallos ? 'resumen fallo' : 'resumen ok';
  resumen.textContent = fallos
    ? `✗ ${fallos} de ${pruebas.length} pruebas fallan`
    : `✓ Las ${pruebas.length} pruebas pasan`;

  raiz.append(resumen, lista);
  document.title = `${fallos ? '✗' : '✓'} ${document.title}`;
  return { total: pruebas.length, fallos };
}
