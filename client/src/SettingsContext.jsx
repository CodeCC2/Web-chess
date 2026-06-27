import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  BOARD_THEMES,
  getSquareStyles,
  loadSettings,
  saveSettings,
  subscribeSettings,
} from "./settings.js";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => subscribeSettings(() => setSettings(loadSettings())), []);

  const value = useMemo(
    () => ({
      settings,
      setSoundEnabled: (soundEnabled) => saveSettings({ soundEnabled }),
      setBoardTheme: (boardTheme) => saveSettings({ boardTheme }),
      boardThemes: BOARD_THEMES,
      squareStyles: getSquareStyles(settings.boardTheme),
    }),
    [settings]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings requires SettingsProvider");
  return ctx;
}
