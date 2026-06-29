-- Run once to clear bogus 0,0 coordinates saved before the null-handling fix

UPDATE users
SET registration_lat = NULL, registration_lng = NULL
WHERE registration_lat = 0 AND registration_lng = 0;

UPDATE users
SET last_lat = NULL, last_lng = NULL
WHERE last_lat = 0 AND last_lng = 0;

UPDATE player_sessions
SET lat = NULL, lng = NULL
WHERE lat = 0 AND lng = 0;
