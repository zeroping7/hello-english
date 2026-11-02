# Plan técnico: Recordatorio diario

> **Spec:** `specs/plataforma/032-recordatorio/spec.md` · **Estado:** Aprobado (con la spec) · **Fecha:** 2026-11-02

## 1. Cumplimiento de la constitución
- [x] A1 `recordatorioToca`, `horaLocal`, `endpointValido`, `jwtVapid` puros (servidor)
- [x] A3 Textos `recordatorio.*` (también los de la notificación, que lee `sw.js`)
- [x] P5 `sw.js` con `push` y `notificationclick`
- [ ] **PR1: excepción** → D-025
- [x] Q2 `servidor/tests.html` (incluye verificar la firma VAPID)
- El servidor es la v2 de `servidor/worker.js` (D-024): hay que volver a pegarlo en Cloudflare. Además, hay que añadir un **cron** `*/15 * * * *` en el Worker (`servidor/LEEME.md`).

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `servidor/worker.js` | Tablas `recordatorios` y `config`; `GET /recordatorio/clave`, `POST/DELETE /recordatorio`, `POST /recordatorio/hecho`; `scheduled()` cada 15 min |
| `src/recordatorio/recordatorio.js` | `soporte`, `activo`, `activar(hora)`, `desactivar`, `avisarObjetivoCumplido`, `actualizarIdioma` |
| `sw.js` | Enseña la notificación con el texto del idioma guardado (caché `hello-config`) |
| `src/ajustes/ajustes.js` | `recordatorioHora` |
| `src/pantallas/ajustes.js` | Sección Recordatorio diario |
| `src/app.js` | Al cumplir el objetivo, avisa al servidor |

## 3. Modelo de datos
`recordatorios(endpoint PK, hora, zona, idioma, ultimo, hecho, creado)`; `config('vapid', { privada (JWK), publica })`. En la app solo `recordatorioHora` en `he-ajustes`; si está activo lo dice la suscripción del navegador.

## 4. Contenido
No usa contenido nuevo salvo que se diga aquí.

## 5. Pantallas
| Ajustes | Interruptor, hora, estado y privacidad | — |
| Notificación | «Aún no has cumplido tu objetivo de hoy…» | Abre `#/practica` |

## 6. Textos de interfaz
`recordatorio.*`

## 7. Assets
Sin assets nuevos (iconos de trazo en `src/ui/iconos.js`).

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Más de 40 avisos a la misma hora | Baja | Se reparten en las siguientes rondas de 15 minutos (ventana de 3 horas) |
| El navegador retira la suscripción | Media | El servicio push responde 404/410 y se borra |
| No se puede probar el envío real sin el servicio push | — | Firma VAPID verificada en pruebas; probar en el móvil tras publicar |

## 9. Pruebas
- **`tests.html`:** ventana de horas, zonas, direcciones permitidas, firma VAPID.
- **Manual en el móvil (Chrome Android):** activar a la hora siguiente, cerrar la app y esperar el aviso.
