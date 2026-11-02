// Recordatorio diario (spec 032, D-025): una notificación a la hora elegida si ese día aún no se
// ha cumplido el objetivo. La envía el servidor del ranking (Web Push) aunque la app esté cerrada;
// no hace falta estar en el ranking. El texto lo pone el service worker (sw.js) en el idioma de la app.
// Web Push es como Firebase Cloud Messaging en Android: el navegador da una dirección
// (endpoint) a la que el servidor manda un aviso, y el service worker lo enseña.
import * as api from '../ranking/api.js';
import { API } from '../ranking/config.js';
import { leerAjustes, cambiarAjuste } from '../ajustes/ajustes.js';
import { hoy } from '../progreso/reloj.js';

const CACHE_CONFIG = 'hello-config'; // no empieza por 'he-': sw.js no la borra al actualizarse

/** iPhone o iPad (también los iPad que dicen ser un Mac). */
function esIos() {
  const n = globalThis.navigator ?? {};
  return /iPad|iPhone|iPod/.test(n.userAgent ?? '') || (n.platform === 'MacIntel' && n.maxTouchPoints > 1);
}

function instalada() {
  return globalThis.matchMedia?.('(display-mode: standalone)').matches || globalThis.navigator?.standalone === true;
}

/**
 * ¿Se pueden usar aquí? 'si', 'instalar' (iPhone/iPad: solo con la app añadida a la pantalla
 * de inicio), 'no' (el navegador no tiene notificaciones push) o 'sin-servidor'.
 */
export function soporte() {
  if (!API) return 'sin-servidor';
  const ok = 'serviceWorker' in navigator && 'PushManager' in globalThis && 'Notification' in globalThis;
  if (ok) return 'si';
  return esIos() && !instalada() ? 'instalar' : 'no';
}

async function suscripcion() {
  if (soporte() !== 'si') return null;
  const reg = await navigator.serviceWorker.getRegistration();
  return reg ? reg.pushManager.getSubscription() : null;
}

/** Está activo en este dispositivo (hay suscripción y permiso). */
export async function activo() {
  return Boolean(await suscripcion()) && Notification.permission === 'granted';
}

function deBase64Url(texto) {
  const b64 = texto.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (texto.length % 4)) % 4);
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

/** El service worker lee de aquí el idioma de la notificación (no tiene acceso a localStorage). */
async function guardarIdiomaParaSw(idioma) {
  try {
    const cache = await caches.open(CACHE_CONFIG);
    await cache.put('./__idioma', new Response(idioma));
  } catch {
    // sin Cache API la notificación sale en español
  }
}

function datosDe(sub, hora) {
  return {
    endpoint: sub.endpoint,
    hora,
    zona: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid',
    idioma: leerAjustes().idioma,
  };
}

/**
 * Activa el recordatorio (o cambia la hora). Pide permiso de notificaciones si hace falta.
 * @returns {Promise<{ ok: true } | { ok: false, motivo: string }>} motivo: 'permiso', 'no' o los de la API
 */
export async function activar(hora) {
  if (soporte() !== 'si') return { ok: false, motivo: 'no' };
  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') return { ok: false, motivo: 'permiso' };
  const clave = await api.claveRecordatorio();
  if (!clave.ok) return clave;
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    const nueva = deBase64Url(clave.datos.clave);
    // Si la suscripción es de otra clave (otro servidor), se rehace
    const actual = sub?.options?.applicationServerKey;
    if (sub && actual && new Uint8Array(actual).join() !== nueva.join()) {
      await sub.unsubscribe();
      sub = null;
    }
    sub ??= await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: nueva });
    const r = await api.guardarRecordatorio(datosDe(sub, hora));
    if (!r.ok) return r;
  } catch {
    return { ok: false, motivo: 'no' };
  }
  await cambiarAjuste('recordatorioHora', hora);
  await guardarIdiomaParaSw(leerAjustes().idioma);
  return { ok: true };
}

/** Quita el recordatorio de este dispositivo y del servidor. */
export async function desactivar() {
  const sub = await suscripcion();
  if (!sub) return { ok: true };
  const r = await api.borrarRecordatorio(sub.endpoint);
  if (!r.ok && r.motivo === 'sin-red') return r;
  await sub.unsubscribe();
  return { ok: true };
}

/** Objetivo de hoy cumplido: el servidor no avisará hoy. */
export async function avisarObjetivoCumplido() {
  const sub = await suscripcion().catch(() => null);
  if (sub) api.recordatorioHecho(sub.endpoint, hoy());
}

/** Al cambiar de idioma, la notificación también cambia. */
export async function actualizarIdioma() {
  const { idioma, recordatorioHora } = leerAjustes();
  await guardarIdiomaParaSw(idioma);
  const sub = await suscripcion().catch(() => null);
  if (sub) api.guardarRecordatorio(datosDe(sub, recordatorioHora));
}
