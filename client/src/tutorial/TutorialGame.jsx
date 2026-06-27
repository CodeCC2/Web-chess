import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { markLessonComplete } from "./lessons.js";
import { buildMoveHighlights } from "../boardUtils.js";
import { useBoardWidth } from "../boardTheme.js";

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

export default function TutorialGame({ lesson, onExit, onNextLesson }) {
  const boardSize = useBoardWidth();
  const gameRef = useRef(new Chess());
  const [stepIndex, setStepIndex] = useState(0);
  const [fen, setFen] = useState("");
  const [moveFrom, setMoveFrom] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [wrongSquare, setWrongSquare] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [waitingOpponent, setWaitingOpponent] = useState(false);
  const [lastOpponentSan, setLastOpponentSan] = useState(null);
  const [successFlash, setSuccessFlash] = useState(false);

  const steps = lesson.steps;
  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;

  const loadStep = useCallback(
    (index) => {
      const step = steps[index];
      if (!step) return;
      const game = new Chess(step.fen);
      gameRef.current = game;
      setFen(game.fen());
      setMoveFrom(null);
      setOptionSquares({});
      setShowHint(false);
      setWrongSquare(null);
      setWaitingOpponent(false);
      setLastOpponentSan(null);
      setSuccessFlash(false);
    },
    [steps]
  );

  useEffect(() => {
    loadStep(stepIndex);
  }, [stepIndex, loadStep]);

  const hintStyles = useMemo(() => {
    if (!showHint || !currentStep) return {};
    const { from, to } = currentStep.expected;
    return { [from]: HINT_FROM_STYLE, [to]: HINT_TO_STYLE };
  }, [showHint, currentStep]);

  const wrongStyles = useMemo(() => {
    if (!wrongSquare) return {};
    return { [wrongSquare]: WRONG_STYLE };
  }, [wrongSquare]);

  const customSquareStyles = useMemo(
    () => ({ ...optionSquares, ...hintStyles, ...wrongStyles }),
    [optionSquares, hintStyles, wrongStyles]
  );

  const hintArrows = useMemo(() => {
    if (!showHint || !currentStep) return [];
    const { from, to } = currentStep.expected;
    return [[from, to, "rgb(52, 211, 153)"]];
  }, [showHint, currentStep]);

  const advanceStep = useCallback(() => {
    setSuccessFlash(true);
    setTimeout(() => {
      setSuccessFlash(false);
      if (stepIndex + 1 >= totalSteps) {
        markLessonComplete(lesson.id);
        setCompleted(true);
      } else {
        setStepIndex((i) => i + 1);
      }
    }, 600);
  }, [stepIndex, totalSteps, lesson.id]);

  const playOpponentMove = useCallback(
    (oppMove, oppSan) => {
      setWaitingOpponent(true);
      setTimeout(() => {
        const game = gameRef.current;
        try {
          game.move({ from: oppMove.from, to: oppMove.to, promotion: "q" });
        } catch {
          /* ignore invalid scripted moves */
        }
        setFen(game.fen());
        setWaitingOpponent(false);
        if (oppSan) setLastOpponentSan(oppSan);
        advanceStep();
      }, 500);
    },
    [advanceStep]
  );

  const isCorrectMove = useCallback(
    (from, to) => {
      const exp = currentStep.expected;
      if (from !== exp.from || to !== exp.to) return false;
      if (exp.promotion) {
        const game = gameRef.current;
        const piece = game.get(from);
        if (!piece || piece.type !== "p") return false;
      }
      return true;
    },
    [currentStep]
  );

  const commitPlayerMove = useCallback(
    (from, to) => {
      const game = gameRef.current;
      const exp = currentStep.expected;
      let res = null;
      try {
        res = game.move({
          from,
          to,
          promotion: exp.promotion || "q",
        });
      } catch {
        res = null;
      }
      if (!res) return false;

      setFen(game.fen());
      setMoveFrom(null);
      setOptionSquares({});
      setShowHint(false);

      if (currentStep.opponentMove) {
        playOpponentMove(currentStep.opponentMove, currentStep.opponentSan);
      } else {
        advanceStep();
      }
      return true;
    },
    [currentStep, advanceStep, playOpponentMove]
  );

  const flashWrong = useCallback((square) => {
    setWrongSquare(square);
    setTimeout(() => setWrongSquare(null), 600);
  }, []);

  const highlightLegalMoves = useCallback((square) => {
    const styles = buildMoveHighlights(gameRef.current, square);
    if (!styles) return false;
    setOptionSquares(styles);
    return true;
  }, []);

  const attemptMove = useCallback(
    (from, to) => {
      if (completed || waitingOpponent) return false;

      if (!isCorrectMove(from, to)) {
        flashWrong(to);
        return false;
      }
      return commitPlayerMove(from, to);
    },
    [completed, waitingOpponent, isCorrectMove, commitPlayerMove, flashWrong]
  );

  const onPieceDrop = useCallback(
    (source, target) => {
      setMoveFrom(null);
      setOptionSquares({});
      return attemptMove(source, target);
    },
    [attemptMove]
  );

  const onSquareClick = useCallback(
    (square) => {
      if (completed || waitingOpponent) return;

      if (!moveFrom) {
        const game = gameRef.current;
        const piece = game.get(square);
        if (piece && piece.color === "w" && highlightLegalMoves(square)) {
          setMoveFrom(square);
        }
        return;
      }

      if (square === moveFrom) {
        setMoveFrom(null);
        setOptionSquares({});
        return;
      }

      if (attemptMove(moveFrom, square)) {
        setMoveFrom(null);
        setOptionSquares({});
      } else {
        const game = gameRef.current;
        const piece = game.get(square);
        if (piece && piece.color === "w" && highlightLegalMoves(square)) {
          setMoveFrom(square);
        } else {
          setMoveFrom(null);
          setOptionSquares({});
        }
      }
    },
    [completed, waitingOpponent, moveFrom, attemptMove, highlightLegalMoves]
  );

  const progressPct = completed
    ? 100
    : Math.round((stepIndex / totalSteps) * 100);

  return (
    <div className="app game">
      <header className="game-header">
        <h1>♞ สอนเปิดเกม</h1>
        <div className="game-header-right">
          <div className="room-badge">
            {lesson.icon}{" "}
            <strong>
              {lesson.title}
              {lesson.subtitle ? ` (${lesson.subtitle})` : ""}
            </strong>
          </div>
          <button type="button" className="home-btn" onClick={onExit}>
            Home
          </button>
        </div>
      </header>

      <div className="game-body">
        <div className="board-wrap">
          <Chessboard
            id="tutorial-board"
            position={fen}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            boardOrientation="white"
            arePiecesDraggable={!completed && !waitingOpponent}
            customSquareStyles={customSquareStyles}
            customArrows={hintArrows}
            boardWidth={boardSize}
            customBoardStyle={{
              borderRadius: "8px",
              boxShadow: successFlash
                ? "0 0 24px rgba(52, 211, 153, 0.6)"
                : "0 4px 20px rgba(0,0,0,0.35)",
              transition: "box-shadow 0.3s ease",
            }}
          />
        </div>

        <aside className="panel">
          <div className="panel-section tutorial-progress">
            <div className="tutorial-step-label">
              ขั้นตอน {completed ? totalSteps : stepIndex + 1} / {totalSteps}
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
                <h3 className="tutorial-complete-title">เรียนจบแล้ว!</h3>
                {lesson.line && (
                  <code className="lesson-line">{lesson.line}</code>
                )}
                <p className="tutorial-desc">{lesson.description}</p>
                {lesson.middlegamePlan && (
                  <div className="tutorial-middlegame-plan">
                    <h4 className="tutorial-plan-heading">แผนกลางเกม</h4>
                    <p className="tutorial-plan-text">{lesson.middlegamePlan}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {currentStep.san && (
                  <div className="tutorial-move-label">{currentStep.san}</div>
                )}
                <h3 className="tutorial-step-title">
                  {waitingOpponent
                    ? "คู่ต่อสู้กำลังตอบ…"
                    : "เดินตามแนวเปิดเกม"}
                </h3>
                {lastOpponentSan && stepIndex > 0 && !waitingOpponent && (
                  <p className="tutorial-opponent-move">
                    คู่ต่อสู้เล่น <strong>{lastOpponentSan}</strong>
                  </p>
                )}
                <p className="tutorial-instruction-text">
                  {currentStep.instruction}
                </p>
                {showHint && currentStep.hint && (
                  <p className="tutorial-hint-text">💡 {currentStep.hint}</p>
                )}
              </>
            )}
          </div>

          <div className="panel-section actions">
            {!completed && (
              <button
                className="hint-btn"
                onClick={() => setShowHint(true)}
                disabled={showHint || waitingOpponent}
              >
                {showHint ? "แสดงใบ้แล้ว" : "ใบ้"}
              </button>
            )}
            {completed && onNextLesson && (
              <button className="primary" onClick={onNextLesson}>
                บทเรียนถัดไป
              </button>
            )}
            <button onClick={onExit}>
              {completed ? "กลับเมนู" : "ออก"}
            </button>
          </div>

          {!completed && wrongSquare && (
            <p className="tutorial-wrong-msg">❌ ลองใหม่อีกครั้ง!</p>
          )}
        </aside>
      </div>
    </div>
  );
}
