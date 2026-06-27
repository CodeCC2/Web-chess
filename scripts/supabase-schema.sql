-- Run once in Supabase → SQL Editor → New query → Run

CREATE TABLE IF NOT EXISTS player_sessions (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  room_id    TEXT,
  color      TEXT,
  ip         TEXT,
  event      TEXT NOT NULL DEFAULT 'join',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_ip ON player_sessions(ip);
CREATE INDEX IF NOT EXISTS idx_sessions_created ON player_sessions(created_at DESC);

CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY,
  display_name TEXT,
  avatar_url   TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
