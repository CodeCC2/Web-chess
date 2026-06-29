import { createClient } from "@supabase/supabase-js";
import { parseCoords } from "./coords.js";

function cleanEnv(value) {
  return typeof value === "string" ? value.trim() : "";
}

const url = cleanEnv(process.env.SUPABASE_URL).replace(/\/$/, "");
const serviceKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const supabaseConfigured = Boolean(url && serviceKey);

export const supabase = supabaseConfigured
  ? createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

if (!supabaseConfigured) {
  console.warn(
    "Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) — player logs disabled"
  );
}

/** @param {unknown} err */
export function formatSupabaseError(err) {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("fetch failed")) {
    return [
      "เชื่อม Supabase ไม่ได้ (fetch failed)",
      "ตรวจสอบ: โปรเจกต์ Supabase ยังเปิดอยู่ไหม (ไม่ถูก Pause)",
      "SUPABASE_URL ถูกต้องไหม (ไม่มีช่องว่าง/สแลชท้าย)",
      "SUPABASE_SERVICE_ROLE_KEY copy ครบทั้งก้อนไหม",
    ].join(" — ");
  }
  return message;
}

/** @param {unknown} err */
export function logSupabaseError(context, err) {
  console.error(context, err);
  if (err instanceof Error && "cause" in err && err.cause) {
    console.error(`${context} cause:`, err.cause);
  }
}

/** @param {{ name: string, roomId?: string|null, color?: string|null, ip?: string|null, lat?: number|null, lng?: number|null, event?: string }} row */
export async function logPlayerSession(row) {
  if (!supabase) return;
  try {
    const insert = {
      name: row.name,
      room_id: row.roomId ?? null,
      color: row.color ?? null,
      ip: row.ip ?? null,
      event: row.event || "join",
    };
    const coords = parseCoords(row.lat, row.lng);
    if (coords) {
      insert.lat = coords.lat;
      insert.lng = coords.lng;
    }
    const { error } = await supabase.from("player_sessions").insert(insert);
    if (error) console.error("logPlayerSession:", error.message);
  } catch (err) {
    logSupabaseError("logPlayerSession:", err);
  }
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

export function clientIpFromRequest(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  const addr = req.socket?.remoteAddress;
  if (typeof addr === "string" && addr.startsWith("::ffff:")) {
    return addr.slice(7);
  }
  return addr || null;
}
