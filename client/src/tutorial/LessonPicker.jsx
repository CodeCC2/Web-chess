import { useMemo } from "react";
import { lessons, getCompletedLessons } from "./lessons.js";

export default function LessonPicker({ onSelect, onBack }) {
  const completed = useMemo(() => getCompletedLessons(), []);

  return (
    <div className="app lobby">
      <h1>♞ สอนเปิดเกม</h1>
      <p className="subtitle">
        เรียนรู้การเปิดหมากยอดนิยม เช่น Ruy Lopez และ Queen&apos;s Gambit
        พร้อมคำอธิบายแนวคิดทีละตา
      </p>

      <div className="lesson-list">
        {lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <button
              key={lesson.id}
              className={`lesson-card${done ? " done" : ""}`}
              onClick={() => onSelect(lesson)}
            >
              <div className="lesson-card-header">
                <span className="lesson-icon">{lesson.icon}</span>
                <span className="lesson-number">บทที่ {index + 1}</span>
                {done && <span className="lesson-done-badge">✓</span>}
              </div>
              <h3 className="lesson-title">
                {lesson.title}
                {lesson.subtitle && (
                  <span className="lesson-subtitle"> — {lesson.subtitle}</span>
                )}
              </h3>
              {lesson.eco && (
                <span className="lesson-eco">ECO {lesson.eco}</span>
              )}
              {lesson.line && (
                <code className="lesson-line">{lesson.line}</code>
              )}
              <p className="lesson-desc">{lesson.description}</p>
              <span className="lesson-steps">
                {lesson.steps.length} ขั้นตอน
              </span>
            </button>
          );
        })}
      </div>

      <button className="back-btn" onClick={onBack}>
        ← กลับเมนูหลัก
      </button>
    </div>
  );
}
