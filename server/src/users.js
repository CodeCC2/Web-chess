import bcrypt from "bcryptjs";
import { supabase, supabaseConfigured } from "./supabase.js";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const BCRYPT_ROUNDS = 10;

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    wins: row.wins ?? 0,
    losses: row.losses ?? 0,
    draws: row.draws ?? 0,
    createdAt: row.created_at,
  };
}

export function validateUsername(username) {
  return USERNAME_RE.test(username);
}

export async function findUserByUsername(username) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function findUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createUser({ username, password, displayName, role = "user" }) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const { data, error } = await supabase
    .from("users")
    .insert({
      username,
      password_hash: passwordHash,
      display_name: displayName || username,
      role,
    })
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") throw new Error("username_taken");
    throw new Error(error.message);
  }
  return mapUser(data);
}

export async function verifyUserPassword(row, password) {
  return bcrypt.compare(password, row.password_hash);
}

export async function updateDisplayName(userId, displayName) {
  const { data, error } = await supabase
    .from("users")
    .update({
      display_name: displayName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapUser(data);
}

export async function updateAvatarUrl(userId, avatarUrl) {
  const { data, error } = await supabase
    .from("users")
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapUser(data);
}

export async function listUsers(limit = 200) {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id,username,display_name,avatar_url,role,wins,losses,draws,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function recordOnlineResult(room, status, winner) {
  if (!room?.userIds) return;
  const whiteId = room.userIds.white;
  const blackId = room.userIds.black;
  const drawStatuses = new Set([
    "draw",
    "stalemate",
    "draw_agreed",
    "insufficient_material",
    "threefold_repetition",
  ]);

  if (drawStatuses.has(status)) {
    if (whiteId) await bumpStat(whiteId, "draws");
    if (blackId) await bumpStat(blackId, "draws");
    return;
  }

  if (!winner) return;
  const loser = winner === "white" ? "black" : "white";
  const winnerId = room.userIds[winner];
  const loserId = room.userIds[loser];
  if (winnerId) await bumpStat(winnerId, "wins");
  if (loserId) await bumpStat(loserId, "losses");
}

async function bumpStat(userId, field) {
  const user = await findUserById(userId);
  if (!user) return;
  const next = (user[field] ?? 0) + 1;
  const { error } = await supabase
    .from("users")
    .update({ [field]: next, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) console.error("bumpStat:", error.message);
}

export async function ensureAdminUser() {
  if (!supabaseConfigured) return;
  const existing = await findUserByUsername("admin");
  if (existing) return;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!password) {
    console.warn(
      "No admin user — set ADMIN_BOOTSTRAP_PASSWORD once to create username admin"
    );
    return;
  }
  await createUser({
    username: "admin",
    password,
    displayName: "แอดมิน",
    role: "admin",
  });
  console.log("Created admin user (username: admin)");
}

export { mapUser };
