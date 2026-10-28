# Spec: Subida de nivel con el uso

> **ID:** 025-nivel-con-el-uso · **Estado:** Implementada (v1.0.0) · **Fecha:** 2026-10-28
> Aprobada por Claude con permiso del usuario («Apruébalas tú»).

## 1. Resumen
El nivel no depende solo de la prueba inicial: si el usuario acierta 16 de los últimos 20 ejercicios de su nivel, sube al siguiente y se le avisa.

## 2. Problema / motivación
Quien mejora tiene que encontrarse ejercicios más difíciles sin repetir la prueba de nivel.

## 3. Alcance
- **Incluye:** contar los últimos 20 ejercicios del nivel del usuario; subir uno con 16 o más bien; avisar «¡Subes de nivel! Ahora eres B1».
- **No incluye:** bajar de nivel solo (se puede repetir la prueba en Ajustes).

## 4. Historias de usuario
- [x] Si acierto 16 de 20 de mi nivel, subo uno; los ejercicios de otros niveles no cuentan.
- [x] En C1 no se sube más.
- [x] Al repetir la prueba de nivel, la cuenta empieza de cero.

## 5. Preguntas abiertas
- Ninguna.
