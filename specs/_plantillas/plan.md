# Plan técnico: <Nombre>

> **Spec:** `specs/<area>/NNN-<id>/spec.md` · **Estado:** Borrador | Aprobado · **Fecha:**
> Describe CÓMO. Cada decisión debe poder trazarse a una parte de la spec.

## 1. Cumplimiento de la constitución
- [ ] A1 La lógica está en módulos puros (sin DOM, almacenamiento ni audio)
- [ ] A2 Ningún contenido escrito en el código
- [ ] A3 Todos los textos de interfaz en `src/i18n/` (es y en)
- [ ] A4 El progreso solo se toca a través de `src/progreso/`
- [ ] A5 Carpeta `juegos/<id>/`, alta en `juegos/registro.js`, `montar` / `desmontar` (si es un minijuego)
- [ ] A6 Aleatoriedad con semilla
- [ ] P5 Archivos añadidos a `FILES` en `sw.js` y `CACHE` subido
- [ ] C1-C5 Táctil y teclado, desde 320 px, contraste AA, no solo color, reducir movimiento
- [ ] PR1 Nada sale del dispositivo (o se avisa)
- [ ] Q2 `tests.html` cubre las reglas principales
- Excepciones (con enlace a `docs/decisiones.md`):

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| | |

## 3. Modelo de datos
```js
/** @typedef {Object} Estado
 *  @property {...} ...
 */
```
- **Funciones de la lógica:**
- **Datos guardados** (clave, versión del formato, migración):

## 4. Contenido
<!-- Formato del JSON que usa, de dónde lo saca y cómo elige los ejercicios. -->

## 5. Pantallas
| Pantalla | Qué muestra | Viene de / va a |
|---|---|---|
| | | |

## 6. Textos de interfaz
<!-- Claves nuevas de i18n. -->

## 7. Assets
| Asset | Formato | Origen / licencia |
|---|---|---|
| | | |

## 8. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| | | |

## 9. Pruebas
- **`tests.html`:** <!-- reglas a verificar -->
- **Manual en el móvil:** <!-- pasos -->
- **Manual en el PC:** <!-- pasos, también solo con teclado -->
