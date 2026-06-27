import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { getBotMove, DIFFICULTY_LABELS, THINK_MS } from "./bot.js";
import MoveList from "./MoveList.jsx";
import PromotionPicker from "./PromotionPicker.jsx";
import { useChessBoardInteraction } from "./useChessBoardInteraction.js";
import {
  lastMoveHighlight,
  playMoveSound,
  classifyMoveSound,
} from "./boardFeedback.js";
import { copyPgn, downloadPgn } from "./pgnUtils.js";

const DIFFICULTY_LABEL = DIFFICULTY_LABELS;

function computeStatus(game) {
  let status = "playing";
  let winner = null;
  if (game.isCheckmate()) {
    status = "checkmate";
    winner = game.turn() === "w" ? "black" : "white";
  } else if (game.isStalemate()) {
    status = "stalemate";
  } else if (game.isInsufficientMaterial()) {
    status = "insufficient_material";
  } else if (game.isThreefoldRepetition()) {
    status = "threefold_repetition";
  } else if (game.isDraw()) {
    status = "draw";
  } else if (game.isCheck()) {
    status = "check";
  }
  return {
    status,
    winner,
    turn: game.turn() === "w" ? "white" : "black",
    history: game.history(),
  };
}

export default function LocalGame({ difficulty, playerColor, onExit }) {
  const gameRef = useRef(new Chess());
  const redoStackRef = useRef([]);
  const [redoCount, setRedoCount] = useState(0);
  const [fen, setFen] = useState(gameRef.current.fen());
  const [info, setInfo] = useState(() => computeStatus(gameRef.current));
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [pgnNotice, setPgnNotice] = useState("");
  const botMoveGenRef = useRef(0);

  const playerChar = playerColor === "white" ? "w" : "b";
  const botColor = playerColor === "white" ? "b" : "w";

  const gameOver = useMemo(() => {
    const s = info.status;
    const outcome = (winner) =>
      winner === playerColor ? "คุณชนะ!" : "คุณแพ้";
    if (s === "checkmate") return `รุมฆาต — ${outcome(info.winner)}`;
    if (s === "stalemate") return "เสมอ — stalemate";
    if (s === "draw") return "เสมอ";
    if (s === "insufficient_material") return "เสมอ — หมากไม่พอรุมฆาต";
    if (s === "threefold_repetition") return "เสมอ — ตำแหน่งซ้ำ 3 ครั้ง";
    return null;
  }, [info, playerColor]);

  const sync = useCallback(() => {
    const game = gameRef.current;
    setFen(game.fen());
    setInfo(computeStatus(game));
  }, []);

  const commitMove = useCallback(
    (move) => {
      const game = gameRef.current;
      let res = null;
      try {
        res = game.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
      } catch {
        res = null;
      }
      if (!res) return false;
      redoStackRef.current = [];
      setRedoCount(0);
      setLastMove({
        from: res.from,
        to: res.to,
        san: res.san,
        captured: res.captured,
        flags: res.flags,
      });
      playMoveSound(classifyMoveSound(res));
      sync();
      return true;
    },
    [sync]
  );

  useEffect(() => {
    const game = gameRef.current;
    if (game.isGameOver() || game.turn() !== botColor) return;

    const gen = ++botMoveGenRef.current;
    setThinking(true);
    const delay = THINK_MS[difficulty] ?? 450;
    const timer = setTimeout(() => {
      if (gen !== botMoveGenRef.current) return;
      const mv = getBotMove(game.fen(), difficulty);
      if (gen === botMoveGenRef.current && mv) commitMove(mv);
      if (gen === botMoveGenRef.current) setThinking(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [fen, botColor, difficulty, commitMove]);

  const getGame = useCallback(() => gameRef.current, []);

  const canPlay = useCallback(() => {
    const game = gameRef.current;
    return !game.isGameOver() && !thinking && game.turn() === playerChar;
  }, [thinking, playerChar]);

  const onMove = useCallback(
    (from, to, promotion) => commitMove({ from, to, promotion }),
    [commitMove]
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
    playerColor: playerChar,
    onMove,
  });

  const canUndo =
    info.history.length > 0 && !thinking && !pendingPromotion && !gameOver;

  const canRedo = redoCount > 0 && !thinking && !pendingPromotion && !gameOver;

  const undoMove = useCallback(() => {
    if (!canUndo) return;
    botMoveGenRef.current += 1;
    setThinking(false);

    const game = gameRef.current;
    const plies = Math.min(2, game.history().length);
    const toRestore = [];
    for (let i = 0; i < plies; i++) {
      const undone = game.undo();
      if (!undone) break;
      toRestore.unshift({
        from: undone.from,
        to: undone.to,
        promotion: undone.promotion,
      });
    }
    if (toRestore.length > 0) {
      redoStackRef.current.push(toRestore);
      setRedoCount(redoStackRef.current.length);
    }

    resetBoardUi();
    sync();
  }, [canUndo, resetBoardUi, sync]);

  const redoMove = useCallback(() => {
    if (thinking || pendingPromotion || gameOver) return;
    if (redoStackRef.current.length === 0) return;
    botMoveGenRef.current += 1;
    setThinking(false);

    const moves = redoStackRef.current.pop();
    if (!moves?.length) {
      setRedoCount(redoStackRef.current.length);
      return;
    }

    const game = gameRef.current;
    for (const step of moves) {
      const opts = { from: step.from, to: step.to };
      if (step.promotion) opts.promotion = step.promotion;
      if (!game.move(opts)) {
        redoStackRef.current = [];
        setRedoCount(0);
        resetBoardUi();
        sync();
        return;
      }
    }

    setRedoCount(redoStackRef.current.length);
    resetBoardUi();
    sync();
  }, [thinking, pendingPromotion, gameOver, resetBoardUi, sync]);

  const newGame = useCallback(() => {
    gameRef.current = new Chess();
    redoStackRef.current = [];
    setRedoCount(0);
    setLastMove(null);
    setPgnNotice("");
    resetBoardUi();
    setThinking(false);
    sync();
  }, [resetBoardUi, sync]);

  const boardSquareStyles = useMemo(
    () => ({ ...optionSquares, ...lastMoveHighlight(lastMove) }),
    [optionSquares, lastMove]
  );

  const handleCopyPgn = useCallback(async () => {
    const ok = await copyPgn(gameRef.current.pgn());
    setPgnNotice(ok ? "คัดลอก PGN แล้ว" : "คัดลอก PGN ไม่สำเร็จ");
  }, []);

  const handleDownloadPgn = useCallback(() => {
    downloadPgn(gameRef.current.pgn(), "chess-bot.pgn");
    setPgnNotice("ดาวน์โหลด PGN แล้ว");
  }, []);

  const isPlayerTurn = info.turn === playerColor && !gameOver;

  return (
    <div className="app game">
      <header className="game-header">
        <h1>♞ หมากรุกออนไลน์</h1>
        <div className="game-header-right">
          <div className="room-badge">
            กับคอมพิวเตอร์ · <strong>{DIFFICULTY_LABEL[difficulty]}</strong>
          </div>
          <button type="button" className="home-btn" onClick={onExit}>
            หน้าแรก
          </button>
        </div>
      </header>

      <div className="game-body">
        <div className="board-wrap">
          <Chessboard
            id="local-board"
            position={fen}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            onPromotionCheck={() => false}
            boardOrientation={playerColor === "black" ? "black" : "white"}
            arePiecesDraggable={isPlayerTurn && !thinking && !pendingPromotion}
            customSquareStyles={boardSquareStyles}
            boardWidth={Math.min(480, window.innerWidth - 32)}
            customBoardStyle={{
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            }}
          />
          {pendingPromotion && (
            <PromotionPicker
              color={playerChar}
              onSelect={handlePromotionSelect}
              onCancel={() => setPendingPromotion(null)}
            />
          )}
        </div>

        <aside className="panel">
          <div className="panel-section">
            <div className="you">
              คุณ: <span className={`chip ${playerColor}`}>
                {playerColor === "white" ? "ขาว" : "ดำ"}
              </span>
            </div>
            <div className="turn">
              {gameOver ? (
                <strong className="gameover">{gameOver}</strong>
              ) : thinking ? (
                <span>คอมพิวเตอร์กำลังคิด…</span>
              ) : (
                <>
                  <span className="dot" data-turn={info.turn} />
                  {isPlayerTurn ? "ตาของคุณ" : "ตาคอมพิวเตอร์"}
                  {info.status === "check" && (
                    <span className="check"> — รุก!</span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="panel-section actions">
            <button className="primary" onClick={newGame}>
              เกมใหม่
            </button>
            <button type="button" onClick={undoMove} disabled={!canUndo}>
              ย้อนกลับ
            </button>
            <button type="button" onClick={redoMove} disabled={!canRedo}>
              ทำซ้ำ
            </button>
            {gameOver && (
              <>
                <button type="button" onClick={handleCopyPgn}>
                  คัดลอก PGN
                </button>
                <button type="button" onClick={handleDownloadPgn}>
                  ดาวน์โหลด PGN
                </button>
              </>
            )}
            <button onClick={onExit}>กลับเมนู</button>
          </div>

          {pgnNotice && <p className="notice">{pgnNotice}</p>}

          <MoveList history={info.history} />
        </aside>
      </div>
    </div>
  );
}
