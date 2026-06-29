/** Optional browser geolocation — returns null if denied or unavailable */
let cachedGeo = null;

export function getCachedGeoPosition() {
  return cachedGeo;
}

function storeCoords(lat, lng) {
  if (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(Math.abs(lat) < 1e-6 && Math.abs(lng) < 1e-6)
  ) {
    cachedGeo = { lat, lng };
    return cachedGeo;
  }
  return null;
}

function readPosition(options) {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(storeCoords(pos.coords.latitude, pos.coords.longitude)),
      () => resolve(null),
      options
    );
  });
}

/** Call once after user clicks — warms permission + cache before join/login */
export function primeGeoPosition() {
  return getGeoPosition();
}

export async function getGeoPosition() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return cachedGeo;
  }

  const accurate = await readPosition({
    enableHighAccuracy: true,
    timeout: 10_000,
    maximumAge: 60_000,
  });
  if (accurate) return accurate;

  const coarse = await readPosition({
    enableHighAccuracy: false,
    timeout: 8_000,
    maximumAge: 300_000,
  });
  if (coarse) return coarse;

  return cachedGeo;
}
