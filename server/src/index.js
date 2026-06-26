import express from "express";
import cors from "cors";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { Chess } from "chess.js";
import {
  TIME_CONTROLS,
  deriveChessStatus,
  isGameFinished,
  resolveTimeControl,
  tickClock,
  applyIncrement,
  startClockIfNeeded,
  resetClocks,
} from "./roomUtils.js";

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";
const MAX_CHAT_LENGTH = 200;
const MAX_CHAT_MESSAGES = 100;

function sanitizeChatText(text) {
  if (typeof text !== "string") return "";
  return text.trim().slice(0, MAX_CHAT_LENGTH);
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", rooms: rooms.size });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
  console.log(`Serving frontend from ${clientDist}`);
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN, methods: ["GET", "POST"] },
});

/** @type {Map<string, object>} */
const rooms = new Map();

function createRoom(timeControlKey = "none") {
  const timeControl = resolveTimeControl(timeControlKey);
  const room = {
    chess: new Chess(),
    players: { white: null, black: null },
    names: { white: null, black: null },
    timeControlKey: timeControl ? timeControlKey : "none",
    timeControl,
    clocks: timeControl
      ? { white: timeControl.initial, black: timeControl.initial }
      : { white: 0, black: 0 },
    clockRunning: false,
    lastTickAt: null,
    gameOver: null,
    chat: [],
  };
  return room;
}

function getOrCreateRoom(roomId, timeControlKey) {
  let room = rooms.get(roomId);
  if (!room) {
    room = createRoom(timeControlKey);
    rooms.set(roomId, room);
  }
  return room;
}

function colorOf(room, socketId) {
  if (room.players.white === socketId) return "white";
  if (room.players.black === socketId) return "black";
  return null;
}

function buildState(room) {
  const chess = room.chess;
  const derived = deriveChessStatus(chess);
  let status = derived.status;
  let winner = derived.winner;

  if (room.gameOver) {
    status = room.gameOver.status;
    winner = room.gameOver.winner;
  }

  return {
    fen: chess.fen(),
    turn: chess.turn() === "w" ? "white" : "black",
    status,
    winner,
    history: chess.history(),
    players: {
      white: Boolean(room.players.white),
      black: Boolean(room.players.black),
    },
    names: room.names,
    timeControl: room.timeControlKey,
    clocks: { ...room.clocks },
    clockRunning: room.clockRunning,
    serverNow: Date.now(),
    chat: room.chat,
  };
}

function broadcastState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit("gameState", buildState(room));
}

function setGameOver(room, status, winner) {
  room.gameOver = { status, winner };
  room.clockRunning = false;
  room.lastTickAt = null;
}

function declareOpponentWin(room, roomId, leavingColor) {
  if (isGameFinished(room)) return;
  const winner = leavingColor === "white" ? "black" : "white";
  const opponentId = room.players[winner];
  if (!opponentId) return;
  setGameOver(room, "opponent_left", winner);
  io.to(roomId).emit("gameOver", {
    status: "opponent_left",
    winner,
  });
  broadcastState(roomId);
}

function removePlayerFromRoom(socket, { awardWin = true } = {}) {
  const roomId = socket.data.roomId;
  if (!roomId) return;

  const room = rooms.get(roomId);
  if (!room) {
    socket.data.roomId = null;
    return;
  }

  const color = colorOf(room, socket.id);
  socket.leave(roomId);
  socket.data.roomId = null;

  if (!color) return;

  room.players[color] = null;
  room.names[color] = null;

  if (awardWin) {
    declareOpponentWin(room, roomId, color);
  } else {
    socket.to(roomId).emit("opponentLeft", { color });
  }

  if (!room.players.white && !room.players.black) {
    rooms.delete(roomId);
  } else if (!awardWin || isGameFinished(room)) {
    broadcastState(roomId);
  }
}

io.on("connection", (socket) => {
  socket.data.roomId = null;

  socket.on("joinGame", ({ roomId, name, timeControl } = {}, ack) => {
    if (!roomId || typeof roomId !== "string") {
      ack?.({ ok: false, error: "Invalid room id" });
      return;
    }

    if (socket.data.roomId && socket.data.roomId !== roomId) {
      removePlayerFromRoom(socket, { awardWin: true });
    }

    const isNew = !rooms.has(roomId);
    const room = getOrCreateRoom(
      roomId,
      isNew ? timeControl || "none" : "none"
    );

    let color = colorOf(room, socket.id);
    if (!color) {
      if (!room.players.white) {
        room.players.white = socket.id;
        color = "white";
      } else if (!room.players.black) {
        room.players.black = socket.id;
        color = "black";
      }
    }

    if (color) room.names[color] = name || `Player ${color}`;
    socket.data.displayName = name?.trim() || "Anonymous";

    socket.data.roomId = roomId;
    socket.join(roomId);

    ack?.({
      ok: true,
      color: color || "spectator",
      state: buildState(room),
    });

    broadcastState(roomId);
    if (color) socket.to(roomId).emit("opponentJoined", { color });
  });

  socket.on("leaveGame", (_payload, ack) => {
    removePlayerFromRoom(socket, { awardWin: true });
    ack?.({ ok: true });
  });

  socket.on("move", ({ from, to, promotion } = {}, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "Not in a room" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "Room not found" });
      return;
    }

    if (isGameFinished(room)) {
      ack?.({ ok: false, error: "Game is over" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "You are a spectator" });
      return;
    }

    const turnColor = room.chess.turn() === "w" ? "white" : "black";
    if (color !== turnColor) {
      ack?.({ ok: false, error: "Not your turn" });
      return;
    }

    if (room.timeControl && room.players.white && room.players.black) {
      if (!room.clockRunning) {
        startClockIfNeeded(room);
      } else {
        const { timedOut } = tickClock(room);
        if (timedOut) {
          const winner = timedOut === "white" ? "black" : "white";
          setGameOver(room, "timeout", winner);
          ack?.({ ok: false, error: "Time is up" });
          io.to(roomId).emit("gameOver", { status: "timeout", winner });
          broadcastState(roomId);
          return;
        }
      }
    }

    let result;
    try {
      result = room.chess.move({ from, to, promotion: promotion || "q" });
    } catch {
      result = null;
    }

    if (!result) {
      ack?.({ ok: false, error: "Illegal move" });
      return;
    }

    applyIncrement(room, color);

    ack?.({ ok: true });
    broadcastState(roomId);
  });

  socket.on("resign", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "Not in a room" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "Room not found" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "You are a spectator" });
      return;
    }

    if (isGameFinished(room)) {
      ack?.({ ok: false, error: "Game is over" });
      return;
    }

    const winner = color === "white" ? "black" : "white";
    setGameOver(room, "resign", winner);
    ack?.({ ok: true });
    io.to(roomId).emit("gameOver", { status: "resign", winner });
    broadcastState(roomId);
  });

  socket.on("rematch", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "Not in a room" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "Room not found" });
      return;
    }

    if (!colorOf(room, socket.id)) {
      ack?.({ ok: false, error: "Only players can rematch" });
      return;
    }

    room.chess = new Chess();
    room.gameOver = null;
    room.clockRunning = false;
    room.lastTickAt = null;
    resetClocks(room);

    ack?.({ ok: true });
    broadcastState(roomId);
    io.to(roomId).emit("rematchStarted");
  });

  socket.on("chatMessage", ({ text } = {}, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "Not in a room" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "Room not found" });
      return;
    }

    const sanitized = sanitizeChatText(text);
    if (!sanitized) {
      ack?.({ ok: false, error: "Empty message" });
      return;
    }

    const color = colorOf(room, socket.id);
    const message = {
      id: `${Date.now()}-${socket.id.slice(0, 6)}`,
      name:
        (color && room.names[color]) ||
        socket.data.displayName ||
        "Anonymous",
      color: color || "spectator",
      text: sanitized,
      ts: Date.now(),
    };

    room.chat.push(message);
    if (room.chat.length > MAX_CHAT_MESSAGES) {
      room.chat.splice(0, room.chat.length - MAX_CHAT_MESSAGES);
    }

    io.to(roomId).emit("chatMessage", message);
    ack?.({ ok: true });
  });

  socket.on("disconnect", () => {
    removePlayerFromRoom(socket, { awardWin: true });
  });
});

export { rooms, buildState, createRoom, TIME_CONTROLS };

server.listen(PORT, () => {
  console.log(`Chess server listening on http://localhost:${PORT}`);
});

setInterval(() => {
  for (const [roomId, room] of rooms) {
    if (!room.clockRunning || isGameFinished(room)) continue;

    const { timedOut } = tickClock(room);
    if (timedOut) {
      const winner = timedOut === "white" ? "black" : "white";
      setGameOver(room, "timeout", winner);
      io.to(roomId).emit("gameOver", { status: "timeout", winner });
      broadcastState(roomId);
      continue;
    }

    io.to(roomId).emit("clockUpdate", {
      clocks: { ...room.clocks },
      clockRunning: room.clockRunning,
      turn: room.chess.turn() === "w" ? "white" : "black",
      serverNow: Date.now(),
    });
  }
}, 1000);
