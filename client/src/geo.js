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
        cachedGeo = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        resolve(cachedGeo);
      },
      () => resolve(cachedGeo),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 }
    );
  });
}
