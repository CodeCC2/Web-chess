import { useEffect, useMemo, useState } from "react";
import { formatClock } from "./clockUtils.js";

/**
 * Displays white/black clocks with smooth local countdown between server ticks.
 */
export default function ChessClock({
  clocks,
  turn,
  clockRunning,
  serverNow,
  timeControl,
  lowTimeMs = 30_000,
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!clockRunning || timeControl === "none") return undefined;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [clockRunning, timeControl]);

  const display = useMemo(() => {
    if (!clocks || timeControl === "none") {
      return { white: null, black: null };
    }

    const elapsed = clockRunning && serverNow ? Math.max(0, now - serverNow) : 0;
    const white =
      turn === "white" && clockRunning
        ? Math.max(0, clocks.white - elapsed)
        : clocks.white;
    const black =
      turn === "black" && clockRunning
        ? Math.max(0, clocks.black - elapsed)
        : clocks.black;

    return { white, black };
  }, [clocks, turn, clockRunning, serverNow, now, timeControl]);

  if (timeControl === "none" || !clocks) return null;

  return (
    <div className="chess-clocks">
      <div
        className={`clock-row white ${turn === "white" && clockRunning ? "active" : ""} ${
          display.white <= lowTimeMs ? "low" : ""
        }`}
      >
        <span className="clock-label">White</span>
        <span className="clock-time">{formatClock(display.white)}</span>
      </div>
      <div
        className={`clock-row black ${turn === "black" && clockRunning ? "active" : ""} ${
          display.black <= lowTimeMs ? "low" : ""
        }`}
      >
        <span className="clock-label">Black</span>
        <span className="clock-time">{formatClock(display.black)}</span>
      </div>
      <div className="clock-control-badge">{timeControl}</div>
    </div>
  );
}
