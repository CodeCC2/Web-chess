export default function ThinkingDots({ label = "กำลังคิด" }) {
  return (
    <span className="thinking-dots" aria-live="polite">
      <span className="thinking-label">{label}</span>
      <span className="thinking-dot" />
      <span className="thinking-dot" />
      <span className="thinking-dot" />
    </span>
  );
}
