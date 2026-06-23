import { useEffect, useMemo, useState, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { socket } from "./socket.js";
import "./App.css";

function randomRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function App() {
  const [name, setName] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [color, setColor] = useState(null); // "white" | "black" | "spectator"
  const [state, setState] = useState(null);
  const [notice, setNotice] = useState("");
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }
    function onGameState(s) {
      setState(s);
    }
    function onOpponentJoined() {
      setNotice("Opponent joined the game.");
    }
    function onOpponentLeft() {
      setNotice("Opponent left the game.");
    }
    function onGameOver({ status, winner }) {
      setState((prev) => (prev ? { ...prev, status, winner } : prev));
    }
    function onRematchStarted() {
      setNotice("Rematch started!");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("gameState", onGameState);
    socket.on("opponentJoined", onOpponentJoined);
    socket.on("opponentLeft", onOpponentLeft);
    socket.on("gameOver", onGameOver);
    socket.on("rematchStarted", onRematchStarted);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("gameState", onGameState);
      socket.off("opponentJoined", onOpponentJoined);
      socket.off("opponentLeft", onOpponentLeft);
      socket.off("gameOver", onGameOver);
      socket.off("rematchStarted", onRematchStarted);
    };
  }, []);

  const joinGame = useCallback(
    (targetRoom) => {
      const id = (targetRoom || roomInput || randomRoomId()).toUpperCase();
      socket.emit(
        "joinGame",
        { roomId: id, name: name.trim() || "Anonymous" },
        (res) => {
          if (!res?.ok) {
            setNotice(res?.error || "Failed to join");
            return;
          }
          setRoomId(id);
          setColor(res.color);
          setState(res.state);
          setNotice(
            res.color === "spectator"
              ? "Game is full — you are spectating."
              : `You are playing as ${res.color}.`
          );
        }
      );
    },
    [name, roomInput]
  );

  const onPieceDrop = useCallback(
    (sourceSquare, targetSquare, piece) => {
      if (!state || !roomId) return false;
      const turn = state.turn;
      if (color !== turn) return false;

      const isPromotion =
        piece &&
        piece[1] === "P" &&
        (targetSquare[1] === "8" || targetSquare[1] === "1");

      const probe = new Chess(state.fen);
      let legal = null;
      try {
        legal = probe.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: isPromotion ? "q" : undefined,
        });
      } catch {
        legal = null;
      }
      if (!legal) return false;

      socket.emit("move", {
        roomId,
        from: sourceSquare,
        to: targetSquare,
        promotion: isPromotion ? "q" : undefined,
      });
      return true;
    },
    [state, roomId, color]
  );

  const gameOver = useMemo(() => {
    if (!state) return null;
    const s = state.status;
    if (s === "checkmate")
      return `Checkmate — ${state.winner} wins!`;
    if (s === "resign")
      return `Opponent resigned — ${state.winner} wins!`;
    if (s === "stalemate") return "Draw — stalemate.";
    if (s === "draw") return "Draw.";
    if (s === "insufficient_material") return "Draw — insufficient material.";
    if (s === "threefold_repetition") return "Draw — threefold repetition.";
    return null;
  }, [state]);

  if (!roomId) {
    return (
      <div className="app lobby">
        <h1>♞ Online Chess</h1>
        <p className="subtitle">Real-time multiplayer chess. Share a room code to play.</p>
        <div className="card">
          <label>
            Your name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous"
              maxLength={20}
            />
          </label>
          <label>
            Room code
            <input
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
              placeholder="e.g. AB12CD"
              maxLength={8}
            />
          </label>
          <div className="row">
            <button className="primary" onClick={() => joinGame()}>
              {roomInput ? "Join room" : "Create new game"}
            </button>
          </div>
          {notice && <p className="notice">{notice}</p>}
          <p className="status">
            Server: {connected ? "🟢 connected" : "🔴 connecting..."}
          </p>
        </div>
      </div>
    );
  }

  const turnLabel =
    state?.turn === color ? "Your move" : "Opponent's move";

  return (
    <div className="app game">
      <header className="game-header">
        <h1>♞ Online Chess</h1>
        <div className="room-badge">
          Room <strong>{roomId}</strong>
          <button
            className="link"
            onClick={() => navigator.clipboard?.writeText(roomId)}
          >
            copy
          </button>
        </div>
      </header>

      <div className="game-body">
        <div className="board-wrap">
          <Chessboard
            id="online-board"
            position={state?.fen}
            onPieceDrop={onPieceDrop}
            boardOrientation={color === "black" ? "black" : "white"}
            arePiecesDraggable={
              color !== "spectator" && !gameOver && state?.turn === color
            }
            boardWidth={Math.min(480, window.innerWidth - 32)}
            customBoardStyle={{
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            }}
          />
        </div>

        <aside className="panel">
          <div className="panel-section">
            <div className="you">
              You: <span className={`chip ${color}`}>{color}</span>
            </div>
            <div className="turn">
              {gameOver ? (
                <strong className="gameover">{gameOver}</strong>
              ) : (
                <>
                  <span className="dot" data-turn={state?.turn} />
                  {turnLabel}
                  {state?.status === "check" && (
                    <span className="check"> — Check!</span>
                  )}
                </>
              )}
            </div>
            <div className="players">
              <span>White: {state?.players?.white ? "🟢" : "⚪"} {state?.names?.white || "waiting..."}</span>
              <span>Black: {state?.players?.black ? "🟢" : "⚪"} {state?.names?.black || "waiting..."}</span>
            </div>
          </div>

          <div className="panel-section actions">
            {color !== "spectator" && !gameOver && (
              <button
                className="danger"
                onClick={() => socket.emit("resign", { roomId })}
              >
                Resign
              </button>
            )}
            {gameOver && color !== "spectator" && (
              <button
                className="primary"
                onClick={() => socket.emit("rematch", { roomId })}
              >
                Rematch
              </button>
            )}
          </div>

          <div className="panel-section moves">
            <h3>Moves</h3>
            <ol>
              {(state?.history || []).map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
          </div>

          {notice && <p className="notice">{notice}</p>}
        </aside>
      </div>
    </div>
  );
}
