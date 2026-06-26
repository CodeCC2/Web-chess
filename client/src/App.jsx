import { useEffect, useMemo, useState, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { socket } from "./socket.js";
import LocalGame from "./LocalGame.jsx";
import MoveList from "./MoveList.jsx";
import LessonPicker from "./tutorial/LessonPicker.jsx";
import TutorialGame from "./tutorial/TutorialGame.jsx";
import { lessons } from "./tutorial/lessons.js";
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
  const [moveFrom, setMoveFrom] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});

  // Lobby mode + single-player (vs computer) config.
  const [lobbyMode, setLobbyMode] = useState("online"); // "online" | "bot" | "tutorial"
  const [difficulty, setDifficulty] = useState("medium");
  const [botColorChoice, setBotColorChoice] = useState("white"); // white | black | random
  const [botConfig, setBotConfig] = useState(null);

  // Tutorial mode
  const [tutorialLesson, setTutorialLesson] = useState(null);
  const [showLessonPicker, setShowLessonPicker] = useState(false);

  const startBotGame = useCallback(() => {
    const playerColor =
      botColorChoice === "random"
        ? Math.random() < 0.5
          ? "white"
          : "black"
        : botColorChoice;
    setBotConfig({ difficulty, playerColor });
  }, [botColorChoice, difficulty]);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }
    function onGameState(s) {
      setState(s);
      setMoveFrom(null);
      setOptionSquares({});
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

  const attemptMove = useCallback(
    (sourceSquare, targetSquare) => {
      if (!state || !roomId) return false;
      if (color !== state.turn) return false;

      const probe = new Chess(state.fen);
      const piece = probe.get(sourceSquare);
      const isPromotion =
        piece &&
        piece.type === "p" &&
        (targetSquare[1] === "8" || targetSquare[1] === "1");

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

  const onPieceDrop = useCallback(
    (sourceSquare, targetSquare) => {
      setMoveFrom(null);
      setOptionSquares({});
      return attemptMove(sourceSquare, targetSquare);
    },
    [attemptMove]
  );

  const highlightLegalMoves = useCallback(
    (square) => {
      if (!state) return false;
      const probe = new Chess(state.fen);
      const moves = probe.moves({ square, verbose: true });
      if (moves.length === 0) return false;
      const styles = {};
      for (const m of moves) {
        styles[m.to] = {
          background:
            "radial-gradient(circle, rgba(99,102,241,0.55) 25%, transparent 28%)",
          borderRadius: "50%",
        };
      }
      styles[square] = { background: "rgba(99,102,241,0.35)" };
      setOptionSquares(styles);
      return true;
    },
    [state]
  );

  const onSquareClick = useCallback(
    (square) => {
      const finished =
        state &&
        ["checkmate", "resign", "stalemate", "draw", "insufficient_material", "threefold_repetition"].includes(
          state.status
        );
      if (!state || color === "spectator" || finished) return;
      if (color !== state.turn) return;

      if (!moveFrom) {
        const probe = new Chess(state.fen);
        const piece = probe.get(square);
        const myTurnColor = color === "white" ? "w" : "b";
        if (piece && piece.color === myTurnColor && highlightLegalMoves(square)) {
          setMoveFrom(square);
        }
        return;
      }

      if (square === moveFrom) {
        setMoveFrom(null);
        setOptionSquares({});
        return;
      }

      const moved = attemptMove(moveFrom, square);
      if (moved) {
        setMoveFrom(null);
        setOptionSquares({});
      } else {
        // Allow reselecting another of your own pieces.
        const probe = new Chess(state.fen);
        const piece = probe.get(square);
        const myTurnColor = color === "white" ? "w" : "b";
        if (piece && piece.color === myTurnColor && highlightLegalMoves(square)) {
          setMoveFrom(square);
        } else {
          setMoveFrom(null);
          setOptionSquares({});
        }
      }
    },
    [state, color, moveFrom, attemptMove, highlightLegalMoves]
  );

  const gameOver = useMemo(() => {
    if (!state) return null;
    const s = state.status;
    const outcome = (winner) => {
      if (color === "spectator") return `${winner} wins!`;
      return winner === color ? "you win!" : "you lose.";
    };
    if (s === "checkmate") return `Checkmate — ${outcome(state.winner)}`;
    if (s === "resign") {
      if (color === "spectator")
        return `A player resigned — ${state.winner} wins!`;
      return state.winner === color
        ? "Opponent resigned — you win!"
        : "You resigned — you lose.";
    }
    if (s === "stalemate") return "Draw — stalemate.";
    if (s === "draw") return "Draw.";
    if (s === "insufficient_material") return "Draw — insufficient material.";
    if (s === "threefold_repetition") return "Draw — threefold repetition.";
    return null;
  }, [state, color]);

  const handleTutorialNext = useCallback(() => {
    if (!tutorialLesson) return;
    const idx = lessons.findIndex((l) => l.id === tutorialLesson.id);
    if (idx >= 0 && idx + 1 < lessons.length) {
      setTutorialLesson(lessons[idx + 1]);
    } else {
      setTutorialLesson(null);
      setShowLessonPicker(true);
    }
  }, [tutorialLesson]);

  const goHome = useCallback(() => {
    setRoomId(null);
    setColor(null);
    setState(null);
    setNotice("");
    setMoveFrom(null);
    setOptionSquares({});
    setBotConfig(null);
    setTutorialLesson(null);
    setShowLessonPicker(false);
  }, []);

  if (tutorialLesson) {
    return (
      <TutorialGame
        lesson={tutorialLesson}
        onExit={() => {
          setTutorialLesson(null);
          setShowLessonPicker(false);
        }}
        onNextLesson={handleTutorialNext}
      />
    );
  }

  if (showLessonPicker) {
    return (
      <LessonPicker
        onSelect={(lesson) => {
          setTutorialLesson(lesson);
          setShowLessonPicker(false);
        }}
        onBack={() => setShowLessonPicker(false)}
      />
    );
  }

  if (botConfig) {
    return (
      <LocalGame
        difficulty={botConfig.difficulty}
        playerColor={botConfig.playerColor}
        onExit={() => setBotConfig(null)}
      />
    );
  }

  if (!roomId) {
    return (
      <div className="app lobby">
        <h1>♞ Online Chess</h1>
        <p className="subtitle">
          Play against the computer, or share a room code to play a friend.
        </p>
        <div className="card">
          <div className="mode-tabs">
            <button
              className={lobbyMode === "online" ? "tab active" : "tab"}
              onClick={() => setLobbyMode("online")}
            >
              Play online
            </button>
            <button
              className={lobbyMode === "bot" ? "tab active" : "tab"}
              onClick={() => setLobbyMode("bot")}
            >
              vs Computer
            </button>
            <button
              className={lobbyMode === "tutorial" ? "tab active" : "tab"}
              onClick={() => setLobbyMode("tutorial")}
            >
              สอนเล่น
            </button>
          </div>

          {lobbyMode === "online" ? (
            <>
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
            </>
          ) : lobbyMode === "bot" ? (
            <>
              <label>
                Difficulty
                <div className="seg">
                  {["easy", "medium", "hard"].map((d) => (
                    <button
                      key={d}
                      className={difficulty === d ? "seg-btn active" : "seg-btn"}
                      onClick={() => setDifficulty(d)}
                    >
                      {d[0].toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </label>
              <label>
                Play as
                <div className="seg">
                  {["white", "black", "random"].map((c) => (
                    <button
                      key={c}
                      className={
                        botColorChoice === c ? "seg-btn active" : "seg-btn"
                      }
                      onClick={() => setBotColorChoice(c)}
                    >
                      {c[0].toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </label>
              <div className="row">
                <button className="primary" onClick={startBotGame}>
                  Start game
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="tutorial-lobby-desc">
                เรียนรู้การเปิดเกมยอดนิยม เช่น Ruy Lopez, Queen&apos;s Gambit,
                Italian Game และ London System พร้อมคำอธิบายแนวคิดทีละตา
              </p>
              <div className="row">
                <button
                  className="primary"
                  onClick={() => setShowLessonPicker(true)}
                >
                  เลือกบทเรียน
                </button>
              </div>
            </>
          )}
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
        <div className="game-header-right">
          <div className="room-badge">
            Room <strong>{roomId}</strong>
            <button
              className="link"
              onClick={() => navigator.clipboard?.writeText(roomId)}
            >
              copy
            </button>
          </div>
          <button type="button" className="home-btn" onClick={goHome}>
            Home
          </button>
        </div>
      </header>

      <div className="game-body">
        <div className="board-wrap">
          <Chessboard
            id="online-board"
            position={state?.fen}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            boardOrientation={color === "black" ? "black" : "white"}
            arePiecesDraggable={
              color !== "spectator" && !gameOver && state?.turn === color
            }
            customSquareStyles={optionSquares}
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
            <button type="button" onClick={goHome}>
              Home
            </button>
          </div>

          <MoveList history={state?.history || []} />

          {notice && <p className="notice">{notice}</p>}
        </aside>
      </div>
    </div>
  );
}
