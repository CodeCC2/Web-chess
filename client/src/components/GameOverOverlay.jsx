const ICONS = {
  win: "🏆",
  lose: "♟",
  draw: "🤝",
  neutral: "♞",
};

export default function GameOverOverlay({
  variant = "neutral",
  title,
  subtitle,
  children,
}) {
  return (
    <div className="game-over-overlay" role="dialog" aria-modal="true">
      <div className={`game-over-card variant-${variant}`}>
        <div className="game-over-icon" aria-hidden="true">
          {ICONS[variant] || ICONS.neutral}
        </div>
        <h2 className="game-over-title">{title}</h2>
        {subtitle && <p className="game-over-subtitle">{subtitle}</p>}
        {children && <div className="game-over-actions">{children}</div>}
      </div>
    </div>
  );
}
