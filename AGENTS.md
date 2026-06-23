# AGENTS.md

## Cursor Cloud specific instructions

This is an npm **workspaces** monorepo for a real-time online chess game:

- `server/` — Express + Socket.IO backend, authoritative chess state via `chess.js`. Runs on port **3001**. Game rooms are stored **in memory**, so restarting the server clears all active games.
- `client/` — Vite + React frontend on port **5173**. It connects to the backend at `http://<hostname>:3001` (override with `VITE_SERVER_URL`).

### Running

- Standard commands live in the root `package.json` and `Readme.md` (`npm run dev`, `dev:server`, `dev:client`, `build`, `lint`, `start`). `npm run dev` starts both services together via `concurrently`.
- The dev script depends on the root dev dependency `concurrently`; run `npm install` at the repo root (not inside a workspace) so workspace + root deps resolve.

### Non-obvious notes

- **Two clients are required to test gameplay**: open `http://localhost:5173` in two browser windows and join with the *same room code*. First joiner = White, second = Black, third+ = spectator.
- The board supports **click-to-move** (click piece → click highlighted destination) in addition to drag-and-drop. Click-to-move is the reliable method for automated/computer-use testing; drag-and-drop is flaky to drive programmatically.
- Black's board is rendered flipped (Black's perspective), which makes square-coordinate targeting tricky during automated GUI testing.
- The backend has a quick health probe at `GET http://localhost:3001/health`.
- Game logic can be tested headlessly by driving `socket.io-client` directly against the running server (join two sockets, emit `move`/`resign`), without a browser.
