import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { getBotMove } from "./bot.js";
import MoveList from "./MoveList.jsx";

const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };

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
  const [fen, setFen] = useState(gameRef.current.fen());
  const [info, setInfo] = useState(() => computeStatus(gameRef.current));
  const [thinking, setThinking] = useState(false);
  const [moveFrom, setMoveFrom] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});

  const playerChar = playerColor === "white" ? "w" : "b";
  const botColor = playerColor === "white" ? "b" : "w";

  const gameOver = useMemo(() => {
    const s = info.status;
    const outcome = (winner) => (winner === playerColor ? "You win!" : "You lose.");
    if (s === "checkmate") return `Checkmate — ${outcome(info.winner)}`;
    if (s === "stalemate") return "Draw — stalemate.";
    if (s === "draw") return "Draw.";
    if (s === "insufficient_material") return "Draw — insufficient material.";
    if (s === "threefold_repetition") return "Draw — threefold repetition.";
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
          promotion: move.promotion || "q",
        });
      } catch {
        res = null;
      }
      if (!res) return false;
      sync();
      return true;
    },
    [sync]
  );

  // Bot plays whenever it is its turn.
  useEffect(() => {
    const game = gameRef.current;
    if (game.isGameOver() || game.turn() !== botColor) return;
    setThinking(true);
    const timer = setTimeout(() => {
      const mv = getBotMove(game.fen(), difficulty);
      if (mv) commitMove(mv);
      setThinking(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [fen, botColor, difficulty, commitMove]);

  const highlightLegalMoves = useCallback((square) => {
    const game = gameRef.current;
    const moves = game.moves({ square, verbose: true });
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
  }, []);

  const attemptMove = useCallback(
    (from, to) => {
      const game = gameRef.current;
      if (game.isGameOver() || thinking) return false;
      if (game.turn() !== playerChar) return false;
      return commitMove({ from, to });
    },
    [commitMove, playerChar, thinking]
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
      const game = gameRef.current;
      if (game.isGameOver() || thinking || game.turn() !== playerChar) return;

      if (!moveFrom) {
        const piece = game.get(square);
        if (piece && piece.color === playerChar && highlightLegalMoves(square)) {
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
        const piece = game.get(square);
        if (piece && piece.color === playerChar && highlightLegalMoves(square)) {
          setMoveFrom(square);
        } else {
          setMoveFrom(null);
          setOptionSquares({});
        }
      }
    },
    [moveFrom, thinking, playerChar, attemptMove, highlightLegalMoves]
  );

  const newGame = useCallback(() => {
    gameRef.current = new Chess();
    setMoveFrom(null);
    setOptionSquares({});
    setThinking(false);
    sync();
  }, [sync]);

  const isPlayerTurn = info.turn === playerColor && !gameOver;

  return (
    <div className="app game">
      <header className="game-header">
        <h1>♞ Online Chess</h1>
        <div className="room-badge">
          vs Computer · <strong>{DIFFICULTY_LABEL[difficulty]}</strong>
        </div>
      </header>

      <div className="game-body">
        <div className="board-wrap">
          <Chessboard
            id="local-board"
            position={fen}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            boardOrientation={playerColor === "black" ? "black" : "white"}
            arePiecesDraggable={isPlayerTurn && !thinking}
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
              You: <span className={`chip ${playerColor}`}>{playerColor}</span>
            </div>
            <div className="turn">
              {gameOver ? (
                <strong className="gameover">{gameOver}</strong>
              ) : thinking ? (
                <span>Computer is thinking…</span>
              ) : (
                <>
                  <span className="dot" data-turn={info.turn} />
                  {isPlayerTurn ? "Your move" : "Computer's move"}
                  {info.status === "check" && <span className="check"> — Check!</span>}
                </>
              )}
            </div>
          </div>

          <div className="panel-section actions">
            <button className="primary" onClick={newGame}>
              New game
            </button>
            <button onClick={onExit}>Back to menu</button>
          </div>

          <MoveList history={info.history} />
        </aside>
      </div>
    </div>
  );
}
