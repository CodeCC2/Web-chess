import { useMemo } from "react";
import {
  puzzles,
  getCompletedPuzzles,
  THEME_LABELS,
  DIFFICULTY_LABELS,
} from "./puzzles.js";

export default function PuzzlePicker({ onSelect, onRandom, onBack }) {
  const completed = useMemo(() => getCompletedPuzzles(), []);
  const doneCount = completed.length;

  const byTheme = useMemo(() => {
    const map = new Map();
    for (const p of puzzles) {
      if (!map.has(p.theme)) map.set(p.theme, []);
      map.get(p.theme).push(p);
    }
    return map;
  }, []);

  const renderCard = (puzzle) => {
    const done = completed.includes(puzzle.id);
    return (
      <button
        key={puzzle.id}
        className={`lesson-card puzzle-card${done ? " done" : ""}`}
        onClick={() => onSelect(puzzle)}
      >
        <div className="lesson-card-header">
          <span className="lesson-icon">{puzzle.icon}</span>
          <span className="puzzle-theme-badge">{puzzle.themeLabel}</span>
          <span className={`puzzle-difficulty ${puzzle.difficulty}`}>
            {DIFFICULTY_LABELS[puzzle.difficulty]}
          </span>
          {done && <span className="lesson-done-badge">✓</span>}
        </div>
        <h3 className="lesson-title">{puzzle.title}</h3>
        <p className="lesson-desc">{puzzle.prompt}</p>
        <span className="lesson-steps">
          {puzzle.solution.filter((_, i) => i % 2 === 0).length} ตาที่ต้องหา
        </span>
      </button>
    );
  };

  return (
    <div className="app lobby">
      <h1>♞ Puzzle</h1>
      <p className="subtitle">
        ฝึกแท็กติก — หาตาที่ดีที่สุด ({doneCount}/{puzzles.length} ผ่านแล้ว)
      </p>

      <div className="puzzle-picker-actions">
        <button className="primary" onClick={onRandom}>
          สุ่ม Puzzle
        </button>
        <button onClick={onBack}>กลับเมนู</button>
      </div>

      {[...byTheme.entries()].map(([theme, items]) => (
        <div className="lesson-section" key={theme}>
          <h2 className="lesson-section-title">
            {THEME_LABELS[theme] || theme}
          </h2>
          <div className="lesson-list">
            {items.map((puzzle) => renderCard(puzzle))}
          </div>
        </div>
      ))}
    </div>
  );
}
