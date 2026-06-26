/* eslint-env node */
import { Chess } from "chess.js";
import { writeFileSync } from "fs";

function move(game, from, to) {
  const piece = game.get(from);
  const opts = { from, to };
  if (piece?.type === "p") {
    const rank = to[1];
    if (rank === "8" || rank === "1") opts.promotion = "q";
  }
  return game.move(opts);
}

function buildSteps(pairs, texts) {
  const game = new Chess();
  const steps = [];
  for (let i = 0; i < pairs.length; i++) {
    const fen = game.fen();
    const [wf, wt, bf, bt] = pairs[i];
    const wMove = move(game, wf, wt);
    if (!wMove) throw new Error(`${wf}-${wt} step ${i + 1}`);
    const step = {
      fen,
      san: texts[i].san,
      instruction: texts[i].instruction,
      expected: { from: wf, to: wt },
    };
    if (texts[i].hint) step.hint = texts[i].hint;
    if (bf && bt) {
      const bMove = move(game, bf, bt);
      if (!bMove) throw new Error(`${bf}-${bt} step ${i + 1}`);
      step.opponentMove = { from: bf, to: bt };
      step.opponentSan = texts[i].opponentSan;
    }
    steps.push(step);
  }
  return { steps, line: game.history().join(" ") };
}

function t(n, instruction, opponentSan, hint) {
  return { san: n, instruction, opponentSan, hint };
}

const lessons = [
  {
    id: "ruy-lopez",
    kind: "main",
    title: "Ruy Lopez",
    subtitle: "สายหลัก Morphy Defense",
    icon: "🇪🇸",
    eco: "C88",
    description: "เปิดสเปนคลาสสิก — กดดันม้า c6 ขยายศูนย์กลางด้วย d4",
    middlegamePlan:
      "แผนกลางเกม: ม้า d2/c3 กดดัน e5, เรือเปิดคอลัมน์, บิชอป c2 ชี้ h7",
    pairs: [
      ["e2", "e4", "e7", "e5"], ["g1", "f3", "b8", "c6"], ["f1", "b5", "a7", "a6"],
      ["b5", "a4", "g8", "f6"], ["e1", "g1", "f8", "e7"], ["f1", "e1", "b7", "b5"],
      ["a4", "b3", "e8", "g8"], ["c2", "c3", "d7", "d6"], ["h2", "h3", "c8", "b7"],
      ["d2", "d4", "e5", "d4"], ["c3", "d4", "b5", "b4"], ["b1", "d2", "f8", "e8"],
      ["a2", "a3", "c6", "a5"], ["b3", "c2", "a8", "c8"], ["d1", "e2", "f6", "d7"],
    ],
    texts: [
      t("1. e4", "เปิดด้วย e4 — ครองศูนย์กลาง", "1...e5", "King's Pawn ยอดนิยม"),
      t("2. Nf3", "พัฒนาม้า โจมตี e5", "2...Nc6"),
      t("3. Bb5", "Ruy Lopez! กดดันม้า c6", "3...a6"),
      t("4. Ba4", "ถอย Ba4 — Morphy Defense", "4...Nf6"),
      t("5. O-O", "Castling สั้น", "5...Be7"),
      t("6. Re1", "เรือ e1 ชี้ e5", "6...b5"),
      t("7. Bb3", "ถอยบิชอป รักษาความกดดัน", "7...O-O"),
      t("8. c3", "c3 เตรียม d4", "8...d6"),
      t("9. h3", "h3 ป้องกันม้าไป g4", "9...Bb7"),
      t("10. d4", "ผลัก d4! ท้าทายศูนย์กลาง", "10...exd4"),
      t("11. cxd4", "กินเบี้ยคืน — เปิดคอลัมน์ c", "11...b4"),
      t("12. Nd2", "ม้า d2 หลบ b4", "12...Re8"),
      t("13. a3", "a3 ถามเบี้ย b4", "13...Na5"),
      t("14. Bc2", "บิชอป c2 ชี้ h7", "14...Rc8"),
      t("15. Qe2", "ควีน e2 เชื่อมเรือ", "15...Nbd7"),
    ],
  },
  {
    id: "ruy-lopez-berlin",
    kind: "variation",
    title: "Ruy Lopez",
    subtitle: "สายรอง: Berlin Defense",
    icon: "🇪🇸",
    eco: "C67",
    description: "ถ้าคู่เล่น 3...Nf6 — Berlin Defense ยอดนิยมในระดับมาสเตอร์",
    middlegamePlan: "Berlin มักแลกควีน — รักษาความสมดุล เน้นพัฒนาหมากและควบคุมศูนย์กลาง",
    pairs: [
      ["e2", "e4", "e7", "e5"], ["g1", "f3", "b8", "c6"], ["f1", "b5", "g8", "f6"],
      ["e1", "g1", "f6", "e4"], ["d2", "d4", "e4", "d6"], ["b5", "c6", "d7", "c6"],
      ["d4", "e5", "d6", "f5"], ["d1", "d8", "e8", "d8"], ["b1", "c3", "f5", "d6"],
      ["f1", "d1", "c8", "e6"], ["h2", "h3", "h7", "h6"], ["b2", "b3", "a7", "a5"],
      ["c1", "e3", "f8", "e7"], ["d1", "d2", "a8", "c8"], ["a1", "d1", "d8", "e8"],
    ],
    texts: [
      t("1. e4", "เปิด e4", "1...e5"), t("2. Nf3", "พัฒนาม้า", "2...Nc6"),
      t("3. Bb5", "Ruy Lopez", "3...Nf6"), t("4. O-O", "Castling — สาย Berlin", "4...Nxe4", "คู่มักกิน e4"),
      t("5. d4", "d4 ไล่ม้า e4", "5...Nd6"), t("6. Bxc6", "แลกม้า — Berlin Exchange", "6...dxc6"),
      t("7. dxe5", "กินเบี้ย e5", "7...Nf5"), t("8. Qxd8+", "แลกควีน", "8...Kxd8"),
      t("9. Nc3", "พัฒนาม้า c3", "9...Nd6"), t("10. Rd1", "เรือ d1 กดดัน d6", "10...Be6"),
      t("11. h3", "h3 ป้องกัน Bg4", "11...h6"), t("12. b3", "b3 เตรียม Bb2", "12...a5"),
      t("13. Be3", "พัฒนาบิชอป", "13...Be7"), t("14. Rd2", "เรือ d2", "14...Rc8"),
      t("15. Rad1", "เรือคู่ d1", "15...Ke8"),
    ],
  },
  {
    id: "queens-gambit-declined",
    kind: "main",
    title: "Queen's Gambit",
    subtitle: "Declined — สายหลัก",
    icon: "♕",
    eco: "D37",
    description: "QGD Orthodox — ต่อสู้ศูนย์กลางและพัฒนาหมากอย่างมั่นคง",
    middlegamePlan: "แผนกลางเกม: ม้า e2/f4, เรือ c1/e1 ควบคุมคอลัมน์เปิด, กดดัน d5",
    pairs: [
      ["d2", "d4", "d7", "d5"], ["c2", "c4", "e7", "e6"], ["b1", "c3", "g8", "f6"],
      ["c1", "g5", "f8", "e7"], ["e2", "e3", "e8", "g8"], ["g1", "f3", "b8", "d7"],
      ["f1", "d3", "c7", "c5"], ["c4", "d5", "e6", "d5"], ["f3", "e5", "d7", "e5"],
      ["g5", "f6", "e7", "f6"], ["d1", "c2", "b7", "b6"], ["e1", "g1", "c8", "b7"],
      ["a1", "c1", "c5", "d4"], ["e3", "d4", "a8", "c8"], ["c3", "e2", "e5", "d7"],
    ],
    texts: [
      t("1. d4", "เปิด d4", "1...d5"), t("2. c4", "Queen's Gambit", "2...e6"),
      t("3. Nc3", "พัฒนาม้า c3", "3...Nf6"), t("4. Bg5", "บิชอป g5 กดดัน f6", "4...Be7"),
      t("5. e3", "e3 สร้างฐาน", "5...O-O"), t("6. Nf3", "พัฒนาม้าคู่", "6...Nbd7"),
      t("7. Bd3", "บิชอป d3 ชี้ h7", "7...c5"), t("8. cxd5", "แลก d5", "8...exd5"),
      t("9. Ne5", "ม้า e5", "9...Nxe5"), t("10. Bxf6", "กินม้า f6", "10...Bxf6"),
      t("11. Qc2", "ควีน c2", "11...b6"), t("12. O-O", "Castling", "12...Bb7"),
      t("13. Rc1", "เรือ c1", "13...cxd4"), t("14. exd4", "กิน d4", "14...Rc8"),
      t("15. Ne2", "ม้า e2 — โครงสร้าง QGD สมบูรณ์", "15...Nbd7"),
    ],
  },
  {
    id: "qgd-tartakower",
    kind: "variation",
    title: "Queen's Gambit",
    subtitle: "สายรอง: Tartakower (5...b6)",
    icon: "♕",
    eco: "D58",
    description: "สายรองยอดนิยม — คู่เล่น b6 แทน Nbd7",
    middlegamePlan: "Tartakower: คู่ตี b6-Bb7 แลกบิชอป — เป้าหมาย e4/c5 ท้าทายศูนย์กลาง",
    pairs: [
      ["d2", "d4", "d7", "d5"], ["c2", "c4", "e7", "e6"], ["b1", "c3", "g8", "f6"],
      ["c1", "g5", "f8", "e7"], ["e2", "e3", "e8", "g8"], ["g1", "f3", "b7", "b6"],
      ["f1", "d3", "c8", "b7"], ["e1", "g1", "b8", "d7"], ["d1", "e2", "c7", "c5"],
      ["d4", "c5", "b6", "c5"],
    ],
    texts: [
      t("1. d4", "เปิด d4", "1...d5"), t("2. c4", "Queen's Gambit", "2...e6"),
      t("3. Nc3", "พัฒนาม้า", "3...Nf6"), t("4. Bg5", "บิชอป g5", "4...Be7"),
      t("5. e3", "e3", "5...O-O"), t("6. Nf3", "ม้าคู่ — คู่เล่น b6!", "6...b6"),
      t("7. Bd3", "บิชอป d3 รอ Bb7", "7...Bb7"), t("8. O-O", "Castling", "8...Nbd7"),
      t("9. Qe2", "ควีน e2 เตรียมรุก", "9...c5"), t("10. dxc5", "กิน c5 — ได้พื้นที่", "10...bxc5"),
    ],
  },
  {
    id: "queens-gambit-accepted",
    kind: "main",
    title: "Queen's Gambit",
    subtitle: "Accepted — สายหลัก",
    icon: "♛",
    eco: "D26",
    description: "QGA — ตอบรับเบี้ย c แล้วพัฒนาเร็วกว่าเพื่อแย่งคืนพื้นที่กลาง",
    middlegamePlan: "หลัง QGA: รักษาเบี้ยคู่ e4-d4, พัฒนาม้าเร็ว, กดดัน c7/c5",
    pairs: [
      ["d2", "d4", "d7", "d5"], ["c2", "c4", "d5", "c4"], ["g1", "f3", "g8", "f6"],
      ["e2", "e3", "e7", "e6"], ["f1", "c4", "c7", "c5"], ["e1", "g1", "a7", "a6"],
      ["b2", "b3", "b7", "b5"], ["c4", "d3", "c8", "b7"], ["b1", "d2", "c5", "d4"],
      ["e3", "d4", "f8", "e7"],
    ],
    texts: [
      t("1. d4", "เปิด d4", "1...d5"), t("2. c4", "Queen's Gambit", "2...dxc4"),
      t("3. Nf3", "พัฒนาม้าก่อนกินคืน", "3...Nf6"), t("4. e3", "e3 รองรับ d4", "4...e6"),
      t("5. Bxc4", "กินเบี้ยคืน", "5...c5"), t("6. O-O", "Castling", "6...a6"),
      t("7. b3", "b3 รองรับ c4", "7...b5"), t("8. Bd3", "บิชอป d3", "8...Bb7"),
      t("9. Nbd2", "ม้าคู่", "9...cxd4"), t("10. exd4", "กิน d4 — โครงสร้าง QGA", "10...Be7"),
    ],
  },
  {
    id: "qga-albin",
    kind: "variation",
    title: "Queen's Gambit",
    subtitle: "สายรอง: Albin Countergambit",
    icon: "♛",
    eco: "D08",
    description: "ถ้าคู่เล่น 2...e5 แทนรับ gambit — Albin Countergambit",
    middlegamePlan: "Albin: ระวังเบี้ย d4 ที่อาจกลายเป็น passer — พัฒนาเร็วและกดดัน e5",
    pairs: [
      ["d2", "d4", "d7", "d5"], ["c2", "c4", "e7", "e5"], ["d4", "e5", "f8", "c5"],
      ["g2", "g3", "d5", "d4"], ["f1", "g2", "b8", "c6"], ["g1", "f3", "g8", "e7"],
      ["e1", "g1", "e8", "g8"], ["e2", "e3", "c5", "b6"],
    ],
    texts: [
      t("1. d4", "เปิด d4", "1...d5"), t("2. c4", "Queen's Gambit", "2...e5"),
      t("3. dxe5", "กิน e5", "3...Bc5"), t("4. g3", "g3 รองรับ d4", "4...d4"),
      t("5. Bg2", "บิชอป g2", "5...Nc6"), t("6. Nf3", "พัฒนาม้า", "6...Nge7"),
      t("7. O-O", "Castling", "7...O-O"), t("8. e3", "e3 ท้าทาย d4", "8...Bb6"),
    ],
  },
  {
    id: "italian-game",
    kind: "main",
    title: "Italian Game",
    subtitle: "Giuoco Piano — สายหลัก",
    icon: "🇮🇹",
    eco: "C50",
    description: "Italian Game — ชี้ f7 และผลัก d4 ท้าทายศูนย์กลาง",
    middlegamePlan: "Italian: หลัง O-O มุ่ง Re1/Bb3 กดดัน f7, ควบคุมคอลัมน์เปิด",
    pairs: [
      ["e2", "e4", "e7", "e5"], ["g1", "f3", "b8", "c6"], ["f1", "c4", "f8", "c5"],
      ["c2", "c3", "g8", "f6"], ["d2", "d4", "e5", "d4"], ["c3", "d4", "c5", "b4"],
      ["c1", "d2", "b4", "d2"], ["b1", "d2", "d7", "d5"], ["e4", "d5", "f6", "d5"],
      ["e1", "g1", "e8", "g8"], ["f1", "e1", "f8", "e8"], ["c4", "b3", "c6", "e7"],
    ],
    texts: [
      t("1. e4", "เปิด e4", "1...e5"), t("2. Nf3", "พัฒนาม้า", "2...Nc6"),
      t("3. Bc4", "Italian! ชี้ f7", "3...Bc5"), t("4. c3", "c3 เตรียม d4", "4...Nf6"),
      t("5. d4", "ผลัก d4!", "5...exd4"), t("6. cxd4", "กินเบี้ยคืน", "6...Bb4+"),
      t("7. Bd2", "ตอบรุก", "7...Bxd2+"), t("8. Nbxd2", "กินบิชอป", "8...d5"),
      t("9. exd5", "กิน d5", "9...Nxd5"), t("10. O-O", "Castling", "10...O-O"),
      t("11. Re1", "เรือ e1 กดดัน e5", "11...Re8"), t("12. Bb3", "Bb3 ชี้ f7 — แผนกลางเกม", "12...Be7"),
    ],
  },
  {
    id: "italian-two-knights",
    kind: "variation",
    title: "Italian Game",
    subtitle: "สายรอง: Two Knights Defense",
    icon: "🇮🇹",
    eco: "C57",
    description: "ถ้าคู่เล่น 3...Nf6 แทน Bc5 — Two Knights",
    middlegamePlan: "Two Knights: Ng5 คุกคาม f7 — เป้าหมาย d4 เร็วหรือ Fried Liver",
    pairs: [
      ["e2", "e4", "e7", "e5"], ["g1", "f3", "b8", "c6"], ["f1", "c4", "g8", "f6"],
      ["f3", "g5", "d7", "d5"], ["e4", "d5", "c6", "a5"], ["c4", "b5", "c7", "c6"],
      ["d5", "c6", "b7", "c6"], ["b5", "d3", "c8", "d7"],
    ],
    texts: [
      t("1. e4", "เปิด e4", "1...e5"), t("2. Nf3", "พัฒนาม้า", "2...Nc6"),
      t("3. Bc4", "Italian", "3...Nf6"), t("4. Ng5", "Ng5! Two Knights", "4...d5"),
      t("5. exd5", "กิน d5", "5...Na5"), t("6. Bb5+", "รุกบวก", "6...c6"),
      t("7. dxc6", "กิน c6", "7...bxc6"), t("8. Bd3", "พัฒนาบิชอป — ได้เปรียบพัฒนา", "8...Bd7"),
    ],
  },
  {
    id: "london-system",
    kind: "main",
    title: "London System",
    subtitle: "สายหลัก",
    icon: "🏰",
    eco: "D02",
    description: "London — แผนเปิดที่จำง่าย ใช้ซ้ำได้เกือบทุกเกม",
    middlegamePlan: "London: Bf4-e3-Nf3-Nbd2-c3, มุ่ง e4 ขยายศูนย์กลาง",
    pairs: [
      ["d2", "d4", "d7", "d5"], ["c1", "f4", "g8", "f6"], ["e2", "e3", "e7", "e6"],
      ["g1", "f3", "f8", "d6"], ["f4", "g3", "e8", "g8"], ["b1", "d2", "b8", "d7"],
      ["c2", "c3", "c7", "c5"], ["f1", "d3", "d8", "c7"], ["e1", "g1", "c5", "d4"],
      ["c3", "d4", "b7", "b6"], ["d1", "e2", "c8", "b7"], ["e3", "e4", "d5", "e4"],
      ["f3", "e5", "d6", "e5"], ["d3", "e4", "f6", "e4"], ["a2", "a3", "a8", "c8"],
    ],
    texts: [
      t("1. d4", "เปิด d4", "1...d5"), t("2. Bf4", "Bf4 ก่อน e3 — หัวใจ London", "2...Nf6"),
      t("3. e3", "e3 รองรับ d4", "3...e6"), t("4. Nf3", "พัฒนาม้า", "4...Bd6"),
      t("5. Bg3", "ถอย Bg3", "5...O-O"), t("6. Nbd2", "ม้าคู่", "6...Nbd7"),
      t("7. c3", "c3 รองรับ d4", "7...c5"), t("8. Bd3", "บิชอป d3", "8...Qc7"),
      t("9. O-O", "Castling", "9...cxd4"), t("10. cxd4", "กิน d4", "10...b6"),
      t("11. Qe2", "ควีน e2", "11...Bb7"), t("12. e4", "e4! ขยายศูนย์กลาง", "12...dxe4"),
      t("13. Nxe5", "กิน e5", "13...Bxe5"), t("14. Bxe4", "กิน e4", "14...Nxe4"),
      t("15. a3", "a3 — โครงสร้าง London สมบูรณ์", "15...Rc8"),
    ],
  },
  {
    id: "london-kings-indian",
    kind: "variation",
    title: "London System",
    subtitle: "สายรอง: ตอบ King's Indian",
    icon: "🏰",
    eco: "A48",
    description: "ถ้าคู่เล่น ...g6 และ ...Bg7 แทน ...e6",
    middlegamePlan: "vs KID: คู่ตี c5/e5 — เป้าหมาย e4 break หรือ c4 ขยายฝั่งควีน",
    pairs: [
      ["d2", "d4", "g8", "f6"], ["c1", "f4", "g7", "g6"], ["e2", "e3", "f8", "g7"],
      ["g1", "f3", "e8", "g8"], ["f1", "e2", "d7", "d6"], ["e1", "g1", "b8", "d7"],
      ["h2", "h3", "e7", "e5"], ["d4", "e5", "d6", "e5"], ["f4", "e5", "d7", "e5"],
      ["b1", "d2", "c8", "g4"],
    ],
    texts: [
      t("1. d4", "เปิด d4", "1...Nf6"), t("2. Bf4", "London vs Nf6", "2...g6"),
      t("3. e3", "e3", "3...Bg7"), t("4. Nf3", "พัฒนาม้า", "4...O-O"),
      t("5. Be2", "Be2", "5...d6"), t("6. O-O", "Castling", "6...Nbd7"),
      t("7. h3", "h3 ป้องกัน Bg4", "7...e5"), t("8. dxe5", "กิน e5", "8...dxe5"),
      t("9. Bxe5", "กิน e5", "9...Nxe5"), t("10. Nbd2", "ม้าคู่ — รอ ...Bg4", "10...Bg4"),
    ],
  },
  {
    id: "sicilian-defense",
    kind: "main",
    title: "Sicilian Defense",
    subtitle: "Open Sicilian — สายหลัก",
    icon: "🐉",
    eco: "B90",
    description: "Open Sicilian + English Attack setup",
    middlegamePlan: "English Attack: f3+e4 ขยายฝั่งคิง, Qd2+Bh6 โจมตีฝั่งคิงคู่",
    pairs: [
      ["e2", "e4", "c7", "c5"], ["g1", "f3", "d7", "d6"], ["d2", "d4", "c5", "d4"],
      ["f3", "d4", "g8", "f6"], ["b1", "c3", "a7", "a6"], ["c1", "e3", "e7", "e5"],
      ["d4", "b3", "c8", "e6"], ["f2", "f3", "b8", "d7"], ["d1", "d2", "g7", "g6"],
      ["f1", "e2", "f8", "g7"], ["e1", "c1", "e8", "g8"], ["g2", "g4", "b7", "b5"],
      ["h2", "h4", "a6", "a5"], ["a2", "a3", "b5", "b4"], ["h4", "h5", "g6", "g5"],
    ],
    texts: [
      t("1. e4", "เปิด e4", "1...c5"), t("2. Nf3", "Nf3 เตรียม d4", "2...d6"),
      t("3. d4", "Open Sicilian!", "3...cxd4"), t("4. Nxd4", "กินด้วยม้า", "4...Nf6"),
      t("5. Nc3", "พัฒนาม้า c3", "5...a6"), t("6. Be3", "English Attack setup", "6...e5"),
      t("7. Nb3", "ถอยม้า b3", "7...Be6"), t("8. f3", "f3 รองรับ e4", "8...Nbd7"),
      t("9. Qd2", "Qd2 เชื่อมเรือ", "9...g6"), t("10. Be2", "Be2", "10...Bg7"),
      t("11. O-O-O", "Castling ฝั่งควีน", "11...O-O"), t("12. g4", "g4! ขยายฝั่งคิง", "12...b5"),
      t("13. h4", "h4 รองรับ g5", "13...a5"), t("14. a3", "a3 รองรับ b4", "14...b4"),
      t("15. h5", "h5 กดดันฝั่งคิง", "15...g5"),
    ],
  },
  {
    id: "sicilian-najdorf",
    kind: "variation",
    title: "Sicilian Defense",
    subtitle: "สายรอง: Najdorf (5...a6)",
    icon: "🐉",
    eco: "B90",
    description: "Najdorf — สายรองที่แข็งแกร่งที่สุดของ Sicilian",
    middlegamePlan: "Najdorf: a6 รองรับ b5 — เป้าหมาย e5/f4-f5 ขยายฝั่งคิง",
    pairs: [
      ["e2", "e4", "c7", "c5"], ["g1", "f3", "d7", "d6"], ["d2", "d4", "c5", "d4"],
      ["f3", "d4", "g8", "f6"], ["b1", "c3", "a7", "a6"], ["c1", "e3", "e7", "e5"],
      ["d4", "b3", "c8", "e6"], ["f2", "f3", "f8", "e7"], ["d1", "d2", "b8", "d7"],
      ["f1", "e2", "e8", "g8"], ["e1", "c1", "d8", "c7"], ["g2", "g4", "b7", "b5"],
      ["h2", "h4", "a6", "a5"], ["a2", "a3", "b5", "b4"], ["h4", "h5", "b4", "a3"],
    ],
    texts: [
      t("1. e4", "เปิด e4", "1...c5"), t("2. Nf3", "Nf3", "2...d6"),
      t("3. d4", "Open Sicilian", "3...cxd4"), t("4. Nxd4", "กินเบี้ย", "4...Nf6"),
      t("5. Nc3", "Najdorf! รอ ...a6", "5...a6"), t("6. Be3", "English Attack", "6...e5"),
      t("7. Nb3", "ถอยม้า", "7...Be6"), t("8. f3", "f3", "8...Be7"),
      t("9. Qd2", "Qd2", "9...Nbd7"), t("10. Be2", "Be2", "10...O-O"),
      t("11. O-O-O", "Castling ฝั่งควีน", "11...Qc7"), t("12. g4", "g4! ขยายฝั่งคิง", "12...b5"),
      t("13. h4", "h4", "13...a5"), t("14. a3", "a3", "14...b4"), t("15. h5", "h5 — กดดันฝั่งคิง", "15...bxa3"),
    ],
  },
];

const built = lessons.map((lesson) => {
  const { steps, line } = buildSteps(lesson.pairs, lesson.texts);
  return {
    id: lesson.id,
    kind: lesson.kind,
    title: lesson.title,
    subtitle: lesson.subtitle,
    icon: lesson.icon,
    eco: lesson.eco,
    description: lesson.description,
    middlegamePlan: lesson.middlegamePlan,
    line,
    steps,
  };
});

const header = `export const lessons = ${JSON.stringify(built, null, 2)};

export function getLessonById(id) {
  return lessons.find((l) => l.id === id) ?? null;
}

const STORAGE_KEY = "chess-opening-lessons-progress";

export function getCompletedLessons() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markLessonComplete(lessonId) {
  const done = getCompletedLessons();
  if (!done.includes(lessonId)) {
    done.push(lessonId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }
}

export function isLessonComplete(lessonId) {
  return getCompletedLessons().includes(lessonId);
}
`;

writeFileSync(new URL("./lessons.js", import.meta.url), header);
console.log("Built", built.length, "lessons");
