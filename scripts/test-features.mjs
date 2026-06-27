/**
 * Smoke test: draw offer, reconnect grace, lastMove/pgn in state.
 * Run with server up: node scripts/test-features.mjs
 */
import { io } from "socket.io-client";

const URL = process.env.SERVER_URL || "http://localhost:3001";

function connect() {
  return new Promise((resolve, reject) => {
    const s = io(URL, { transports: ["websocket"], forceNew: true });
    s.on("connect", () => resolve(s));
    s.on("connect_error", reject);
  });
}

function join(socket, roomId, extra = {}) {
  return new Promise((resolve) => {
    socket.emit("joinGame", { roomId, name: extra.name || "P", timeControl: "none", ...extra }, resolve);
  });
}

function waitForState(socket, pred, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    function handler(s) {
      if (pred(s)) {
        socket.off("gameState", handler);
        resolve(s);
      }
    }
    socket.on("gameState", handler);
    setTimeout(() => {
      socket.off("gameState", handler);
      reject(new Error("waitForState timeout"));
    }, timeoutMs);
  });
}

// --- Draw test ---
const drawRoom = `D${Date.now().toString(36).slice(-5).toUpperCase()}`;
const w1 = await connect();
const b1 = await connect();
const wj = await join(w1, drawRoom, { name: "W" });
const bj = await join(b1, drawRoom, { name: "B" });
if (!wj.ok || !bj.ok) throw new Error("draw join failed");

b1.emit("offerDraw", {}, (res) => {
  if (!res?.ok) throw new Error(`offerDraw failed: ${JSON.stringify(res)}`);
});

const stateAfterOffer = await waitForState(
  w1,
  (s) => s.drawOffer === "black"
);
if (stateAfterOffer.drawOffer !== "black") {
  throw new Error(`expected drawOffer=black, got ${stateAfterOffer.drawOffer}`);
}

const drawOver = new Promise((resolve) => w1.once("gameOver", resolve));
w1.emit("acceptDraw", {}, (res) => {
  if (!res?.ok) throw new Error(`acceptDraw failed: ${JSON.stringify(res)}`);
});
const drawResult = await drawOver;
if (drawResult.status !== "draw_agreed") {
  throw new Error(`expected draw_agreed, got ${JSON.stringify(drawResult)}`);
}
console.log("OK: draw offer/accept");

w1.close();
b1.close();

// --- Reconnect test ---
const rcRoom = `R${Date.now().toString(36).slice(-5).toUpperCase()}`;
const w2 = await connect();
const b2 = await connect();
const wj2 = await join(w2, rcRoom, { name: "W2" });
const bj2 = await join(b2, rcRoom, { name: "B2" });
if (!wj2.ok || !bj2.ok) throw new Error("reconnect join failed");

w2.emit("move", { from: "e2", to: "e4" }, (res) => {
  if (!res?.ok) throw new Error(`move failed: ${JSON.stringify(res)}`);
});

const stateAfterMove = await waitForState(
  b2,
  (s) => s.lastMove?.from === "e2"
);
if (!stateAfterMove.lastMove || stateAfterMove.lastMove.from !== "e2") {
  throw new Error(`missing lastMove: ${JSON.stringify(stateAfterMove.lastMove)}`);
}
if (!stateAfterMove.pgn?.includes("e4")) {
  throw new Error(`missing pgn: ${stateAfterMove.pgn}`);
}
console.log("OK: lastMove + pgn in state");

const token = wj2.token;
w2.disconnect();

const disconnected = await waitForState(
  b2,
  (s) => s.connected?.white === false && s.players?.white === true
);
if (disconnected.connected?.white !== false) {
  throw new Error(`expected white disconnected, got ${JSON.stringify(disconnected.connected)}`);
}
if (!disconnected.players?.white) {
  throw new Error("white seat should still be occupied during grace");
}

const w3 = await connect();
const rj = await join(w3, rcRoom, { name: "W2", reconnectToken: token });
if (!rj.ok || rj.color !== "white") {
  throw new Error(`reconnect failed: ${JSON.stringify(rj)}`);
}
console.log("OK: reconnect reclaims white seat");

w3.close();
b2.emit("leaveGame", {}, () => {});
b2.close();

console.log("All feature smoke tests passed");
