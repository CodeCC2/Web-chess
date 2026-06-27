/**
 * Copy a PNG into icon-source.png and regenerate all favicon sizes.
 * Usage:
 *   npm run icon:apply -- path/to/your-icon.png
 *   npm run icon:apply          (uses icon.png in repo root or client/public/icon-drop/)
 */
import { copyFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, extname } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const dest = resolve(root, "client/public/icon-source.png");
const dropDir = resolve(root, "client/public/icon-drop");

function findDefault() {
  const rootIcon = resolve(root, "icon.png");
  if (existsSync(rootIcon)) return rootIcon;

  if (existsSync(dropDir)) {
    const img = readdirSync(dropDir)
      .filter((f) => [".png", ".jpg", ".jpeg", ".webp"].includes(extname(f).toLowerCase()))
      .sort()[0];
    if (img) return resolve(dropDir, img);
  }

  return null;
}

const src = process.argv[2] ? resolve(process.argv[2]) : findDefault();
if (!src || !existsSync(src)) {
  console.error(
    "ไม่พบไฟล์รูป\n" +
      "  npm run icon:apply -- path/to/icon.png\n" +
      "  หรือวาง icon.png ที่ root หรือใน client/public/icon-drop/"
  );
  process.exit(1);
}

copyFileSync(src, dest);
console.log(`Copied ${src} → ${dest}`);

const gen = spawnSync("node", ["scripts/generate-favicon.mjs"], {
  cwd: root,
  stdio: "inherit",
});
process.exit(gen.status ?? 1);
