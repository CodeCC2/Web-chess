import multer from "multer";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionFromRequest,
  sessionConfigured,
} from "./session.js";
import { supabase, supabaseConfigured, clientIpFromRequest } from "./supabase.js";
import {
  createUser,
  findUserByUsername,
  findUserById,
  mapUser,
  updateAvatarUrl,
  updateDisplayName,
  validateUsername,
  verifyUserPassword,
  ensureAdminUser,
  updateLastLocation,
} from "./users.js";
import { resolveCoords } from "./ipGeo.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) cb(null, true);
    else cb(new Error("invalid_file_type"));
  },
});

function publicUser(row) {
  return mapUser(row);
}

async function requireUser(req, res) {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ ok: false, error: "not_authenticated" });
    return null;
  }
  try {
    const row = await findUserById(session.userId);
    if (!row) {
      res.status(401).json({ ok: false, error: "not_authenticated" });
      return null;
    }
    return row;
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
    return null;
  }
}

export async function initAuth() {
  await ensureAdminUser();
}

export function registerAuthRoutes(app) {
  app.post("/api/auth/register", async (req, res) => {
    if (!supabaseConfigured || !sessionConfigured()) {
      res.status(503).json({ ok: false, error: "not_configured" });
      return;
    }

    const username = String(req.body?.username || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");
    const displayName = String(req.body?.displayName || username).trim();

    if (!validateUsername(username)) {
      res.status(400).json({
        ok: false,
        error: "invalid_username",
        message: "ชื่อผู้ใช้ 3–20 ตัว ใช้ a-z 0-9 _ เท่านั้น",
      });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({
        ok: false,
        error: "weak_password",
        message: "รหัสผ่านอย่างน้อย 6 ตัว",
      });
      return;
    }
    if (username === "admin") {
      res.status(400).json({
        ok: false,
        error: "reserved_username",
        message: "ชื่อผู้ใช้นี้สงวนไว้",
      });
      return;
    }

    try {
      const existing = await findUserByUsername(username);
      if (existing) {
        res.status(409).json({
          ok: false,
          error: "username_taken",
          message: "ชื่อผู้ใช้นี้มีแล้ว",
        });
        return;
      }
      const ip = clientIpFromRequest(req);
      const coords = await resolveCoords({
        ip,
        lat: req.body?.lat,
        lng: req.body?.lng,
      });
      const user = await createUser({
        username,
        password,
        displayName: displayName.slice(0, 30) || username,
        registrationIp: ip,
        registrationLat: coords?.lat ?? null,
        registrationLng: coords?.lng ?? null,
        registrationGeoSource: coords?.source ?? null,
      });
      const token = createSessionToken(user);
      setSessionCookie(res, token);
      res.json({ ok: true, user });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    if (!supabaseConfigured || !sessionConfigured()) {
      res.status(503).json({ ok: false, error: "not_configured" });
      return;
    }

    const username = String(req.body?.username || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (!username || !password) {
      res.status(400).json({ ok: false, error: "missing_credentials" });
      return;
    }

    try {
      const row = await findUserByUsername(username);
      if (!row || !(await verifyUserPassword(row, password))) {
        res.status(401).json({
          ok: false,
          error: "invalid_credentials",
          message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        });
        return;
      }
      const user = publicUser(row);
      await updateLastLocation(row.id, {
        ip: clientIpFromRequest(req),
        lat: req.body?.lat,
        lng: req.body?.lng,
      });
      const token = createSessionToken(user);
      setSessionCookie(res, token);
      res.json({ ok: true, user });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  app.get("/api/auth/me", async (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      res.json({ ok: true, user: null });
      return;
    }
    try {
      const row = await findUserById(session.userId);
      if (!row) {
        clearSessionCookie(res);
        res.json({ ok: true, user: null });
        return;
      }
      res.json({ ok: true, user: publicUser(row) });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.patch("/api/auth/profile", async (req, res) => {
    const row = await requireUser(req, res);
    if (!row) return;

    const displayName = String(req.body?.displayName || "").trim();
    if (!displayName || displayName.length > 30) {
      res.status(400).json({
        ok: false,
        error: "invalid_display_name",
        message: "ชื่อที่แสดง 1–30 ตัวอักษร",
      });
      return;
    }

    try {
      const user = await updateDisplayName(row.id, displayName);
      res.json({ ok: true, user });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.post("/api/auth/avatar", upload.single("avatar"), async (req, res) => {
    const row = await requireUser(req, res);
    if (!row) return;

    if (!req.file) {
      res.status(400).json({ ok: false, error: "no_file" });
      return;
    }

    const ext = req.file.mimetype === "image/png" ? "png" : "jpg";
    const path = `${row.id}/avatar.${ext}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, req.file.buffer, {
          upsert: true,
          contentType: req.file.mimetype,
        });
      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const avatarUrl = `${urlData.publicUrl}?v=${Date.now()}`;
      const user = await updateAvatarUrl(row.id, avatarUrl);
      res.json({ ok: true, user });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
        message:
          err.message.includes("Bucket not found")
            ? "ยังไม่ได้สร้าง bucket avatars ใน Supabase Storage"
            : undefined,
      });
    }
  });
}

export { getSessionFromRequest };
