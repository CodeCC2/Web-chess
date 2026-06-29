import { parseCoords } from "./coords.js";

const cache = new Map();
const CACHE_MS = 86_400_000;

function isPrivateIp(ip) {
  if (!ip) return true;
  if (ip === "::1" || ip === "localhost") return true;
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  return (
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  );
}

/** Approximate lat/lng from public IP (city-level). Cached 24h per IP. */
export async function lookupIpGeo(ip) {
  if (isPrivateIp(ip)) return null;

  const hit = cache.get(ip);
  if (hit && hit.expires > Date.now()) return hit.coords;

  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(4000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.success) return null;
    const coords = parseCoords(data.latitude, data.longitude);
    if (!coords) return null;
    cache.set(ip, { coords, expires: Date.now() + CACHE_MS });
    return coords;
  } catch (err) {
    console.error("lookupIpGeo:", err.message);
    return null;
  }
}

/** Prefer GPS from client; fall back to IP geolocation. */
export async function resolveCoords({ ip, lat, lng } = {}) {
  const client = parseCoords(lat, lng);
  if (client) return client;
  if (!ip) return null;
  return lookupIpGeo(ip);
}
