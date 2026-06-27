-- Run once in Supabase SQL Editor (adds IP columns to existing users table)

ALTER TABLE users ADD COLUMN IF NOT EXISTS registration_ip TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_ip TEXT;
