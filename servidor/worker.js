// API del ranking de Hello English (specs 027-033, D-021, D-022, D-024 y D-025).
// Se publica como Cloudflare Worker con una base de datos D1 enlazada como `DB`.
// Todo va en este único archivo para poder pegarlo tal cual en el panel de Cloudflare.
// Las reglas puras (arriba) se exportan para probarlas en servidor/tests.html.
// v2: ayer y mes pasado, ligas por nivel, rachas, reto del día y recordatorios (Web Push con
// un cron cada 15 minutos). Las tablas y columnas nuevas se crean solas (prepararEsquema).

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
  rachaMax: 3650,
  rachaPrimera: 365,     // racha más larga que se acepta en el primer envío
  retoN: 10,             // ejercicios del reto del día (spec 033)
  retoSegMin: 10,
  retoSegMax: 3600,
  maxRecordatoriosHora: 10, // altas de recordatorio por IP y hora
  recordatoriosPorRonda: 40, // el plan gratis deja 50 peticiones salientes por ejecución
  ventanaRecordatorio: 3,    // horas tras la elegida en las que aún se avisa
};

export const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1'];

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

const aNumero = (dia) => Date.UTC(...dia.split('-').map((n, i) => Number(n) - (i === 1 ? 1 : 0))) / 86400000;

/** Días de b menos días de a ('2026-11-01', '2026-11-03' → 2). */
export function diasEntre(a, b) {
  return Math.round(aNumero(b) - aNumero(a));
}

export function diaAnterior(dia) {
  return new Date((aNumero(dia) - 1) * 86400000).toISOString().slice(0, 10);
}

export const PERIODOS = ['dia', 'ayer', 'mes', 'mesAnterior'];

/**
 * Días que abarca un periodo de la clasificación (spec 028).
 * @returns {{ periodo: string, desde: string, hasta: string, dia: string }} dia = día de referencia
 */
export function rangoPeriodo(periodo, hoy) {
  const p = PERIODOS.includes(periodo) ? periodo : 'dia';
  if (p === 'dia') return { periodo: p, desde: hoy, hasta: hoy, dia: hoy };
  if (p === 'ayer') {
    const ayer = diaAnterior(hoy);
    return { periodo: p, desde: ayer, hasta: ayer, dia: ayer };
  }
  const ref = p === 'mes' ? hoy : inicioMesAnterior(hoy);
  const [desde, hasta] = rangoMes(ref);
  return { periodo: p, desde, hasta, dia: ref };
}

/** Nivel de una liga (spec 030), o null si no es uno de los cinco. */
export function nivelValido(nivel) {
  return NIVELES.includes(nivel) ? nivel : null;
}

/**
 * Racha que se acepta (spec 031). Como mucho sube 1 por día desde el último envío (o 1 el mismo
 * día, al cumplir el objetivo); en el primer envío, hasta un año. null = no es una racha.
 * @param {{ racha: number, dia: string|null }|null} anterior
 */
export function rachaAceptada(nueva, anterior, hoy) {
  if (!Number.isInteger(nueva) || nueva < 0) return null;
  let r = Math.min(nueva, REGLAS.rachaMax);
  if (!anterior?.dia) return Math.min(r, REGLAS.rachaPrimera);
  const dias = Math.max(0, diasEntre(anterior.dia, hoy));
  r = Math.min(r, anterior.racha + Math.max(1, dias));
  return r;
}

/**
 * Resultado del reto del día (spec 033).
 * @returns {{ ok: true } | { ok: false, motivo: 'imposible' }}
 */
export function validarReto(r) {
  const { juego, aciertos, total, segundos } = r ?? {};
  if (typeof juego !== 'string' || !/^[a-z][a-z-]{1,29}$/.test(juego)) return { ok: false, motivo: 'imposible' };
  if (total !== REGLAS.retoN) return { ok: false, motivo: 'imposible' };
  if (!Number.isInteger(aciertos) || aciertos < 0 || aciertos > total) return { ok: false, motivo: 'imposible' };
  if (!Number.isInteger(segundos) || segundos < REGLAS.retoSegMin || segundos > REGLAS.retoSegMax) return { ok: false, motivo: 'imposible' };
  return { ok: true };
}

/** Posiciones del reto: más aciertos y, a igualdad, menos segundos. */
export function posicionesReto(filas) {
  let pos = 0;
  return filas.map((f, i) => {
    const antes = filas[i - 1];
    if (i === 0 || f.aciertos !== antes.aciertos || f.segundos !== antes.segundos) pos = i + 1;
    return { pos, alias: f.alias, aciertos: f.aciertos, total: f.total, segundos: f.segundos };
  });
}

// --- Recordatorios (spec 032, D-025) ---

/** Servicios de notificaciones push de los navegadores: no se aceptan otras direcciones. */
const SERVICIOS_PUSH = [/\.googleapis\.com$/, /\.push\.services\.mozilla\.com$/, /\.push\.apple\.com$/, /\.notify\.windows\.com$/];

export function endpointValido(endpoint) {
  if (typeof endpoint !== 'string' || endpoint.length > 1000) return false;
  try {
    const u = new URL(endpoint);
    return u.protocol === 'https:' && SERVICIOS_PUSH.some((re) => re.test(u.hostname));
  } catch {
    return false;
  }
}

export function zonaValida(zona) {
  if (typeof zona !== 'string' || zona.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: zona });
    return true;
  } catch {
    return false;
  }
}

/** Día y hora (0-23) en una zona horaria. */
export function horaLocal(fecha, zona) {
  const partes = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(fecha).map((p) => [p.type, p.value]));
  return { dia: `${partes.year}-${partes.month}-${partes.day}`, hora: Number(partes.hour) };
}

/**
 * ¿Toca avisar ahora? Desde la hora elegida y durante unas horas, una vez al día y solo si ese
 * día no ha cumplido el objetivo.
 * @param {{ hora: number, zona: string, ultimo: string|null, hecho: string|null }} r
 */
export function recordatorioToca(r, ahora) {
  const { dia, hora } = horaLocal(ahora, r.zona);
  return hora >= r.hora && hora < r.hora + REGLAS.ventanaRecordatorio && r.ultimo !== dia && r.hecho !== dia;
}

export function aBase64Url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Firma VAPID (RFC 8292): un JWT ES256 para el servicio push de `aud`. */
export async function jwtVapid(clavePrivada, aud, ahora = new Date()) {
  const codificar = (o) => aBase64Url(new TextEncoder().encode(JSON.stringify(o)));
  const datos = `${codificar({ typ: 'JWT', alg: 'ES256' })}.${codificar({
    aud,
    exp: Math.floor(ahora.getTime() / 1000) + 12 * 3600,
    sub: 'https://zeroping7.github.io/hello-english/',
  })}`;
  const firma = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, clavePrivada, new TextEncoder().encode(datos));
  return `${datos}.${aBase64Url(new Uint8Array(firma))}`;
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
  if (texto.length > 2000) return null;
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
  return db.prepare('SELECT id, alias, racha, racha_dia FROM jugadores WHERE codigo_hash = ?').bind(await sha256(codigo)).first();
}

/** Las tablas y columnas de la v2 (se crean solas la primera vez, sin tocar la consola de D1). */
let esquemaListo = false;
async function prepararEsquema(db) {
  if (esquemaListo) return;
  const { results } = await db.prepare('PRAGMA table_info(jugadores)').all();
  const columnas = results.map((c) => c.name);
  const sentencias = [];
  if (!columnas.includes('nivel')) sentencias.push('ALTER TABLE jugadores ADD COLUMN nivel TEXT');
  if (!columnas.includes('racha')) sentencias.push('ALTER TABLE jugadores ADD COLUMN racha INTEGER NOT NULL DEFAULT 0');
  if (!columnas.includes('racha_dia')) sentencias.push('ALTER TABLE jugadores ADD COLUMN racha_dia TEXT');
  sentencias.push(
    `CREATE TABLE IF NOT EXISTS reto (jugador INTEGER NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
      dia TEXT NOT NULL, juego TEXT NOT NULL, aciertos INTEGER NOT NULL, total INTEGER NOT NULL,
      segundos INTEGER NOT NULL, PRIMARY KEY (jugador, dia))`,
    `CREATE TABLE IF NOT EXISTS recordatorios (endpoint TEXT PRIMARY KEY, hora INTEGER NOT NULL,
      zona TEXT NOT NULL, idioma TEXT NOT NULL, ultimo TEXT, hecho TEXT, creado TEXT NOT NULL)`,
    'CREATE TABLE IF NOT EXISTS config (clave TEXT PRIMARY KEY, valor TEXT NOT NULL)',
  );
  await db.batch(sentencias.map((q) => db.prepare(q)));
  esquemaListo = true;
}

/** Borra lo que ya no hace falta: altas de ayer, puntos y retos de antes del mes pasado. */
async function limpiar(db, ahora) {
  const ayer = new Date(ahora.getTime() - 24 * 3600 * 1000).toISOString().slice(0, 13);
  const desde = inicioMesAnterior(diaMadrid(ahora));
  await db.batch([
    db.prepare('DELETE FROM altas WHERE hora < ?').bind(ayer),
    db.prepare('DELETE FROM puntos WHERE dia < ?').bind(desde),
    db.prepare('DELETE FROM reto WHERE dia < ?').bind(desde),
  ]);
}

/** Tope por IP y hora (altas en el ranking o recordatorios). La IP solo se guarda resumida. */
async function dentroDelTope(peticion, db, ahora, tipo, maximo) {
  const hora = ahora.toISOString().slice(0, 13);
  const ip = peticion.headers.get('CF-Connecting-IP') ?? 'local';
  const ipHash = await sha256(`${tipo}|${ip}|${hora}`);
  const fila = await db.prepare('SELECT n FROM altas WHERE ip_hash = ? AND hora = ?').bind(ipHash, hora).first();
  if ((fila?.n ?? 0) >= maximo) return false;
  await db.prepare('INSERT INTO altas (ip_hash, hora, n) VALUES (?, ?, 1) ON CONFLICT (ip_hash, hora) DO UPDATE SET n = n + 1')
    .bind(ipHash, hora).run();
  return true;
}

async function unirse(peticion, db, ahora) {
  const cuerpo = await leerJson(peticion);
  const alias = cuerpo?.alias;
  const v = validarAlias(alias);
  if (!v.ok) return [{ error: 'alias-no-valido', motivo: v.motivo }, 422];

  // Tope de altas por IP y hora; la IP solo se guarda resumida y se borra al día siguiente
  if (!await dentroDelTope(peticion, db, ahora, 'alta', REGLAS.maxAltasHora)) return [{ error: 'tope' }, 429];

  const codigo = crearCodigo();
  try {
    await db.prepare('INSERT INTO jugadores (alias, codigo_hash, creado) VALUES (?, ?, ?)')
      .bind(alias, await sha256(codigo), ahora.toISOString()).run();
  } catch (e) {
    if (String(e?.message ?? e).includes('UNIQUE')) return [{ error: 'alias-usado' }, 409];
    throw e;
  }

  // El histórico está fuera de alcance: solo hace falta el mes actual y el anterior
  await limpiar(db, ahora);
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

  const sentencias = [db.prepare(`INSERT INTO puntos (jugador, dia, puntos, envios) VALUES (?, ?, ?, 1)
    ON CONFLICT (jugador, dia) DO UPDATE SET puntos = puntos + excluded.puntos, envios = envios + 1`)
    .bind(jugador.id, dia, envio.puntos)];
  // Liga (spec 030) y racha (spec 031): opcionales, las manda la app desde la v1.2.0
  const nivel = nivelValido(envio.nivel);
  if (nivel) sentencias.push(db.prepare('UPDATE jugadores SET nivel = ? WHERE id = ?').bind(nivel, jugador.id));
  const racha = rachaAceptada(envio.racha, jugador.racha_dia ? { racha: jugador.racha, dia: jugador.racha_dia } : null, dia);
  if (racha !== null) sentencias.push(db.prepare('UPDATE jugadores SET racha = ?, racha_dia = ? WHERE id = ?').bind(racha, dia, jugador.id));
  await db.batch(sentencias);
  const [desde, hasta] = rangoMes(dia);
  const mes = await db.prepare('SELECT COALESCE(SUM(puntos), 0) AS p FROM puntos WHERE jugador = ? AND dia BETWEEN ? AND ?')
    .bind(jugador.id, desde, hasta).first();
  return [{ hoy: hoy.puntos + envio.puntos, mes: mes.p }, 200];
}

async function clasificacion(peticion, db, ahora, url) {
  const { periodo, desde, hasta, dia } = rangoPeriodo(url.searchParams.get('periodo'), diaMadrid(ahora));
  const liga = nivelValido(url.searchParams.get('liga'));
  // Puntos de cada jugador en el periodo (un día o la suma del mes), solo los de la liga si se pide
  const totales = `SELECT jugador, SUM(puntos) AS puntos FROM puntos WHERE dia BETWEEN ?1 AND ?2
    AND (?4 IS NULL OR jugador IN (SELECT id FROM jugadores WHERE nivel = ?4)) GROUP BY jugador HAVING SUM(puntos) > 0`;

  const { results } = await db.prepare(`SELECT j.alias AS alias, t.puntos AS puntos FROM (${totales}) t
    JOIN jugadores j ON j.id = t.jugador ORDER BY t.puntos DESC, j.id ASC LIMIT ?3`)
    .bind(desde, hasta, REGLAS.top, liga).all();
  const top = posiciones(results);

  let yo = null;
  const jugador = await jugadorDe(peticion, db);
  if (jugador) {
    const mio = await db.prepare(`SELECT puntos FROM (${totales}) WHERE jugador = ?3`).bind(desde, hasta, jugador.id, liga).first();
    const puntos = mio?.puntos ?? 0;
    let pos = null;
    if (puntos > 0) {
      const delante = await db.prepare(`SELECT COUNT(*) AS n FROM (${totales}) WHERE puntos > ?3`).bind(desde, hasta, puntos, liga).first();
      pos = delante.n + 1;
    }
    yo = { alias: jugador.alias, pos, puntos };
  }
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM (${totales}) WHERE ?3 IS NULL`).bind(desde, hasta, null, liga).first();
  return [{ api: 2, periodo, dia, desde, hasta, liga, top, yo, jugadores: total.n }, 200];
}

/** Rachas activas (cumplidas hoy o ayer), de la más larga a la más corta (spec 031). */
async function rachas(peticion, db, ahora) {
  const hoy = diaMadrid(ahora);
  const ayer = diaAnterior(hoy);
  const { results } = await db.prepare(`SELECT alias, racha FROM jugadores WHERE racha > 0 AND racha_dia >= ?1
    ORDER BY racha DESC, id ASC LIMIT ?2`).bind(ayer, REGLAS.top).all();
  const top = posiciones(results.map((f) => ({ alias: f.alias, puntos: f.racha }))).map((f) => ({ pos: f.pos, alias: f.alias, racha: f.puntos }));

  let yo = null;
  const jugador = await jugadorDe(peticion, db);
  if (jugador) {
    const vigente = jugador.racha_dia && jugador.racha_dia >= ayer ? jugador.racha : 0;
    let pos = null;
    if (vigente > 0) {
      const delante = await db.prepare('SELECT COUNT(*) AS n FROM jugadores WHERE racha > ?1 AND racha_dia >= ?2').bind(vigente, ayer).first();
      pos = delante.n + 1;
    }
    yo = { alias: jugador.alias, pos, racha: vigente };
  }
  const total = await db.prepare('SELECT COUNT(*) AS n FROM jugadores WHERE racha > 0 AND racha_dia >= ?1').bind(ayer).first();
  return [{ api: 2, dia: hoy, top, yo, jugadores: total.n }, 200];
}

/** Guarda el resultado del reto de hoy; solo vale el primero (spec 033). */
async function guardarReto(peticion, db, ahora) {
  const jugador = await jugadorDe(peticion, db);
  if (!jugador) return [{ error: 'codigo' }, 401];
  const r = await leerJson(peticion);
  const v = validarReto(r);
  if (!v.ok) return [{ error: v.motivo }, 422];
  const dia = diaMadrid(ahora);
  const hecho = await db.prepare(`INSERT INTO reto (jugador, dia, juego, aciertos, total, segundos) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (jugador, dia) DO NOTHING`).bind(jugador.id, dia, r.juego, r.aciertos, r.total, r.segundos).run();
  if (!hecho.meta?.changes) return [{ error: 'ya-jugado' }, 409];
  return [{ dia }, 201];
}

/** Clasificación del reto de hoy (spec 033). */
async function clasificacionReto(peticion, db, ahora) {
  const dia = diaMadrid(ahora);
  const { results } = await db.prepare(`SELECT j.alias AS alias, r.aciertos AS aciertos, r.total AS total, r.segundos AS segundos
    FROM reto r JOIN jugadores j ON j.id = r.jugador WHERE r.dia = ?1
    ORDER BY r.aciertos DESC, r.segundos ASC, r.jugador ASC LIMIT ?2`).bind(dia, REGLAS.top).all();
  const top = posicionesReto(results);

  let yo = null;
  const jugador = await jugadorDe(peticion, db);
  if (jugador) {
    const mio = await db.prepare('SELECT aciertos, total, segundos FROM reto WHERE jugador = ?1 AND dia = ?2').bind(jugador.id, dia).first();
    let pos = null;
    if (mio) {
      const delante = await db.prepare(`SELECT COUNT(*) AS n FROM reto WHERE dia = ?1
        AND (aciertos > ?2 OR (aciertos = ?2 AND segundos < ?3))`).bind(dia, mio.aciertos, mio.segundos).first();
      pos = delante.n + 1;
    }
    yo = { alias: jugador.alias, pos, ...(mio ?? {}) };
  }
  const total = await db.prepare('SELECT COUNT(*) AS n FROM reto WHERE dia = ?1').bind(dia).first();
  return [{ api: 2, dia, top, yo, jugadores: total.n }, 200];
}

// --- Recordatorios (spec 032, D-025): Web Push sin contenido, firmado con claves VAPID propias ---

/** Claves VAPID: el Worker las crea la primera vez y las guarda en la tabla config. */
async function clavesVapid(db) {
  const leer = () => db.prepare("SELECT valor FROM config WHERE clave = 'vapid'").first();
  let fila = await leer();
  if (!fila) {
    const par = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    const privada = await crypto.subtle.exportKey('jwk', par.privateKey);
    const publica = aBase64Url(new Uint8Array(await crypto.subtle.exportKey('raw', par.publicKey)));
    await db.prepare("INSERT OR IGNORE INTO config (clave, valor) VALUES ('vapid', ?)").bind(JSON.stringify({ privada, publica })).run();
    fila = await leer(); // si dos peticiones las crearon a la vez, gana la primera
  }
  const { privada, publica } = JSON.parse(fila.valor);
  const clave = await crypto.subtle.importKey('jwk', privada, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  return { clave, publica };
}

async function claveRecordatorio(peticion, db) {
  return [{ clave: (await clavesVapid(db)).publica }, 200];
}

async function guardarRecordatorio(peticion, db, ahora) {
  const r = await leerJson(peticion);
  const { endpoint, hora, zona, idioma } = r ?? {};
  if (!endpointValido(endpoint) || !Number.isInteger(hora) || hora < 0 || hora > 23 || !zonaValida(zona) || !['es', 'en'].includes(idioma)) {
    return [{ error: 'imposible' }, 422];
  }
  const existe = await db.prepare('SELECT 1 AS si FROM recordatorios WHERE endpoint = ?').bind(endpoint).first();
  if (!existe && !await dentroDelTope(peticion, db, ahora, 'recordatorio', REGLAS.maxRecordatoriosHora)) return [{ error: 'tope' }, 429];
  await db.prepare(`INSERT INTO recordatorios (endpoint, hora, zona, idioma, creado) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (endpoint) DO UPDATE SET hora = excluded.hora, zona = excluded.zona, idioma = excluded.idioma`)
    .bind(endpoint, hora, zona, idioma, ahora.toISOString()).run();
  return [{ hora }, 201];
}

async function borrarRecordatorio(peticion, db) {
  const r = await leerJson(peticion);
  if (!endpointValido(r?.endpoint)) return [{ error: 'imposible' }, 422];
  await db.prepare('DELETE FROM recordatorios WHERE endpoint = ?').bind(r.endpoint).run();
  return [null, 204];
}

/** La app avisa de que hoy ya ha cumplido el objetivo: ese día no se le recuerda. */
async function recordatorioHecho(peticion, db) {
  const r = await leerJson(peticion);
  if (!endpointValido(r?.endpoint) || !/^\d{4}-\d{2}-\d{2}$/.test(r?.dia ?? '')) return [{ error: 'imposible' }, 422];
  await db.prepare('UPDATE recordatorios SET hecho = ? WHERE endpoint = ?').bind(r.dia, r.endpoint).run();
  return [null, 204];
}

/** Cada 15 minutos (cron): manda los recordatorios que tocan. Sin contenido: el texto lo pone la app. */
export async function enviarRecordatorios(db, ahora) {
  const { results } = await db.prepare('SELECT endpoint, hora, zona, ultimo, hecho FROM recordatorios LIMIT 5000').all();
  const tocan = results.filter((r) => zonaValida(r.zona) && recordatorioToca(r, ahora)).slice(0, REGLAS.recordatoriosPorRonda);
  if (!tocan.length) return 0;
  const claves = await clavesVapid(db);
  const sentencias = [];
  await Promise.all(tocan.map(async (r) => {
    try {
      const jwt = await jwtVapid(claves.clave, new URL(r.endpoint).origin, ahora);
      const res = await fetch(r.endpoint, {
        method: 'POST',
        headers: { Authorization: `vapid t=${jwt}, k=${claves.publica}`, TTL: '10800', Urgency: 'normal', 'Content-Length': '0' },
        body: '',
      });
      // 404 o 410: el navegador ya no quiere avisos (desinstalada, permiso quitado)
      if (res.status === 404 || res.status === 410) sentencias.push(db.prepare('DELETE FROM recordatorios WHERE endpoint = ?').bind(r.endpoint));
      else sentencias.push(db.prepare('UPDATE recordatorios SET ultimo = ? WHERE endpoint = ?').bind(horaLocal(ahora, r.zona).dia, r.endpoint));
    } catch (e) {
      console.error(e);
    }
  }));
  if (sentencias.length) await db.batch(sentencias);
  return tocan.length;
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
    db.prepare('DELETE FROM reto WHERE jugador = ?').bind(jugador.id),
    db.prepare('DELETE FROM jugadores WHERE id = ?').bind(jugador.id),
  ]);
  return [null, 204];
}

const RUTAS = {
  'POST /unirse': unirse,
  'POST /puntos': sumarPuntos,
  'GET /ranking': clasificacion,
  'GET /rachas': rachas,
  'POST /reto': guardarReto,
  'GET /reto': clasificacionReto,
  'POST /recuperar': recuperar,
  'DELETE /yo': salir,
  'GET /recordatorio/clave': claveRecordatorio,
  'POST /recordatorio': guardarRecordatorio,
  'DELETE /recordatorio': borrarRecordatorio,
  'POST /recordatorio/hecho': recordatorioHecho,
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
      await prepararEsquema(env.DB);
      const [cuerpo, estado] = await ruta(peticion, env.DB, new Date(), url);
      return respuesta(cuerpo, estado, origen);
    } catch (e) {
      console.error(e);
      return respuesta({ error: 'servidor' }, 500, origen);
    }
  },

  /** Cron (Settings → Trigger events, cada 15 minutos): recordatorios y limpieza. */
  async scheduled(evento, env, ctx) {
    if (!env.DB) return;
    ctx.waitUntil((async () => {
      const ahora = new Date();
      await prepararEsquema(env.DB);
      await enviarRecordatorios(env.DB, ahora);
      await limpiar(env.DB, ahora);
    })());
  },
};
