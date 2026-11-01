// Dirección de la API del ranking (servidor/LEEME.md, paso 6). Vacía = el ranking no aparece.
// Para probar otra sin tocar esto: ?debug=1&api=https://...
const PUBLICADA = '';

function desdeUrl() {
  const params = new URLSearchParams(globalThis.location?.search ?? '');
  return params.get('debug') === '1' ? params.get('api') : null;
}

export const API = (desdeUrl() ?? PUBLICADA).replace(/\/+$/, '');
