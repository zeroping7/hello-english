# Plan técnico: Formato del contenido y primer banco

> **Spec:** `specs/contenido/001-formato-y-primer-banco/spec.md` · **Estado:** Aprobado (por Claude, con permiso del usuario) · **Fecha:** 2026-10-28

## 1. Cumplimiento de la constitución
- [x] A2 Contenido solo en `contenido/*.json`.
- [x] A6 La elección de ejercicios usa un generador con semilla (`src/contenido/azar.js`).
- [x] CO1-CO4 Ficha común, inglés revisado, original.
- [x] Q2 `contenido/tests.html` valida todos los bancos y la lógica de elección.
- [x] P5 Los JSON van en `FILES` de `sw.js`.

## 2. Archivos
| Archivo | Responsabilidad |
|---|---|
| `contenido/temas.json` | Lista de temas: `[{ "id": "programacion" }, …]`. El nombre va en i18n (`tema.<id>`) |
| `contenido/prueba-nivel.json` | Preguntas de la prueba de nivel |
| `contenido/falsos-amigos.json` | Tarjetas de Falsos amigos |
| `contenido/merge-conflict.json` | Pares de frases de Merge Conflict |
| `contenido/tests.html` | Validación de todos los bancos y pruebas de `elegir.js` |
| `src/contenido/cargar.js` | `cargarBanco(nombre)` con `fetch` y `cache: 'no-cache'`, y caché en memoria |
| `src/contenido/azar.js` | `crearAzar(semilla)` (mulberry32) y `barajar(lista, azar)` |
| `src/contenido/elegir.js` | `elegirEjercicios(items, { nivel, n, azar, tema })` |
| `src/contenido/esquema.js` | `validarBanco(nombre, datos)` → lista de errores |

## 3. Formato
Cada banco es `{ "banco": "<nombre>", "v": 1, "items": [ … ] }`.

**Ficha común** (constitución CO2), en todos los items:
```js
{
  id: 'fa-001',            // prefijo del banco + número; nunca se reutiliza
  nivel: 'A1',             // A1 | A2 | B1 | B2 | C1
  tema: 'programacion',    // id de temas.json
  explicacion: { es: '…', en: '…' },   // breve, para cuando se falla
}
```

**prueba-nivel** (`pn-NNN`): `enunciado` (frase en inglés con `___` en el hueco), `opciones` (4 textos), `correcta` (índice 0-3), `traduccion` (español de la frase completa).

**falsos-amigos** (`fa-NNN`): `en` (palabra inglesa), `es` (la traducción que parece), `verdadero` (si `en` significa de verdad `es`), `significa` (`{ es, en }`: qué significa realmente), `ejemplo` (frase en inglés con la palabra).

**merge-conflict** (`mc-NNN`): `correcta` y `incorrecta` (la misma frase con un error de gramática), `traduccion` (español de la correcta).

## 4. Elección de ejercicios (`elegir.js`)
1. Filtra por tema si se pide.
2. Reparte `n` así: 60 % del nivel del usuario, 30 % del nivel anterior y 10 % del siguiente (A1 no tiene anterior: su parte va a A1; C1 no tiene siguiente: va a C1).
3. Si un nivel no tiene suficientes, completa con los niveles más cercanos.
4. Baraja con el generador con semilla.

## 5. Textos de interfaz
`tema.programacion`, `tema.web`, `tema.equipo` y `tema.todos`.

## 6. Riesgos
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Un ejercicio con inglés dudoso | Media | Solo usos frecuentes en el trabajo; ante la duda no se incluye (CO3). El usuario puede revisar los JSON |
| Un ejercicio mal formado rompe un minijuego | Baja | `contenido/tests.html` valida todo, y los minijuegos ignoran items que no pasan `validarBanco` |

## 7. Pruebas
- **`contenido/tests.html`:** cada banco pasa `validarBanco`; ids únicos en todos los bancos; mínimos por nivel de la spec §4; `elegirEjercicios` respeta el reparto, no repite y da lo mismo con la misma semilla.
