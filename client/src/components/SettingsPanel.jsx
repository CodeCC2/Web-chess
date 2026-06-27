import { useSettings } from "../SettingsContext.jsx";

export default function SettingsPanel({ open, onClose }) {
  const { settings, setSoundEnabled, setBoardTheme, boardThemes } = useSettings();

  if (!open) return null;

  return (
    <div
      className="settings-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="settings-header">
          <h2 id="settings-title">ตั้งค่า</h2>
          <button type="button" className="settings-close" onClick={onClose}>
            ✕
          </button>
        </header>

        <section className="settings-section">
          <h3>เสียง</h3>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
            <span>เสียงเมื่อเดินหมาก</span>
          </label>
        </section>

        <section className="settings-section">
          <h3>สีกระดาน</h3>
          <div className="theme-grid">
            {Object.values(boardThemes).map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-swatch${settings.boardTheme === theme.id ? " active" : ""}`}
                onClick={() => setBoardTheme(theme.id)}
                aria-pressed={settings.boardTheme === theme.id}
              >
                <span
                  className="theme-swatch-colors"
                  style={{
                    background: `linear-gradient(135deg, ${theme.light} 50%, ${theme.dark} 50%)`,
                  }}
                />
                <span className="theme-swatch-label">{theme.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
