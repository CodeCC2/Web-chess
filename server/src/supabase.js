import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(url && serviceKey);

export const supabase = supabaseConfigured
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : null;

if (!supabaseConfigured) {
  console.warn(
    "Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) — player logs disabled"
  );
}

/** @param {{ name: string, roomId?: string|null, color?: string|null, ip?: string|null, event?: string }} row */
export async function logPlayerSession(row) {
  if (!supabase) return;
  const { error } = await supabase.from("player_sessions").insert({
    name: row.name,
    room_id: row.roomId ?? null,
    color: row.color ?? null,
    ip: row.ip ?? null,
    event: row.event || "join",
  });
  if (error) console.error("logPlayerSession:", error.message);
}

export function clientIpFromSocket(socket) {
  const forwarded = socket.handshake.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  const addr = socket.handshake.address;
  if (typeof addr === "string" && addr.startsWith("::ffff:")) {
    return addr.slice(7);
  }
  return addr || null;
}
