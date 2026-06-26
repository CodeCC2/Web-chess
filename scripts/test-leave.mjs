/**
 * Headless smoke test: opponent leave awards win.
 * Run with server already up: node scripts/test-leave.mjs
 */
import { io } from "socket.io-client";

const URL = process.env.SERVER_URL || "http://localhost:3001";
const roomId = `T${Date.now().toString(36).slice(-5).toUpperCase()}`;

function connect() {
  return new Promise((resolve, reject) => {
    const s = io(URL, { transports: ["websocket"], forceNew: true });
    s.on("connect", () => resolve(s));
    s.on("connect_error", reject);
  });
}

function join(socket, name) {
  return new Promise((resolve) => {
    socket.emit(
      "joinGame",
      { roomId, name, timeControl: "none" },
      (res) => resolve(res)
    );
  });
}

const white = await connect();
const black = await connect();

const wJoin = await join(white, "White");
const bJoin = await join(black, "Black");
if (!wJoin.ok || !bJoin.ok) throw new Error("join failed");

const gameOver = new Promise((resolve) => {
  white.on("gameOver", resolve);
});

black.emit("leaveGame", {}, () => {});
const result = await gameOver;

if (result.status !== "opponent_left" || result.winner !== "white") {
  throw new Error(`expected white win on leave, got ${JSON.stringify(result)}`);
}

console.log("OK: opponent leave awards win to remaining player");
white.close();
black.close();
process.exit(0);
