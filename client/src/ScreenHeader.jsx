export default function ScreenHeader({ title, badge, onHome }) {
  return (
    <header className="game-header">
      <h1 className="screen-header-title">{title}</h1>
      <div className="game-header-right">
        {badge ? <div className="room-badge">{badge}</div> : null}
        <button type="button" className="home-btn" onClick={onHome}>
          หน้าแรก
        </button>
      </div>
    </header>
  );
}
