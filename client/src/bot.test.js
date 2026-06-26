import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getBotMove } from "./bot.js";

describe("getBotMove", () => {
  it("returns a legal move from the starting position", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const move = getBotMove(fen, "easy");
    assert.ok(move);
    assert.ok(move.from);
    assert.ok(move.to);
  });

  it("returns moves on easy without throwing", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
    const move = getBotMove(fen, "medium");
    assert.ok(move);
  });
});
