import { io } from "socket.io-client";

// Priority:
// 1. Explicit VITE_SERVER_URL (set this when deploying frontend separately).
// 2. Dev mode: the backend runs on a separate port (3001).
// 3. Production build served by the backend itself: connect to same origin.
const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ??
  (import.meta.env.DEV ? `http://${window.location.hostname}:3001` : undefined);

export const socket = io(SERVER_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  withCredentials: true,
});
