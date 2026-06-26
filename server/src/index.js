import express from "express";
import cors from "cors";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { Chess } from "chess.js";

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", rooms: rooms.size });
});

// Serve the built frontend (client/dist) when it exists, so the whole app can
// run from a single port/origin in production (e.g. `npm run build` + `npm start`).
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

/**
 * In-memory game store.
 * roomId -> {
 *   chess: Chess,
 *   players: { white: socketId|null, black: socketId|null },
 *   names: { white: string|null, black: string|null }
 * }
 */
const rooms = new Map();

function getOrCreateRoom(roomId) {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      chess: new Chess(),
      players: { white: null, black: null },
      names: { white: null, black: null },
    };
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
  let status = "playing";
  let winner = null;

  if (chess.isCheckmate()) {
    status = "checkmate";
    // The side to move is checkmated, so the other side won.
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
  };
}

function broadcastState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit("gameState", buildState(room));
}

io.on("connection", (socket) => {
  socket.data.roomId = null;

  socket.on("joinGame", ({ roomId, name } = {}, ack) => {
    if (!roomId || typeof roomId !== "string") {
      ack?.({ ok: false, error: "Invalid room id" });
      return;
    }

    const room = getOrCreateRoom(roomId);

    // Assign an available color, else spectator.
    let color = null;
    if (!room.players.white) {
      room.players.white = socket.id;
      color = "white";
    } else if (!room.players.black) {
      room.players.black = socket.id;
      color = "black";
    }

    if (color) room.names[color] = name || `Player ${color}`;

    socket.data.roomId = roomId;
    socket.join(roomId);

    ack?.({
      ok: true,
      color: color || "spectator",
      state: buildState(room),
    });

    broadcastState(roomId);
    socket.to(roomId).emit("opponentJoined", { color });
  });

  socket.on("move", ({ roomId, from, to, promotion } = {}, ack) => {
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

    const turnColor = room.chess.turn() === "w" ? "white" : "black";
    if (color !== turnColor) {
      ack?.({ ok: false, error: "Not your turn" });
      return;
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

    ack?.({ ok: true });
    broadcastState(roomId);
  });

  socket.on("resign", ({ roomId } = {}) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const color = colorOf(room, socket.id);
    if (!color) return;
    const winner = color === "white" ? "black" : "white";
    io.to(roomId).emit("gameOver", { status: "resign", winner });
  });

  socket.on("rematch", ({ roomId } = {}) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.chess = new Chess();
    broadcastState(roomId);
    io.to(roomId).emit("rematchStarted");
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    const color = colorOf(room, socket.id);
    if (color) {
      room.players[color] = null;
      room.names[color] = null;
      socket.to(roomId).emit("opponentLeft", { color });
    }

    if (!room.players.white && !room.players.black) {
      rooms.delete(roomId);
    } else {
      broadcastState(roomId);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Chess server listening on http://localhost:${PORT}`);
});
