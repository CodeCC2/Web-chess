import MaterialScoreBadge from "./MaterialScoreBadge.jsx";

function statusIcon(connected, occupied) {
  if (connected) return "online";
  if (occupied) return "away";
  return "empty";
}

export default function PlayerStatusCard({
  color,
  name,
  connected,
  occupied,
  isYou,
  isTurn,
  materialScore,
}) {
  const label = color === "white" ? "ขาว" : "ดำ";
  const status = statusIcon(connected, occupied);

  return (
    <div
      className={`player-card ${color}${isTurn ? " active-turn" : ""}${isYou ? " is-you" : ""}`}
    >
      <div className="player-card-piece" aria-hidden="true">
        {color === "white" ? "♔" : "♚"}
      </div>
      <div className="player-card-info">
        <span className="player-card-label">
          {label}
          {isYou && <span className="player-card-you">คุณ</span>}
        </span>
        <span className="player-card-name">{name || "รอผู้เล่น..."}</span>
        <MaterialScoreBadge score={materialScore} />
      </div>
      <span className={`player-card-status status-${status}`} title={status}>
        <span className="sr-only">{status}</span>
      </span>
    </div>
  );
}
