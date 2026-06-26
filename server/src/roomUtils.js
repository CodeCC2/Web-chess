/** @typedef {'white' | 'black'} PlayerColor */

export const TIME_CONTROLS = {
  none: null,
  "5+0": { initial: 5 * 60 * 1000, increment: 0, label: "5+0" },
  "3+2": { initial: 3 * 60 * 1000, increment: 2000, label: "3+2" },
};

export const FINISHED_STATUSES = new Set([
  "checkmate",
  "resign",
  "stalemate",
  "draw",
  "insufficient_material",
  "threefold_repetition",
  "opponent_left",
  "timeout",
]);

/**
 * @param {import('chess.js').Chess} chess
 */
export function deriveChessStatus(chess) {
  let status = "playing";
  let winner = null;

  if (chess.isCheckmate()) {
    status = "checkmate";
    winner = chess.turn() === "w" ? "black" : "white";
  } else if (chess.isStalemate()) {
    status = "stalemate";
  } else if (chess.isInsufficientMaterial()) {
    status = "insufficient_material";
  } else if (chess.isThreefoldRepetition()) {
    status = "threefold_repetition";
  } else if (chess.isDraw()) {
    status = "draw";
  } else if (chess.isCheck()) {
    status = "check";
  }

  return { status, winner };
}

/**
 * @param {{ chess: import('chess.js').Chess, gameOver?: { status: string, winner: PlayerColor|null }|null }} room
 */
export function isGameFinished(room) {
  if (room.gameOver) return true;
  const { status } = deriveChessStatus(room.chess);
  return FINISHED_STATUSES.has(status);
}

/**
 * @param {string|null|undefined} key
 */
export function resolveTimeControl(key) {
  if (!key || key === "none") return null;
  return TIME_CONTROLS[key] ?? null;
}

/**
 * @param {{ timeControl: ReturnType<typeof resolveTimeControl>, clocks: { white: number, black: number }, clockRunning: boolean, lastTickAt: number|null, chess: import('chess.js').Chess }} room
 * @returns {{ timedOut: PlayerColor|null, clocks: { white: number, black: number } }}
 */
export function tickClock(room) {
  if (!room.timeControl || !room.clockRunning || room.lastTickAt == null) {
    return { timedOut: null, clocks: room.clocks };
  }

  const now = Date.now();
  const elapsed = now - room.lastTickAt;
  const active =
    room.chess.turn() === "w" ? "white" : ("black");

  const next = {
    white: room.clocks.white,
    black: room.clocks.black,
  };
  next[active] = Math.max(0, next[active] - elapsed);
  room.clocks = next;
  room.lastTickAt = now;

  if (next[active] <= 0) {
    return { timedOut: active, clocks: next };
  }
  return { timedOut: null, clocks: next };
}

/**
 * Apply increment to the player who just moved.
 * @param {{ timeControl: ReturnType<typeof resolveTimeControl>, clocks: { white: number, black: number }, clockRunning: boolean, lastTickAt: number|null }} room
 * @param {PlayerColor} mover
 */
export function applyIncrement(room, mover) {
  if (!room.timeControl || !room.clockRunning) return;
  room.clocks[mover] += room.timeControl.increment;
  room.lastTickAt = Date.now();
}

/**
 * Start the clock once both players are present (first move begins timing).
 * @param {{ timeControl: ReturnType<typeof resolveTimeControl>, clocks: { white: number, black: number }, clockRunning: boolean, lastTickAt: number|null, players: { white: string|null, black: string|null } }} room
 */
export function startClockIfNeeded(room) {
  if (!room.timeControl || room.clockRunning) return false;
  if (!room.players.white || !room.players.black) return false;
  room.clockRunning = true;
  room.lastTickAt = Date.now();
  return true;
}

/**
 * @param {{ timeControl: ReturnType<typeof resolveTimeControl>, clocks: { white: number, black: number } }} room
 */
export function resetClocks(room) {
  if (!room.timeControl) {
    room.clocks = { white: 0, black: 0 };
    return;
  }
  room.clocks = {
    white: room.timeControl.initial,
    black: room.timeControl.initial,
  };
}
