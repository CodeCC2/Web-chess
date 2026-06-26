import { useCallback, useState } from "react";
import { needsPromotion } from "./promotionUtils.js";
import { buildMoveHighlights } from "./boardUtils.js";

/**
 * Shared click-to-move + promotion flow for chess boards.
 * @param {{
 *   getGame: () => import('chess.js').Chess,
 *   canPlay: () => boolean,
 *   playerColor: 'w' | 'b',
 *   onMove: (from: string, to: string, promotion?: string) => boolean,
 * }} options
 */
export function useChessBoardInteraction({
  getGame,
  canPlay,
  playerColor,
  onMove,
}) {
  const [moveFrom, setMoveFrom] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});
  const [pendingPromotion, setPendingPromotion] = useState(null);

  const clearSelection = useCallback(() => {
    setMoveFrom(null);
    setOptionSquares({});
  }, []);

  const highlightLegalMoves = useCallback(
    (square) => {
      const styles = buildMoveHighlights(getGame(), square);
      if (!styles) return false;
      setOptionSquares(styles);
      return true;
    },
    [getGame]
  );

  const tryMove = useCallback(
    (from, to, promotion) => {
      const game = getGame();
      if (!canPlay()) return false;

      if (needsPromotion(game, from, to) && !promotion) {
        setPendingPromotion({ from, to });
        return false;
      }

      return onMove(from, to, promotion);
    },
    [getGame, canPlay, onMove]
  );

  const handlePromotionSelect = useCallback(
    (piece) => {
      if (!pendingPromotion) return;
      const { from, to } = pendingPromotion;
      setPendingPromotion(null);
      clearSelection();
      onMove(from, to, piece);
    },
    [pendingPromotion, clearSelection, onMove]
  );

  const onPieceDrop = useCallback(
    (sourceSquare, targetSquare) => {
      clearSelection();
      return tryMove(sourceSquare, targetSquare);
    },
    [clearSelection, tryMove]
  );

  const onSquareClick = useCallback(
    (square) => {
      if (!canPlay()) return;

      const game = getGame();

      if (!moveFrom) {
        const piece = game.get(square);
        if (piece && piece.color === playerColor && highlightLegalMoves(square)) {
          setMoveFrom(square);
        }
        return;
      }

      if (square === moveFrom) {
        clearSelection();
        return;
      }

      if (needsPromotion(game, moveFrom, square)) {
        setPendingPromotion({ from: moveFrom, to: square });
        clearSelection();
        return;
      }

      if (tryMove(moveFrom, square)) {
        clearSelection();
      } else {
        const piece = game.get(square);
        if (piece && piece.color === playerColor && highlightLegalMoves(square)) {
          setMoveFrom(square);
        } else {
          clearSelection();
        }
      }
    },
    [
      canPlay,
      getGame,
      moveFrom,
      playerColor,
      highlightLegalMoves,
      clearSelection,
      tryMove,
    ]
  );

  const resetBoardUi = useCallback(() => {
    setMoveFrom(null);
    setOptionSquares({});
    setPendingPromotion(null);
  }, []);

  return {
    moveFrom,
    optionSquares,
    pendingPromotion,
    setPendingPromotion,
    onPieceDrop,
    onSquareClick,
    handlePromotionSelect,
    resetBoardUi,
  };
}
