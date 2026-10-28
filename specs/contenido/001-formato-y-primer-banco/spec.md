# Spec de funcionalidad: Formato del contenido y primer banco

> **ID:** 001-formato-y-primer-banco · **Estado:** Implementada (v0.1.1) · **Fecha:** 2026-10-28

## 1. Problema
Los minijuegos y la prueba de nivel necesitan ejercicios en inglés correctos, con nivel, tema, traducción y explicación (constitución CO1-CO4). Todavía no hay ni un formato común ni contenido.

## 2. Objetivo
Un formato de ficha común para todo el contenido, un banco por tipo de ejercicio y un primer lote suficiente para la versión 1: prueba de nivel, Falsos amigos y Merge Conflict, sobre tres temas.

## 3. Historias de usuario

**HU-1 — Contenido fiable.** Como usuario, quiero que lo que aprendo sea inglés real y correcto.
- [x] Todo el contenido está escrito por Claude con inglés de uso real en el trabajo, en ortografía británica salvo nombres técnicos (spec 000).
- [x] Cada ejercicio tiene una explicación breve en español y en inglés para cuando se falla.

**HU-2 — Contenido a mi nivel y de mis temas.**
- [x] Cada ejercicio tiene un nivel (A1–C1) y un tema.
- [x] Los tres primeros temas son **Programación**, **Web** y **Trabajo en equipo** (reuniones, *code review*, mensajes).
- [x] Cada banco tiene ejercicios de todos los niveles.

**HU-3 — Nada se rompe por un ejercicio mal escrito.**
- [x] Una página de pruebas comprueba todos los bancos: campos obligatorios, tipos, niveles y temas válidos e ids únicos que no se repiten entre bancos.

## 4. Primer lote (mínimos)
| Banco | Para | Mínimo |
|---|---|---|
| `prueba-nivel` | Prueba de nivel (spec 002) | 5 preguntas por nivel (25) |
| `falsos-amigos` | Falsos amigos (spec 003) | 40 tarjetas, al menos 6 por nivel, mitad aproximada verdaderas y falsas |
| `merge-conflict` | Merge Conflict (spec 004) | 40 pares de frases, al menos 6 por nivel |

## 5. Fuera de alcance
- Bancos de los demás minijuegos (llegan con su spec).
- Más temas (se añaden con la orden "contenido de <tema> <nivel>").
- Audio grabado (se usa la voz del navegador, D-005).

## 6. Preguntas abiertas
- [x] ¿Qué tres temas primero? → **Programación, Web y Trabajo en equipo**: cubren lo técnico y lo profesional.
- [x] ¿Un banco por minijuego o uno común? → **Uno por tipo de ejercicio** (ver plan): cada minijuego necesita datos distintos.
