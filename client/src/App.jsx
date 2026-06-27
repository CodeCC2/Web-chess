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
import {
  lastMoveHighlight,
  playMoveSound,
  classifyMoveSound,
} from "./boardFeedback.js";
import { saveSession, loadSession, clearSession } from "./gameSession.js";
import { copyPgn, downloadPgn } from "./pgnUtils.js";
import "./App.css";

const FINISHED_STATUSES = new Set([
  "checkmate",
  "resign",
  "stalemate",
  "draw",
  "draw_agreed",
  "insufficient_material",
  "threefold_repetition",
  "opponent_left",
  "timeout",
]);

function randomRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function colorLabel(color) {
  if (color === "white") return "ขาว";
  if (color === "black") return "ดำ";
  return color;
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
  const [pgnNotice, setPgnNotice] = useState("");

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
  const prevHistoryLen = useRef(0);
  const reconnectAttempted = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("room")?.trim().toUpperCase();
    if (fromUrl) setRoomInput(fromUrl);
  }, []);

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
      if (color === "spectator") return `${colorLabel(winner)}ชนะ!`;
      return winner === color ? "คุณชนะ!" : "คุณแพ้";
    };
    if (s === "checkmate") return `รุมฆาต — ${outcome(state.winner)}`;
    if (s === "resign") {
      if (color === "spectator")
        return `มีผู้เล่นยอมแพ้ — ${colorLabel(state.winner)}ชนะ!`;
      return state.winner === color
        ? "คู่ต่อสู้ยอมแพ้ — คุณชนะ!"
        : "คุณยอมแพ้ — คุณแพ้";
    }
    if (s === "opponent_left") {
      if (color === "spectator")
        return `มีผู้เล่นออกจากห้อง — ${colorLabel(state.winner)}ชนะ!`;
      return state.winner === color
        ? "คู่ต่อสู้ออกจากห้อง — คุณชนะ!"
        : "คุณออกจากห้อง — คุณแพ้";
    }
    if (s === "timeout") {
      if (color === "spectator")
        return `หมดเวลา — ${colorLabel(state.winner)}ชนะ!`;
      return state.winner === color
        ? "คู่ต่อสู้หมดเวลา — คุณชนะ!"
        : "คุณหมดเวลา — คุณแพ้";
    }
    if (s === "draw_agreed") return "เสมอ — ทั้งสองฝ่ายตกลง";
    if (s === "stalemate") return "เสมอ — stalemate";
    if (s === "draw") return "เสมอ";
    if (s === "insufficient_material") return "เสมอ — หมากไม่พอรุมฆาต";
    if (s === "threefold_repetition") return "เสมอ — ตำแหน่งซ้ำ 3 ครั้ง";
    return null;
  }, [state, color]);

  const sendMove = useCallback((sourceSquare, targetSquare, promotion) => {
    socket.emit(
      "move",
      { from: sourceSquare, to: targetSquare, promotion },
      (res) => {
        if (!res?.ok) setNotice(res?.error || "เดินหมากไม่สำเร็จ");
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

  const boardSquareStyles = useMemo(
    () => ({ ...optionSquares, ...lastMoveHighlight(state?.lastMove) }),
    [optionSquares, state?.lastMove]
  );

  useEffect(() => {
    const len = state?.history?.length ?? 0;
    if (len > prevHistoryLen.current && state?.lastMove) {
      playMoveSound(classifyMoveSound(state.lastMove));
    }
    prevHistoryLen.current = len;
  }, [state?.history?.length, state?.lastMove]);

  const applyJoinResult = useCallback((id, res) => {
    if (!res?.ok) {
      setNotice(res?.error || "เข้าห้องไม่สำเร็จ");
      return false;
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
    prevHistoryLen.current = res.state?.history?.length ?? 0;
    if (res.color !== "spectator" && res.token) {
      saveSession({
        roomId: id,
        token: res.token,
        name: name.trim() || "ไม่ระบุชื่อ",
        timeControl,
      });
    }
    setNotice(
      res.color === "spectator"
        ? "ห้องเต็มแล้ว — คุณเป็นผู้ชม"
        : `คุณเล่นเป็นฝ่าย${colorLabel(res.color)}`
    );
    return true;
  }, [name, timeControl]);

  const joinGame = useCallback(
    (targetRoom, { reconnectToken } = {}) => {
      const id = (targetRoom || roomInput || randomRoomId()).toUpperCase();
      socket.emit(
        "joinGame",
        {
          roomId: id,
          name: name.trim() || "ไม่ระบุชื่อ",
          timeControl,
          reconnectToken,
        },
        (res) => applyJoinResult(id, res)
      );
    },
    [name, roomInput, timeControl, applyJoinResult]
  );

  useEffect(() => {
    if (reconnectAttempted.current || roomId) return;
    const session = loadSession();
    if (!session?.roomId || !session?.token) return;

    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get("room")?.trim().toUpperCase();
    if (urlRoom && urlRoom !== session.roomId.toUpperCase()) {
      clearSession();
      return;
    }

    const tryReconnect = () => {
      if (reconnectAttempted.current) return;
      reconnectAttempted.current = true;
      if (session.name) setName(session.name);
      if (session.timeControl) setTimeControl(session.timeControl);
      setRoomInput(session.roomId);
      socket.emit(
        "joinGame",
        {
          roomId: session.roomId,
          name: session.name || "ไม่ระบุชื่อ",
          timeControl: session.timeControl || "none",
          reconnectToken: session.token,
        },
        (res) => {
          if (!applyJoinResult(session.roomId, res)) {
            clearSession();
          }
        }
      );
    };

    if (socket.connected) tryReconnect();
    else socket.once("connect", tryReconnect);
  }, [roomId, applyJoinResult]);

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
      setNotice("คู่ต่อสู้เข้าห้องแล้ว");
    }
    function onOpponentLeft() {
      setNotice("คู่ต่อสู่ออกจากห้อง");
    }
    function onOpponentDisconnected() {
      setNotice("คู่ต่อสู้หลุดการเชื่อมต่อ — รอ reconnect 2 นาที");
    }
    function onOpponentReconnected() {
      setNotice("คู่ต่อสู้กลับมาแล้ว");
    }
    function onGameOver({ status, winner }) {
      setState((prev) => (prev ? { ...prev, status, winner } : prev));
    }
    function onRematchStarted() {
      setNotice("เริ่มเกมใหม่!");
      prevHistoryLen.current = 0;
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
    socket.on("opponentDisconnected", onOpponentDisconnected);
    socket.on("opponentReconnected", onOpponentReconnected);
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
      socket.off("opponentDisconnected", onOpponentDisconnected);
      socket.off("opponentReconnected", onOpponentReconnected);
      socket.off("gameOver", onGameOver);
      socket.off("rematchStarted", onRematchStarted);
      socket.off("clockUpdate", onClockUpdate);
      socket.off("chatMessage", onChatMessage);
    };
  }, [resetBoardUi]);

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
      if (!res?.ok) setNotice(res?.error || "ส่งข้อความไม่สำเร็จ");
    });
  }, []);

  const goHome = useCallback(() => {
    if (roomId) {
      socket.emit("leaveGame", {}, () => {});
    }
    clearSession();
    reconnectAttempted.current = false;
    setRoomId(null);
    setColor(null);
    setState(null);
    setChatMessages([]);
    setNotice("");
    setPgnNotice("");
    resetBoardUi();
    prevHistoryLen.current = 0;
    setClockMeta({ clocks: null, clockRunning: false, serverNow: null });
    setBotConfig(null);
    setTutorialLesson(null);
    setShowLessonPicker(false);
    setActivePuzzle(null);
    setShowPuzzlePicker(false);
  }, [roomId, resetBoardUi]);

  const inviteUrl = roomId
    ? `${window.location.origin}${window.location.pathname}?room=${roomId}`
    : "";

  const incomingDrawOffer =
    state?.drawOffer && state.drawOffer !== color ? state.drawOffer : null;

  const handleCopyInvite = useCallback(async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setNotice("คัดลอกลิงก์ชวนเล่นแล้ว");
    } catch {
      setNotice("คัดลอกลิงก์ไม่สำเร็จ");
    }
  }, [inviteUrl]);

  const handleCopyPgn = useCallback(async () => {
    if (!state?.pgn) return;
    const ok = await copyPgn(state.pgn);
    setPgnNotice(ok ? "คัดลอก PGN แล้ว" : "คัดลอก PGN ไม่สำเร็จ");
  }, [state?.pgn]);

  const handleDownloadPgn = useCallback(() => {
    if (!state?.pgn) return;
    downloadPgn(state.pgn, `chess-${roomId || "game"}.pgn`);
    setPgnNotice("ดาวน์โหลด PGN แล้ว");
  }, [state?.pgn, roomId]);

  if (activePuzzle) {
    return (
      <PuzzleGame
        puzzle={activePuzzle}
        onExit={goHome}
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
        onHome={goHome}
      />
    );
  }

  if (tutorialLesson) {
    return (
      <TutorialGame
        lesson={tutorialLesson}
        onExit={goHome}
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
        onHome={goHome}
      />
    );
  }

  if (botConfig) {
    return (
      <LocalGame
        difficulty={botConfig.difficulty}
        playerColor={botConfig.playerColor}
        onExit={goHome}
      />
    );
  }

  if (!roomId) {
    return (
      <div className="app lobby">
        <h1>♞ หมากรุกออนไลน์</h1>
        <p className="subtitle">
          เล่นกับคอมพิวเตอร์ หรือแชร์รหัสห้องเพื่อเล่นกับเพื่อน
        </p>
        <div className="card">
          <div className="mode-tabs">
            <button
              className={lobbyMode === "online" ? "tab active" : "tab"}
              onClick={() => setLobbyMode("online")}
            >
              เล่นออนไลน์
            </button>
            <button
              className={lobbyMode === "bot" ? "tab active" : "tab"}
              onClick={() => setLobbyMode("bot")}
            >
              กับคอมพิวเตอร์
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
                ชื่อของคุณ
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ไม่ระบุชื่อ"
                  maxLength={20}
                />
              </label>
              <label>
                รหัสห้อง
                <input
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                  placeholder="เช่น AB12CD"
                  maxLength={8}
                />
              </label>
              <label>
                ควบคุมเวลา
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
                  {roomInput ? "เข้าห้อง" : "สร้างห้องใหม่"}
                </button>
              </div>
              {notice && <p className="notice">{notice}</p>}
              <p className="status">
                เซิร์ฟเวอร์: {connected ? "🟢 เชื่อมต่อแล้ว" : "🔴 กำลังเชื่อมต่อ..."}
              </p>
            </>
          ) : lobbyMode === "bot" ? (
            <>
              <label>
                ระดับความยาก
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
                เล่นเป็นฝ่าย
                <div className="seg">
                  {[
                    { id: "white", label: "ขาว" },
                    { id: "black", label: "ดำ" },
                    { id: "random", label: "สุ่ม" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      className={
                        botColorChoice === c.id ? "seg-btn active" : "seg-btn"
                      }
                      onClick={() => setBotColorChoice(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </label>
              <div className="row">
                <button className="primary" onClick={startBotGame}>
                  เริ่มเกม
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
                ฝึกแท็กติก — หาลำดับที่ดีที่สุด 3–5 ตา (รุมฆาตจริง ผ่าน validation ทุกข้อ)
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
    state?.turn === color ? "ตาของคุณ" : "ตาคู่ต่อสู้";

  const clocks = clockMeta.clocks ?? state?.clocks;

  return (
    <div className="app game">
      <header className="game-header">
        <h1>♞ หมากรุกออนไลน์</h1>
        <div className="game-header-right">
          <div className="room-badge">
            ห้อง <strong>{roomId}</strong>
            <button
              className="link"
              type="button"
              onClick={() => navigator.clipboard?.writeText(roomId)}
            >
              คัดลอกรหัส
            </button>
            <button className="link" type="button" onClick={handleCopyInvite}>
              ลิงก์ชวนเล่น
            </button>
          </div>
          <button type="button" className="home-btn" onClick={goHome}>
            หน้าแรก
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
            customSquareStyles={boardSquareStyles}
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
              คุณ: <span className={`chip ${color}`}>{colorLabel(color)}</span>
            </div>
            <div className="turn">
              {gameOver ? (
                <strong className="gameover">{gameOver}</strong>
              ) : (
                <>
                  <span className="dot" data-turn={state?.turn} />
                  {turnLabel}
                  {state?.status === "check" && (
                    <span className="check"> — รุก!</span>
                  )}
                </>
              )}
            </div>
            <div className="players">
              <span>
                ขาว:{" "}
                {state?.connected?.white
                  ? "🟢"
                  : state?.players?.white
                    ? "🟡"
                    : "⚪"}{" "}
                {state?.names?.white || "รอผู้เล่น..."}
              </span>
              <span>
                ดำ:{" "}
                {state?.connected?.black
                  ? "🟢"
                  : state?.players?.black
                    ? "🟡"
                    : "⚪"}{" "}
                {state?.names?.black || "รอผู้เล่น..."}
              </span>
            </div>
            {incomingDrawOffer && color !== "spectator" && !gameOver && (
              <p className="draw-offer-notice">
                คู่ต่อสู้เสนอเสมอ — ยอมรับหรือไม่?
              </p>
            )}
          </div>

          <div className="panel-section actions">
            {color !== "spectator" && !gameOver && (
              <>
                <button
                  className="danger"
                  onClick={() =>
                    socket.emit("resign", {}, (res) => {
                      if (!res?.ok) setNotice(res?.error || "ยอมแพ้ไม่สำเร็จ");
                    })
                  }
                >
                  ยอมแพ้
                </button>
                {incomingDrawOffer ? (
                  <>
                    <button
                      className="primary"
                      onClick={() =>
                        socket.emit("acceptDraw", {}, (res) => {
                          if (!res?.ok)
                            setNotice(res?.error || "ยอมเสมอไม่สำเร็จ");
                        })
                      }
                    >
                      ยอมเสมอ
                    </button>
                    <button
                      onClick={() =>
                        socket.emit("declineDraw", {}, (res) => {
                          if (!res?.ok)
                            setNotice(res?.error || "ปฏิเสธไม่สำเร็จ");
                        })
                      }
                    >
                      ปฏิเสธเสมอ
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      socket.emit("offerDraw", {}, (res) => {
                        if (!res?.ok)
                          setNotice(res?.error || "เสนอเสมอไม่สำเร็จ");
                        else setNotice("เสนอเสมอแล้ว — รอคู่ต่อสู้ตอบ");
                      })
                    }
                  >
                    เสนอเสมอ
                  </button>
                )}
              </>
            )}
            {gameOver && color !== "spectator" && (
              <button
                className="primary"
                onClick={() =>
                  socket.emit("rematch", {}, (res) => {
                    if (!res?.ok) setNotice(res?.error || "เริ่มใหม่ไม่สำเร็จ");
                  })
                }
              >
                เล่นอีกครั้ง
              </button>
            )}
            {gameOver && state?.pgn && (
              <>
                <button type="button" onClick={handleCopyPgn}>
                  คัดลอก PGN
                </button>
                <button type="button" onClick={handleDownloadPgn}>
                  ดาวน์โหลด PGN
                </button>
              </>
            )}
            <button type="button" onClick={goHome}>
              หน้าแรก
            </button>
          </div>

          {pgnNotice && <p className="notice">{pgnNotice}</p>}

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
