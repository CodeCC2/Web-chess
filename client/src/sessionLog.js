import { getGeoPosition, getCachedGeoPosition } from "./geo.js";

/** Fire-and-forget session log for client-only modes (bot, tutorial, puzzle). */
export function logClientSession({ mode, event, name, detail }) {
  const payload = (geo) => ({
    mode,
    event,
    name:
      String(name || "ไม่ระบุชื่อ")
        .trim()
        .slice(0, 20) || "ไม่ระบุชื่อ",
    detail: detail ? String(detail).slice(0, 80) : null,
    ...(geo || {}),
  });

  const send = (geo) => {
    fetch("/api/session-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload(geo)),
      keepalive: event === "leave",
    }).catch(() => {});
  };

  if (event === "leave") {
    send(getCachedGeoPosition());
    return;
  }
  void getGeoPosition().then(send);
}
