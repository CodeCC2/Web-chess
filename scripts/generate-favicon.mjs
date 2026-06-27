/**
 * Generate favicon + apple-touch-icon from client/public/icon-source.png
 * Usage: npm run favicon
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const src = resolve(root, "client/public/icon-source.png");
const publicDir = resolve(root, "client/public");

if (!existsSync(src)) {
  console.error(
    "ไม่พบ client/public/icon-source.png\n" +
      "บันทึกรูปที่ต้องการเป็น icon ลงไฟล์นี้ก่อน แล้วรัน npm run favicon"
  );
  process.exit(1);
}

const sizes = [
  { file: "favicon-32.png", size: 32 },
  { file: "favicon-48.png", size: 48 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "icon-192.png", size: 192 },
];

for (const { file, size } of sizes) {
  await sharp(src)
    .resize(size, size, { fit: "cover", position: "centre" })
    .png()
    .toFile(resolve(publicDir, file));
  console.log(`OK: ${file} (${size}x${size})`);
}

await sharp(src)
  .resize(32, 32, { fit: "cover", position: "centre" })
  .png()
  .toFile(resolve(publicDir, "favicon.png"));

console.log("OK: favicon.png");
console.log("เสร็จแล้ว — commit แล้ว deploy ใหม่");
