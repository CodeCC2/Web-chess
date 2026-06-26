/** Build react-chessboard square highlight styles for legal moves from `square`. */
export function buildMoveHighlights(game, square) {
  const moves = game.moves({ square, verbose: true });
  if (moves.length === 0) return null;

  const styles = {};
  for (const m of moves) {
    styles[m.to] = {
      background:
        "radial-gradient(circle, rgba(99,102,241,0.55) 25%, transparent 28%)",
      borderRadius: "50%",
    };
  }
  styles[square] = { background: "rgba(99,102,241,0.35)" };
  return styles;
}
