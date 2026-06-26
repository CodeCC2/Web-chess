import { Chess } from "chess.js";

/** @param {import('chess.js').Chess} game */
export function needsPromotion(game, from, to) {
  const piece = game.get(from);
  if (!piece || piece.type !== "p") return false;
  return (
    (piece.color === "w" && to[1] === "8") ||
    (piece.color === "b" && to[1] === "1")
  );
}

/** @param {import('chess.js').Chess} game */
export function isLegalMove(game, from, to, promotion) {
  const probe = new Chess(game.fen());
  try {
    return !!probe.move({
      from,
      to,
      promotion: promotion || undefined,
    });
  } catch {
    return false;
  }
}

// chess.js needs a promotion piece to validate; use queen only for probing.
export function canReachSquare(game, from, to) {
  return isLegalMove(game, from, to, "q");
}

export const PROMOTION_PIECES = [
  { piece: "q", label: "ควีน", symbol: "♕" },
  { piece: "r", label: "เรือ", symbol: "♖" },
  { piece: "b", label: "บิชอป", symbol: "♗" },
  { piece: "n", label: "ม้า", symbol: "♘" },
];
