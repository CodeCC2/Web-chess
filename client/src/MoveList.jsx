export default function MoveList({ history = [] }) {
  const rows = [];
  for (let i = 0; i < history.length; i += 2) {
    rows.push([history[i], history[i + 1]]);
  }

  const latestRow = rows.length - 1;

  return (
    <div className="panel-section moves">
      <h3>บันทึกการเดิน</h3>
      {rows.length === 0 ? (
        <p className="moves-empty">ยังไม่มีการเดินหมาก</p>
      ) : (
        <div className="movelist">
          {rows.map(([white, black], i) => (
            <div
              className={`move-row${i === latestRow ? " move-row-latest" : ""}`}
              key={i}
            >
              <span className="move-num">{i + 1}.</span>
              <span className="move-san">{white}</span>
              <span className="move-san">{black || ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
