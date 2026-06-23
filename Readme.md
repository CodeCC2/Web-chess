# Online Chess

Play chess online — a real-time, two-player multiplayer chess web game.

Players join a shared room by code; the first player is assigned White, the
second Black. Moves are validated and synced in real time over WebSockets, so
each move instantly appears on both boards.

## Tech stack

- **client/** — React 18 + Vite, [`react-chessboard`](https://www.npmjs.com/package/react-chessboard) for the board UI, [`chess.js`](https://www.npmjs.com/package/chess.js) for local validation/highlighting, `socket.io-client` for realtime.
- **server/** — Node.js + Express + [`socket.io`](https://socket.io), authoritative game state via `chess.js`. In-memory room store.

The project is an npm workspaces monorepo.

## Getting started

```bash
npm install        # installs root + client + server deps (workspaces)
npm run dev        # runs server (:3001) and client (:5173) together
```

Then open http://localhost:5173 in two browser windows/tabs, enter a name,
type the same room code in both, and click **Join room** to play.

## Scripts (run from repo root)

| Command | Description |
| --- | --- |
| `npm run dev` | Start client + server in watch/dev mode (concurrently). |
| `npm run dev:server` | Start only the backend (`:3001`). |
| `npm run dev:client` | Start only the Vite dev server (`:5173`). |
| `npm run build` | Production build of the client. |
| `npm run lint` | ESLint the client. |
| `npm start` | Run the backend in production mode. |

## How to play

- Click a piece to see its legal moves (highlighted), then click a destination.
  Drag-and-drop also works.
- Pawns auto-promote to a queen.
- Use **Resign** to concede, and **Rematch** after a game ends to play again.
