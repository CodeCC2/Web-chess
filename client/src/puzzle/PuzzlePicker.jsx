import { useMemo, useState } from "react";
import AppBrand from "../components/AppBrand.jsx";
import {
  puzzles,
  getCompletedPuzzles,
  THEME_LABELS,
  DIFFICULTY_LABELS,
} from "./puzzles.js";

const ALL = "all";

export default function PuzzlePicker({ onSelect, onRandom, onHome }) {
  const [themeFilter, setThemeFilter] = useState(ALL);
  const [difficultyFilter, setDifficultyFilter] = useState(ALL);
  const completed = useMemo(() => getCompletedPuzzles(), []);

  const themes = useMemo(() => {
    const set = new Set(puzzles.map((p) => p.theme));
    return [...set].sort();
  }, []);

  const filtered = useMemo(() => {
    return puzzles.filter((p) => {
      if (themeFilter !== ALL && p.theme !== themeFilter) return false;
      if (difficultyFilter !== ALL && p.difficulty !== difficultyFilter)
        return false;
      return true;
    });
  }, [themeFilter, difficultyFilter]);

  const stats = useMemo(() => {
    const byTheme = {};
    const byDifficulty = {};
    for (const p of puzzles) {
      byTheme[p.theme] = byTheme[p.theme] || { total: 0, done: 0 };
      byTheme[p.theme].total += 1;
      if (completed.includes(p.id)) byTheme[p.theme].done += 1;

      byDifficulty[p.difficulty] = byDifficulty[p.difficulty] || {
        total: 0,
        done: 0,
      };
      byDifficulty[p.difficulty].total += 1;
      if (completed.includes(p.id)) byDifficulty[p.difficulty].done += 1;
    }
    return { byTheme, byDifficulty, doneCount: completed.length };
  }, [completed]);

  const byTheme = useMemo(() => {
    const map = new Map();
    for (const p of filtered) {
      if (!map.has(p.theme)) map.set(p.theme, []);
      map.get(p.theme).push(p);
    }
    return map;
  }, [filtered]);

  const renderCard = (puzzle) => {
    const done = completed.includes(puzzle.id);
    return (
      <button
        key={puzzle.id}
        className={`lesson-card puzzle-card${done ? " done" : ""}`}
        onClick={() => onSelect(puzzle)}
      >
        <span className="puzzle-card-icon-bg" aria-hidden="true">
          {puzzle.icon}
        </span>
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
    <div className="app lobby puzzle-lobby">
      <div className="lobby-hero">
        <AppBrand subtitle="ฝึกแท็กติก — หาตาที่ดีที่สุด" />
      </div>
      <div className="puzzle-picker-topbar">
        <button type="button" className="home-btn" onClick={onHome}>
          หน้าแรก
        </button>
      </div>

      <div className="puzzle-stats card">
        <h3 className="puzzle-stats-title">สถิติ</h3>
        <div className="puzzle-stats-grid">
          {Object.entries(stats.byDifficulty).map(([diff, { done, total }]) => (
            <div className="puzzle-stat" key={diff}>
              <span className="puzzle-stat-label">
                {DIFFICULTY_LABELS[diff] || diff}
              </span>
              <span className="puzzle-stat-value">
                {done}/{total}
              </span>
            </div>
          ))}
        </div>
        <div className="puzzle-stats-themes">
          {Object.entries(stats.byTheme).map(([theme, { done, total }]) => (
            <span className="puzzle-stat-chip" key={theme}>
              {THEME_LABELS[theme] || theme}: {done}/{total}
            </span>
          ))}
        </div>
      </div>

      <div className="puzzle-filters card">
        <label>
          ธีม
          <div className="seg seg-wrap">
            <button
              type="button"
              className={themeFilter === ALL ? "seg-btn active" : "seg-btn"}
              onClick={() => setThemeFilter(ALL)}
            >
              ทั้งหมด
            </button>
            {themes.map((theme) => (
              <button
                key={theme}
                type="button"
                className={themeFilter === theme ? "seg-btn active" : "seg-btn"}
                onClick={() => setThemeFilter(theme)}
              >
                {THEME_LABELS[theme] || theme}
              </button>
            ))}
          </div>
        </label>
        <label>
          ความยาก
          <div className="seg seg-wrap">
            <button
              type="button"
              className={
                difficultyFilter === ALL ? "seg-btn active" : "seg-btn"
              }
              onClick={() => setDifficultyFilter(ALL)}
            >
              ทั้งหมด
            </button>
            {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={
                  difficultyFilter === key ? "seg-btn active" : "seg-btn"
                }
                onClick={() => setDifficultyFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="puzzle-picker-actions">
        <button className="primary" onClick={onRandom}>
          สุ่ม Puzzle
        </button>
        <span className="puzzle-filter-count">
          แสดง {filtered.length} ข้อ
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="notice">ไม่พบ Puzzle ตามตัวกรอง</p>
      ) : (
        [...byTheme.entries()].map(([theme, items]) => (
          <div className="lesson-section" key={theme}>
            <h2 className="lesson-section-title">
              {THEME_LABELS[theme] || theme}
            </h2>
            <div className="lesson-list">
              {items.map((puzzle) => renderCard(puzzle))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
