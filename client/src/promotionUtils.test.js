import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { needsPromotion, isLegalMove } from "./promotionUtils.js";

describe("promotionUtils", () => {
  it("detects pawn promotion squares", () => {
    const game = new Chess("8/4P3/8/8/8/8/8/4K2k w - - 0 1");
    assert.equal(needsPromotion(game, "e7", "e8"), true);
    assert.equal(needsPromotion(game, "e1", "e2"), false);
  });

  it("validates legal moves", () => {
    const game = new Chess();
    assert.equal(isLegalMove(game, "e2", "e4"), true);
    assert.equal(isLegalMove(game, "e2", "e5"), false);
  });
});
