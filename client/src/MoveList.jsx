export default function MoveList({ history = [] }) {
  const rows = [];
  for (let i = 0; i < history.length; i += 2) {
    rows.push([history[i], history[i + 1]]);
  }

  return (
    <div className="panel-section moves">
      <h3>Moves</h3>
      {rows.length === 0 ? (
        <p className="moves-empty">No moves yet.</p>
      ) : (
        <div className="movelist">
          {rows.map(([white, black], i) => (
            <div className="move-row" key={i}>
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
