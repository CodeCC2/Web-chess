# Online Chess

Play chess online — a real-time, two-player multiplayer chess web game.

**▶️ Play now: [online-chess-pcl8.onrender.com](https://online-chess-pcl8.onrender.com)**

> Hosted on Render's free tier — if the app has been idle it may take ~30–60s to
> wake up on the first visit.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/CodeCC2/Web-chess)

Three ways to play:

- **vs Computer** — single-player against a built-in chess bot with selectable
  difficulty (Easy / Medium / Hard / Expert). Runs entirely in the browser, no
  network needed.
- **Play online** — join a shared room by code; the first player is assigned
  White, the second Black. Moves are validated and synced in real time over
  WebSockets. Optional **blitz clocks** (5+0 or 3+2).
- **สอนเล่น (Tutorial)** — guided opening lessons in Thai with main lines and
  sidelines.

## Tech stack

- **client/** — React 18 + Vite, [`react-chessboard`](https://www.npmjs.com/package/react-chessboard) for the board UI, [`chess.js`](https://www.npmjs.com/package/chess.js) for local validation/highlighting, `socket.io-client` for realtime.
- **server/** — Node.js + Express + [`socket.io`](https://socket.io), authoritative game state via `chess.js`. In-memory room store with server-side chess clocks.

The project is an npm workspaces monorepo.

## Getting started

```bash
npm install        # installs root + client + server deps (workspaces)
npm run dev        # runs server (:3001) and client (:5173) together
```

Then open http://localhost:5173 in two browser windows/tabs, enter a name,
type the same room code in both, and click **Join room** to play.

Copy `.env.example` to `.env` if you need to override `CLIENT_ORIGIN`,
`VITE_SERVER_URL`, or `PORT`.

## Scripts (run from repo root)

| Command | Description |
| --- | --- |
| `npm run dev` | Start client + server in watch/dev mode (concurrently). |
| `npm run dev:server` | Start only the backend (`:3001`). |
| `npm run dev:client` | Start only the Vite dev server (`:5173`). |
| `npm run build` | Production build of the client. |
| `npm run lint` | ESLint the client. |
| `npm test` | Run unit tests (bot, promotion utils, clock helpers). |
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
  (Easy / Medium / Hard / Expert) and a color, then **Start game**. The bot replies
  automatically after each move. Use **Undo** to take back your last move and the
  bot's reply.
- **Online**: click **Play online**, enter a name and the same room code in two
  browsers, pick a time control (unlimited, 5+0, or 3+2), then **Join room**.
  If your opponent leaves or disconnects, you are awarded the win automatically.
- **Tutorial**: click **สอนเล่น** and pick an opening lesson.
- Click a piece to see its legal moves (highlighted), then click a destination.
  Drag-and-drop also works.
- Pawn promotion opens a picker (queen, rook, bishop, or knight).
- In online games, use **Resign** to concede and **Rematch** after a game ends.

The bot is a client-side minimax engine (`client/src/bot.js`) with alpha-beta
pruning and piece-square tables; difficulty maps to search depth (Easy = random,
Medium = depth 2, Hard = depth 3, Expert = iterative deepening with a time budget).
