import multer from "multer";
import { supabase, supabaseConfigured, formatSupabaseError } from "./supabase.js";
import { getSessionFromRequest } from "./auth.js";
import { findUserById, listUsers } from "./users.js";
import { clearSessionCookie } from "./session.js";
import { saveFaviconFromBuffer } from "./siteAssets.js";
import { lookupIpGeo } from "./ipGeo.js";
import { hasValidCoords } from "./coords.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) cb(null, true);
    else cb(new Error("invalid_file_type"));
  },
});

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
    .wrap { max-width: 1100px; margin: 0 auto; }
    h1 { font-size: 1.35rem; margin: 0 0 8px; }
    h2 { font-size: 1.05rem; margin: 0 0 12px; }
    .sub { color: var(--muted); margin-bottom: 20px; font-size: 0.9rem; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    label { display:block; margin-bottom:6px; color:var(--muted); font-size:0.85rem; }
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
    .badge.admin { background:#422006; color:#fcd34d; }
    .section { margin-bottom: 28px; }
    .favicon-form { display:flex; flex-wrap:wrap; gap:12px; align-items:flex-end; }
    .favicon-form input[type=file] { font-size:0.85rem; color:var(--muted); }
    .favicon-preview { width:32px; height:32px; border-radius:6px; border:1px solid var(--border); }
    .th-hint { display:block; font-weight:400; font-size:0.7rem; color:var(--muted); margin-top:2px; }
    .loc-cell { line-height:1.35; }
    .loc-ip { font-size:0.85rem; word-break:break-all; }
    .loc-geo { display:block; font-size:0.75rem; color:var(--muted); text-decoration:none; margin-top:2px; }
    a.loc-geo:hover { color:var(--gold); text-decoration:underline; }
    .stats-cell { white-space:nowrap; font-size:0.82rem; color:var(--muted); }
    .ctx-cell { line-height:1.35; }
    .ctx-room { font-size:0.85rem; word-break:break-all; }
    .ctx-detail { display:block; font-size:0.75rem; color:var(--muted); margin-top:2px; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>${escapeHtml(title)}</h1>
    ${loggedIn ? '<p class="sub">แอดมิน — log ผู้เล่น · สมาชิก · ไอคอนเว็บ · พิกัดจาก GPS หรือประมาณจาก IP</p>' : ""}
    ${body}
    ${loggedIn ? '<p style="margin-top:24px"><a class="btn" href="/admin/logout">ออกจากระบบ</a> · <a class="btn" href="/">กลับหน้าเกม</a></p>' : ""}
  </div>
</body>
</html>`;
}

function loginHintPage() {
  return layout(
    "เข้าสู่ระบบแอดมิน",
    `<div class="card">
      <p>ล็อกอินที่หน้าเกมด้วยบัญชี <strong>admin</strong> ก่อน แล้วกลับมาที่หน้านี้</p>
      <p class="sub">กดปุ่ม Login มุมขวาบน → เข้าสู่ระบบ → ชื่อผู้ใช้ <code>admin</code></p>
      <p><a class="btn primary" href="/">ไปหน้าเกม</a></p>
    </div>`
  );
}

function forbiddenPage() {
  return layout(
    "ไม่มีสิทธิ์",
    `<div class="card err">
      <p>บัญชีนี้ไม่ใช่แอดมิน</p>
      <p><a class="btn" href="/">กลับหน้าเกม</a></p>
    </div>`
  );
}

function supabaseWarningPage() {
  return layout(
    "แอดมิน",
    `<div class="card">
      <p>ยังไม่ได้เชื่อม Supabase</p>
      <p class="sub">ใส่ <code>SUPABASE_URL</code> และ <code>SUPABASE_SERVICE_ROLE_KEY</code> ใน Render</p>
    </div>`,
    { loggedIn: true }
  );
}

async function fetchLogs(limit = 200) {
  const { data, error } = await supabase
    .from("player_sessions")
    .select("id,name,room_id,color,ip,lat,lng,event,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}

function fetchLogsSafe(limit = 200) {
  return fetchLogs(limit).catch((err) => {
    throw new Error(formatSupabaseError(err));
  });
}

function fetchUsersSafe(limit = 200) {
  return listUsers(limit).catch((err) => {
    throw new Error(formatSupabaseError(err));
  });
}

async function backfillGeoFromIp() {
  if (!supabase) return { usersUpdated: 0, logsUpdated: 0 };

  let usersUpdated = 0;
  let logsUpdated = 0;

  const users = await listUsers(500);
  for (const u of users) {
    const patch = {};
    const lastIp = u.last_ip || u.registration_ip;
    if (!hasValidCoords(u.last_lat, u.last_lng) && lastIp) {
      const coords = await lookupIpGeo(lastIp);
      if (coords) {
        patch.last_lat = coords.lat;
        patch.last_lng = coords.lng;
      }
    }
    if (!hasValidCoords(u.registration_lat, u.registration_lng)) {
      const regIp = u.registration_ip || u.last_ip;
      if (regIp) {
        const coords = await lookupIpGeo(regIp);
        if (coords) {
          patch.registration_lat = coords.lat;
          patch.registration_lng = coords.lng;
        }
      }
    }
    if (Object.keys(patch).length === 0) continue;
    const { error } = await supabase
      .from("users")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", u.id);
    if (!error) usersUpdated += 1;
  }

  const { data: logs, error: logsErr } = await supabase
    .from("player_sessions")
    .select("id,ip,lat,lng")
    .order("created_at", { ascending: false })
    .limit(500);
  if (logsErr) throw new Error(logsErr.message);

  for (const row of logs || []) {
    if (hasValidCoords(row.lat, row.lng) || !row.ip) continue;
    const coords = await lookupIpGeo(row.ip);
    if (!coords) continue;
    const { error } = await supabase
      .from("player_sessions")
      .update({ lat: coords.lat, lng: coords.lng })
      .eq("id", row.id);
    if (!error) logsUpdated += 1;
  }

  return { usersUpdated, logsUpdated };
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
  } catch {
    return iso;
  }
}

function formatCoords(lat, lng) {
  if (lat == null || lng == null || lat === "" || lng === "") return null;
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
  if (Math.abs(la) < 1e-6 && Math.abs(ln) < 1e-6) return null;
  return `${la.toFixed(5)}, ${ln.toFixed(5)}`;
}

function locationCell(ip, lat, lng) {
  const coords = formatCoords(lat, lng);
  const geoLine = coords
    ? `<a class="loc-geo" href="https://www.google.com/maps?q=${Number(lat)},${Number(lng)}" target="_blank" rel="noopener">${escapeHtml(coords)}</a>`
    : `<span class="loc-geo">—</span>`;
  return `<div class="loc-cell"><div class="loc-ip">${escapeHtml(ip || "—")}</div>${geoLine}</div>`;
}

function statsCell(wins, losses, draws) {
  return `<span class="stats-cell" title="ชนะ / แพ้ / เสมอ">${wins ?? 0}W · ${losses ?? 0}L · ${draws ?? 0}D</span>`;
}

function sessionContextCell(roomId, color) {
  const room = escapeHtml(roomId || "—");
  const detail = color ? escapeHtml(color) : null;
  if (!detail || detail === room) {
    return `<span class="ctx-room">${room}</span>`;
  }
  return `<div class="ctx-cell"><div class="ctx-room">${room}</div><span class="ctx-detail">${detail}</span></div>`;
}

const FLASH_MESSAGES = {
  deleted: "ลบรายการแล้ว",
  ip_deleted: "ลบ log ของ IP นี้แล้ว",
  purged: "ลบ log เก่ากว่า 30 วันแล้ว",
  favicon_updated: "อัปเดตไอคอนเว็บแล้ว — รีเฟรชแท็บเบราว์เซอร์ (อาจต้อง Ctrl+F5)",
  favicon_error: "อัปโหลดไอคอนไม่สำเร็จ — ตรวจสอบว่าสร้าง bucket site-assets ใน Supabase Storage",
  geo_backfilled: "เติมพิกัดจาก IP แล้ว — รีเฟรชหน้านี้",
};

function dashboardPage({ logs, users, flash = "" }) {
  const logRows = logs
    .map(
      (r, i) => `<tr>
        <td>${i + 1}</td>
        <td>${formatTime(r.created_at)}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${sessionContextCell(r.room_id, r.color)}</td>
        <td><span class="badge">${escapeHtml(r.event)}</span></td>
        <td>${locationCell(r.ip, r.lat, r.lng)}</td>
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

  const userRows = users
    .map(
      (u, i) => `<tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(u.username)}</td>
        <td>${escapeHtml(u.display_name)}</td>
        <td><span class="badge${u.role === "admin" ? " admin" : ""}">${escapeHtml(u.role)}</span></td>
        <td>${locationCell(u.last_ip, u.last_lat, u.last_lng)}</td>
        <td>${locationCell(u.registration_ip, u.registration_lat, u.registration_lng)}</td>
        <td>${statsCell(u.wins, u.losses, u.draws)}</td>
        <td>${formatTime(u.created_at)}</td>
      </tr>`
    )
    .join("");

  return layout(
    "แดชบอร์ดแอดมิน",
    `${flash ? `<p class="ok">${escapeHtml(flash)}</p>` : ""}

    <div class="section card">
      <h2>ไอคอนเว็บ (Favicon)</h2>
      <p class="sub" style="margin-top:0">อัปโหลดรูปสี่เหลี่ยม — จะเปลี่ยนไอคอนแถบเบราว์เซอร์ทั้งเว็บ</p>
      <form class="favicon-form" method="post" action="/admin/favicon" enctype="multipart/form-data">
        <div>
          <label for="favicon">เลือกรูป PNG/JPG</label>
          <input id="favicon" type="file" name="favicon" accept="image/*" required />
        </div>
        <img class="favicon-preview" src="/favicon.png?v=${Date.now()}" alt="" width="32" height="32" />
        <button type="submit" class="primary">อัปโหลดไอคอน</button>
      </form>
    </div>

    <div class="section card" style="overflow-x:auto">
      <h2>สมาชิกในระบบ (${users.length})</h2>
      <table>
        <thead>
          <tr><th>#</th><th>ชื่อผู้ใช้</th><th>ชื่อแสดง</th><th>บทบาท</th><th>ล่าสุด<span class="th-hint">IP · พิกัด</span></th><th>ตอนสมัคร<span class="th-hint">IP · พิกัด</span></th><th>สถิติ<span class="th-hint">ชนะ·แพ้·เสมอ</span></th><th>สมัครเมื่อ</th></tr>
        </thead>
        <tbody>${userRows || '<tr><td colspan="8">ยังไม่มีสมาชิก</td></tr>'}</tbody>
      </table>
    </div>

    <div class="section">
      <div class="toolbar">
        <h2 style="margin:0;flex:1">Log ผู้เล่น</h2>
        <form method="post" action="/admin/purge-old" onsubmit="return confirm('ลบ log เก่ากว่า 30 วัน?')">
          <button type="submit" class="danger">ลบ log เก่ากว่า 30 วัน</button>
        </form>
        <form method="post" action="/admin/backfill-geo" onsubmit="return confirm('เติมพิกัดจาก IP ให้ข้อมูลที่ยังว่างหรือเป็น 0?')">
          <button type="submit" class="primary">เติมพิกัดจาก IP</button>
        </form>
        <a class="btn" href="/admin">รีเฟรช</a>
      </div>
      <div class="card" style="overflow-x:auto">
        <table>
          <thead>
            <tr><th>#</th><th>เวลา</th><th>ชื่อ</th><th>โหมด<span class="th-hint">ห้อง · รายละเอียด</span></th><th>เหตุการณ์</th><th>ที่อยู่<span class="th-hint">IP · พิกัด</span></th><th></th></tr>
          </thead>
          <tbody>${logRows || '<tr><td colspan="7">ยังไม่มี log</td></tr>'}</tbody>
        </table>
      </div>
    </div>`,
    { loggedIn: true }
  );
}

async function requireAdmin(req, res) {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).send(loginHintPage());
    return null;
  }
  try {
    const row = await findUserById(session.userId);
    if (!row || row.role !== "admin") {
      res.status(403).send(forbiddenPage());
      return null;
    }
    return row;
  } catch (err) {
    res.status(500).send(layout("ข้อผิดพลาด", `<div class="card err">${escapeHtml(err.message)}</div>`));
    return null;
  }
}

export function registerAdminRoutes(app) {
  app.get("/admin", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    if (!supabaseConfigured) {
      res.status(503).send(supabaseWarningPage());
      return;
    }
    try {
      const [logs, users] = await Promise.all([
        fetchLogsSafe(),
        fetchUsersSafe(),
      ]);
      const flash = FLASH_MESSAGES[req.query.flash] || "";
      res.send(dashboardPage({ logs, users, flash }));
    } catch (err) {
      res.status(500).send(layout("ข้อผิดพลาด", `<div class="card err">${escapeHtml(err.message)}</div>`, { loggedIn: true }));
    }
  });

  app.post("/admin/favicon", upload.single("favicon"), async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    if (!req.file) {
      res.redirect(302, "/admin?flash=favicon_error");
      return;
    }
    try {
      await saveFaviconFromBuffer(req.file.buffer);
      res.redirect(302, "/admin?flash=favicon_updated");
    } catch (err) {
      console.error("favicon upload:", err);
      res.status(500).send(
        layout("ข้อผิดพลาด", `<div class="card err">${escapeHtml(err.message)}</div>`, { loggedIn: true })
      );
    }
  });

  app.get("/admin/logout", (req, res) => {
    clearSessionCookie(res);
    res.redirect("/");
  });

  app.post("/admin/delete/:id", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin || !supabase) {
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
    const admin = await requireAdmin(req, res);
    if (!admin || !supabase) {
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
    const admin = await requireAdmin(req, res);
    if (!admin || !supabase) {
      res.redirect(302, "/admin");
      return;
    }
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("player_sessions").delete().lt("created_at", cutoff);
    res.redirect(302, "/admin?flash=purged");
  });

  app.post("/admin/backfill-geo", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin || !supabase) {
      res.redirect(302, "/admin");
      return;
    }
    try {
      await backfillGeoFromIp();
      res.redirect(302, "/admin?flash=geo_backfilled");
    } catch (err) {
      console.error("backfill-geo:", err);
      res.status(500).send(
        layout("ข้อผิดพลาด", `<div class="card err">${escapeHtml(err.message)}</div>`, { loggedIn: true })
      );
    }
  });
}
