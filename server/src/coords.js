/** @returns {{ lat: number, lng: number } | null} */
export function parseCoords(lat, lng) {
  if (lat == null || lng == null || lat === "" || lng === "") return null;
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
  if (la < -90 || la > 90 || ln < -180 || ln > 180) return null;
  if (Math.abs(la) < 1e-6 && Math.abs(ln) < 1e-6) return null;
  return { lat: la, lng: ln };
}

export function hasValidCoords(lat, lng) {
  return parseCoords(lat, lng) !== null;
}
