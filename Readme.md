# Online Chess

Play chess online — a real-time, two-player multiplayer chess web game.

**▶️ Play now: [online-chess-pcl8.onrender.com](https://online-chess-pcl8.onrender.com)**

> Hosted on Render's free tier — if the app has been idle it may take ~30–60s to
> wake up on the first visit.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/CodeCC2/Web-chess)

Two ways to play:

- **vs Computer** — single-player against a built-in chess bot with selectable
  difficulty (Easy / Medium / Hard). Runs entirely in the browser, no network
  needed.
- **Play online** — join a shared room by code; the first player is assigned
  White, the second Black. Moves are validated and synced in real time over
  WebSockets, so each move instantly appears on both boards.

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

## Deploy online (share a permanent link)

The backend serves the built frontend, so the whole game deploys as a **single
web service** — no separate frontend host needed.

### Easiest: one click on Render (free)

1. Click the **Deploy to Render** button above (it reads `render.yaml`).
2. Sign in with GitHub and authorize the repo.
3. Click **Apply** — Render runs `npm install --include=dev && npm run build`
   then `npm start`, and gives you a public URL like
   `https://online-chess-xxxx.onrender.com`.
4. Share that URL with a friend. Both open it, type the same room code, and play.

> Render assigns the port via the `PORT` env var, which the server already reads.
> On the free plan the service sleeps after inactivity and takes a few seconds to
> wake on the next visit.

## How to play

- **vs Computer**: open the app, click the **vs Computer** tab, pick a difficulty
  and a color, then **Start game**. The bot replies automatically after each move.
- **Online**: click **Play online**, enter a name and the same room code in two
  browsers, then **Join room**.
- Click a piece to see its legal moves (highlighted), then click a destination.
  Drag-and-drop also works.
- Pawns auto-promote to a queen.
- In online games, use **Resign** to concede and **Rematch** after a game ends.

The bot is a client-side minimax engine (`client/src/bot.js`) with alpha-beta
pruning and piece-square tables; difficulty maps to search depth (Easy = random,
Medium = depth 2, Hard = depth 3).
