import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { supabase, supabaseConfigured } from "./supabase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SITE_DIR = path.resolve(__dirname, "../data/site");
const BUCKET = "site-assets";

const ICON_FILES = [
  { file: "favicon.png", size: 32 },
  { file: "favicon-32.png", size: 32 },
  { file: "favicon-48.png", size: 48 },
  { file: "apple-touch-icon.png", size: 180 },
];

function ensureSiteDir() {
  fs.mkdirSync(SITE_DIR, { recursive: true });
}

async function uploadToStorage(file, buffer, contentType = "image/png") {
  if (!supabaseConfigured) return;
  const { error } = await supabase.storage.from(BUCKET).upload(file, buffer, {
    upsert: true,
    contentType,
  });
  if (error) throw new Error(error.message);
}

async function downloadFromStorage(file) {
  if (!supabaseConfigured) return false;
  const { data, error } = await supabase.storage.from(BUCKET).download(file);
  if (error || !data) return false;
  const buffer = Buffer.from(await data.arrayBuffer());
  fs.writeFileSync(path.join(SITE_DIR, file), buffer);
  return true;
}

export async function initSiteAssets() {
  ensureSiteDir();
  if (!supabaseConfigured) return;
  for (const { file } of ICON_FILES) {
    const local = path.join(SITE_DIR, file);
    if (fs.existsSync(local)) continue;
    try {
      await downloadFromStorage(file);
    } catch {
      // bucket may not exist yet
    }
  }
}

export function registerSiteAssetRoutes(app, clientDist) {
  const fallbacks = new Map(
    ICON_FILES.map(({ file }) => [file, path.join(clientDist, file)])
  );

  for (const { file } of ICON_FILES) {
    app.get(`/${file}`, (req, res, next) => {
      const custom = path.join(SITE_DIR, file);
      if (fs.existsSync(custom)) {
        res.setHeader("Cache-Control", "public, max-age=300");
        res.sendFile(custom);
        return;
      }
      const fallback = fallbacks.get(file);
      if (fallback && fs.existsSync(fallback)) {
        res.sendFile(fallback);
        return;
      }
      next();
    });
  }
}

export async function saveFaviconFromBuffer(buffer) {
  ensureSiteDir();
  const outputs = [];

  for (const { file, size } of ICON_FILES) {
    const out = await sharp(buffer)
      .resize(size, size, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();
    const localPath = path.join(SITE_DIR, file);
    fs.writeFileSync(localPath, out);
    await uploadToStorage(file, out);
    outputs.push(file);
  }

  return outputs;
}
