import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { socket } from "./socket.js";
import LocalGame from "./LocalGame.jsx";
import MoveList from "./MoveList.jsx";
import LessonPicker from "./tutorial/LessonPicker.jsx";
import TutorialGame from "./tutorial/TutorialGame.jsx";
import PuzzlePicker from "./puzzle/PuzzlePicker.jsx";
import PuzzleGame from "./puzzle/PuzzleGame.jsx";
import { lessons } from "./tutorial/lessons.js";
import { puzzles } from "./puzzle/puzzles.js";
import { DIFFICULTY_LABELS } from "./bot.js";
import PromotionPicker from "./PromotionPicker.jsx";
import ChessClock from "./ChessClock.jsx";
import { isLegalMove } from "./promotionUtils.js";
import { TIME_CONTROL_OPTIONS } from "./clockUtils.js";
import RoomChat from "./RoomChat.jsx";
import { useChessBoardInteraction } from "./useChessBoardInteraction.js";
import "./App.css";

const FINISHED_STATUSES = new Set([
  "checkmate",
  "resign",
  "stalemate",
  "draw",
  "insufficient_material",
  "threefold_repetition",
  "opponent_left",
  "timeout",
]);

function randomRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function App() {
  const [name, setName] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [color, setColor] = useState(null);
  const [state, setState] = useState(null);
  const [notice, setNotice] = useState("");
  const [connected, setConnected] = useState(socket.connected);
  const [timeControl, setTimeControl] = useState("none");
  const [clockMeta, setClockMeta] = useState({
    clocks: null,
    clockRunning: false,
    serverNow: null,
  });

  const [lobbyMode, setLobbyMode] = useState("online");
  const [difficulty, setDifficulty] = useState("medium");
  const [botColorChoice, setBotColorChoice] = useState("white");
  const [botConfig, setBotConfig] = useState(null);

  const [tutorialLesson, setTutorialLesson] = useState(null);
  const [showLessonPicker, setShowLessonPicker] = useState(false);

  const [activePuzzle, setActivePuzzle] = useState(null);
  const [showPuzzlePicker, setShowPuzzlePicker] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const stateRef = useRef(state);
  stateRef.current = state;

  const startBotGame = useCallback(() => {
    const playerColor =
      botColorChoice === "random"
        ? Math.random() < 0.5
          ? "white"
          : "black"
        : botColorChoice;
    setBotConfig({ difficulty, playerColor });
  }, [botColorChoice, difficulty]);

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
    if (s === "opponent_left") {
      if (color === "spectator")
        return `A player left — ${state.winner} wins!`;
      return state.winner === color
        ? "Opponent left — you win!"
        : "You left — you lose.";
    }
    if (s === "timeout") {
      if (color === "spectator")
        return `Time out — ${state.winner} wins!`;
      return state.winner === color
        ? "Opponent ran out of time — you win!"
        : "You ran out of time — you lose.";
    }
    if (s === "stalemate") return "Draw — stalemate.";
    if (s === "draw") return "Draw.";
    if (s === "insufficient_material") return "Draw — insufficient material.";
    if (s === "threefold_repetition") return "Draw — threefold repetition.";
    return null;
  }, [state, color]);

  const sendMove = useCallback((sourceSquare, targetSquare, promotion) => {
    socket.emit(
      "move",
      { from: sourceSquare, to: targetSquare, promotion },
      (res) => {
        if (!res?.ok) setNotice(res?.error || "Move rejected");
      }
    );
  }, []);

  const getGame = useCallback(
    () => new Chess(stateRef.current?.fen || undefined),
    []
  );

  const canPlay = useCallback(() => {
    const s = stateRef.current;
    if (!s || color === "spectator") return false;
    if (FINISHED_STATUSES.has(s.status)) return false;
    return color === s.turn;
  }, [color]);

  const onMove = useCallback(
    (from, to, promotion) => {
      const s = stateRef.current;
      if (!s || !roomId) return false;
      const probe = new Chess(s.fen);
      if (!isLegalMove(probe, from, to, promotion)) return false;
      sendMove(from, to, promotion);
      return true;
    },
    [roomId, sendMove]
  );

  const {
    optionSquares,
    pendingPromotion,
    setPendingPromotion,
    onPieceDrop,
    onSquareClick,
    handlePromotionSelect,
    resetBoardUi,
  } = useChessBoardInteraction({
    getGame,
    canPlay,
    playerColor: color === "black" ? "b" : "w",
    onMove,
  });

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }
    function onGameState(s) {
      setState(s);
      if (Array.isArray(s.chat)) {
        setChatMessages(s.chat);
      }
      setClockMeta({
        clocks: s.clocks,
        clockRunning: s.clockRunning,
        serverNow: s.serverNow,
      });
      resetBoardUi();
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
    function onClockUpdate(payload) {
      setClockMeta({
        clocks: payload.clocks,
        clockRunning: payload.clockRunning,
        serverNow: payload.serverNow,
      });
      setState((prev) =>
        prev
          ? {
              ...prev,
              clocks: payload.clocks,
              clockRunning: payload.clockRunning,
              turn: payload.turn,
            }
          : prev
      );
    }
    function onChatMessage(message) {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("gameState", onGameState);
    socket.on("opponentJoined", onOpponentJoined);
    socket.on("opponentLeft", onOpponentLeft);
    socket.on("gameOver", onGameOver);
    socket.on("rematchStarted", onRematchStarted);
    socket.on("clockUpdate", onClockUpdate);
    socket.on("chatMessage", onChatMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("gameState", onGameState);
      socket.off("opponentJoined", onOpponentJoined);
      socket.off("opponentLeft", onOpponentLeft);
      socket.off("gameOver", onGameOver);
      socket.off("rematchStarted", onRematchStarted);
      socket.off("clockUpdate", onClockUpdate);
      socket.off("chatMessage", onChatMessage);
    };
  }, [resetBoardUi]);

  const joinGame = useCallback(
    (targetRoom) => {
      const id = (targetRoom || roomInput || randomRoomId()).toUpperCase();
      socket.emit(
        "joinGame",
        { roomId: id, name: name.trim() || "Anonymous", timeControl },
        (res) => {
          if (!res?.ok) {
            setNotice(res?.error || "Failed to join");
            return;
          }
          setRoomId(id);
          setColor(res.color);
          setState(res.state);
          setChatMessages(res.state?.chat || []);
          setClockMeta({
            clocks: res.state.clocks,
            clockRunning: res.state.clockRunning,
            serverNow: res.state.serverNow,
          });
          setNotice(
            res.color === "spectator"
              ? "Game is full — you are spectating."
              : `You are playing as ${res.color}.`
          );
        }
      );
    },
    [name, roomInput, timeControl]
  );

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

  const handlePuzzleNext = useCallback(() => {
    if (!activePuzzle) return;
    const idx = puzzles.findIndex((p) => p.id === activePuzzle.id);
    if (idx >= 0 && idx + 1 < puzzles.length) {
      setActivePuzzle(puzzles[idx + 1]);
    } else {
      setActivePuzzle(null);
      setShowPuzzlePicker(true);
    }
  }, [activePuzzle]);

  const pickRandomPuzzle = useCallback(() => {
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    setActivePuzzle(puzzle);
    setShowPuzzlePicker(false);
  }, []);

  const sendChat = useCallback((text) => {
    socket.emit("chatMessage", { text }, (res) => {
      if (!res?.ok) setNotice(res?.error || "Could not send message");
    });
  }, []);

  const goHome = useCallback(() => {
    if (roomId) {
      socket.emit("leaveGame", {}, () => {});
    }
    setRoomId(null);
    setColor(null);
    setState(null);
    setChatMessages([]);
    setNotice("");
    resetBoardUi();
    setClockMeta({ clocks: null, clockRunning: false, serverNow: null });
    setBotConfig(null);
    setTutorialLesson(null);
    setShowLessonPicker(false);
    setActivePuzzle(null);
    setShowPuzzlePicker(false);
  }, [roomId, resetBoardUi]);

  if (activePuzzle) {
    return (
      <PuzzleGame
        puzzle={activePuzzle}
        onExit={() => {
          setActivePuzzle(null);
          setShowPuzzlePicker(false);
        }}
        onNext={handlePuzzleNext}
      />
    );
  }

  if (showPuzzlePicker) {
    return (
      <PuzzlePicker
        onSelect={(puzzle) => {
          setActivePuzzle(puzzle);
          setShowPuzzlePicker(false);
        }}
        onRandom={pickRandomPuzzle}
        onBack={() => setShowPuzzlePicker(false)}
      />
    );
  }

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
            <button
              className={lobbyMode === "puzzle" ? "tab active" : "tab"}
              onClick={() => setLobbyMode("puzzle")}
            >
              Puzzle
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
              <label>
                Time control
                <div className="seg seg-wrap">
                  {TIME_CONTROL_OPTIONS.map((tc) => (
                    <button
                      key={tc.id}
                      type="button"
                      className={
                        timeControl === tc.id ? "seg-btn active" : "seg-btn"
                      }
                      onClick={() => setTimeControl(tc.id)}
                    >
                      {tc.label}
                    </button>
                  ))}
                </div>
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
                <div className="seg seg-wrap">
                  {Object.keys(DIFFICULTY_LABELS).map((d) => (
                    <button
                      key={d}
                      className={difficulty === d ? "seg-btn active" : "seg-btn"}
                      onClick={() => setDifficulty(d)}
                    >
                      {DIFFICULTY_LABELS[d]}
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
          ) : lobbyMode === "tutorial" ? (
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
          ) : (
            <>
              <p className="tutorial-lobby-desc">
                ฝึกแท็กติก — รุมฆาต ส้อม พิน และเดินเบี้ย หาตาที่ดีที่สุดในแต่ละตำแหน่ง
              </p>
              <div className="row">
                <button
                  className="primary"
                  onClick={() => setShowPuzzlePicker(true)}
                >
                  เลือก Puzzle
                </button>
                <button onClick={pickRandomPuzzle}>สุ่ม Puzzle</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const turnLabel =
    state?.turn === color ? "Your move" : "Opponent's move";

  const clocks = clockMeta.clocks ?? state?.clocks;

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
          <ChessClock
            clocks={clocks}
            turn={state?.turn}
            clockRunning={clockMeta.clockRunning ?? state?.clockRunning}
            serverNow={clockMeta.serverNow ?? state?.serverNow}
            timeControl={state?.timeControl}
          />
          <Chessboard
            id="online-board"
            position={state?.fen}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            onPromotionCheck={() => false}
            boardOrientation={color === "black" ? "black" : "white"}
            arePiecesDraggable={
              color !== "spectator" &&
              !gameOver &&
              state?.turn === color &&
              !pendingPromotion
            }
            customSquareStyles={optionSquares}
            boardWidth={Math.min(480, window.innerWidth - 32)}
            customBoardStyle={{
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            }}
          />
          {pendingPromotion && color !== "spectator" && (
            <PromotionPicker
              color={color === "white" ? "w" : "b"}
              onSelect={handlePromotionSelect}
              onCancel={() => setPendingPromotion(null)}
            />
          )}
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
              <span>
                White: {state?.players?.white ? "🟢" : "⚪"}{" "}
                {state?.names?.white || "waiting..."}
              </span>
              <span>
                Black: {state?.players?.black ? "🟢" : "⚪"}{" "}
                {state?.names?.black || "waiting..."}
              </span>
            </div>
          </div>

          <div className="panel-section actions">
            {color !== "spectator" && !gameOver && (
              <button
                className="danger"
                onClick={() =>
                  socket.emit("resign", {}, (res) => {
                    if (!res?.ok) setNotice(res?.error || "Could not resign");
                  })
                }
              >
                Resign
              </button>
            )}
            {gameOver && color !== "spectator" && (
              <button
                className="primary"
                onClick={() =>
                  socket.emit("rematch", {}, (res) => {
                    if (!res?.ok) setNotice(res?.error || "Could not rematch");
                  })
                }
              >
                Rematch
              </button>
            )}
            <button type="button" onClick={goHome}>
              Home
            </button>
          </div>

          <MoveList history={state?.history || []} />

          <div className="panel-section room-chat-section">
            <RoomChat
              messages={chatMessages}
              onSend={sendChat}
              disabled={!connected}
            />
          </div>

          {notice && <p className="notice">{notice}</p>}
        </aside>
      </div>
    </div>
  );
}
