/** Format milliseconds as M:SS (clocks under one hour). */
export function formatClock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const TIME_CONTROL_OPTIONS = [
  { id: "none", label: "ไม่จำกัดเวลา" },
  { id: "5+0", label: "Blitz 5+0 (5 นาที)" },
  { id: "3+2", label: "Blitz 3+2 (3 นาที +2 วิ/ตา)" },
];
