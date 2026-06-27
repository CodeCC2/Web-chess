import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { getBotMoveAsync, DIFFICULTY_LABELS, THINK_MS, BOT_ANIMATION_MS } from "./bot.js";
import MoveList from "./MoveList.jsx";
import PromotionPicker from "./PromotionPicker.jsx";
import { useChessBoardInteraction } from "./useChessBoardInteraction.js";
import {
  lastMoveHighlight,
  playMoveSound,
  classifyMoveSound,
} from "./boardFeedback.js";
import AppBrand from "./components/AppBrand.jsx";
import GameOverOverlay from "./components/GameOverOverlay.jsx";
import ThinkingDots from "./components/ThinkingDots.jsx";
import SettingsButton from "./components/SettingsButton.jsx";
import { useSettings } from "./SettingsContext.jsx";
import { copyPgn, downloadPgn } from "./pgnUtils.js";
import {
  BOARD_STYLE,
  boardWidth,
  gameOverVariantFromInfo,
  gameOverTitle,
} from "./boardTheme.js";

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
  const { squareStyles } = useSettings();
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
    if (!info.status || info.status === "playing" || info.status === "check") {
      return null;
    }
    return gameOverTitle(info, playerColor);
  }, [info, playerColor]);

  const overlayVariant = gameOver
    ? gameOverVariantFromInfo(info, playerColor)
    : null;

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
    const delay = (THINK_MS[difficulty] ?? 450) + BOT_ANIMATION_MS;
    let cancelled = false;

    const timer = setTimeout(() => {
      if (gen !== botMoveGenRef.current) return;
      getBotMoveAsync(game.fen(), difficulty).then((mv) => {
        if (cancelled || gen !== botMoveGenRef.current) return;
        if (mv) commitMove(mv);
        if (gen === botMoveGenRef.current) setThinking(false);
      });
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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
  const inCheck = info.status === "check" && isPlayerTurn;

  return (
    <div className="app game">
      <header className="game-header">
        <AppBrand compact />
        <div className="game-header-right">
          <div className="room-badge">
            กับคอมพิวเตอร์ · <strong>{DIFFICULTY_LABEL[difficulty]}</strong>
          </div>
          <button type="button" className="home-btn" onClick={onExit}>
            หน้าแรก
          </button>
          <SettingsButton className="settings-fab header-settings" />
        </div>
      </header>

      <div className="game-body">
        <div className="board-column">
          <div className={`board-wrap${inCheck ? " in-check" : ""}`}>
            <Chessboard
              id="local-board"
              position={fen}
              animationDuration={BOT_ANIMATION_MS}
              onPieceDrop={onPieceDrop}
              onSquareClick={onSquareClick}
              onPromotionCheck={() => false}
              boardOrientation={playerColor === "black" ? "black" : "white"}
              arePiecesDraggable={isPlayerTurn && !thinking && !pendingPromotion}
              customSquareStyles={boardSquareStyles}
              boardWidth={boardWidth()}
              customBoardStyle={BOARD_STYLE}
              {...squareStyles}
            />
            {pendingPromotion && (
              <PromotionPicker
                color={playerChar}
                onSelect={handlePromotionSelect}
                onCancel={() => setPendingPromotion(null)}
              />
            )}
            {gameOver && (
              <GameOverOverlay
                variant={overlayVariant}
                title={gameOver}
                subtitle={`ระดับ ${DIFFICULTY_LABEL[difficulty]}`}
              >
                <button className="primary" type="button" onClick={newGame}>
                  เล่นอีกครั้ง
                </button>
                <button type="button" onClick={handleCopyPgn}>
                  คัดลอก PGN
                </button>
                <button type="button" onClick={handleDownloadPgn}>
                  ดาวน์โหลด PGN
                </button>
                <button type="button" onClick={onExit}>
                  กลับหน้าแรก
                </button>
              </GameOverOverlay>
            )}
          </div>
        </div>

        <aside className="panel">
          <div className="panel-section">
            <div
              className={`turn-status${isPlayerTurn && !thinking ? " your-turn" : ""}${inCheck ? " in-check" : ""}`}
            >
              {gameOver ? (
                <span className="gameover-text">{gameOver}</span>
              ) : thinking ? (
                <ThinkingDots label="คอมพิวเตอร์กำลังคิด" />
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

            <div className="player-cards">
              <div
                className={`player-card white${info.turn === "white" && !gameOver ? " active-turn" : ""}${playerColor === "white" ? " is-you" : ""}`}
              >
                <div className="player-card-piece">♔</div>
                <div className="player-card-info">
                  <span className="player-card-label">
                    ขาว
                    {playerColor === "white" && (
                      <span className="player-card-you">คุณ</span>
                    )}
                  </span>
                  <span className="player-card-name">
                    {playerColor === "white" ? "คุณ" : "คอมพิวเตอร์"}
                  </span>
                </div>
                <span className="player-card-status status-online" />
              </div>
              <div
                className={`player-card black${info.turn === "black" && !gameOver ? " active-turn" : ""}${playerColor === "black" ? " is-you" : ""}`}
              >
                <div className="player-card-piece">♚</div>
                <div className="player-card-info">
                  <span className="player-card-label">
                    ดำ
                    {playerColor === "black" && (
                      <span className="player-card-you">คุณ</span>
                    )}
                  </span>
                  <span className="player-card-name">
                    {playerColor === "black" ? "คุณ" : "คอมพิวเตอร์"}
                  </span>
                </div>
                <span className="player-card-status status-online" />
              </div>
            </div>
          </div>

          <div className="panel-section actions">
            <div className="action-group">
              <button className="primary" type="button" onClick={newGame}>
                เกมใหม่
              </button>
              <button type="button" onClick={undoMove} disabled={!canUndo}>
                ย้อนกลับ
              </button>
              <button type="button" onClick={redoMove} disabled={!canRedo}>
                ทำซ้ำ
              </button>
            </div>
            <div className="action-group">
              <button type="button" onClick={onExit}>
                กลับเมนู
              </button>
            </div>
          </div>

          {pgnNotice && <p className="notice">{pgnNotice}</p>}

          <MoveList history={info.history} />
        </aside>
      </div>
    </div>
  );
}
