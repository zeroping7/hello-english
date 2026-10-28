// Crear elementos sin innerHTML.
//   h('button', { class: 'boton', onclick: fn, 'aria-label': t('x') }, 'Texto', otroNodo)
// Atributos: 'class' → className; on* con función → escucha; true → atributo vacío;
// false, null o undefined → se omite. Hijos: nodos, textos, números, arrays o null.

export function h(etiqueta, atributos = {}, ...hijos) {
  const el = document.createElement(etiqueta);

  for (const [clave, valor] of Object.entries(atributos ?? {})) {
    if (valor === false || valor == null) continue;
    if (clave.startsWith('on') && typeof valor === 'function') {
      el.addEventListener(clave.slice(2), valor);
    } else if (clave === 'class') {
      el.className = valor;
    } else {
      el.setAttribute(clave, valor === true ? '' : valor);
    }
  }

  añadir(el, hijos);
  return el;
}

function añadir(el, hijos) {
  for (const hijo of hijos) {
    if (hijo == null || hijo === false) continue;
    if (Array.isArray(hijo)) añadir(el, hijo);
    else el.append(hijo instanceof Node ? hijo : String(hijo));
  }
}
