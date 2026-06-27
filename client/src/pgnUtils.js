export function downloadPgn(pgn, filename = "game.pgn") {
  const blob = new Blob([pgn], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function copyPgn(pgn) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(pgn);
    return true;
  }
  return false;
}
