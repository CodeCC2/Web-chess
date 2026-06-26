import { Chess } from "chess.js";

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
const MATE = 1_000_000;

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

/** 4 levels — expert uses timed iterative deepening (actually strong). */
export const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
};

/** Minimum UI delay before bot moves (expert search time is separate). */
export const THINK_MS = {
  easy: 250,
  medium: 350,
  hard: 500,
  expert: 0,
};

const CONFIG = {
  medium: { depth: 2, mistake: 0.12 },
  hard: { depth: 3, mistake: 0 },
  expert: { timeMs: 3000, maxDepth: 8 },
};

let searchDeadline = 0;

function pstValue(piece, row, col) {
  const table = PST[piece.type];
  if (!table) return 0;
  return piece.color === "w" ? table[row][col] : table[7 - row][col];
}

function evaluateBoard(game, extended = false) {
  if (game.isCheckmate()) return game.turn() === "w" ? -MATE : MATE;
  if (game.isDraw() || game.isStalemate() || game.isInsufficientMaterial()) {
    return 0;
  }

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

  if (extended) {
    const mobility = game.moves().length;
    score += (game.turn() === "w" ? mobility : -mobility) * 5;
    if (game.isCheck()) {
      score += game.turn() === "w" ? -25 : 25;
    }
  }

  return score;
}

function scoreMove(m) {
  let s = 0;
  if (m.captured) s += 10 * PIECE_VALUES[m.captured] - PIECE_VALUES[m.piece];
  if (m.promotion) s += PIECE_VALUES[m.promotion];
  if (m.san.includes("#")) s += MATE;
  else if (m.san.includes("+")) s += 90;
  return s;
}

function orderedMoves(game) {
  return game
    .moves({ verbose: true })
    .sort((a, b) => scoreMove(b) - scoreMove(a));
}

function timedOut() {
  return Date.now() >= searchDeadline;
}

function search(game, depth, alpha, beta, extended) {
  if (timedOut()) return evaluateBoard(game, extended);

  if (depth === 0 || game.isGameOver()) {
    const sign = game.turn() === "w" ? 1 : -1;
    return sign * evaluateBoard(game, extended);
  }

  let best = -Infinity;
  for (const m of orderedMoves(game)) {
    if (timedOut()) break;
    game.move({ from: m.from, to: m.to, promotion: m.promotion });
    const score = -search(game, depth - 1, -beta, -alpha, extended);
    game.undo();
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

function searchAtDepth(game, depth, extended) {
  const moves = orderedMoves(game);
  let best = -Infinity;
  let bestMoves = [moves[0]];
  let alpha = -Infinity;
  const beta = Infinity;

  for (const m of moves) {
    if (timedOut()) break;
    game.move({ from: m.from, to: m.to, promotion: m.promotion });
    const score = -search(game, depth - 1, -beta, -alpha, extended);
    game.undo();
    if (score > best) {
      best = score;
      bestMoves = [m];
    } else if (score === best) {
      bestMoves.push(m);
    }
    if (best > alpha) alpha = best;
  }

  return { move: bestMoves[0], score: best, completed: !timedOut() };
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function toMove(m) {
  return { from: m.from, to: m.to, promotion: m.promotion || "q" };
}

function getFixedDepthMove(game, depth, mistake) {
  const legal = game.moves({ verbose: true });
  if (mistake > 0 && Math.random() < mistake) {
    return toMove(randomChoice(legal));
  }

  const { move } = searchAtDepth(game, depth, false);
  return toMove(move);
}

function getExpertMove(game) {
  const { timeMs, maxDepth } = CONFIG.expert;
  searchDeadline = Date.now() + timeMs;

  const moves = orderedMoves(game);
  let bestMove = moves[0];

  for (let depth = 1; depth <= maxDepth; depth++) {
    if (timedOut()) break;
    const { move, score, completed } = searchAtDepth(game, depth, true);
    if (move && completed) {
      bestMove = move;
      if (Math.abs(score) > MATE - 1000) break;
    }
  }

  return toMove(bestMove);
}

/**
 * @param {string} fen
 * @param {"easy"|"medium"|"hard"|"expert"} difficulty
 */
export function getBotMove(fen, difficulty = "medium") {
  const game = new Chess(fen);
  const legal = game.moves({ verbose: true });
  if (legal.length === 0) return null;

  if (difficulty === "easy") return toMove(randomChoice(legal));

  if (difficulty === "expert") return getExpertMove(game);

  const { depth, mistake } = CONFIG[difficulty] ?? CONFIG.hard;
  return getFixedDepthMove(game, depth, mistake);
}
