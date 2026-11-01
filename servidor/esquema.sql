-- Base de datos D1 del ranking (spec 027, plan §3).
-- Se pega una sola vez en la consola de la base de datos (ver servidor/LEEME.md).

CREATE TABLE IF NOT EXISTS jugadores (
  id INTEGER PRIMARY KEY,
  alias TEXT NOT NULL UNIQUE COLLATE NOCASE,
  codigo_hash TEXT NOT NULL UNIQUE,
  creado TEXT NOT NULL
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
