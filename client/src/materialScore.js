/** Display piece values for material tally (pawn=1, rook=5, etc.). */
export const PIECE_SCORE = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};

const PIECE_LABEL = {
  p: "เบี้ย",
  n: "ม้า",
  b: "บิชอป",
  r: "เรือ",
  q: "ควีน",
};

/** Net material from captures: positive = side is ahead in exchanged pieces. */
export function materialBalance(game) {
  let white = 0;
  let black = 0;
  for (const move of game.history({ verbose: true })) {
    if (!move.captured) continue;
    const value = PIECE_SCORE[move.captured] ?? 0;
    if (move.color === "w") {
      white += value;
      black -= value;
    } else {
      black += value;
      white -= value;
    }
  }
  return { white, black };
}

export function formatMaterialScore(score) {
  if (score > 0) return `+${score}`;
  return String(score);
}

export function materialScoreTitle(score) {
  if (score > 0) return `นำหมาก ${score} คะแนน`;
  if (score < 0) return `เสียหมาก ${Math.abs(score)} คะแนน`;
  return "คะแนนหมากเท่ากัน";
}

export function pieceScoreLabel(pieceType) {
  const label = PIECE_LABEL[pieceType] || pieceType;
  const value = PIECE_SCORE[pieceType] ?? 0;
  return `${label} (${value})`;
}
