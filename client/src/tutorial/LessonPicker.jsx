import { useMemo } from "react";
import ScreenHeader from "../ScreenHeader.jsx";
import { lessons, getCompletedLessons } from "./lessons.js";

export default function LessonPicker({ onSelect, onHome }) {
  const completed = useMemo(() => getCompletedLessons(), []);

  const mainLessons = lessons.filter((l) => l.kind === "main");
  const variationLessons = lessons.filter((l) => l.kind === "variation");

  const renderCard = (lesson, index, label) => {
    const done = completed.includes(lesson.id);
    const isVariation = lesson.kind === "variation";
    return (
      <button
        key={lesson.id}
        className={`lesson-card${done ? " done" : ""}${isVariation ? " variation" : ""}`}
        onClick={() => onSelect(lesson)}
      >
        <div className="lesson-card-header">
          <span className="lesson-icon">{lesson.icon}</span>
          <span className="lesson-number">{label}</span>
          {isVariation && <span className="lesson-kind-badge">สายรอง</span>}
          {!isVariation && <span className="lesson-kind-badge main">สายหลัก</span>}
          {done && <span className="lesson-done-badge">✓</span>}
        </div>
        <h3 className="lesson-title">
          {lesson.title}
          {lesson.subtitle && (
            <span className="lesson-subtitle"> — {lesson.subtitle}</span>
          )}
        </h3>
        {lesson.eco && <span className="lesson-eco">ECO {lesson.eco}</span>}
        {lesson.line && <code className="lesson-line">{lesson.line}</code>}
        <p className="lesson-desc">{lesson.description}</p>
        {lesson.middlegamePlan && (
          <p className="lesson-plan-preview">
            <strong>แผนกลางเกม:</strong> {lesson.middlegamePlan}
          </p>
        )}
        <span className="lesson-steps">{lesson.steps.length} ขั้นตอน</span>
      </button>
    );
  };

  return (
    <div className="app lobby">
      <ScreenHeader title="♞ สอนเปิดเกม" onHome={onHome} />
      <p className="subtitle">
        ระดับกลาง–แข็ง: 10–15+ ตา สายหลัก + สายรอง พร้อมแผนกลางเกม
      </p>

      <div className="lesson-section">
        <h2 className="lesson-section-title">สายหลัก</h2>
        <div className="lesson-list">
          {mainLessons.map((lesson, i) =>
            renderCard(lesson, i, `บทที่ ${i + 1}`)
          )}
        </div>
      </div>

      <div className="lesson-section">
        <h2 className="lesson-section-title">สายรอง</h2>
        <div className="lesson-list">
          {variationLessons.map((lesson, i) =>
            renderCard(lesson, i, `สายรอง ${i + 1}`)
          )}
        </div>
      </div>
    </div>
  );
}
