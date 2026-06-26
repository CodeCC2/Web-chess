/**
 * Puzzle catalog — every entry is validated (legal moves + checkmate when required).
 */
import { Chess } from "chess.js";

/** @type {Array<object>} */
export const GENERATED_PUZZLES = [];

function playSolution(puzzle) {
  const game = new Chess(puzzle.fen);
  const start = game.turn();
  for (let i = 0; i < puzzle.solution.length; i++) {
    const exp = i % 2 === 0 ? start : start === "w" ? "b" : "w";
    if (game.turn() !== exp) return null;
    const s = puzzle.solution[i];
    const opts = { from: s.from, to: s.to };
    if (s.promotion) opts.promotion = s.promotion;
    const res = game.move(opts);
    if (!res) return null;
  }
  return game;
}

function requiresMate(puzzle) {
  if (puzzle.theme === "mate") return true;
  if (puzzle.theme === "sacrifice") return true;
  if (puzzle.prompt?.includes("รุมฆาต")) return true;
  if (puzzle.title?.includes("#")) return true;
  return false;
}

function tryAdd(puzzle) {
  try {
    const game = playSolution(puzzle);
    if (!game) return;
    if (requiresMate(puzzle) && !game.isCheckmate()) return;
    GENERATED_PUZZLES.push(puzzle);
  } catch {
    /* skip invalid */
  }
}

function matePuzzle(id, title, fen, from, to, { difficulty = "easy", hint } = {}) {
  tryAdd({
    id,
    title,
    theme: "mate",
    themeLabel: "รุมฆาต",
    difficulty,
    icon: title.includes("เรือ") ? "♜" : title.includes("ควีน") ? "♕" : "♟️",
    fen,
    prompt: fen.includes(" b ")
      ? "ดำเดิน — รุมฆาต"
      : "ขาวเดิน — รุมฆาต",
    hint: hint || `${from}→${to}`,
    solution: [{ from, to }],
  });
}

// Back-rank mates — king g8 boxed by f7/g7/h7 pawns
const backRankMates = [
  ["rook-mate-a", "เรือ a8#", "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", "a1", "a8"],
  ["rook-mate-d", "เรือ d8#", "6k1/5ppp/8/8/8/8/4P1PP/3R2K1 w - - 0 1", "d1", "d8"],
  ["rook-mate-h", "เรือ h8#", "6k1/5ppp/8/8/8/8/5PPP/7R w - - 0 1", "h1", "h8"],
  ["queen-mate-d8", "ควีน d8#", "6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1", "d1", "d8"],
  ["queen-mate-a8", "ควีน a8#", "6k1/5ppp/8/8/8/8/6PP/Q5K1 w - - 0 1", "a1", "a8"],
  ["queen-mate-e8", "ควีน e8#", "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1", "e1", "e8"],
  ["queen-mate-c8", "ควีน c8#", "6k1/5ppp/8/8/8/8/6PP/2Q2K1 w - - 0 1", "c1", "c8"],
  ["queen-mate-h8", "ควีน h8#", "6k1/5ppp/8/8/8/7Q/6PP/6K1 w - - 0 1", "h3", "h8"],
  ["q-d3-d8", "ควีน d3→d8#", "6k1/5ppp/8/8/8/3Q4/6PP/6K1 w - - 0 1", "d3", "d8"],
  ["q-a3-a8", "ควีน a3→a8#", "6k1/5ppp/8/8/8/Q7/6PP/6K1 w - - 0 1", "a3", "a8"],
  ["q-c4-c8", "ควีน c4→c8#", "6k1/5ppp/8/8/2Q5/8/6PP/6K1 w - - 0 1", "c4", "c8"],
  ["q-e5-e8", "ควีน e5→e8#", "6k1/5ppp/8/4Q3/8/8/6PP/6K1 w - - 0 1", "e5", "e8"],
  ["q-d6-d8", "ควีน d6→d8#", "6k1/5ppp/3Q4/8/8/8/6PP/6K1 w - - 0 1", "d6", "d8"],
  ["q-c6-c8", "ควีน c6→c8#", "6k1/5ppp/2Q5/8/8/8/6PP/6K1 w - - 0 1", "c6", "c8"],
  ["q-b6-b8", "ควีน b6→b8#", "6k1/5ppp/1Q6/8/8/8/6PP/6K1 w - - 0 1", "b6", "b8"],
  ["q-e6-e8", "ควีน e6→e8#", "6k1/5ppp/4Q3/8/8/8/6PP/6K1 w - - 0 1", "e6", "e8"],
  ["r-a8-7k", "เรือ a8# (มุม)", "7k/5ppp/8/8/8/8/6PP/R5K1 w - - 0 1", "a1", "a8"],
  ["r-a8-7k2", "เรือ a8#", "7k/6pp/8/8/8/8/6PP/R5K1 w - - 0 1", "a1", "a8"],
];

for (const [id, title, fen, from, to] of backRankMates) {
  matePuzzle(id, title, fen, from, to);
}

// Corner king h8
matePuzzle(
  "queen-mate-h8-corner",
  "ควีน d8# (มุม)",
  "7k/5ppp/5Q2/8/8/8/6PP/6K1 w - - 0 1",
  "f6",
  "d8",
  { difficulty: "medium", hint: "Qd8#" }
);

// Rook capture mate
matePuzzle(
  "tactic-re8-mate",
  "เรือ xe8#",
  "4r1k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
  "e1",
  "e8",
  { difficulty: "medium" }
);

// Knight mate (protected)
matePuzzle(
  "piece-mate-nf7",
  "ม้า f7#",
  "6rk/5ppp/8/6N1/8/8/6PP/6K1 w - - 0 1",
  "g5",
  "f7",
  { difficulty: "medium" }
);

// Mate in 2 — queen box
tryAdd({
  id: "mate2-queen-box",
  title: "รุมฆาตควีน 2 ตา",
  theme: "mate",
  themeLabel: "รุมฆาต",
  difficulty: "medium",
  icon: "♕",
  fen: "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1",
  prompt: "ขาวเดิน — รุมฆาตใน 2 ตา",
  hint: "Qe7+ แล้วตามด้วยรุมฆาต",
  solution: [
    { from: "e1", to: "e7" },
    { from: "g8", to: "h8" },
    { from: "e7", to: "f8" },
  ],
});

// Mate in 2 — rook on 7th
tryAdd({
  id: "mate2-rook-7th",
  title: "รุมฆาตเรือ 2 ตา",
  theme: "mate",
  themeLabel: "รุมฆาต",
  difficulty: "medium",
  icon: "♜",
  fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
  prompt: "ขาวเดิน — รุมฆาตใน 2 ตา",
  hint: "Re7+ แล้ว Re8#",
  solution: [
    { from: "e1", to: "e7" },
    { from: "g8", to: "h8" },
    { from: "e7", to: "e8" },
  ],
});

// Scholar's mate
tryAdd({
  id: "tactic-scholar",
  title: "Scholar's mate",
  theme: "tactic",
  themeLabel: "แท็กติก",
  difficulty: "easy",
  icon: "🎯",
  fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
  prompt: "ขาวเดิน — รุมฆาตทันที",
  hint: "Qxf7#",
  solution: [{ from: "h5", to: "f7" }],
});

// Black to move — back rank
[
  ["black-mate-ra1", "ดำ เรือ a1#", "6K1/5PPP/8/8/8/8/5ppp/r7 b - - 0 1", "a2", "a1"],
  ["black-mate-re1", "ดำ เรือ e1#", "4k3/8/8/8/8/8/5ppp/4r3 b - - 0 1", "e2", "e1"],
  ["black-mate-rh1", "ดำ เรือ h1#", "6K1/8/8/8/8/8/5ppp/6rk b - - 0 1", "h2", "h1"],
  ["black-mate-qe8", "ดำ ควีน e8#", "4k3/8/8/8/8/8/5ppp/4q2K b - - 0 1", "e2", "e8"],
].forEach(([id, title, fen, from, to]) => {
  matePuzzle(id, title, fen, from, to);
});

// Forks — win material (no mate required)
[
  ["fork-nc7", "ม้าส้อม c7", "1k6/r7/8/1N6/8/8/6PP/6K1 w - - 0 1", "b5", "c7", "ม้าส้อมคิงกับเรือ"],
  ["fork-ne5", "ม้าส้อม e5", "4k3/8/8/4r3/8/5N2/8/4K2R w - - 0 1", "f3", "e5", "ม้าส้อมคิงกับเรือ"],
  ["fork-qd5", "ควีนส้อม d5", "4r1k1/5ppp/8/8/3Q4/8/5PPP/5RK1 w - - 0 1", "d4", "d5", "ควีนส้อมคิงกับเรือ"],
  ["fork-nd5", "ม้าส้อม f5", "4k3/8/3n4/8/3N4/8/8/4K3 w - - 0 1", "d4", "f5", "ม้าส้อมม้ากับคิง"],
  ["fork-nc3", "ม้าส้อม d6", "4k3/8/3r4/8/2N5/8/8/4K3 w - - 0 1", "c4", "d6", "ม้าส้อมเรือกับคิง"],
  ["fork-na4", "ม้าส้อม e5", "4k3/8/8/4r3/2N5/8/8/4K3 w - - 0 1", "c4", "e5", "ม้าส้อมเรือกับคิง"],
].forEach(([id, title, fen, from, to, hint]) => {
  tryAdd({
    id,
    title,
    theme: "fork",
    themeLabel: "ส้อม",
    difficulty: "medium",
    icon: "♞",
    fen,
    prompt: "ขาวเดิน — ชนะหมาก",
    hint,
    solution: [{ from, to }],
  });
});

// Pin
tryAdd({
  id: "pin-bishop-b5",
  title: "พินบิชอป b5",
  theme: "pin",
  themeLabel: "พิน",
  difficulty: "medium",
  icon: "📌",
  fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1PB1P3/8/PP1P1PPP/RNBQK1NR w KQkq - 2 4",
  prompt: "ขาวเดิน — พินม้า c6",
  hint: "Bb5",
  solution: [{ from: "c4", to: "b5" }],
});

tryAdd({
  id: "pin-rd8",
  title: "เรือ x d8 ชนะเรือ",
  theme: "tactic",
  themeLabel: "แท็กติก",
  difficulty: "medium",
  icon: "♜",
  fen: "4r1k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
  prompt: "ขาวเดิน — ชนะหมาก",
  hint: "Rxd8",
  solution: [{ from: "d1", to: "d8" }],
});

tryAdd({
  id: "win-qxd8",
  title: "ควีน x d8 ชนะเรือ",
  theme: "tactic",
  themeLabel: "แท็กติก",
  difficulty: "medium",
  icon: "♕",
  fen: "4r1k1/5ppp/8/8/3Q4/8/5PPP/5RK1 w - - 0 1",
  prompt: "ขาวเดิน — ชนะหมาก",
  hint: "Qxd8",
  solution: [{ from: "d4", to: "d8" }],
});

// Promotion puzzles
[
  ["promo-e8q", "เดินเบี้ย e8=ควีน", "8/4P3/8/8/8/8/8/4K2k w - - 0 1", "e7", "e8", "q"],
  ["promo-a8q", "เดินเบี้ย a8=ควีน", "8/8/8/8/8/8/P7/4K2k w - - 0 1", "a7", "a8", "q"],
  ["promo-h8r", "เดินเบี้ย h8=เรือ", "8/7P/8/8/8/8/8/4K2k w - - 0 1", "h7", "h8", "r"],
  ["promo-b8q", "เดินเบี้ย b8=ควีน", "8/1P6/8/8/8/8/8/4K2k w - - 0 1", "b7", "b8", "q"],
  ["promo-c8q", "เดินเบี้ย c8=ควีน", "8/2P5/8/8/8/8/8/4K2k w - - 0 1", "c7", "c8", "q"],
  ["promo-d8q", "เดินเบี้ย d8=ควีน", "8/3P4/8/8/8/8/8/4K2k w - - 0 1", "d7", "d8", "q"],
  ["promo-g8n", "เดินเบี้ย g8=ม้า", "8/6P1/8/8/8/8/8/4K2k w - - 0 1", "g7", "g8", "n"],
].forEach(([id, title, fen, from, to, promo]) => {
  const sol = [{ from, to, promotion: promo }];
  tryAdd({
    id,
    title,
    theme: "promotion",
    themeLabel: "เดินเบี้ย",
    difficulty: "medium",
    icon: "♙",
    fen,
    prompt: "ขาวเดิน — เดินเบี้ยชนะ",
    hint: `${from}→${to}=${promo}`,
    solution: sol,
  });
});

// Extra mate-in-2 puzzles
const mateIn2 = [
  {
    id: "mate2-queen-h8",
    title: "รุมฆาตควีน 2 ตา (มุม)",
    fen: "7k/5ppp/5Q2/8/8/8/6PP/6K1 w - - 0 1",
    hint: "Qd8#",
    solution: [
      { from: "f6", to: "f7" },
      { from: "h8", to: "h7" },
      { from: "f7", to: "d8" },
    ],
  },
  {
    id: "mate2-queen-f8",
    title: "รุมฆาตควีน 2 ตา",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1",
    hint: "Qe7+ แล้ว Qf8#",
    solution: [
      { from: "e1", to: "e7" },
      { from: "g8", to: "h8" },
      { from: "e7", to: "e8" },
    ],
  },
];

for (const p of mateIn2) {
  tryAdd({
    ...p,
    theme: "mate",
    themeLabel: "รุมฆาต",
    difficulty: "medium",
    icon: "♕",
    prompt: "ขาวเดิน — รุมฆาตใน 2 ตา",
  });
}

// Generate more unique back-rank style mates on different files
const extraMates = [
  ["mate-q-b2-b8", "6k1/1p6/8/8/8/1Q6/6PP/6K1 w - - 0 1", "b3", "b8"],
  ["mate-q-f2-f8", "6k1/5ppp/8/8/8/5Q2/6PP/6K1 w - - 0 1", "f3", "f8"],
  ["mate-r-e2-e8", "6k1/5ppp/8/8/8/4R3/6PP/6K1 w - - 0 1", "e3", "e8"],
  ["mate-r-c2-c8", "6k1/2p5/8/8/8/2R5/6PP/6K1 w - - 0 1", "c3", "c8"],
];

for (const [id, fen, from, to] of extraMates) {
  matePuzzle(id, `${from}→${to}#`, fen, from, to, { difficulty: "medium" });
}

// More validated mates & tactics (audit: must end in checkmate for mate theme)
matePuzzle(
  "mate-q-d5-d8",
  "ควีน d5→d8#",
  "6k1/5ppp/8/3Q4/8/8/6PP/6K1 w - - 0 1",
  "d5",
  "d8",
  { difficulty: "medium" }
);

matePuzzle(
  "mate-q-a5-a8",
  "ควีน a5→a8#",
  "6k1/5ppp/8/Q7/8/8/6PP/6K1 w - - 0 1",
  "a5",
  "a8",
  { difficulty: "medium" }
);

tryAdd({
  id: "mate2-queen-d8",
  title: "รุมฆาตควีน 2 ตา (d8)",
  theme: "mate",
  themeLabel: "รุมฆาต",
  difficulty: "medium",
  icon: "♕",
  fen: "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1",
  prompt: "ขาวเดิน — รุมฆาตใน 2 ตา",
  hint: "Qe7+ แล้ว Qd8#",
  solution: [
    { from: "e1", to: "e7" },
    { from: "g8", to: "h8" },
    { from: "e7", to: "d8" },
  ],
});

tryAdd({
  id: "fork-qe6",
  title: "ควีนส้อม e6",
  theme: "fork",
  themeLabel: "ส้อม",
  difficulty: "medium",
  icon: "♕",
  fen: "4k3/8/4r3/8/8/4Q3/8/4K3 w - - 0 1",
  prompt: "ขาวเดิน — ชนะหมาก",
  hint: "Qe6 ส้อมคิงกับเรือ",
  solution: [{ from: "e3", to: "e6" }],
});

tryAdd({
  id: "promo-a8q",
  title: "เดินเบี้ย a8=ควีน",
  theme: "promotion",
  themeLabel: "เดินเบี้ย",
  difficulty: "easy",
  icon: "♙",
  fen: "8/P7/8/8/8/8/8/4K2k w - - 0 1",
  prompt: "ขาวเดิน — เดินเบี้ยแล้วชนะ",
  hint: "a8=ควีน",
  solution: [{ from: "a7", to: "a8", promotion: "q" }],
});

tryAdd({
  id: "promo-g6-g7",
  title: "เดินเบี้ย g7",
  theme: "promotion",
  themeLabel: "เดินเบี้ย",
  difficulty: "easy",
  icon: "♙",
  fen: "8/8/6P1/8/8/8/8/4K2k w - - 0 1",
  prompt: "ขาวเดิน — เดินเบี้ยชนะ",
  hint: "g6-g7",
  solution: [{ from: "g6", to: "g7" }],
});

tryAdd({
  id: "mate2-queen-d7",
  title: "รุมฆาตควีน 2 ตา (d7)",
  theme: "mate",
  themeLabel: "รุมฆาต",
  difficulty: "medium",
  icon: "♕",
  fen: "6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1",
  prompt: "ขาวเดิน — รุมฆาตใน 2 ตา",
  hint: "Qd7+ แล้ว Qd8#",
  solution: [
    { from: "d1", to: "d7" },
    { from: "g8", to: "h8" },
    { from: "d7", to: "d8" },
  ],
});

matePuzzle(
  "mate-q-c5-c8",
  "ควีน c5→c8#",
  "6k1/5ppp/8/2Q5/8/8/6PP/6K1 w - - 0 1",
  "c5",
  "c8",
  { difficulty: "medium" }
);

matePuzzle(
  "mate-q-e4-e8",
  "ควีน e4→e8#",
  "6k1/5ppp/8/8/4Q3/8/6PP/6K1 w - - 0 1",
  "e4",
  "e8",
  { difficulty: "medium" }
);

matePuzzle(
  "mate-q-b4-b8",
  "ควีน b4→b8#",
  "6k1/5ppp/8/8/1Q6/8/6PP/6K1 w - - 0 1",
  "b4",
  "b8",
  { difficulty: "medium" }
);

tryAdd({
  id: "fork-nd7",
  title: "ม้าส้อม d7",
  theme: "fork",
  themeLabel: "ส้อม",
  difficulty: "medium",
  icon: "♞",
  fen: "4k3/8/3r4/8/3N4/8/8/4K3 w - - 0 1",
  prompt: "ขาวเดิน — ชนะหมาก",
  hint: "Nc6 ส้อมเรือกับคิง",
  solution: [{ from: "d4", to: "c6" }],
});

tryAdd({
  id: "tactic-discovered-e8",
  title: "เรือ xe8# (เปิดลาย)",
  theme: "tactic",
  themeLabel: "แท็กติก",
  difficulty: "medium",
  icon: "♜",
  fen: "4r1k1/5ppp/5B2/8/8/8/5PPP/4R1K1 w - - 0 1",
  prompt: "ขาวเดิน — รุมฆาต",
  hint: "Rxe8#",
  solution: [{ from: "e1", to: "e8" }],
});

export default GENERATED_PUZZLES;
