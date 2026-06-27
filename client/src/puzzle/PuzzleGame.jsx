import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import PromotionPicker from "../PromotionPicker.jsx";
import { buildMoveHighlights } from "../boardUtils.js";
import {
  lastMoveHighlight,
  playMoveSound,
  classifyMoveSound,
} from "../boardFeedback.js";
import { needsPromotion } from "../promotionUtils.js";
import { BOARD_STYLE, boardWidth } from "../boardTheme.js";
import SettingsButton from "../components/SettingsButton.jsx";
import { useSettings } from "../SettingsContext.jsx";
import { markPuzzleComplete } from "./puzzles.js";

const HINT_FROM_STYLE = {
  background: "rgba(250, 204, 21, 0.45)",
  borderRadius: "4px",
};
const HINT_TO_STYLE = {
  background:
    "radial-gradient(circle, rgba(52, 211, 153, 0.7) 25%, transparent 28%)",
  borderRadius: "50%",
};
const WRONG_STYLE = {
  background: "rgba(239, 68, 68, 0.5)",
  borderRadius: "4px",
};

export default function PuzzleGame({ puzzle, onExit, onNext }) {
  const { squareStyles } = useSettings();
  const gameRef = useRef(new Chess(puzzle.fen));
  const playerColor = useRef(
    puzzle.fen.includes(" w ") ? "w" : "b"
  ).current;

  const [fen, setFen] = useState(puzzle.fen);
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveFrom, setMoveFrom] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [wrongSquare, setWrongSquare] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [waitingOpponent, setWaitingOpponent] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [lastSan, setLastSan] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  const solution = puzzle.solution;
  const playerPlies = solution.filter((_, i) => i % 2 === 0).length;
  const playerPlyDone = Math.floor(moveIndex / 2);

  const resetPuzzle = useCallback(() => {
    gameRef.current = new Chess(puzzle.fen);
    setFen(puzzle.fen);
    setMoveIndex(0);
    setMoveFrom(null);
    setOptionSquares({});
    setShowHint(false);
    setWrongSquare(null);
    setCompleted(false);
    setWaitingOpponent(false);
    setSuccessFlash(false);
    setPendingPromotion(null);
    setLastSan(null);
    setLastMove(null);
  }, [puzzle]);

  useEffect(() => {
    resetPuzzle();
  }, [puzzle, resetPuzzle]);

  const expectedStep = solution[moveIndex];

  const hintStyles = useMemo(() => {
    if (!showHint || !expectedStep || moveIndex % 2 !== 0) return {};
    const { from, to } = expectedStep;
    return { [from]: HINT_FROM_STYLE, [to]: HINT_TO_STYLE };
  }, [showHint, expectedStep, moveIndex]);

  const wrongStyles = useMemo(() => {
    if (!wrongSquare) return {};
    return { [wrongSquare]: WRONG_STYLE };
  }, [wrongSquare]);

  const customSquareStyles = useMemo(
    () => ({
      ...optionSquares,
      ...lastMoveHighlight(lastMove),
      ...hintStyles,
      ...wrongStyles,
    }),
    [optionSquares, lastMove, hintStyles, wrongStyles]
  );

  const hintArrows = useMemo(() => {
    if (!showHint || !expectedStep || moveIndex % 2 !== 0) return [];
    return [[expectedStep.from, expectedStep.to, "rgb(52, 211, 153)"]];
  }, [showHint, expectedStep, moveIndex]);

  const finishPuzzle = useCallback(() => {
    markPuzzleComplete(puzzle.id);
    setSuccessFlash(true);
    setTimeout(() => {
      setSuccessFlash(false);
      setCompleted(true);
    }, 600);
  }, [puzzle.id]);

  const applyMove = useCallback((from, to, promotion) => {
    const game = gameRef.current;
    const opts = { from, to };
    if (promotion) opts.promotion = promotion;
    const res = game.move(opts);
    if (!res) return null;
    setFen(game.fen());
    setLastSan(res.san);
    setLastMove({ from: res.from, to: res.to, san: res.san, captured: res.captured, flags: res.flags });
    playMoveSound(classifyMoveSound(res));
    return res;
  }, []);

  const playOpponentMoves = useCallback(
    (startIndex) => {
      let idx = startIndex;
      const tick = () => {
        if (idx >= solution.length || idx % 2 === 0) {
          setWaitingOpponent(false);
          if (idx >= solution.length) finishPuzzle();
          return;
        }
        setWaitingOpponent(true);
        setTimeout(() => {
          const step = solution[idx];
          applyMove(step.from, step.to, step.promotion);
          idx += 1;
          setMoveIndex(idx);
          if (idx >= solution.length) {
            setWaitingOpponent(false);
            finishPuzzle();
          } else {
            tick();
          }
        }, 450);
      };
      tick();
    },
    [solution, applyMove, finishPuzzle]
  );

  const matchesStep = useCallback(
    (from, to, promotion, step) => {
      if (from !== step.from || to !== step.to) return false;
      if (step.promotion && promotion !== step.promotion) return false;
      return true;
    },
    []
  );

  const tryPlayerMove = useCallback(
    (from, to, promotion) => {
      if (completed || waitingOpponent || moveIndex % 2 !== 0) return false;

      const step = solution[moveIndex];
      if (!step) return false;

      const game = gameRef.current;
      if (needsPromotion(game, from, to) && !promotion) {
        setPendingPromotion({ from, to });
        return false;
      }

      if (!matchesStep(from, to, promotion, step)) {
        setWrongSquare(to);
        setTimeout(() => setWrongSquare(null), 600);
        return false;
      }

      const res = applyMove(from, to, promotion || step.promotion);
      if (!res) return false;

      setMoveFrom(null);
      setOptionSquares({});
      setShowHint(false);
      setPendingPromotion(null);

      const nextIndex = moveIndex + 1;
      setMoveIndex(nextIndex);

      if (nextIndex >= solution.length) {
        finishPuzzle();
      } else {
        playOpponentMoves(nextIndex);
      }
      return true;
    },
    [
      completed,
      waitingOpponent,
      moveIndex,
      solution,
      matchesStep,
      applyMove,
      finishPuzzle,
      playOpponentMoves,
    ]
  );

  const highlightLegalMoves = useCallback((square) => {
    const styles = buildMoveHighlights(gameRef.current, square);
    if (!styles) return false;
    setOptionSquares(styles);
    return true;
  }, []);

  const onPieceDrop = useCallback(
    (source, target) => {
      setMoveFrom(null);
      setOptionSquares({});
      return tryPlayerMove(source, target);
    },
    [tryPlayerMove]
  );

  const onSquareClick = useCallback(
    (square) => {
      if (completed || waitingOpponent || moveIndex % 2 !== 0) return;

      if (!moveFrom) {
        const piece = gameRef.current.get(square);
        if (
          piece &&
          piece.color === playerColor &&
          highlightLegalMoves(square)
        ) {
          setMoveFrom(square);
        }
        return;
      }

      if (square === moveFrom) {
        setMoveFrom(null);
        setOptionSquares({});
        return;
      }

      const game = gameRef.current;
      if (needsPromotion(game, moveFrom, square)) {
        setPendingPromotion({ from: moveFrom, to: square });
        setMoveFrom(null);
        setOptionSquares({});
        return;
      }

      if (tryPlayerMove(moveFrom, square)) {
        setMoveFrom(null);
        setOptionSquares({});
      } else {
        const piece = game.get(square);
        if (
          piece &&
          piece.color === playerColor &&
          highlightLegalMoves(square)
        ) {
          setMoveFrom(square);
        } else {
          setMoveFrom(null);
          setOptionSquares({});
        }
      }
    },
    [
      completed,
      waitingOpponent,
      moveIndex,
      moveFrom,
      playerColor,
      highlightLegalMoves,
      tryPlayerMove,
    ]
  );

  const handlePromotionSelect = useCallback(
    (piece) => {
      if (!pendingPromotion) return;
      const { from, to } = pendingPromotion;
      setPendingPromotion(null);
      tryPlayerMove(from, to, piece);
    },
    [pendingPromotion, tryPlayerMove]
  );

  const progressPct = completed
    ? 100
    : Math.round((playerPlyDone / playerPlies) * 100);

  const boardOrientation = playerColor === "w" ? "white" : "black";

  return (
    <div className="app game">
      <header className="game-header">
        <h1>♞ Puzzle</h1>
        <div className="game-header-right">
          <div className="room-badge">
            {puzzle.icon} <strong>{puzzle.title}</strong>
          </div>
          <button type="button" className="home-btn" onClick={onExit}>
            หน้าแรก
          </button>
          <SettingsButton className="settings-fab header-settings" />
        </div>
      </header>

      <div className="game-body">
        <div className={`board-wrap${successFlash ? " puzzle-success" : ""}`}>
          <Chessboard
            id="puzzle-board"
            position={fen}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            onPromotionCheck={() => false}
            boardOrientation={boardOrientation}
            arePiecesDraggable={
              !completed && !waitingOpponent && moveIndex % 2 === 0
            }
            customSquareStyles={customSquareStyles}
            customArrows={hintArrows}
            boardWidth={boardWidth()}
            customBoardStyle={BOARD_STYLE}
            {...squareStyles}
            animationDuration={300}
          />
          {pendingPromotion && (
            <PromotionPicker
              color={playerColor}
              onSelect={handlePromotionSelect}
              onCancel={() => setPendingPromotion(null)}
            />
          )}
        </div>

        <aside className="panel">
          <div className="panel-section tutorial-progress">
            <div className="tutorial-step-label">
              {completed
                ? "ผ่านแล้ว!"
                : `ตาที่ต้องหา ${playerPlyDone + 1} / ${playerPlies}`}
            </div>
            <div className="tutorial-progress-bar">
              <div
                className="tutorial-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="panel-section tutorial-instruction">
            {completed ? (
              <>
                <div className="tutorial-complete-icon">🎉</div>
                <h3 className="tutorial-complete-title">ถูกต้อง!</h3>
                <p className="tutorial-desc">{puzzle.prompt}</p>
                {lastSan && (
                  <p className="tutorial-opponent-move">
                    คำตอบ: <strong>{solution.map((s) => `${s.from}→${s.to}`).join(", ")}</strong>
                  </p>
                )}
              </>
            ) : (
              <>
                <span className="puzzle-theme-badge inline">
                  {puzzle.themeLabel}
                </span>
                <span className={`puzzle-difficulty inline ${puzzle.difficulty}`}>
                  {puzzle.difficulty}
                </span>
                <h3 className="tutorial-step-title">
                  {waitingOpponent
                    ? "คู่ต่อสู้ตอบ…"
                    : playerColor === "w"
                      ? "ขาวเดิน"
                      : "ดำเดิน"}
                </h3>
                <p className="tutorial-instruction-text">{puzzle.prompt}</p>
                {showHint && puzzle.hint && (
                  <p className="tutorial-hint-text">💡 {puzzle.hint}</p>
                )}
              </>
            )}
          </div>

          <div className="panel-section actions">
            {!completed && (
              <>
                <button
                  className="hint-btn"
                  onClick={() => setShowHint(true)}
                  disabled={showHint || waitingOpponent}
                >
                  {showHint ? "แสดงใบ้แล้ว" : "ใบ้"}
                </button>
                <button onClick={resetPuzzle} disabled={waitingOpponent}>
                  เริ่มใหม่
                </button>
              </>
            )}
            {completed && onNext && (
              <button className="primary" onClick={onNext}>
                Puzzle ถัดไป
              </button>
            )}
            <button onClick={onExit}>
              {completed ? "กลับเมนู" : "ออก"}
            </button>
          </div>

          {wrongSquare && (
            <p className="tutorial-wrong-msg">❌ ยังไม่ใช่ตาที่ดีที่สุด!</p>
          )}
        </aside>
      </div>
    </div>
  );
}
