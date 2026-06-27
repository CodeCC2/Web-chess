import { createHmac } from "node:crypto";
import { supabase, supabaseConfigured } from "./supabase.js";

const COOKIE_NAME = "chess_admin";
const SESSION_VERSION = "admin-v1";

let sessionToken = null;

function initSessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || !password) {
    console.warn(
      "Admin panel disabled — set ADMIN_PASSWORD and ADMIN_SESSION_SECRET"
    );
    return;
  }
  sessionToken = createHmac("sha256", secret)
    .update(SESSION_VERSION)
    .digest("hex");
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (!rawKey) continue;
    out[rawKey] = decodeURIComponent(rest.join("="));
  }
  return out;
}

function isAdmin(req) {
  return Boolean(
    sessionToken && parseCookies(req.headers.cookie)[COOKIE_NAME] === sessionToken
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(title, body, { loggedIn = false } = {}) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} — หมากรุกออนไลน์</title>
  <style>
    :root { color-scheme: dark; --bg:#0a0c10; --card:#141820; --border:#2a3140; --text:#e8eaed; --muted:#9aa3b2; --gold:#e0bc4a; --danger:#ef4444; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: system-ui, sans-serif; background:var(--bg); color:var(--text); padding:24px; }
    .wrap { max-width: 960px; margin: 0 auto; }
    h1 { font-size: 1.35rem; margin: 0 0 8px; }
    .sub { color: var(--muted); margin-bottom: 20px; font-size: 0.9rem; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    label { display:block; margin-bottom:6px; color:var(--muted); font-size:0.85rem; }
    input[type=password], input[type=text] { width:100%; max-width:320px; padding:10px 12px; border-radius:8px; border:1px solid var(--border); background:#0f1319; color:var(--text); }
    button, .btn { display:inline-block; padding:8px 14px; border-radius:8px; border:1px solid var(--border); background:#1a2030; color:var(--text); cursor:pointer; text-decoration:none; font-size:0.9rem; }
    button.primary, .btn.primary { background: linear-gradient(135deg,#c9a227,#e0bc4a); color:#0a0c10; border-color:#c9a227; font-weight:600; }
    button.danger { border-color:#7f1d1d; color:#fecaca; background:#450a0a; }
    .err { color:#fca5a5; margin-top:10px; }
    .ok { color:#86efac; margin-top:10px; }
    table { width:100%; border-collapse: collapse; font-size:0.85rem; }
    th, td { text-align:left; padding:8px 10px; border-bottom:1px solid var(--border); vertical-align: top; }
    th { color:var(--muted); font-weight:600; }
    .actions form { display:inline; margin-right:6px; }
    .toolbar { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:16px; }
    .badge { font-size:0.75rem; padding:2px 8px; border-radius:999px; background:#1f2937; color:var(--muted); }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>${escapeHtml(title)}</h1>
    ${loggedIn ? '<p class="sub">แอดมิน — จัดการ log ผู้เล่น (PDPA: ลบ IP ได้เมื่อไม่ต้องการเก็บ)</p>' : ""}
    ${body}
    ${loggedIn ? '<p style="margin-top:24px"><a class="btn" href="/admin/logout">ออกจากระบบ</a></p>' : ""}
  </div>
</body>
</html>`;
}

function loginPage(error = "") {
  return layout(
    "เข้าสู่ระบบแอดมิน",
    `<div class="card">
      <form method="post" action="/admin/login">
        <label for="password">รหัสผ่านแอดมิน</label>
        <input id="password" name="password" type="password" required autocomplete="current-password" />
        <p style="margin-top:14px"><button class="primary" type="submit">เข้าสู่ระบบ</button></p>
        ${error ? `<p class="err">${escapeHtml(error)}</p>` : ""}
      </form>
    </div>`
  );
}

function configWarningPage() {
  return layout(
    "แอดมิน",
    `<div class="card">
      <p>ยังไม่ได้ตั้งค่าแอดมินบนเซิร์ฟเวอร์</p>
      <p class="sub">ใส่ <code>ADMIN_PASSWORD</code> และ <code>ADMIN_SESSION_SECRET</code> ใน Render Environment แล้ว deploy ใหม่</p>
    </div>`
  );
}

function supabaseWarningPage() {
  return layout(
    "แอดมิน",
    `<div class="card">
      <p>ยังไม่ได้เชื่อม Supabase</p>
      <p class="sub">ใส่ <code>SUPABASE_URL</code> และ <code>SUPABASE_SERVICE_ROLE_KEY</code> ใน Render แล้วรัน SQL จาก <code>scripts/supabase-schema.sql</code></p>
    </div>`,
    { loggedIn: true }
  );
}

async function fetchLogs(limit = 200) {
  const { data, error } = await supabase
    .from("player_sessions")
    .select("id,name,room_id,color,ip,event,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
  } catch {
    return iso;
  }
}

const FLASH_MESSAGES = {
  deleted: "ลบรายการแล้ว",
  ip_deleted: "ลบ log ของ IP นี้แล้ว",
  purged: "ลบ log เก่ากว่า 30 วันแล้ว",
};

function logsPage(rows, flash = "") {
  const tableRows = rows
    .map(
      (r) => `<tr>
        <td>${r.id}</td>
        <td>${formatTime(r.created_at)}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${escapeHtml(r.room_id || "—")}</td>
        <td>${escapeHtml(r.color || "—")}</td>
        <td><span class="badge">${escapeHtml(r.event)}</span></td>
        <td>${escapeHtml(r.ip || "—")}</td>
        <td class="actions">
          <form method="post" action="/admin/delete/${r.id}" onsubmit="return confirm('ลบรายการนี้?')">
            <button type="submit" class="danger">ลบ</button>
          </form>
          ${
            r.ip
              ? `<form method="post" action="/admin/delete-ip" onsubmit="return confirm('ลบทุก log ของ IP นี้?')">
            <input type="hidden" name="ip" value="${escapeHtml(r.ip)}" />
            <button type="submit" class="danger">ลบ IP</button>
          </form>`
              : ""
          }
        </td>
      </tr>`
    )
    .join("");

  return layout(
    "Log ผู้เล่น",
    `${flash ? `<p class="ok">${escapeHtml(flash)}</p>` : ""}
    <div class="toolbar">
      <form method="post" action="/admin/purge-old" onsubmit="return confirm('ลบ log เก่ากว่า 30 วัน?')">
        <button type="submit" class="danger">ลบ log เก่ากว่า 30 วัน</button>
      </form>
      <a class="btn" href="/admin">รีเฟรช</a>
    </div>
    <div class="card" style="overflow-x:auto">
      <table>
        <thead>
          <tr><th>#</th><th>เวลา</th><th>ชื่อ</th><th>ห้อง</th><th>สี</th><th>เหตุการณ์</th><th>IP</th><th></th></tr>
        </thead>
        <tbody>${tableRows || '<tr><td colspan="8">ยังไม่มี log</td></tr>'}</tbody>
      </table>
    </div>`,
    { loggedIn: true }
  );
}

export function registerAdminRoutes(app) {
  initSessionToken();

  app.get("/admin", async (req, res) => {
    if (!sessionToken) {
      res.status(503).send(configWarningPage());
      return;
    }
    if (!isAdmin(req)) {
      res.send(loginPage());
      return;
    }
    if (!supabaseConfigured) {
      res.status(503).send(supabaseWarningPage());
      return;
    }
    try {
      const rows = await fetchLogs();
      const flash = FLASH_MESSAGES[req.query.flash] || "";
      res.send(logsPage(rows, flash));
    } catch (err) {
      res.status(500).send(layout("ข้อผิดพลาด", `<div class="card err">${escapeHtml(err.message)}</div>`, { loggedIn: true }));
    }
  });

  app.post("/admin/login", (req, res) => {
    const wantsJson = req.headers.accept?.includes("application/json");
    if (!sessionToken) {
      if (wantsJson) {
        res.status(503).json({ ok: false, error: "admin_not_configured" });
        return;
      }
      res.status(503).send(configWarningPage());
      return;
    }
    const password = req.body?.password || "";
    if (password !== process.env.ADMIN_PASSWORD) {
      if (wantsJson) {
        res.status(401).json({ ok: false, error: "invalid_password" });
        return;
      }
      res.status(401).send(loginPage("รหัสผ่านไม่ถูกต้อง"));
      return;
    }
    const secure =
      process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${sessionToken}; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=86400${secure}`
    );
    if (wantsJson) {
      res.json({ ok: true });
      return;
    }
    res.redirect(302, "/admin");
  });

  app.get("/admin/logout", (req, res) => {
    const secure =
      process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
    );
    res.redirect(302, "/admin");
  });

  app.post("/admin/delete/:id", async (req, res) => {
    if (!isAdmin(req) || !supabase) {
      res.redirect(302, "/admin");
      return;
    }
    const id = Number(req.params.id);
    if (Number.isFinite(id)) {
      await supabase.from("player_sessions").delete().eq("id", id);
    }
    res.redirect(302, "/admin?flash=deleted");
  });

  app.post("/admin/delete-ip", async (req, res) => {
    if (!isAdmin(req) || !supabase) {
      res.redirect(302, "/admin");
      return;
    }
    const ip = String(req.body?.ip || "").trim();
    if (ip) {
      await supabase.from("player_sessions").delete().eq("ip", ip);
    }
    res.redirect(302, "/admin?flash=ip_deleted");
  });

  app.post("/admin/purge-old", async (req, res) => {
    if (!isAdmin(req) || !supabase) {
      res.redirect(302, "/admin");
      return;
    }
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("player_sessions").delete().lt("created_at", cutoff);
    res.redirect(302, "/admin?flash=purged");
  });
}
