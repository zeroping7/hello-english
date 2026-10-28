// Arranque de la app. En T001 solo pinta la portada provisional con el logo;
// el router, los idiomas y los ajustes llegan en T002-T011.
import { VERSION } from './version.js';

function crearLogo() {
  const logo = document.createElement('h1');
  logo.className = 'logo';

  const prompt = document.createElement('span');
  prompt.className = 'logo-prompt';
  prompt.textContent = '>_';

  const cursor = document.createElement('span');
  cursor.className = 'logo-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  // La marca no se traduce: es la misma en todos los idiomas
  logo.append(prompt, ' hello', cursor);
  logo.setAttribute('aria-label', 'Hello English');
  return logo;
}

function arrancar() {
  const raiz = document.getElementById('app');
  const portada = document.createElement('main');
  portada.className = 'portada';
  portada.append(crearLogo());
  raiz.replaceChildren(portada);
  document.documentElement.dataset.version = VERSION;
}

arrancar();
