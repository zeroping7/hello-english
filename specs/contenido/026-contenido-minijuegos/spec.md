# Spec: Contenido de los 17 minijuegos

> **ID:** 026-contenido-minijuegos · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
Un banco por minijuego (D-011) con el mismo formato común de la spec 001 (`id`, `nivel`, `tema`, `explicacion`) y los campos propios de cada spec 005-021. 421 ejercicios nuevos, de A1 a C1, en los tres temas (Programación, Web y Trabajo en equipo), en inglés británico.

## 2. Alcance
- **Incluye:** los 17 bancos, su validación en `src/contenido/esquema.js` y sus pruebas en `contenido/tests.html` (validación, mínimo por nivel, tres temas, ids únicos).
- **No incluye:** temas nuevos (hardware, redes, cloud, seguridad...): se añadirán con la orden «contenido de <tema> <nivel>».

## 3. Criterios
- [x] Cada banco pasa la validación y tiene el mínimo por nivel de su spec.
- [x] La explicación es obligatoria donde el minijuego la enseña al fallar; en el resto es opcional (lo dice `EXPLICACION_OPCIONAL`).

## 4. Preguntas abiertas
- Ninguna.
