/**
 * บทเรียนสอนเล่นหมากรุกสำหรับมือใหม่
 * แต่ละบทมี steps ที่กำหนดตำแหน่ง FEN และการเดินที่ถูกต้อง
 *
 * step fields:
 *   fen          — ตำแหน่งเริ่มต้นของขั้นตอนนี้
 *   instruction  — คำแนะนำภาษาไทย
 *   hint         — คำใบ้เพิ่มเติม (แสดงเมื่อกดปุ่ม "ใบ้")
 *   expected     — { from, to, promotion? } การเดินที่ถูกต้อง
 *   opponentMove — { from, to } หมากฝ่ายตรงข้ามเดินอัตโนมัติหลังผู้เล่นเดินถูก
 */

export const lessons = [
  {
    id: "pawn-basics",
    title: "เบี้ย (Pawn)",
    icon: "♟",
    description: "เบี้ยเดินหน้าได้ 1 หรือ 2 ช่อง (ครั้งแรก) และกินแนวทแยง",
    steps: [
      {
        fen: "k7/8/8/8/8/8/4P3/4K3 w - - 0 1",
        instruction: "เดินเบี้ยจาก e2 ไป e4 (เดิน 2 ช่องได้ในครั้งแรก)",
        hint: "คลิกที่เบี้ย e2 แล้วคลิกช่อง e4",
        expected: { from: "e2", to: "e4" },
      },
      {
        fen: "k7/8/8/3p4/4P3/8/8/4K3 w - - 0 1",
        instruction: "กินเบี้ยดำที่ d5 ด้วยการเดินแนวทแยง (e4 → d5)",
        hint: "เบี้ยกินได้เฉพาะแนวทแยง 1 ช่อง",
        expected: { from: "e4", to: "d5" },
      },
      {
        fen: "k7/8/8/8/8/8/3P4/4K3 w - - 0 1",
        instruction: "เดินเบี้ยจาก d2 ไป d3 (เดินหน้า 1 ช่อง)",
        expected: { from: "d2", to: "d3" },
      },
    ],
  },
  {
    id: "rook-basics",
    title: "เรือ (Rook)",
    icon: "♜",
    description: "เรือเดินได้เป็นเส้นตรงทั้งแนวนอนและแนวตั้ง",
    steps: [
      {
        fen: "k7/8/8/8/8/4R3/8/4K3 w - - 0 1",
        instruction: "เดินเรือจาก e3 ไป a3 (แนวนอน)",
        hint: "เรือเดินได้เป็นเส้นตรง ไม่มีหมากขวาง",
        expected: { from: "e3", to: "a3" },
      },
      {
        fen: "R6k/8/8/8/8/8/8/4K3 w - - 0 1",
        instruction: "เดินเรือจาก a8 ลงมาที่ a1 (แนวตั้ง)",
        expected: { from: "a8", to: "a1" },
      },
      {
        fen: "k7/8/8/8/8/8/8/R3K2R w - - 0 1",
        instruction: "เดินเรือจาก h1 ไป h8",
        expected: { from: "h1", to: "h8" },
      },
    ],
  },
  {
    id: "bishop-basics",
    title: "บิชอป (Bishop)",
    icon: "♝",
    description: "บิชอปเดินได้เฉพาะแนวทแยง",
    steps: [
      {
        fen: "k7/8/8/8/8/4B3/8/4K3 w - - 0 1",
        instruction: "เดินบิชอปจาก e3 ไป b6 (แนวทแยง)",
        hint: "บิชอปเดินได้เฉพาะแนวทแยง สีช่องไม่เปลี่ยน",
        expected: { from: "e3", to: "b6" },
      },
      {
        fen: "k7/8/1B6/8/8/8/8/4K3 w - - 0 1",
        instruction: "เดินบิชอปจาก b6 ไป g1 (แนวทแยง)",
        expected: { from: "b6", to: "g1" },
      },
      {
        fen: "k7/8/8/4p3/3B4/8/8/4K3 w - - 0 1",
        instruction: "กินเบี้ยดำที่ e5 ด้วยบิชอป",
        expected: { from: "d4", to: "e5" },
      },
    ],
  },
  {
    id: "knight-basics",
    title: "ม้า (Knight)",
    icon: "♞",
    description: "ม้าเดินเป็นรูปตัว L (2+1 ช่อง) และกระโดดข้ามหมากได้",
    steps: [
      {
        fen: "k7/8/8/8/8/4N3/8/4K3 w - - 0 1",
        instruction: "เดินม้าจาก e3 ไป f5 (รูปตัว L)",
        hint: "ม้าเดิน 2 ช่องแล้วเลี้ยว 1 ช่อง — กระโดดข้ามหมากอื่นได้",
        expected: { from: "e3", to: "f5" },
      },
      {
        fen: "k7/8/8/5N2/8/8/8/4K3 w - - 0 1",
        instruction: "เดินม้าจาก f5 ไป d6",
        expected: { from: "f5", to: "d6" },
      },
      {
        fen: "k7/3p4/1N6/8/8/8/8/4K3 w - - 0 1",
        instruction: "กินเบี้ยดำที่ d7 ด้วยม้า",
        expected: { from: "b6", to: "d7" },
      },
    ],
  },
  {
    id: "queen-basics",
    title: "ควีน (Queen)",
    icon: "♛",
    description: "ควีนเดินได้ทั้งแนวตรงและแนวทแยง — หมากที่ทรงพลังที่สุด",
    steps: [
      {
        fen: "k7/8/8/8/8/4Q3/8/4K3 w - - 0 1",
        instruction: "เดินควีนจาก e3 ไป e7 (แนวตั้ง)",
        hint: "ควีน = เรือ + บิชอป รวมกัน",
        expected: { from: "e3", to: "e7" },
      },
      {
        fen: "k7/4Q3/8/8/8/8/8/4K3 w - - 0 1",
        instruction: "เดินควีนจาก e7 ไป a3 (แนวทแยง)",
        expected: { from: "e7", to: "a3" },
      },
      {
        fen: "k7/8/8/8/8/8/8/Q3K3 w - - 0 1",
        instruction: "เดินควีนจาก a1 ไป a8 (แนวตั้ง)",
        expected: { from: "a1", to: "a8" },
      },
    ],
  },
  {
    id: "king-basics",
    title: "คิง (King)",
    icon: "♚",
    description: "คิงเดินได้ทุกทิศทางทีละ 1 ช่อง",
    steps: [
      {
        fen: "k7/8/8/8/8/8/8/4K3 w - - 0 1",
        instruction: "เดินคิงจาก e1 ไป e2 (หน้า 1 ช่อง)",
        hint: "คิงเดินได้ทุกทิศทาง แต่ทีละ 1 ช่องเท่านั้น",
        expected: { from: "e1", to: "e2" },
      },
      {
        fen: "k7/8/8/8/8/8/4K3/8 w - - 0 1",
        instruction: "เดินคิงจาก e2 ไป f3 (แนวทแยง)",
        expected: { from: "e2", to: "f3" },
      },
      {
        fen: "k7/8/8/8/8/5K2/8/8 w - - 0 1",
        instruction: "เดินคิงจาก f3 ไป e4",
        expected: { from: "f3", to: "e4" },
      },
    ],
  },
  {
    id: "check-basics",
    title: "รุก (Check)",
    icon: "⚠",
    description: "รุกคือการโจมตีคิงฝ่ายตรงข้าม — ต้องหลบหรือป้องกัน",
    steps: [
      {
        fen: "4k3/8/8/8/8/8/8/4R2K w - - 0 1",
        instruction: "เดินเรือจาก e1 ไป e8 เพื่อรุกคิงดำ!",
        hint: "เมื่อคิงถูกโจมตี = รุก (Check) ฝ่ายนั้นต้องหลบรุก",
        expected: { from: "e1", to: "e8" },
      },
      {
        fen: "4k2r/8/8/8/8/8/8/5RK1 w - - 0 1",
        instruction: "เดินเรือจาก f1 ไป f8 เพื่อรุกคิงอีกครั้ง",
        expected: { from: "f1", to: "f8" },
      },
    ],
  },
  {
    id: "checkmate-basics",
    title: "รุกฆาต (Checkmate)",
    icon: "🏆",
    description: "รุกฆาตคือรุกที่หลบไม่ได้ — ชนะเกม!",
    steps: [
      {
        fen: "6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1",
        instruction: "เดินเรือจาก e1 ไป e8 — รุกฆาตคิงดำ!",
        hint: "คิงดำหลบไม่ได้ เพราะเบี้ยบังทาง — นี่คือรุกฆาต!",
        expected: { from: "e1", to: "e8" },
      },
      {
        fen: "7k/6Q1/8/8/8/8/8/7K w - - 0 1",
        instruction: "เดินควีนจาก g7 ไป g8 — รุกฆาต!",
        expected: { from: "g7", to: "g8" },
      },
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        instruction: "เปิดเกมด้วย e4 — การเดินที่นิยมสำหรับมือใหม่",
        hint: "e4 เป็นการเปิดที่ดี เพราะควบคุมศูนย์กลางกระดาน",
        expected: { from: "e2", to: "e4" },
        opponentMove: { from: "e7", to: "e5" },
      },
      {
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
        instruction: "ตอบด้วย Nf3 — พัฒนาม้าออกมา",
        expected: { from: "g1", to: "f3" },
      },
    ],
  },
];

export function getLessonById(id) {
  return lessons.find((l) => l.id === id) ?? null;
}

const STORAGE_KEY = "chess-tutorial-progress";

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
