/** Fire-and-forget session log for client-only modes (bot, tutorial, puzzle). */
export function logClientSession({ mode, event, name, detail }) {
  const payload = {
    mode,
    event,
    name: String(name || "ไม่ระบุชื่อ")
      .trim()
      .slice(0, 20) || "ไม่ระบุชื่อ",
    detail: detail ? String(detail).slice(0, 80) : null,
  };

  fetch("/api/session-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: event === "leave",
  }).catch(() => {});
}
