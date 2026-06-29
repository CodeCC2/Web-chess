-- Run once in Supabase SQL Editor (adds lat/lng to player_sessions)

ALTER TABLE player_sessions ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE player_sessions ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;
