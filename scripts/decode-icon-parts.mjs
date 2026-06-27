import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const partsDir = resolve(import.meta.dirname, "icon-b64-parts");
const out = resolve(import.meta.dirname, "../client/public/icon-source.png");
const b64 = readdirSync(partsDir)
  .filter((f) => f.endsWith(".txt"))
  .sort()
  .map((f) => readFileSync(resolve(partsDir, f), "utf8").trim())
  .join("");
mkdirSync(resolve(out, ".."), { recursive: true });
writeFileSync(out, Buffer.from(b64, "base64"));
console.log(`Wrote ${out} (${Buffer.from(b64, "base64").length} bytes)`);
