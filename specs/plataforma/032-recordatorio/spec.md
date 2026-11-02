# Spec de funcionalidad: Recordatorio diario

> **ID:** 032-recordatorio · **Estado:** Implementada (v1.2.0) · **Fecha:** 2026-11-02
> Pedida por el usuario el 2026-11-02 con «hazlo todo y avísame al terminar»: las preguntas abiertas las decidió Claude (§6) y quedan para que el usuario las revise.

## 1. Problema
Si un día no te acuerdas de practicar, pierdes la racha. La app no puede avisar porque no está abierta.

## 2. Objetivo
Una notificación a la hora elegida, solo los días que aún no has cumplido el objetivo, aunque la app esté cerrada.

## 3. Historias de usuario
**HU-1 — Activar.** Como jugador, quiero activar un recordatorio y elegir la hora.
- [x] En Ajustes → Recordatorio diario: activar/desactivar y la hora (en punto, de 00:00 a 23:00; por defecto 20:00).
- [x] Se pide permiso de notificaciones al activarlo, no antes.
- [x] Se explica qué guarda el servidor. No hace falta estar en el ranking.

**HU-2 — Recibirlo.** Como jugador con el recordatorio activo, quiero el aviso solo si me hace falta.
- [x] Llega entre la hora elegida y 3 horas después, una vez al día.
- [x] Si ese día ya cumplí el objetivo, no llega.
- [x] Sale en el idioma de la app; al tocarlo abre la Práctica de hoy.

**HU-3 — Donde no se puede.**
- [x] En iPhone/iPad sin instalar la app se explica cómo instalarla; en navegadores sin notificaciones push, se dice.

## 4. Requisitos no funcionales
- PR1: excepción (D-025). Se guarda la dirección de avisos del navegador, la hora, la zona horaria y el idioma; se borra al desactivarlo o al borrar todo.
- Gratis: un cron del Worker cada 15 minutos (el plan gratis deja 50 peticiones salientes por ejecución: hasta 40 avisos por ronda).

## 5. Fuera de alcance
- Varios recordatorios al día, días de la semana o minutos concretos.
- Avisos con contenido personalizado.

## 6. Preguntas abiertas (decididas por Claude)
- [x] ¿Notificación local o push? → **Push desde el Worker** (D-025): las notificaciones programadas en el navegador no existen de forma fiable.
- [x] ¿Claves VAPID? → Las **crea el propio Worker** la primera vez y las guarda en D1: el usuario no tiene que generar nada.
- [x] ¿Cifrar el contenido? → **Aviso vacío**: el texto lo pone el service worker. Así no hace falta cifrar.
