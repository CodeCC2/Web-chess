import { useState } from "react";
import SettingsPanel from "./SettingsPanel.jsx";

export default function SettingsButton({ className = "settings-fab" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        aria-label="ตั้งค่า"
        title="ตั้งค่า"
      >
        ⚙️
      </button>
      <SettingsPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
