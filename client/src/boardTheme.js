const BOARD_STYLE = {
  borderRadius: "12px",
  boxShadow: "var(--shadow-board)",
};

export { BOARD_STYLE };

export function boardWidth() {
  return Math.min(480, window.innerWidth - 32);
}

export function gameOverVariantFromInfo(info, playerColor) {
  const s = info?.status;
  if (
    ["stalemate", "draw", "insufficient_material", "threefold_repetition"].includes(
      s
    )
  ) {
    return "draw";
  }
  if (s === "checkmate" && info.winner) {
    return info.winner === playerColor ? "win" : "lose";
  }
  return "neutral";
}

export function gameOverTitle(info, playerColor) {
  const s = info?.status;
  const outcome = (winner) =>
    winner === playerColor ? "คุณชนะ!" : "คุณแพ้";
  if (s === "checkmate") return `รุมฆาต — ${outcome(info.winner)}`;
  if (s === "stalemate") return "เสมอ — stalemate";
  if (s === "draw") return "เสมอ";
  if (s === "insufficient_material") return "เสมอ — หมากไม่พอรุมฆาต";
  if (s === "threefold_repetition") return "เสมอ — ตำแหน่งซ้ำ 3 ครั้ง";
  return "เกมจบ";
}
