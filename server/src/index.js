import express from "express";
import cors from "cors";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
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
import { registerAdminRoutes } from "./admin.js";
import { logPlayerSession, clientIpFromSocket } from "./supabase.js";
import { registerSessionLogRoute } from "./sessionLogRoute.js";
import { registerAuthRoutes, initAuth } from "./auth.js";
import { parseSessionFromCookieHeader } from "./session.js";
import { recordOnlineResult } from "./users.js";

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";
const MAX_CHAT_LENGTH = 200;
const MAX_CHAT_MESSAGES = 100;
const DISCONNECT_GRACE_MS = 120_000;

function sanitizeChatText(text) {
  if (typeof text !== "string") return "";
  return text.trim().slice(0, MAX_CHAT_LENGTH);
}

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: CLIENT_ORIGIN === "*" ? true : CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", rooms: rooms.size });
});

registerAuthRoutes(app);
registerAdminRoutes(app);
registerSessionLogRoute(app);

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
  cors: {
    origin: CLIENT_ORIGIN === "*" ? true : CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  const session = parseSessionFromCookieHeader(socket.handshake.headers.cookie);
  if (session) {
    socket.data.userId = session.userId;
    socket.data.username = session.username;
    socket.data.userRole = session.role;
  }
  next();
});

/** @type {Map<string, object>} */
const rooms = new Map();

function createRoom(timeControlKey = "none") {
  const timeControl = resolveTimeControl(timeControlKey);
  const room = {
    chess: new Chess(),
    players: { white: null, black: null },
    names: { white: null, black: null },
    playerTokens: { white: null, black: null },
    disconnectTimers: { white: null, black: null },
    timeControlKey: timeControl ? timeControlKey : "none",
    timeControl,
    clocks: timeControl
      ? { white: timeControl.initial, black: timeControl.initial }
      : { white: 0, black: 0 },
    clockRunning: false,
    lastTickAt: null,
    gameOver: null,
    chat: [],
    drawOffer: null,
    takebackOffer: null,
    rematchOffer: null,
    lastMove: null,
    userIds: { white: null, black: null },
    statsRecorded: false,
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

function colorByToken(room, token) {
  if (!token) return null;
  if (room.playerTokens.white === token) return "white";
  if (room.playerTokens.black === token) return "black";
  return null;
}

function clearDisconnectTimer(room, color) {
  if (room.disconnectTimers[color]) {
    clearTimeout(room.disconnectTimers[color]);
    room.disconnectTimers[color] = null;
  }
}

function seatOccupied(room, color) {
  return Boolean(room.players[color] || room.names[color]);
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
    pgn: chess.pgn(),
    lastMove: room.lastMove,
    drawOffer: room.drawOffer,
    takebackOffer: room.takebackOffer,
    rematchOffer: room.rematchOffer,
    players: {
      white: seatOccupied(room, "white"),
      black: seatOccupied(room, "black"),
    },
    connected: {
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
  if (room.gameOver) return;
  room.gameOver = { status, winner };
  room.clockRunning = false;
  room.lastTickAt = null;
  room.drawOffer = null;
  room.takebackOffer = null;
  if (!room.statsRecorded) {
    room.statsRecorded = true;
    void recordOnlineResult(room, status, winner);
  }
}

function syncLastMoveFromHistory(room) {
  const hist = room.chess.history({ verbose: true });
  if (hist.length === 0) {
    room.lastMove = null;
    return;
  }
  const result = hist[hist.length - 1];
  room.lastMove = {
    from: result.from,
    to: result.to,
    san: result.san,
    captured: result.captured || null,
    flags: result.flags,
  };
}

function resetGameRoom(room) {
  room.chess = new Chess();
  room.gameOver = null;
  room.clockRunning = false;
  room.lastTickAt = null;
  room.drawOffer = null;
  room.takebackOffer = null;
  room.rematchOffer = null;
  room.lastMove = null;
  room.statsRecorded = false;
  resetClocks(room);
}

function clearSeat(room, color) {
  clearDisconnectTimer(room, color);
  room.players[color] = null;
  room.names[color] = null;
  room.playerTokens[color] = null;
  if (room.userIds) room.userIds[color] = null;
}

function declareOpponentWin(room, roomId, leavingColor) {
  if (isGameFinished(room)) return;
  const winner = leavingColor === "white" ? "black" : "white";
  if (!seatOccupied(room, winner)) return;
  setGameOver(room, "opponent_left", winner);
  io.to(roomId).emit("gameOver", {
    status: "opponent_left",
    winner,
  });
  broadcastState(roomId);
}

function sessionLog(socket, event, { roomId, color, name } = {}) {
  void logPlayerSession({
    name: name || socket.data.displayName || "ไม่ระบุชื่อ",
    roomId: roomId ?? socket.data.roomId ?? null,
    color: color ?? null,
    ip: socket.data.clientIp ?? clientIpFromSocket(socket),
    event,
  });
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
  const playerName = color
    ? room.names[color] || socket.data.displayName
    : socket.data.displayName;

  socket.leave(roomId);
  socket.data.roomId = null;

  if (!color) return;

  sessionLog(socket, "leave", { roomId, color, name: playerName });

  clearDisconnectTimer(room, color);
  room.players[color] = null;
  room.names[color] = null;
  room.playerTokens[color] = null;
  if (room.userIds) room.userIds[color] = null;

  if (awardWin) {
    declareOpponentWin(room, roomId, color);
  } else {
    socket.to(roomId).emit("opponentLeft", { color });
  }

  if (!seatOccupied(room, "white") && !seatOccupied(room, "black")) {
    rooms.delete(roomId);
  } else if (!awardWin || isGameFinished(room)) {
    broadcastState(roomId);
  }
}

function handlePlayerDisconnect(socket) {
  const roomId = socket.data.roomId;
  if (!roomId) return;

  const room = rooms.get(roomId);
  if (!room) {
    socket.data.roomId = null;
    return;
  }

  const color = colorOf(room, socket.id);
  const playerName = color
    ? room.names[color] || socket.data.displayName
    : socket.data.displayName;

  socket.leave(roomId);
  socket.data.roomId = null;

  if (!color) return;

  sessionLog(socket, "disconnect", { roomId, color, name: playerName });

  if (isGameFinished(room)) {
    room.players[color] = null;
    broadcastState(roomId);
    return;
  }

  room.players[color] = null;
  broadcastState(roomId);
  socket.to(roomId).emit("opponentDisconnected", { color });

  clearDisconnectTimer(room, color);
  room.disconnectTimers[color] = setTimeout(() => {
    room.disconnectTimers[color] = null;
    if (room.players[color]) return;
    const lostColor = color;
    room.names[lostColor] = null;
    room.playerTokens[lostColor] = null;
    declareOpponentWin(room, roomId, lostColor);
    if (!seatOccupied(room, "white") && !seatOccupied(room, "black")) {
      rooms.delete(roomId);
    }
  }, DISCONNECT_GRACE_MS);
}

io.on("connection", (socket) => {
  socket.data.roomId = null;
  socket.data.clientIp = clientIpFromSocket(socket);

  socket.on(
    "joinGame",
    ({ roomId, name, timeControl, reconnectToken } = {}, ack) => {
      if (!roomId || typeof roomId !== "string") {
        ack?.({ ok: false, error: "รหัสห้องไม่ถูกต้อง" });
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
      const reclaimColor = colorByToken(room, reconnectToken);

      if (!color && reclaimColor && seatOccupied(room, reclaimColor)) {
        clearDisconnectTimer(room, reclaimColor);
        room.players[reclaimColor] = socket.id;
        color = reclaimColor;
        if (name?.trim()) room.names[reclaimColor] = name.trim();
        if (socket.data.userId) room.userIds[reclaimColor] = socket.data.userId;
      } else if (!color) {
        if (!seatOccupied(room, "white")) {
          room.players.white = socket.id;
          room.playerTokens.white = randomUUID();
          color = "white";
        } else if (!seatOccupied(room, "black")) {
          room.players.black = socket.id;
          room.playerTokens.black = randomUUID();
          color = "black";
        }
      }

      if (color) {
        const display =
          socket.data.displayName ||
          name?.trim() ||
          `ผู้เล่น${color === "white" ? "ขาว" : "ดำ"}`;
        room.names[color] = display;
        if (socket.data.userId) {
          room.userIds[color] = socket.data.userId;
        }
      }
      socket.data.displayName =
        name?.trim() || socket.data.displayName || "ไม่ระบุชื่อ";

      socket.data.roomId = roomId;
      socket.join(roomId);

      ack?.({
        ok: true,
        color: color || "spectator",
        token: color ? room.playerTokens[color] : null,
        state: buildState(room),
      });

      broadcastState(roomId);

      sessionLog(socket, "join", {
        roomId,
        color: color || "spectator",
        name:
          (color && room.names[color]) ||
          socket.data.displayName ||
          "ไม่ระบุชื่อ",
      });

      if (color && reclaimColor) {
        socket.to(roomId).emit("opponentReconnected", { color });
      } else if (color) {
        socket.to(roomId).emit("opponentJoined", { color });
      }
    }
  );

  socket.on("leaveGame", (_payload, ack) => {
    removePlayerFromRoom(socket, { awardWin: true });
    ack?.({ ok: true });
  });

  socket.on("move", ({ from, to, promotion } = {}, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    if (isGameFinished(room)) {
      ack?.({ ok: false, error: "เกมจบแล้ว" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "คุณเป็นผู้ชม" });
      return;
    }

    const turnColor = room.chess.turn() === "w" ? "white" : "black";
    if (color !== turnColor) {
      ack?.({ ok: false, error: "ยังไม่ถึงตาคุณ" });
      return;
    }

    if (room.timeControl && seatOccupied(room, "white") && seatOccupied(room, "black")) {
      if (!room.clockRunning) {
        startClockIfNeeded(room);
      } else {
        const { timedOut } = tickClock(room);
        if (timedOut) {
          const winner = timedOut === "white" ? "black" : "white";
          setGameOver(room, "timeout", winner);
          ack?.({ ok: false, error: "หมดเวลา" });
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
      ack?.({ ok: false, error: "เดินหมากไม่ได้" });
      return;
    }

    room.lastMove = {
      from: result.from,
      to: result.to,
      san: result.san,
      captured: result.captured || null,
      flags: result.flags,
    };
    room.drawOffer = null;
    room.takebackOffer = null;
    applyIncrement(room, color);

    const derived = deriveChessStatus(room.chess);
    if (
      derived.status !== "playing" &&
      derived.status !== "check" &&
      !isGameFinished(room)
    ) {
      setGameOver(room, derived.status, derived.winner);
      io.to(roomId).emit("gameOver", {
        status: derived.status,
        winner: derived.winner,
      });
    }

    ack?.({ ok: true });
    broadcastState(roomId);
  });

  socket.on("resign", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "คุณเป็นผู้ชม" });
      return;
    }

    if (isGameFinished(room)) {
      ack?.({ ok: false, error: "เกมจบแล้ว" });
      return;
    }

    const winner = color === "white" ? "black" : "white";
    setGameOver(room, "resign", winner);
    ack?.({ ok: true });
    io.to(roomId).emit("gameOver", { status: "resign", winner });
    broadcastState(roomId);
  });

  socket.on("offerDraw", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "คุณเป็นผู้ชม" });
      return;
    }

    if (isGameFinished(room)) {
      ack?.({ ok: false, error: "เกมจบแล้ว" });
      return;
    }

    room.drawOffer = color;
    ack?.({ ok: true });
    broadcastState(roomId);
  });

  socket.on("acceptDraw", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "คุณเป็นผู้ชม" });
      return;
    }

    if (isGameFinished(room)) {
      ack?.({ ok: false, error: "เกมจบแล้ว" });
      return;
    }

    if (!room.drawOffer || room.drawOffer === color) {
      ack?.({ ok: false, error: "ไม่มีข้อเสนอเสมอ" });
      return;
    }

    setGameOver(room, "draw_agreed", null);
    ack?.({ ok: true });
    io.to(roomId).emit("gameOver", { status: "draw_agreed", winner: null });
    broadcastState(roomId);
  });

  socket.on("declineDraw", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "คุณเป็นผู้ชม" });
      return;
    }

    if (room.drawOffer && room.drawOffer !== color) {
      room.drawOffer = null;
      broadcastState(roomId);
    }

    ack?.({ ok: true });
  });

  socket.on("requestTakeback", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "คุณเป็นผู้ชม" });
      return;
    }

    if (isGameFinished(room)) {
      ack?.({ ok: false, error: "เกมจบแล้ว" });
      return;
    }

    if (room.chess.history().length === 0) {
      ack?.({ ok: false, error: "ยังไม่มีตาที่ถอยได้" });
      return;
    }

    room.takebackOffer = color;
    ack?.({ ok: true });
    broadcastState(roomId);
  });

  socket.on("acceptTakeback", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "คุณเป็นผู้ชม" });
      return;
    }

    if (isGameFinished(room)) {
      ack?.({ ok: false, error: "เกมจบแล้ว" });
      return;
    }

    if (!room.takebackOffer || room.takebackOffer === color) {
      ack?.({ ok: false, error: "ไม่มีคำขอถอยตา" });
      return;
    }

    if (room.chess.history().length === 0) {
      ack?.({ ok: false, error: "ยังไม่มีตาที่ถอยได้" });
      return;
    }

    room.chess.undo();
    room.takebackOffer = null;
    room.drawOffer = null;
    syncLastMoveFromHistory(room);
    ack?.({ ok: true });
    broadcastState(roomId);
  });

  socket.on("declineTakeback", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "คุณเป็นผู้ชม" });
      return;
    }

    if (room.takebackOffer && room.takebackOffer !== color) {
      room.takebackOffer = null;
      broadcastState(roomId);
    }

    ack?.({ ok: true });
  });

  socket.on("offerRematch", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "เฉพาะผู้เล่นเท่านั้น" });
      return;
    }

    if (!isGameFinished(room)) {
      ack?.({ ok: false, error: "เกมยังไม่จบ" });
      return;
    }

    room.rematchOffer = color;
    ack?.({ ok: true });
    broadcastState(roomId);
  });

  socket.on("acceptRematch", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "เฉพาะผู้เล่นเท่านั้น" });
      return;
    }

    if (!isGameFinished(room)) {
      ack?.({ ok: false, error: "เกมยังไม่จบ" });
      return;
    }

    if (!room.rematchOffer || room.rematchOffer === color) {
      ack?.({ ok: false, error: "ไม่มีคำขอเล่นอีกครั้ง" });
      return;
    }

    resetGameRoom(room);
    ack?.({ ok: true });
    broadcastState(roomId);
    io.to(roomId).emit("rematchStarted");
  });

  socket.on("declineRematch", (_payload, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const color = colorOf(room, socket.id);
    if (!color) {
      ack?.({ ok: false, error: "เฉพาะผู้เล่นเท่านั้น" });
      return;
    }

    if (room.rematchOffer && room.rematchOffer !== color) {
      room.rematchOffer = null;
      broadcastState(roomId);
    }

    ack?.({ ok: true });
  });

  socket.on("chatMessage", ({ text } = {}, ack) => {
    const roomId = socket.data.roomId;
    if (!roomId) {
      ack?.({ ok: false, error: "ไม่ได้อยู่ในห้อง" });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      ack?.({ ok: false, error: "ไม่พบห้อง" });
      return;
    }

    const sanitized = sanitizeChatText(text);
    if (!sanitized) {
      ack?.({ ok: false, error: "ข้อความว่าง" });
      return;
    }

    const color = colorOf(room, socket.id);
    const message = {
      id: `${Date.now()}-${socket.id.slice(0, 6)}`,
      name:
        (color && room.names[color]) ||
        socket.data.displayName ||
        "ไม่ระบุชื่อ",
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
    handlePlayerDisconnect(socket);
  });
});

export { rooms, buildState, createRoom, TIME_CONTROLS };

await initAuth();

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
