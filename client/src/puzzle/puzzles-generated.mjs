/**
 * Programmatically generate validated puzzles (target 40+ unique).
 */
import { Chess } from "chess.js";

/** @type {Array<object>} */
export const GENERATED_PUZZLES = [];

function tryAdd(puzzle) {
  try {
    const game = new Chess(puzzle.fen);
    const start = game.turn();
    for (let i = 0; i < puzzle.solution.length; i++) {
      const exp = i % 2 === 0 ? start : start === "w" ? "b" : "w";
      if (game.turn() !== exp) return;
      const s = puzzle.solution[i];
      const opts = { from: s.from, to: s.to };
      if (s.promotion) opts.promotion = s.promotion;
      if (!game.move(opts)) return;
    }
    GENERATED_PUZZLES.push(puzzle);
  } catch {
    /* skip */
  }
}

// Rook mates by file (unique FENs)
const rookFiles = [
  ["a", "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", "a1", "a8"],
  ["b", "6k1/1p6/8/8/8/8/6PP/1R4K1 w - - 0 1", "b1", "b8"],
  ["c", "6k1/2p5/8/8/8/8/6PP/2R3K1 w - - 0 1", "c1", "c8"],
  ["d", "6k1/5ppp/8/8/8/8/4P1PP/3R2K1 w - - 0 1", "d1", "d8"],
  ["e", "6k1/5ppp/8/8/8/8/5PP2/4R2K1 w - - 0 1", "e1", "e8"],
  ["f", "6k1/5ppp/8/8/8/8/4P1PP/5R1K w - - 0 1", "f1", "f8"],
  ["g", "6k1/5ppp/8/8/8/8/4P1PP/6RK1 w - - 0 1", "g1", "g8"],
  ["h", "6k1/5ppp/8/8/8/8/5PPP/7R w - - 0 1", "h1", "h8"],
];

for (const [file, fen, from, to] of rookFiles) {
  tryAdd({
    id: `rook-mate-${file}`,
    title: `เรือ ${file}8#`,
    theme: "mate",
    themeLabel: "รุมฆาต",
    difficulty: "easy",
    icon: "♜",
    fen,
    prompt: "ขาวเดิน — รุมฆาต",
    hint: `เรือ ${to}`,
    solution: [{ from, to }],
  });
}

// Queen mates (unique)
const queenMates = [
  ["h7", "6k1/8/5pp1/7Q/8/8/6PP/6K1 w - - 0 1", "h5", "h7"],
  ["d8", "6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1", "d1", "d8"],
  ["b7", "1k6/1p6/8/8/8/8/6PP/1Q4K1 w - - 0 1", "b1", "b7"],
  ["a8", "6k1/5ppp/8/8/8/8/6PP/Q5K1 w - - 0 1", "a1", "a8"],
  ["e8", "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1", "e1", "e8"],
  ["g7", "6k1/5ppp/8/8/8/8/5PPP/5QK1 w - - 0 1", "g1", "g7"],
  ["f7", "6k1/6pp/8/5Q2/8/8/6PP/6K1 w - - 0 1", "f5", "f7"],
  ["c8", "6k1/5ppp/8/8/8/8/6PP/2Q2K1 w - - 0 1", "c1", "c8"],
  ["h8", "6k1/5ppp/8/8/8/7Q/6PP/6K1 w - - 0 1", "h3", "h8"],
  ["a7", "1k6/8/8/8/8/8/6PP/Q6K1 w - - 0 1", "a1", "a7"],
];

for (const [tag, fen, from, to] of queenMates) {
  tryAdd({
    id: `queen-mate-${tag}`,
    title: `ควีน ${tag}#`,
    theme: "mate",
    themeLabel: "รุมฆาต",
    difficulty: "easy",
    icon: "♕",
    fen,
    prompt: "ขาวเดิน — รุมฆาต",
    hint: `ควีน ${to}`,
    solution: [{ from, to }],
  });
}

// Bishop & knight mates
[
  ["bh7", "6k1/5ppp/8/8/8/3B4/6PP/6K1 w - - 0 1", "d3", "h7"],
  ["bf7", "6k1/5ppp/8/8/2B5/8/6PP/6K1 w - - 0 1", "c4", "f7"],
  ["nf7", "6rk/5ppp/8/6N1/8/8/6PP/6K1 w - - 0 1", "g5", "f7"],
  ["nh7", "6k1/5ppp/5N2/8/8/8/6PP/6K1 w - - 0 1", "f6", "h7"],
].forEach(([tag, fen, from, to]) => {
  tryAdd({
    id: `piece-mate-${tag}`,
    title: `แท็กติก ${tag}`,
    theme: "mate",
    themeLabel: "รุมฆาต",
    difficulty: "medium",
    icon: "♞",
    fen,
    prompt: "ขาวเดิน — รุมฆาต",
    hint: `${from}→${to}`,
    solution: [{ from, to }],
  });
});

// Forks
[
  ["nc7", "1k6/r7/8/1N6/8/8/6PP/6K1 w - - 0 1", "b5", "c7", "ม้าส้อม c7"],
  ["ne5", "4k3/8/8/4r3/8/5N2/8/4K2R w - - 0 1", "f3", "e5", "ม้าส้อม e5"],
  ["qd5", "4r1k1/5ppp/8/8/3Q4/8/5PPP/5RK1 w - - 0 1", "d4", "d5", "ควีน d5"],
].forEach(([tag, fen, from, to, hint]) => {
  tryAdd({
    id: `fork-${tag}`,
    title: hint,
    theme: "fork",
    themeLabel: "ส้อม",
    difficulty: tag === "nc7" ? "easy" : "medium",
    icon: "♞",
    fen,
    prompt: "ขาวเดิน — ชนะหมาก",
    hint,
    solution: [{ from, to }],
  });
});

// Promotion
[
  ["e8q", "8/4P3/8/8/8/8/8/4K2k w - - 0 1", "e7", "e8", "q"],
  ["a8q", "8/8/8/8/8/8/P7/4K2k w - - 0 1", "a7", "a8", "q"],
  ["h8r", "8/7P/8/8/8/8/8/4K2k w - - 0 1", "h7", "h8", "r"],
  ["b8q", "8/1P6/8/8/8/8/8/4K2k w - - 0 1", "b7", "b8", "q"],
  ["c8q", "8/2P5/8/8/8/8/8/4K2k w - - 0 1", "c7", "c8", "q"],
  ["f8q", "8/8/8/8/8/5P2/8/4K2k w - - 0 1", "f6", "f7", null],
].forEach(([tag, fen, from, to, promo]) => {
  const sol = [{ from, to }];
  if (promo) sol[0].promotion = promo;
  tryAdd({
    id: `promo-${tag}`,
    title: `เดินเบี้ย ${tag}`,
    theme: "promotion",
    themeLabel: "เดินเบี้ย",
    difficulty: "medium",
    icon: "♙",
    fen,
    prompt: "ขาวเดิน — เดินเบี้ยชนะ",
    hint: `${from}→${to}`,
    solution: sol,
  });
});

// Mate in 2
tryAdd({
  id: "mate2-rook-ladder",
  title: "รุมฆาตเรือ 2 ตา",
  theme: "mate",
  themeLabel: "รุมฆาต",
  difficulty: "medium",
  icon: "♜",
  fen: "1k6/1pp5/8/8/8/8/1PP5/2K2R2 w - - 0 1",
  prompt: "ขาวเดิน — รุมฆาตใน 2 ตา",
  hint: "Rf8+",
  solution: [
    { from: "f1", to: "f8" },
    { from: "b8", to: "a7" },
    { from: "f8", to: "c8" },
  ],
});

tryAdd({
  id: "mate2-queen-box",
  title: "รุมฆาตควีน 2 ตา",
  theme: "mate",
  themeLabel: "รุมฆาต",
  difficulty: "medium",
  icon: "♕",
  fen: "6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1",
  prompt: "ขาวเดิน — รุมฆาตใน 2 ตา",
  hint: "Qe7+",
  solution: [
    { from: "e5", to: "e7" },
    { from: "g8", to: "h8" },
    { from: "e7", to: "f7" },
  ],
});

tryAdd({
  id: "tactic-sacrifice-qe8",
  title: "เสียสละแล้วรุมฆาต",
  theme: "sacrifice",
  themeLabel: "เสียสละ",
  difficulty: "hard",
  icon: "♛",
  fen: "6k1/5ppp/8/8/8/6Q1/5PPP/4R1K1 w - - 0 1",
  prompt: "ขาวเดิน — รุมฆาตใน 2 ตา",
  hint: "Qxg7+",
  solution: [
    { from: "g3", to: "g7" },
    { from: "g8", to: "g7" },
    { from: "e1", to: "e8" },
  ],
});

tryAdd({
  id: "tactic-scholar",
  title: "Scholar's mate",
  theme: "tactic",
  themeLabel: "แท็กติก",
  difficulty: "easy",
  icon: "🎯",
  fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
  prompt: "ขาวเดิน — ชนะทันที",
  hint: "Qxf7#",
  solution: [{ from: "h5", to: "f7" }],
});

tryAdd({
  id: "tactic-re8-mate",
  title: "เรือ e8#",
  theme: "tactic",
  themeLabel: "แท็กติก",
  difficulty: "medium",
  icon: "♜",
  fen: "4r1k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
  prompt: "ขาวเดิน — รุมฆาต",
  hint: "Re8#",
  solution: [{ from: "e1", to: "e8" }],
});

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

// Black to move
[
  ["ra1", "6K1/5PPP/8/8/8/8/5ppp/r7 b - - 0 1", "a2", "a1"],
  ["qh2", "6k1/8/8/8/8/8/6PP/6qK b - - 0 1", "g1", "h2"],
  ["re1", "4k3/8/8/8/8/8/5ppp/4r3 b - - 0 1", "e2", "e1"],
  ["rh1", "6K1/8/8/8/8/8/5ppp/6rk b - - 0 1", "h2", "h1"],
].forEach(([tag, fen, from, to]) => {
  tryAdd({
    id: `black-mate-${tag}`,
    title: `ดำรุมฆาต ${tag}`,
    theme: "mate",
    themeLabel: "รุมฆาต",
    difficulty: "easy",
    icon: "♚",
    fen,
    prompt: "ดำเดิน — รุมฆาต",
    hint: `${from}→${to}`,
    solution: [{ from, to }],
  });
});

// Extra queen/rook variety
[
  ["q-d3-d8", "6k1/5ppp/8/8/8/3Q4/6PP/6K1 w - - 0 1", "d3", "d8"],
  ["q-a3-a8", "6k1/5ppp/8/8/8/Q7/6PP/6K1 w - - 0 1", "a3", "a8"],
  ["q-c4-c8", "6k1/5ppp/8/8/2Q5/8/6PP/6K1 w - - 0 1", "c4", "c8"],
  ["r-a8-7k", "7k/5ppp/8/8/8/8/6PP/R5K1 w - - 0 1", "a1", "a8"],
].forEach(([tag, fen, from, to]) => {
  tryAdd({
    id: tag,
    title: `${from}→${to}`,
    theme: "mate",
    themeLabel: "รุมฆาต",
    difficulty: "medium",
    icon: "♟️",
    fen,
    prompt: "ขาวเดิน — รุมฆาต",
    hint: `${from}→${to}`,
    solution: [{ from, to }],
  });
});

// Additional validated puzzles (batch expansion to 50+)
[
  ["q-e5-e8", "6k1/5ppp/8/4Q3/8/8/6PP/6K1 w - - 0 1", "e5", "e8", "mate", "easy", "♕"],
  ["q-d6-d8", "6k1/5ppp/3Q4/8/8/8/6PP/6K1 w - - 0 1", "d6", "d8", "mate", "medium", "♕"],
  ["q-c6-c8", "6k1/5ppp/2Q5/8/8/8/6PP/6K1 w - - 0 1", "c6", "c8", "mate", "medium", "♕"],
  ["q-b6-b8", "6k1/5ppp/1Q6/8/8/8/6PP/6K1 w - - 0 1", "b6", "b8", "mate", "medium", "♕"],
  ["q-e6-e8", "6k1/5ppp/4Q3/8/8/8/6PP/6K1 w - - 0 1", "e6", "e8", "mate", "medium", "♕"],
  ["b-ac8", "1k6/8/2B5/8/8/8/6PP/6K1 w - - 0 1", "c6", "a8", "mate", "hard", "♗"],
  ["n-c6-d8", "1k6/8/2N5/8/8/8/6PP/6K1 w - - 0 1", "c6", "d8", "mate", "hard", "♞"],
  ["n-f6-g8", "6k1/5ppp/5N2/8/8/8/6PP/6K1 w - - 0 1", "f6", "g8", "mate", "medium", "♞"],
  ["fork-nd5", "4k3/8/3n4/8/3N4/8/8/4K3 w - - 0 1", "d4", "f5", "fork", "medium", "♞"],
  ["fork-nc3", "4k3/8/3r4/8/2N5/8/8/4K3 w - - 0 1", "c4", "d6", "fork", "medium", "♞"],
  ["fork-na4", "4k3/8/8/4r3/2N5/8/8/4K3 w - - 0 1", "c4", "e5", "fork", "medium", "♞"],
  ["pin-rd8", "4r1k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1", "d1", "d8", "tactic", "medium", "♜"],
  ["disc-bh3", "4r1k1/5ppp/5B2/8/8/8/5PPP/4R1K1 w - - 0 1", "e1", "e8", "tactic", "medium", "♜"],
  ["win-qxd8", "4r1k1/5ppp/8/8/3Q4/8/5PPP/5RK1 w - - 0 1", "d4", "d8", "tactic", "medium", "♕"],
  ["b-qc2", "6k1/8/8/8/8/8/1q6/6K1 b - - 0 1", "b2", "c2", "mate", "easy", "♚"],
  ["b-qg2", "6k1/8/8/8/8/8/6PP/5q1K b - - 0 1", "f1", "g2", "mate", "easy", "♚"],
  ["promo-g7", "8/8/6P1/8/8/8/8/4K2k w - - 0 1", "g6", "g7", "promotion", "easy", "♙"],
  ["promo-g8n", "8/6P1/8/8/8/8/8/4K2k w - - 0 1", "g7", "g8", "promotion", "medium", "♙", "n"],
  ["b-e6-c8", "6k1/5ppp/4B3/8/8/8/6PP/6K1 w - - 0 1", "e6", "c8", "mate", "hard", "♗"],
  ["b-c3-h7", "6k1/5ppp/8/5B2/8/8/6PP/6K1 w - - 0 1", "f5", "h7", "mate", "medium", "♗"],
  ["b-f3-h5", "6k1/5ppp/8/8/8/5B2/6PP/6K1 w - - 0 1", "f3", "h5", "tactic", "medium", "♗"],
  ["r-a8-7k2", "7k/6pp/8/8/8/8/6PP/R5K1 w - - 0 1", "a1", "a8", "mate", "easy", "♜"],
].forEach(([tag, fen, from, to, theme, difficulty, icon, promo]) => {
  const sol = [{ from, to }];
  if (promo) sol[0].promotion = promo;
  tryAdd({
    id: tag,
    title: `${from}→${to}`,
    theme,
    themeLabel:
      theme === "mate"
        ? "รุมฆาต"
        : theme === "fork"
          ? "ส้อม"
          : theme === "promotion"
            ? "เดินเบี้ย"
            : "แท็กติก",
    difficulty,
    icon,
    fen,
    prompt:
      fen.includes(" b ")
        ? "ดำเดิน — หาตาที่ดีที่สุด"
        : "ขาวเดิน — หาตาที่ดีที่สุด",
    hint: `${from}→${to}`,
    solution: sol,
  });
});

export default GENERATED_PUZZLES;
