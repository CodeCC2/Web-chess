import {
  formatMaterialScore,
  materialScoreTitle,
} from "../materialScore.js";

export default function MaterialScoreBadge({ score }) {
  if (!score) return null;
  return (
    <span
      className={`player-card-material${score > 0 ? " ahead" : " behind"}`}
      title={materialScoreTitle(score)}
    >
      {formatMaterialScore(score)}
    </span>
  );
}
