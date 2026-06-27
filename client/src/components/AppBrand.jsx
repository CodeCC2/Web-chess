export default function AppBrand({ subtitle, compact = false }) {
  return (
    <div className={`app-brand${compact ? " compact" : ""}`}>
      <div className="app-brand-mark" aria-hidden="true">
        ♞
      </div>
      <div className="app-brand-text">
        <h1 className="app-brand-title">หมากรุกออนไลน์</h1>
        {subtitle && !compact && <p className="app-brand-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
