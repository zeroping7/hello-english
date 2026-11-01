// API del ranking de Hello English (spec 027, D-021 y D-022).
// Se publica como Cloudflare Worker con una base de datos D1 enlazada como `DB`.
// Todo va en este único archivo para poder pegarlo tal cual en el panel de Cloudflare.
// Las reglas puras (arriba) se exportan para probarlas en servidor/tests.html.

// --- Reglas ---

export const REGLAS = {
  aliasMin: 3,
  aliasMax: 16,
  maxPorAcierto: 30,     // 10 × 2 (C1) × 1,5 (esfuerzo alto), D-023
  maxEjercicios: 40,     // por envío
  maxPuntosDia: 10000,
  maxEnviosDia: 300,
  maxAltasHora: 5,       // por IP
  top: 50,
};

/** Webs que pueden llamar a la API (CORS). localhost, con cualquier puerto, para probar. */
export const ORIGENES = ['https://zeroping7.github.io'];
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function origenPermitido(origen) {
  return ORIGENES.includes(origen) || LOCAL.test(origen ?? '');
}

/** Día 'AAAA-MM-DD' en hora de España: el ranking cierra a medianoche de Madrid. */
export function diaMadrid(fecha = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(fecha);
}

/** Primer y último día posibles del mes de un día ('2026-11-15' → ['2026-11-01', '2026-11-31']). */
export function rangoMes(dia) {
  const mes = dia.slice(0, 7);
  return [`${mes}-01`, `${mes}-31`];
}

/** Primer día del mes anterior: lo más antiguo que se guarda. */
export function inicioMesAnterior(dia) {
  let [a, m] = dia.split('-').map(Number);
  m -= 1;
  if (m === 0) { m = 12; a -= 1; }
  return `${a}-${String(m).padStart(2, '0')}-01`;
}

// Palabras que no puede contener un alias. PARTE: en cualquier sitio del alias (palabras
// largas, sin falsos positivos claros). ENTERA: solo como palabra suelta, porque dentro de
// otras palabras son inocentes ("computa", "cono", "class"). RESERVADOS: alias completos.
export const VETADAS_PARTE = [
  'gilipollas', 'hijoputa', 'hijodeputa', 'putamadre', 'cabron', 'maricon', 'mierda', 'follar',
  'pendejo', 'chingada', 'chingar', 'culero', 'subnormal', 'retrasado', 'negrata', 'sudaca',
  'fuck', 'shit', 'cunt', 'nigger', 'nigga', 'faggot', 'bitch', 'whore', 'slut', 'retard',
  'pussy', 'asshole', 'bastard', 'motherf', 'nazi', 'hitler', 'porno', 'violador', 'rapist',
];
export const VETADAS_ENTERA = [
  'puta', 'puto', 'putas', 'putos', 'polla', 'pollas', 'joder', 'jodete', 'verga', 'culo', 'cono',
  'zorra', 'mamon', 'marica', 'moro', 'panchito', 'facha', 'kkk', 'ass', 'dick', 'cock', 'tits', 'fag',
  'porn', 'sex', 'sexo', 'rape', 'nude', 'nudes', 'kill', 'matar',
];
export const RESERVADOS = ['admin', 'administrador', 'moderador', 'moderator', 'helloenglish', 'hello', 'claude', 'anthropic', 'soporte', 'support'];

const LETRAS = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', 9: 'g' };
const comoLetras = (s) => s.replace(/[01345789]/g, (c) => LETRAS[c]);
const sinRepetidas = (s) => s.replace(/(.)\1+/g, '$1');

/** Una palabra suelta es vetada tal cual o alargando letras ("puuuta"), pero "as" no es "ass". */
function palabraVetada(palabra) {
  return VETADAS_ENTERA.some((v) => palabra === v
    || (palabra !== sinRepetidas(palabra) && sinRepetidas(palabra) === sinRepetidas(v)));
}

/** @returns {{ ok: true } | { ok: false, motivo: 'formato' | 'vetado' }} */
export function validarAlias(alias) {
  if (typeof alias !== 'string') return { ok: false, motivo: 'formato' };
  const re = new RegExp(`^[A-Za-z0-9_-]{${REGLAS.aliasMin},${REGLAS.aliasMax}}$`);
  if (!re.test(alias) || !/[A-Za-z]/.test(alias)) return { ok: false, motivo: 'formato' };
  if (RESERVADOS.includes(alias.toLowerCase().replace(/[_-]/g, ''))) return { ok: false, motivo: 'vetado' };

  // Palabras: separadas por _ o -, por cambio a mayúscula ("PutaMadre") y, aparte, por números
  const separado = alias.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  const palabras = separado.split(/[\s_-]+/).filter(Boolean);
  const candidatas = [
    ...palabras.map(comoLetras),                                   // "p0lla" → "polla"
    ...separado.split(/[\s_\-0-9]+/).filter(Boolean),             // "culo1" → "culo"
  ];
  const junto = sinRepetidas(comoLetras(palabras.join('')));
  if (VETADAS_PARTE.some((v) => junto.includes(sinRepetidas(v)))) return { ok: false, motivo: 'vetado' };
  if (candidatas.some(palabraVetada)) return { ok: false, motivo: 'vetado' };
  return { ok: true };
}

/**
 * Comprueba un envío de puntos contra lo que el jugador ya lleva hoy.
 * @param {{ puntos: unknown, ejercicios: unknown }} envio
 * @param {{ puntos: number, envios: number }} hoy
 * @returns {{ ok: true } | { ok: false, motivo: 'imposible' | 'tope' }}
 */
export function validarEnvio(envio, hoy = { puntos: 0, envios: 0 }) {
  const { puntos, ejercicios } = envio ?? {};
  if (!Number.isInteger(ejercicios) || ejercicios < 1 || ejercicios > REGLAS.maxEjercicios) return { ok: false, motivo: 'imposible' };
  if (!Number.isInteger(puntos) || puntos < 1 || puntos > ejercicios * REGLAS.maxPorAcierto) return { ok: false, motivo: 'imposible' };
  if (hoy.envios >= REGLAS.maxEnviosDia || hoy.puntos + puntos > REGLAS.maxPuntosDia) return { ok: false, motivo: 'tope' };
  return { ok: true };
}

// Código secreto (D-022): 'HE-XXXX-XXXX-XXXX', 12 caracteres de un alfabeto sin 0/O ni 1/I/L.
const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export function crearCodigo(aleatorio = (n) => crypto.getRandomValues(new Uint8Array(n))) {
  const letras = [];
  while (letras.length < 12) {
    for (const b of aleatorio(16)) {
      // descarta los bytes que darían un reparto desigual entre las 31 letras
      if (b < 248 && letras.length < 12) letras.push(ALFABETO[b % ALFABETO.length]);
    }
  }
  const c = letras.join('');
  return `HE-${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8)}`;
}

/** Acepta el código con o sin guiones, espacios o minúsculas; null si no tiene la forma. */
export function normalizarCodigo(texto) {
  if (typeof texto !== 'string') return null;
  let c = texto.toUpperCase().replace(/[\s-]/g, '');
  if (c.startsWith('HE')) c = c.slice(2);
  c = c.replace(/O/g, '0').replace(/[IL]/g, '1'); // por si se copió a mano
  if (!new RegExp(`^[${ALFABETO}]{12}$`).test(c)) return null;
  return `HE-${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8)}`;
}

export async function sha256(texto) {
  const datos = new TextEncoder().encode(texto);
  const resumen = await crypto.subtle.digest('SHA-256', datos);
  return [...new Uint8Array(resumen)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Posiciones con empates: [100, 80, 80, 50] → [1, 2, 2, 4]. */
export function posiciones(filas) {
  let pos = 0;
  return filas.map((f, i) => {
    if (i === 0 || f.puntos !== filas[i - 1].puntos) pos = i + 1;
    return { pos, alias: f.alias, puntos: f.puntos };
  });
}

// --- API ---

function respuesta(cuerpo, estado, origen) {
  const cabeceras = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
  if (origen && origenPermitido(origen)) {
    cabeceras['Access-Control-Allow-Origin'] = origen;
    cabeceras['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS';
    cabeceras['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    cabeceras['Access-Control-Max-Age'] = '86400';
  }
  return new Response(cuerpo === null ? null : JSON.stringify(cuerpo), { status: estado, headers: cabeceras });
}

async function leerJson(peticion) {
  const texto = await peticion.text();
  if (texto.length > 1000) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

/** El jugador del código de la cabecera Authorization, o null. */
async function jugadorDe(peticion, db) {
  const cabecera = peticion.headers.get('Authorization') ?? '';
  const codigo = normalizarCodigo(cabecera.replace(/^Bearer\s+/i, ''));
  if (!codigo) return null;
  return db.prepare('SELECT id, alias FROM jugadores WHERE codigo_hash = ?').bind(await sha256(codigo)).first();
}

async function unirse(peticion, db, ahora) {
  const cuerpo = await leerJson(peticion);
  const alias = cuerpo?.alias;
  const v = validarAlias(alias);
  if (!v.ok) return [{ error: 'alias-no-valido', motivo: v.motivo }, 422];

  // Tope de altas por IP y hora; la IP solo se guarda resumida y se borra al día siguiente
  const hora = ahora.toISOString().slice(0, 13);
  const ip = peticion.headers.get('CF-Connecting-IP') ?? 'local';
  const ipHash = await sha256(`${ip}|${hora}`);
  const fila = await db.prepare('SELECT n FROM altas WHERE ip_hash = ? AND hora = ?').bind(ipHash, hora).first();
  if ((fila?.n ?? 0) >= REGLAS.maxAltasHora) return [{ error: 'tope' }, 429];

  const codigo = crearCodigo();
  try {
    await db.prepare('INSERT INTO jugadores (alias, codigo_hash, creado) VALUES (?, ?, ?)')
      .bind(alias, await sha256(codigo), ahora.toISOString()).run();
  } catch (e) {
    if (String(e?.message ?? e).includes('UNIQUE')) return [{ error: 'alias-usado' }, 409];
    throw e;
  }

  const ayer = new Date(ahora.getTime() - 24 * 3600 * 1000).toISOString().slice(0, 13);
  await db.batch([
    db.prepare('INSERT INTO altas (ip_hash, hora, n) VALUES (?, ?, 1) ON CONFLICT (ip_hash, hora) DO UPDATE SET n = n + 1').bind(ipHash, hora),
    db.prepare('DELETE FROM altas WHERE hora < ?').bind(ayer),
    // El histórico está fuera de alcance: solo hace falta el mes actual (y el anterior, por margen)
    db.prepare('DELETE FROM puntos WHERE dia < ?').bind(inicioMesAnterior(diaMadrid(ahora))),
  ]);
  return [{ alias, codigo }, 201];
}

async function sumarPuntos(peticion, db, ahora) {
  const jugador = await jugadorDe(peticion, db);
  if (!jugador) return [{ error: 'codigo' }, 401];
  const envio = await leerJson(peticion);
  const dia = diaMadrid(ahora);
  const hoy = await db.prepare('SELECT puntos, envios FROM puntos WHERE jugador = ? AND dia = ?').bind(jugador.id, dia).first()
    ?? { puntos: 0, envios: 0 };
  const v = validarEnvio(envio, hoy);
  if (!v.ok) return [{ error: v.motivo }, v.motivo === 'tope' ? 429 : 422];

  await db.prepare(`INSERT INTO puntos (jugador, dia, puntos, envios) VALUES (?, ?, ?, 1)
    ON CONFLICT (jugador, dia) DO UPDATE SET puntos = puntos + excluded.puntos, envios = envios + 1`)
    .bind(jugador.id, dia, envio.puntos).run();
  const [desde, hasta] = rangoMes(dia);
  const mes = await db.prepare('SELECT COALESCE(SUM(puntos), 0) AS p FROM puntos WHERE jugador = ? AND dia BETWEEN ? AND ?')
    .bind(jugador.id, desde, hasta).first();
  return [{ hoy: hoy.puntos + envio.puntos, mes: mes.p }, 200];
}

async function clasificacion(peticion, db, ahora, url) {
  const periodo = url.searchParams.get('periodo') === 'mes' ? 'mes' : 'dia';
  const dia = diaMadrid(ahora);
  const [desde, hasta] = periodo === 'mes' ? rangoMes(dia) : [dia, dia];
  // Puntos de cada jugador en el periodo (un día o la suma del mes)
  const totales = `SELECT jugador, SUM(puntos) AS puntos FROM puntos WHERE dia BETWEEN ?1 AND ?2 GROUP BY jugador HAVING SUM(puntos) > 0`;

  const { results } = await db.prepare(`SELECT j.alias AS alias, t.puntos AS puntos FROM (${totales}) t
    JOIN jugadores j ON j.id = t.jugador ORDER BY t.puntos DESC, j.id ASC LIMIT ?3`)
    .bind(desde, hasta, REGLAS.top).all();
  const top = posiciones(results);

  let yo = null;
  const jugador = await jugadorDe(peticion, db);
  if (jugador) {
    const mio = await db.prepare(`SELECT puntos FROM (${totales}) WHERE jugador = ?3`).bind(desde, hasta, jugador.id).first();
    const puntos = mio?.puntos ?? 0;
    let pos = null;
    if (puntos > 0) {
      const delante = await db.prepare(`SELECT COUNT(*) AS n FROM (${totales}) WHERE puntos > ?3`).bind(desde, hasta, puntos).first();
      pos = delante.n + 1;
    }
    yo = { alias: jugador.alias, pos, puntos };
  }
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM (${totales})`).bind(desde, hasta).first();
  return [{ periodo, dia, top, yo, jugadores: total.n }, 200];
}

async function recuperar(peticion, db) {
  const jugador = await jugadorDe(peticion, db);
  if (!jugador) return [{ error: 'codigo' }, 401];
  return [{ alias: jugador.alias }, 200];
}

async function salir(peticion, db) {
  const jugador = await jugadorDe(peticion, db);
  if (!jugador) return [{ error: 'codigo' }, 401];
  await db.batch([
    db.prepare('DELETE FROM puntos WHERE jugador = ?').bind(jugador.id),
    db.prepare('DELETE FROM jugadores WHERE id = ?').bind(jugador.id),
  ]);
  return [null, 204];
}

const RUTAS = {
  'POST /unirse': unirse,
  'POST /puntos': sumarPuntos,
  'GET /ranking': clasificacion,
  'POST /recuperar': recuperar,
  'DELETE /yo': salir,
};

export default {
  async fetch(peticion, env) {
    const origen = peticion.headers.get('Origin');
    if (origen && !origenPermitido(origen)) return respuesta({ error: 'origen' }, 403, null);
    if (peticion.method === 'OPTIONS') return respuesta(null, 204, origen);

    const url = new URL(peticion.url);
    const ruta = RUTAS[`${peticion.method} ${url.pathname.replace(/\/+$/, '')}`];
    if (!ruta) return respuesta({ error: 'no-existe' }, 404, origen);
    if (!env.DB) return respuesta({ error: 'sin-base-de-datos' }, 500, origen);

    try {
      const [cuerpo, estado] = await ruta(peticion, env.DB, new Date(), url);
      return respuesta(cuerpo, estado, origen);
    } catch (e) {
      console.error(e);
      return respuesta({ error: 'servidor' }, 500, origen);
    }
  },
};
