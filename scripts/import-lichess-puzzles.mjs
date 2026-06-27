/**
 * Import multi-move puzzles from Lichess CSV (partial or full).
 * Usage: node scripts/import-lichess-puzzles.mjs [csvPath]
 */
import { Chess } from "chess.js";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../client/src/puzzle");
const csvPath = process.argv[2] || "/tmp/lichess_puzzles.csv";
const TARGET = 50;
const MIN_PLAYER_PLIES = 3;
const MAX_PLAYER_PLIES = 5;

function uciToStep(uci) {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? uci[4] : undefined;
  const step = { from, to };
  if (promotion) step.promotion = promotion;
  return step;
}

function playerPlies(solution) {
  return Math.ceil(solution.length / 2);
}

function parseCsvLine(line) {
  const parts = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      parts.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}

function validatePuzzle(fen, solution, theme) {
  const game = new Chess(fen);
  const start = game.turn();
  for (let i = 0; i < solution.length; i++) {
    const exp = i % 2 === 0 ? start : start === "w" ? "b" : "w";
    if (game.turn() !== exp) return false;
    const s = solution[i];
    const opts = { from: s.from, to: s.to };
    if (s.promotion) opts.promotion = s.promotion;
    if (!game.move(opts)) return false;
  }
  if (theme === "mate" || theme === "sacrifice") {
    return game.isCheckmate();
  }
  return true;
}

function themeFromLichess(themes) {
  const t = themes.toLowerCase();
  if (t.includes("promotion")) return "promotion";
  if (t.includes("fork")) return "fork";
  if (t.includes("pin")) return "pin";
  if (t.includes("sacrifice")) return "sacrifice";
  if (t.includes("mate")) return "mate";
  return "tactic";
}

function difficultyFromRating(rating) {
  if (rating < 1100) return "easy";
  if (rating < 1600) return "medium";
  return "hard";
}

function themeLabel(theme) {
  const map = {
    mate: "รุมฆาต",
    fork: "ส้อม",
    pin: "พิน",
    sacrifice: "เสียสละ",
    promotion: "เดินเบี้ย",
    tactic: "แท็กติก",
  };
  return map[theme] || "แท็กติก";
}

function iconFor(theme) {
  const map = {
    mate: "♛",
    fork: "♞",
    pin: "📌",
    sacrifice: "💥",
    promotion: "♙",
    tactic: "🎯",
  };
  return map[theme] || "♟️";
}

function lichessRowToPuzzle(row) {
  const [puzzleId, fen, moves, ratingStr, , popularityStr, , themes] = row;
  if (!fen || !moves) return null;

  const uci = moves.trim().split(/\s+/);
  if (uci.length < 2) return null;

  const setup = new Chess(fen);
  const setupMove = uciToStep(uci[0]);
  if (!setup.move(setupMove)) return null;

  const puzzleFen = setup.fen();
  const solution = uci.slice(1).map(uciToStep);
  const plies = playerPlies(solution);

  if (plies < MIN_PLAYER_PLIES || plies > MAX_PLAYER_PLIES) return null;

  const rating = Number(ratingStr) || 1200;
  const theme = themeFromLichess(themes);
  if (!validatePuzzle(puzzleFen, solution, theme)) return null;

  const turn = puzzleFen.includes(" w ") ? "ขาว" : "ดำ";

  const titleByTheme = {
    mate: `รุมฆาตใน ${plies} ตา`,
    sacrifice: `เสียสละ — ชนะใน ${plies} ตา`,
    fork: `ส้อม — ชนะใน ${plies} ตา`,
    pin: `พิน — ชนะใน ${plies} ตา`,
    promotion: `เดินเบี้ย — ชนะใน ${plies} ตา`,
    tactic: `แท็กติก ${plies} ตา`,
  };

  return {
    id: `lz-${puzzleId.toLowerCase()}`,
    title: titleByTheme[theme] || `แท็กติก ${plies} ตา`,
    theme,
    themeLabel: themeLabel(theme),
    difficulty: difficultyFromRating(rating),
    icon: iconFor(theme),
    fen: puzzleFen,
    prompt: `${turn}เดิน — หาลำดับที่ดีที่สุด ${plies} ตา`,
    hint: `ชนะใน ${plies} ตาของคุณ`,
    solution,
    _popularity: Number(popularityStr) || 0,
  };
}

const THEME_QUOTAS = {
  mate: 12,
  fork: 10,
  pin: 8,
  sacrifice: 8,
  promotion: 6,
  tactic: 6,
};

const raw = readFileSync(csvPath, "utf8");
const lines = raw.split("\n").filter(Boolean);
lines.shift();

const byTheme = Object.fromEntries(
  Object.keys(THEME_QUOTAS).map((t) => [t, []])
);

for (const line of lines) {
  const row = parseCsvLine(line);
  const puzzle = lichessRowToPuzzle(row);
  if (!puzzle) continue;
  const bucket = byTheme[puzzle.theme];
  if (bucket) bucket.push(puzzle);
}

for (const list of Object.values(byTheme)) {
  list.sort((a, b) => b._popularity - a._popularity);
}

const chosen = [];
const seen = new Set();

function takeFrom(theme, n) {
  for (const p of byTheme[theme] || []) {
    if (chosen.length >= TARGET) break;
    const key = `${p.fen}|${JSON.stringify(p.solution)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    chosen.push(p);
    if (--n <= 0) break;
  }
}

for (const [theme, quota] of Object.entries(THEME_QUOTAS)) {
  takeFrom(theme, quota);
}

const allCandidates = Object.values(byTheme).flat();
allCandidates.sort((a, b) => b._popularity - a._popularity);
for (const p of allCandidates) {
  if (chosen.length >= TARGET) break;
  const key = `${p.fen}|${JSON.stringify(p.solution)}`;
  if (seen.has(key)) continue;
  seen.add(key);
  chosen.push(p);
}

if (chosen.length < TARGET) {
  console.error(`Only found ${chosen.length} puzzles (need ${TARGET}).`);
  for (const [theme, list] of Object.entries(byTheme)) {
    console.error(`  ${theme}: ${list.length} candidates`);
  }
  process.exit(1);
}

const outPuzzles = chosen.slice(0, TARGET).map(({ _popularity, ...p }) => p);

const themeCounts = {};
for (const p of outPuzzles) {
  themeCounts[p.theme] = (themeCounts[p.theme] || 0) + 1;
}

const out = `/**
 * Lichess-sourced puzzles (${outPuzzles.length}) — mixed themes (mate, fork, pin, etc.).
 * Generated by scripts/import-lichess-puzzles.mjs — do not edit by hand.
 */
export const GENERATED_PUZZLES = ${JSON.stringify(outPuzzles, null, 2)};

export default GENERATED_PUZZLES;
`;

writeFileSync(path.join(outDir, "puzzles-generated.mjs"), out, "utf8");
console.log(`Wrote ${outPuzzles.length} puzzles to puzzles-generated.mjs`);
console.log("Themes:", themeCounts);
console.log(
  "Player plies:",
  outPuzzles.map((p) => Math.ceil(p.solution.length / 2)).join(", ")
);
