import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const b64Path = process.argv[2];
if (!b64Path) {
  console.error("Usage: node save-icon-from-b64.mjs <base64-file>");
  process.exit(1);
}

const raw = readFileSync(b64Path, "utf8").trim();
const b64 = raw.includes(",") ? raw.split(",")[1] : raw;
const out = resolve(import.meta.dirname, "../client/public/icon-source.png");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(b64, "base64"));
console.log(`Saved ${out} (${Buffer.from(b64, "base64").length} bytes)`);
