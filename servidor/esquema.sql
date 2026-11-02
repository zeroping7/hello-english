-- Base de datos D1 del ranking (spec 027, plan §3).
-- Se pega una sola vez en la consola de la base de datos (ver servidor/LEEME.md).

CREATE TABLE IF NOT EXISTS jugadores (
  id INTEGER PRIMARY KEY,
  alias TEXT NOT NULL UNIQUE COLLATE NOCASE,
  codigo_hash TEXT NOT NULL UNIQUE,
  creado TEXT NOT NULL,
  nivel TEXT,                          -- liga (spec 030)
  racha INTEGER NOT NULL DEFAULT 0,    -- spec 031
  racha_dia TEXT
);

CREATE TABLE IF NOT EXISTS puntos (
  jugador INTEGER NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
  dia TEXT NOT NULL,
  puntos INTEGER NOT NULL DEFAULT 0,
  envios INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (jugador, dia)
);

CREATE INDEX IF NOT EXISTS puntos_dia ON puntos (dia, puntos DESC);

CREATE TABLE IF NOT EXISTS altas (
  ip_hash TEXT NOT NULL,
  hora TEXT NOT NULL,
  n INTEGER NOT NULL,
  PRIMARY KEY (ip_hash, hora)
);

-- v2 (specs 028-033). En una base de datos creada con la v1 no hace falta pegar nada más:
-- el Worker añade solo las columnas y tablas que falten la primera vez que recibe una petición.

CREATE TABLE IF NOT EXISTS reto (
  jugador INTEGER NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
  dia TEXT NOT NULL,
  juego TEXT NOT NULL,
  aciertos INTEGER NOT NULL,
  total INTEGER NOT NULL,
  segundos INTEGER NOT NULL,
  PRIMARY KEY (jugador, dia)
);

CREATE TABLE IF NOT EXISTS recordatorios (
  endpoint TEXT PRIMARY KEY,
  hora INTEGER NOT NULL,
  zona TEXT NOT NULL,
  idioma TEXT NOT NULL,
  ultimo TEXT,
  hecho TEXT,
  creado TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS config (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL
);
