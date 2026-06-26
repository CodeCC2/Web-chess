import { PROMOTION_PIECES } from "./promotionUtils.js";

export default function PromotionPicker({ color, onSelect, onCancel }) {
  const isWhite = color === "w" || color === "white";

  return (
    <div className="promotion-overlay" onClick={onCancel}>
      <div
        className="promotion-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="เลือกหมากเลื่อนขั้น"
      >
        <p className="promotion-title">เลือกหมากเลื่อนขั้น</p>
        <div className="promotion-options">
          {PROMOTION_PIECES.map(({ piece, label, symbol }) => (
            <button
              key={piece}
              type="button"
              className="promotion-option"
              onClick={() => onSelect(piece)}
            >
              <span
                className={`promotion-piece ${isWhite ? "white" : "black"}`}
                aria-hidden
              >
                {symbol}
              </span>
              <span className="promotion-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
