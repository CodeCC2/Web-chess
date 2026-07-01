import test from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import {
  materialBalance,
  formatMaterialScore,
  PIECE_SCORE,
} from "./materialScore.js";

test("materialBalance tracks captures with standard piece values", () => {
  const game = new Chess();
  game.move("e4");
  game.move("d5");
  game.move("exd5"); // white captures pawn (+1 white, -1 black)

  const bal = materialBalance(game);
  assert.equal(bal.white, PIECE_SCORE.p);
  assert.equal(bal.black, -PIECE_SCORE.p);
});

test("materialBalance after rook capture", () => {
  const game = new Chess("4k3/8/8/8/4r3/8/8/4R2K w - - 0 1");
  game.move("e1e4");

  const bal = materialBalance(game);
  assert.equal(bal.white, PIECE_SCORE.r);
  assert.equal(bal.black, -PIECE_SCORE.r);
});

test("formatMaterialScore", () => {
  assert.equal(formatMaterialScore(5), "+5");
  assert.equal(formatMaterialScore(-1), "-1");
  assert.equal(formatMaterialScore(0), "0");
});
