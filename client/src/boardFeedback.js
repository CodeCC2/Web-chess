export const LAST_MOVE_FROM_STYLE = {
  background: "rgba(250, 204, 21, 0.42)",
  borderRadius: "4px",
};

export const LAST_MOVE_TO_STYLE = {
  background: "rgba(250, 204, 21, 0.62)",
  borderRadius: "4px",
};

/** @param {{ from?: string, to?: string }|null|undefined} lastMove */
export function lastMoveHighlight(lastMove) {
  if (!lastMove?.from || !lastMove?.to) return {};
  return {
    [lastMove.from]: LAST_MOVE_FROM_STYLE,
    [lastMove.to]: LAST_MOVE_TO_STYLE,
  };
}

let audioCtx = null;

function getAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/** @param {'move'|'capture'|'check'} kind */
export function playMoveSound(kind = "move") {
  try {
    const ctx = getAudio();
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    if (kind === "capture") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (kind === "check") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    /* audio unavailable */
  }
}

/** @param {{ san?: string, captured?: string|null, flags?: string }|null|undefined} move */
export function classifyMoveSound(move) {
  if (!move) return "move";
  if (move.san?.includes("+") || move.san?.includes("#")) return "check";
  if (move.captured || move.flags?.includes("c")) return "capture";
  return "move";
}
