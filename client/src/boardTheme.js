import { useEffect, useState } from "react";

const BOARD_STYLE = {
  borderRadius: "12px",
  boxShadow: "var(--shadow-board)",
};

export { BOARD_STYLE };

/** iPad / tablet portrait only — not phone, not landscape */
export function isTabletPortrait() {
  if (typeof window === "undefined") return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return w >= 768 && w <= 1100 && h > w;
}

export function computeBoardWidth() {
  const w = window.innerWidth;
  if (isTabletPortrait()) {
    return Math.min(w - 32, 720);
  }
  return Math.min(480, w - 32);
}

/** @deprecated prefer useBoardWidth in React components */
export function boardWidth() {
  return computeBoardWidth();
}

export function useBoardWidth() {
  const [width, setWidth] = useState(() => computeBoardWidth());

  useEffect(() => {
    const update = () => setWidth(computeBoardWidth());
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return width;
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
