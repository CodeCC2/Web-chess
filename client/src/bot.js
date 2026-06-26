import { Chess } from "chess.js";

// Material values (centipawns).
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
const MATE = 1000000;

// Piece-square tables, white's perspective, row 0 = rank 8 (matches Chess.board()).
const PST = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

function pstValue(piece, row, col) {
  const table = PST[piece.type];
  if (!table) return 0;
  // White reads the table directly; Black reads the vertically mirrored row.
  return piece.color === "w" ? table[row][col] : table[7 - row][col];
}

// Static evaluation from White's perspective (positive = White is better).
function evaluateBoard(game) {
  if (game.isCheckmate()) return game.turn() === "w" ? -MATE : MATE;
  if (game.isDraw() || game.isStalemate() || game.isInsufficientMaterial())
    return 0;

  let score = 0;
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type] + pstValue(piece, r, c);
      score += piece.color === "w" ? value : -value;
    }
  }
  return score;
}

function scoreMove(m, strong = false) {
  let s = 0;
  if (m.captured) s += 10 * PIECE_VALUES[m.captured] - PIECE_VALUES[m.piece];
  if (m.promotion) s += PIECE_VALUES[m.promotion];
  if (strong) {
    if (m.san.includes("#")) s += MATE;
    else if (m.san.includes("+")) s += 80;
  }
  return s;
}

function orderedMoves(game, strong = false) {
  return game
    .moves({ verbose: true })
    .sort((a, b) => scoreMove(b, strong) - scoreMove(a, strong));
}

// Negamax with alpha-beta pruning. Returns score from the side-to-move's view.
function search(game, depth, alpha, beta) {
  if (depth === 0 || game.isGameOver()) {
    const sign = game.turn() === "w" ? 1 : -1;
    return sign * evaluateBoard(game);
  }
  let best = -Infinity;
  for (const m of orderedMoves(game)) {
    game.move({ from: m.from, to: m.to, promotion: m.promotion });
    const score = -search(game, depth - 1, -beta, -alpha);
    game.undo();
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const DEPTHS = {
  medium: 3,
  hard: 3,
  expert: 4,
  master: 4,
};

/** Display names for lobby and in-game UI. */
export const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
  master: "Master",
};

/** Bot "thinking" delay before moving (ms). */
export const THINK_MS = {
  easy: 300,
  medium: 400,
  hard: 700,
  expert: 1000,
  master: 1400,
};

const MISTAKE_CHANCE = { medium: 0.1, hard: 0.03 };
const STRONG_ORDER = { expert: true, master: true };

/**
 * Pick the bot's move for a position.
 * @param {string} fen current position
 * @param {"easy"|"medium"|"hard"|"expert"|"master"} difficulty
 * @returns {{from:string,to:string,promotion:string}|null}
 */
export function getBotMove(fen, difficulty = "medium") {
  const game = new Chess(fen);
  const legal = game.moves({ verbose: true });
  if (legal.length === 0) return null;

  const toMove = (m) => ({ from: m.from, to: m.to, promotion: m.promotion || "q" });

  if (difficulty === "easy") return toMove(randomChoice(legal));

  const depth = DEPTHS[difficulty] ?? 3;
  const strong = STRONG_ORDER[difficulty] ?? false;
  const ordered = orderedMoves(game, strong);
  let best = -Infinity;
  let bestMoves = [];
  let alpha = -Infinity;
  const beta = Infinity;

  for (const m of ordered) {
    game.move({ from: m.from, to: m.to, promotion: m.promotion });
    const score = -search(game, depth - 1, -beta, -alpha);
    game.undo();
    if (score > best) {
      best = score;
      bestMoves = [m];
    } else if (score === best) {
      bestMoves.push(m);
    }
    if (best > alpha) alpha = best;
  }

  const mistakeRate = MISTAKE_CHANCE[difficulty] ?? 0;
  if (mistakeRate > 0 && Math.random() < mistakeRate) {
    return toMove(randomChoice(legal));
  }

  if (difficulty === "master") return toMove(bestMoves[0]);
  return toMove(randomChoice(bestMoves));
}
