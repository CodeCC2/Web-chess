import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  TIME_CONTROLS,
  tickClock,
  applyIncrement,
  startClockIfNeeded,
  resetClocks,
  resolveTimeControl,
} from "./roomUtils.js";

describe("resolveTimeControl", () => {
  it("returns null for none", () => {
    assert.equal(resolveTimeControl("none"), null);
    assert.equal(resolveTimeControl(null), null);
  });

  it("resolves blitz presets", () => {
    assert.equal(resolveTimeControl("3+2")?.initial, 180_000);
    assert.equal(resolveTimeControl("3+2")?.increment, 2_000);
    assert.equal(resolveTimeControl("5+0")?.increment, 0);
  });
});

describe("clock helpers", () => {
  it("starts clock when both players present", () => {
    const room = {
      timeControl: TIME_CONTROLS["3+2"],
      clocks: { white: 180_000, black: 180_000 },
      clockRunning: false,
      lastTickAt: null,
      players: { white: "a", black: "b" },
    };
    assert.equal(startClockIfNeeded(room), true);
    assert.equal(room.clockRunning, true);
    assert.ok(room.lastTickAt);
  });

  it("deducts elapsed time from active side", () => {
    const room = {
      timeControl: TIME_CONTROLS["5+0"],
      clocks: { white: 10_000, black: 10_000 },
      clockRunning: true,
      lastTickAt: Date.now() - 3_000,
      chess: { turn: () => "w" },
    };
    const { timedOut, clocks } = tickClock(room);
    assert.equal(timedOut, null);
    assert.equal(clocks.white, 7_000);
    assert.equal(clocks.black, 10_000);
  });

  it("flags timeout at zero", () => {
    const room = {
      timeControl: TIME_CONTROLS["5+0"],
      clocks: { white: 500, black: 10_000 },
      clockRunning: true,
      lastTickAt: Date.now() - 2_000,
      chess: { turn: () => "w" },
    };
    const { timedOut } = tickClock(room);
    assert.equal(timedOut, "white");
  });

  it("applies increment after move", () => {
    const room = {
      timeControl: TIME_CONTROLS["3+2"],
      clocks: { white: 60_000, black: 60_000 },
      clockRunning: true,
      lastTickAt: Date.now(),
    };
    applyIncrement(room, "white");
    assert.equal(room.clocks.white, 62_000);
  });

  it("resets clocks to initial values", () => {
    const room = {
      timeControl: TIME_CONTROLS["5+0"],
      clocks: { white: 1_000, black: 2_000 },
    };
    resetClocks(room);
    assert.equal(room.clocks.white, TIME_CONTROLS["5+0"].initial);
    assert.equal(room.clocks.black, TIME_CONTROLS["5+0"].initial);
  });
});
