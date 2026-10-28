// Arranque de la app. Por ahora pinta la portada provisional con el logo en el idioma
// del navegador; el router y los ajustes llegan en T003 y T011.
import { VERSION } from './version.js';
import { cargarIdioma, idiomaDelNavegador, t } from './i18n/textos.js';

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
  logo.setAttribute('aria-label', t('app.nombre'));
  return logo;
}

async function arrancar() {
  await cargarIdioma(idiomaDelNavegador());

  const lema = document.createElement('p');
  lema.className = 'portada-lema';
  lema.textContent = t('app.lema');

  const bloque = document.createElement('div');
  bloque.append(crearLogo(), lema);

  const portada = document.createElement('main');
  portada.className = 'portada';
  portada.append(bloque);

  document.getElementById('app').replaceChildren(portada);
  document.documentElement.dataset.version = VERSION;
}

arrancar();
