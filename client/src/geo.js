/** Optional browser geolocation — returns null if denied or unavailable */
let cachedGeo = null;

export function getCachedGeoPosition() {
  return cachedGeo;
}

export function getGeoPosition() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(cachedGeo);
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          !(Math.abs(lat) < 1e-6 && Math.abs(lng) < 1e-6)
        ) {
          cachedGeo = { lat, lng };
        }
        resolve(cachedGeo);
      },
      () => resolve(cachedGeo),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 }
    );
  });
}
