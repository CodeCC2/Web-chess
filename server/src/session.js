import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "chess_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sessionSecret() {
  return (
    process.env.AUTH_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    ""
  );
}

export function sessionConfigured() {
  return Boolean(sessionSecret());
}

function sign(body) {
  return createHmac("sha256", sessionSecret()).update(body).digest("base64url");
}

export function createSessionToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function parseSessionToken(token) {
  if (!token || !sessionSecret()) return null;
  const [body, sig] = String(token).split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!data?.userId || !data?.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (!rawKey) continue;
    out[rawKey] = decodeURIComponent(rest.join("="));
  }
  return out;
}

export function parseSessionFromCookieHeader(header) {
  return parseSessionToken(parseCookies(header)[SESSION_COOKIE]);
}

export function setSessionCookie(res, token) {
  const secure =
    process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secure}`
  );
}

export function clearSessionCookie(res) {
  const secure =
    process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
  );
}

export function getSessionFromRequest(req) {
  return parseSessionFromCookieHeader(req.headers.cookie);
}
