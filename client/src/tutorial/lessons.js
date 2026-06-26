/**
 * บทเรียนเปิดเกมหมากรุก — สอนแนวทางเปิดยอดนิยมทีละตา
 *
 * step fields:
 *   fen           — ตำแหน่งก่อนผู้เล่นเดิน
 *   san           — สัญลักษณ์การเดิน (แสดงใน UI)
 *   instruction   — คำอธิบายภาษาไทย
 *   hint          — คำใบ้เพิ่มเติม
 *   expected      — { from, to, promotion? }
 *   opponentMove  — { from, to } คู่ต่อสู้ตอบอัตโนมัติ
 *   opponentSan   — สัญลักษณ์การเดินของคู่ต่อสู้ (แสดงหลังเดิน)
 */

export const lessons = [
  {
    id: "ruy-lopez",
    title: "Ruy Lopez",
    subtitle: "Spanish Opening",
    icon: "🇪🇸",
    eco: "C60",
    line: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O",
    description:
      "เปิดสเปน (Ruy Lopez) — กดดันม้าคู่ต่อสู้อย่างต่อเนื่อง ควบคุมศูนย์กลาง และเตรียมรุกคิงอย่างปลอดภัย",
    steps: [
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        san: "1. e4",
        instruction:
          "เปิดด้วย e4 — ครองศูนย์กลางและเปิดทางให้บิชอปกับควีน",
        hint: "e4 เป็นการเปิด King's Pawn ที่นิยมที่สุด",
        expected: { from: "e2", to: "e4" },
        opponentMove: { from: "e7", to: "e5" },
        opponentSan: "1...e5",
      },
      {
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
        san: "2. Nf3",
        instruction:
          "พัฒนาม้าไป f3 — โจมตีเบี้ย e5 และเตรียม castling",
        hint: "อย่าเดินเบี้ยซ้ำก่อนพัฒนาหมากหลัก",
        expected: { from: "g1", to: "f3" },
        opponentMove: { from: "b8", to: "c6" },
        opponentSan: "2...Nc6",
      },
      {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        san: "3. Bb5",
        instruction:
          "นี่คือ Ruy Lopez! บิชอปไป b5 กดดันม้า c6 ที่ปกป้อง e5",
        hint: "หากม้าถูกไล่ คู่ต่อสู้อาจเสียจังหวะในการพัฒนาหมาก",
        expected: { from: "f1", to: "b5" },
        opponentMove: { from: "a7", to: "a6" },
        opponentSan: "3...a6",
      },
      {
        fen: "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
        san: "4. Ba4",
        instruction:
          "ถอยบิชอปมา a4 (Morphy Defense) — รักษาความกดดันบนม้า c6",
        hint: "อย่ารีบกินม้า c6 ทันที เพราะคู่ต่อสู้อาจได้คู่บิชอป",
        expected: { from: "b5", to: "a4" },
        opponentMove: { from: "g8", to: "f6" },
        opponentSan: "4...Nf6",
      },
      {
        fen: "r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 5",
        san: "5. O-O",
        instruction:
          "Castling สั้น — นำคิงไปที่ปลอดภัยและเชื่อมเรือเข้าเกม",
        hint: "คลิกคิง e1 แล้วคลิก g1 เพื่อ castling",
        expected: { from: "e1", to: "g1" },
        opponentMove: { from: "f8", to: "e7" },
        opponentSan: "5...Be7",
      },
    ],
  },
  {
    id: "queens-gambit-declined",
    title: "Queen's Gambit",
    subtitle: "Declined (QGD)",
    icon: "♕",
    eco: "D37",
    line: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3",
    description:
      "Queen's Gambit Declined — ต่อสู้เพื่อควบคุมศูนย์กลางด้วยเบี้ย d และ c พร้อมพัฒนาหมากอย่างมั่นคง",
    steps: [
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        san: "1. d4",
        instruction:
          "เปิดด้วย d4 — ครองศูนย์กลางและเตรียมพัฒนาบิชอปคู่",
        hint: "d4 เป็น Queen's Pawn opening ที่นิยมมาก",
        expected: { from: "d2", to: "d4" },
        opponentMove: { from: "d7", to: "d5" },
        opponentSan: "1...d5",
      },
      {
        fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        san: "2. c4",
        instruction:
          "Queen's Gambit! เสนอเบี้ย c เพื่อแย่งควบคุมศูนย์กลาง",
        hint: "ไม่จำเป็นต้องกินเบี้ยทันที — เป้าหมายคือพื้นที่กลางกระดาน",
        expected: { from: "c2", to: "c4" },
        opponentMove: { from: "e7", to: "e6" },
        opponentSan: "2...e6",
      },
      {
        fen: "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        san: "3. Nc3",
        instruction:
          "พัฒนาม้า c3 — รองรับเบี้ย d4 และเตรียม e4 ในอนาคต",
        expected: { from: "b1", to: "c3" },
        opponentMove: { from: "g8", to: "f6" },
        opponentSan: "3...Nf6",
      },
      {
        fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
        san: "4. Bg5",
        instruction:
          "บิชอปไป g5 กดดันม้า f6 — ลดศักยภาพการพัฒนาของคู่ต่อสู้",
        hint: "การไล่ม้า f6 ทำให้คู่ต่อสู่เสียจังหวะในการ castling",
        expected: { from: "c1", to: "g5" },
        opponentMove: { from: "f8", to: "e7" },
        opponentSan: "4...Be7",
      },
      {
        fen: "rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq - 4 5",
        san: "5. e3",
        instruction:
          "e3 สร้างฐานมั่นคง — รองรับเบี้ย d4 และเตรียมพัฒนาบิชอปคู่",
        hint: "แนวนี้มุ่งพัฒนาหมากก่อนโจมตี",
        expected: { from: "e2", to: "e3" },
        opponentMove: { from: "e8", to: "g8" },
        opponentSan: "5...O-O",
      },
    ],
  },
  {
    id: "queens-gambit-accepted",
    title: "Queen's Gambit",
    subtitle: "Accepted (QGA)",
    icon: "♛",
    eco: "D20",
    line: "1.d4 d5 2.c4 dxc4 3.e4 Nf6 4.Bxc4 e6 5.Nf3",
    description:
      "Queen's Gambit Accepted — ตอบรับเบี้ย c แล้วรีบพัฒนาหมากให้เร็วกว่า เพื่อแย่งคืนพื้นที่กลาง",
    steps: [
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        san: "1. d4",
        instruction: "เปิดด้วย d4 — ควบคุมช่อง e5 และ c5",
        expected: { from: "d2", to: "d4" },
        opponentMove: { from: "d7", to: "d5" },
        opponentSan: "1...d5",
      },
      {
        fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        san: "2. c4",
        instruction: "เสนอ Queen's Gambit — ท้าให้คู่ต่อสู่ตัดสินใจ",
        expected: { from: "c2", to: "c4" },
        opponentMove: { from: "d5", to: "c4" },
        opponentSan: "2...dxc4",
      },
      {
        fen: "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        san: "3. e4",
        instruction:
          "e4! สร้างหมากเบี้ยคู่กลางที่แข็งแกร่ง — เป้าหมายคือพัฒนาหมากเร็วกว่า",
        hint: "อย่ารีบกินเบี้ย c4 ทันที ให้พัฒนาหมากก่อน",
        expected: { from: "e2", to: "e4" },
        opponentMove: { from: "g8", to: "f6" },
        opponentSan: "3...Nf6",
      },
      {
        fen: "rnbqkb1r/ppp1pppp/5n2/8/2pPP3/8/PP3PPP/RNBQKBNR w KQkq - 1 4",
        san: "4. Bxc4",
        instruction:
          "กินเบี้ยคืน c4 — พัฒนาบิชอปพร้อมกู้พื้นที่กลาง",
        expected: { from: "f1", to: "c4" },
        opponentMove: { from: "e7", to: "e6" },
        opponentSan: "4...e6",
      },
      {
        fen: "rnbqkb1r/ppp2ppp/4pn2/8/2BPP3/8/PP3PPP/RNBQK1NR w KQkq - 0 5",
        san: "5. Nf3",
        instruction:
          "พัฒนาม้า f3 — เตรียม castling และรองรับศูนย์กลาง",
        expected: { from: "g1", to: "f3" },
        opponentMove: { from: "f8", to: "b4" },
        opponentSan: "5...Bb4+",
      },
    ],
  },
  {
    id: "italian-game",
    title: "Italian Game",
    subtitle: "Giuoco Piano",
    icon: "🇮🇹",
    eco: "C50",
    line: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4",
    description:
      "Italian Game (Giuoco Piano) — พัฒนาบิชอปเร็ว ชี้คิง f7 และเตรียมผลักเบี้ยกลาง d4",
    steps: [
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        san: "1. e4",
        instruction: "เปิด King's Pawn — ครองศูนย์กลาง",
        expected: { from: "e2", to: "e4" },
        opponentMove: { from: "e7", to: "e5" },
        opponentSan: "1...e5",
      },
      {
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
        san: "2. Nf3",
        instruction: "พัฒนาม้าและโจมตีเบี้ย e5",
        expected: { from: "g1", to: "f3" },
        opponentMove: { from: "b8", to: "c6" },
        opponentSan: "2...Nc6",
      },
      {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        san: "3. Bc4",
        instruction:
          "Italian Game! บิชอป c4 ชี้ f7 (จุดอ่อนของคิง) — แนวโจมตีคลาสสิก",
        hint: "Bc4 ต่างจาก Bb5 ของ Ruy Lopez ที่กดดันม้า c6",
        expected: { from: "f1", to: "c4" },
        opponentMove: { from: "f8", to: "c5" },
        opponentSan: "3...Bc5",
      },
      {
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        san: "4. c3",
        instruction:
          "c3 เตรียมผลัก d4 — แผน Giuoco Piano คลาสสิก",
        hint: "d4 จะท้าทายศูนย์กลางของคู่ต่อสู้",
        expected: { from: "c2", to: "c3" },
        opponentMove: { from: "g8", to: "f6" },
        opponentSan: "4...Nf6",
      },
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5",
        san: "5. d4",
        instruction:
          "ผลัก d4! เปิดศูนย์กลางและท้าทายเบี้ย e5",
        hint: "หากคู่ต่อสู่กิน d4 จะเปิดทางให้คุณพัฒนาหมากได้ดี",
        expected: { from: "d2", to: "d4" },
        opponentMove: { from: "e5", to: "d4" },
        opponentSan: "5...exd4",
      },
    ],
  },
  {
    id: "london-system",
    title: "London System",
    subtitle: "Solid Setup",
    icon: "🏰",
    eco: "D02",
    line: "1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 Bd6 5.Bg3",
    description:
      "London System — แผนเปิดที่เรียนรู้ง่าย ใช้รูปแบบเดิมได้เกือบทุกเกม ไม่ต้องจำทฤษฎีเยอะ",
    steps: [
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        san: "1. d4",
        instruction: "เปิด d4 — จุดเริ่มต้นของ London System",
        expected: { from: "d2", to: "d4" },
        opponentMove: { from: "d7", to: "d5" },
        opponentSan: "1...d5",
      },
      {
        fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        san: "2. Bf4",
        instruction:
          "Bf4 ก่อนพัฒนาม้า e3 — หัวใจของ London! บิชอปออกมาก่อนเบี้ย e3 บัง",
        hint: "London มักเล่น Bf4 ก่อน e3 เสมอ",
        expected: { from: "c1", to: "f4" },
        opponentMove: { from: "g8", to: "f6" },
        opponentSan: "2...Nf6",
      },
      {
        fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 2 3",
        san: "3. e3",
        instruction:
          "e3 รองรับเบี้ย d4 และเตรียมพัฒนาม้า f3 กับบิชอป d3",
        expected: { from: "e2", to: "e3" },
        opponentMove: { from: "e7", to: "e6" },
        opponentSan: "3...e6",
      },
      {
        fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 0 4",
        san: "4. Nf3",
        instruction: "พัฒนาม้า f3 — เตรียม castling และควบคุม e5",
        expected: { from: "g1", to: "f3" },
        opponentMove: { from: "f8", to: "d6" },
        opponentSan: "4...Bd6",
      },
      {
        fen: "rnbqk2r/ppp2ppp/3bpn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 2 5",
        san: "5. Bg3",
        instruction:
          "ถอยบิชอปมา g3 — รักษาบิชอปคมไว้และหลีกเลี่ยงการแลกหมาก",
        hint: "London มัก castling แล้วเชื่อมเรือตามมา",
        expected: { from: "f4", to: "g3" },
        opponentMove: { from: "e8", to: "g8" },
        opponentSan: "5...O-O",
      },
    ],
  },
  {
    id: "sicilian-defense",
    title: "Sicilian Defense",
    subtitle: "Open Sicilian",
    icon: "🐉",
    eco: "B50",
    line: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3",
    description:
      "Sicilian Defense (ฝั่งขาว) — วิธีตอบ 1...c5 ที่นิยมที่สุด เปิดศูนย์กลางและสู้เพื่อควบคุมกระดาน",
    steps: [
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        san: "1. e4",
        instruction: "เปิด e4 ตามปกติ",
        expected: { from: "e2", to: "e4" },
        opponentMove: { from: "c7", to: "c5" },
        opponentSan: "1...c5",
      },
      {
        fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
        san: "2. Nf3",
        instruction:
          "Nf3 เตรียมผลัก d4 — แผน Open Sicilian มาตรฐาน",
        hint: "Sicilian คือการตอบ 1...c5 ที่คู่ต่อสู่เล่นมากที่สุด",
        expected: { from: "g1", to: "f3" },
        opponentMove: { from: "d7", to: "d6" },
        opponentSan: "2...d6",
      },
      {
        fen: "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        san: "3. d4",
        instruction:
          "ผลัก d4! เปิดศูนย์กลาง — หัวใจของ Open Sicilian",
        expected: { from: "d2", to: "d4" },
        opponentMove: { from: "c5", to: "d4" },
        opponentSan: "3...cxd4",
      },
      {
        fen: "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
        san: "4. Nxd4",
        instruction:
          "กินเบี้ยคืนด้วยม้า — ม้าอยู่ศูนย์กลางที่แข็งแกร่ง",
        hint: "ม้า d4 ควบคุมช่องสำคัญหลายช่อง",
        expected: { from: "f3", to: "d4" },
        opponentMove: { from: "g8", to: "f6" },
        opponentSan: "4...Nf6",
      },
      {
        fen: "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5",
        san: "5. Nc3",
        instruction:
          "พัฒนาม้า c3 — ปกป้อง e4 และเตรียม castling",
        hint: "แนว Scheveningen / Najdorf มักเริ่มจากตรงนี้",
        expected: { from: "b1", to: "c3" },
        opponentMove: { from: "a7", to: "a6" },
        opponentSan: "5...a6",
      },
    ],
  },
];

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
