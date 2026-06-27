import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AuthButton from "./components/AuthButton.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { SettingsProvider } from "./SettingsContext.jsx";
import "./index.css";
import "./App.css";
import "./ui.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <AuthButton />
        <App />
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);
