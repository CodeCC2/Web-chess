-- Run once in Supabase SQL Editor (tracks GPS vs IP-filled coordinates)

ALTER TABLE users ADD COLUMN IF NOT EXISTS registration_geo_source TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_geo_source TEXT;

ALTER TABLE player_sessions ADD COLUMN IF NOT EXISTS geo_source TEXT;

-- ถ้าพิกัดที่มีอยู่มาจากการกด "เติมพิกัดจาก IP" ทั้งหมด ให้รันส่วนนี้ครั้งเดียว:
-- UPDATE users SET last_geo_source = 'ip' WHERE last_lat IS NOT NULL AND last_geo_source IS NULL;
-- UPDATE users SET registration_geo_source = 'ip' WHERE registration_lat IS NOT NULL AND registration_geo_source IS NULL;
-- UPDATE player_sessions SET geo_source = 'ip' WHERE lat IS NOT NULL AND geo_source IS NULL;
