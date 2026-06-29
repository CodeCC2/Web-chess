import { logPlayerSession, clientIpFromRequest, supabaseConfigured } from "./supabase.js";
import { parseCoords } from "./coords.js";

const ALLOWED_MODES = new Set(["bot", "tutorial", "puzzle"]);
const ALLOWED_EVENTS = new Set(["join", "leave"]);
const logRateLimit = new Map();

function allowLog(ip, mode, event) {
  const key = `${ip || "unknown"}:${mode}:${event}`;
  const now = Date.now();
  const last = logRateLimit.get(key) || 0;
  if (now - last < 2000) return false;
  logRateLimit.set(key, now);
  if (logRateLimit.size > 10_000) logRateLimit.clear();
  return true;
}

export function registerSessionLogRoute(app) {
  app.post("/api/session-log", async (req, res) => {
    if (!supabaseConfigured) {
      res.status(503).json({ ok: false, error: "supabase_not_configured" });
      return;
    }

    const mode = String(req.body?.mode || "").trim();
    const event = String(req.body?.event || "").trim();
    const name =
      String(req.body?.name || "ไม่ระบุชื่อ")
        .trim()
        .slice(0, 20) || "ไม่ระบุชื่อ";
    const detail = req.body?.detail
      ? String(req.body.detail).trim().slice(0, 80)
      : null;

    if (!ALLOWED_MODES.has(mode) || !ALLOWED_EVENTS.has(event)) {
      res.status(400).json({ ok: false, error: "invalid_payload" });
      return;
    }

    const ip = clientIpFromRequest(req);
    if (!allowLog(ip, mode, event)) {
      res.status(429).json({ ok: false, error: "rate_limited" });
      return;
    }

    const coords = await resolveCoords({
      ip,
      lat: req.body?.lat,
      lng: req.body?.lng,
    });

    void logPlayerSession({
      name,
      roomId: mode,
      color: detail,
      ip,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      event,
    });

    res.json({ ok: true });
  });
}
