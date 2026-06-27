const STORAGE_KEY = "chess_settings";

export const BOARD_THEMES = {
  classic: {
    id: "classic",
    name: "คลาสสิก",
    dark: "#779556",
    light: "#ebecd0",
  },
  blue: {
    id: "blue",
    name: "น้ำเงิน",
    dark: "#8ca2ad",
    light: "#dee3e6",
  },
  brown: {
    id: "brown",
    name: "ไม้",
    dark: "#b58863",
    light: "#f0d9b5",
  },
  gray: {
    id: "gray",
    name: "เทา",
    dark: "#6d6d6d",
    light: "#e8e8e8",
  },
  purple: {
    id: "purple",
    name: "ม่วง",
    dark: "#7c6faf",
    light: "#e8e0f5",
  },
};

const DEFAULTS = {
  soundEnabled: true,
  boardTheme: "classic",
};

/** @type {Set<() => void>} */
const listeners = new Set();

function notify() {
  for (const fn of listeners) fn();
}

export function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const boardTheme = BOARD_THEMES[raw.boardTheme] ? raw.boardTheme : DEFAULTS.boardTheme;
    return {
      soundEnabled:
        typeof raw.soundEnabled === "boolean"
          ? raw.soundEnabled
          : DEFAULTS.soundEnabled,
      boardTheme,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

/** @param {Partial<{ soundEnabled: boolean, boardTheme: string }>} patch */
export function saveSettings(patch) {
  const next = { ...loadSettings(), ...patch };
  if (!BOARD_THEMES[next.boardTheme]) next.boardTheme = DEFAULTS.boardTheme;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  notify();
  return next;
}

export function isSoundEnabled() {
  return loadSettings().soundEnabled;
}

export function subscribeSettings(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSquareStyles(themeId) {
  const theme = BOARD_THEMES[themeId] || BOARD_THEMES.classic;
  return {
    customDarkSquareStyle: { backgroundColor: theme.dark },
    customLightSquareStyle: { backgroundColor: theme.light },
  };
}
