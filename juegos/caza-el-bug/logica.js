// Reglas de Caza el bug (spec 005). Puras: sin DOM.
// El texto marca el error así: "Please {revise|review} my PR." → mal "revise", bien "review".

const MARCA = /^(.*)\{([^{}|]+)\|([^{}|]+)\}(.*)$/;

/** Las palabras del texto; la del error sabe cómo se ve mal y cómo se corrige. */
export function prepararTexto(texto) {
  return texto.trim().split(/\s+/).map((trozo) => {
    const m = trozo.match(MARCA);
    if (!m) return { mal: trozo, bien: trozo, bug: false };
    const [, antes, mal, bien, despues] = m;
    return { mal: antes + mal + despues, bien: antes + bien + despues, bug: true };
  });
}

export const conError = (palabras) => palabras.map((p) => p.mal).join(' ');
export const corregido = (palabras) => palabras.map((p) => p.bien).join(' ');

/** ¿Es la palabra del error? */
export const comprobar = (palabras, indice) => palabras[indice]?.bug === true;
