import { useCallback, useEffect, useRef, useState } from "react";

export default function AdminLoginButton() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    setPassword("");
    setError("");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({ password }),
        credentials: "include",
      });

      if (res.ok) {
        window.location.href = "/admin";
        return;
      }

      if (res.status === 401) {
        setError("รหัสผ่านไม่ถูกต้อง");
        return;
      }

      if (res.status === 503) {
        setError("ยังไม่ได้ตั้งค่าแอดมินบนเซิร์ฟเวอร์");
        return;
      }

      setError("เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง");
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="admin-login-btn"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Login
      </button>

      {open ? (
        <div
          className="admin-login-overlay"
          role="presentation"
          onClick={close}
        >
          <div
            className="admin-login-modal card"
            role="dialog"
            aria-labelledby="admin-login-title"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="admin-login-title" className="admin-login-title">
              เข้าสู่ระบบแอดมิน
            </h2>
            <p className="admin-login-desc">ใส่รหัสผ่านแอดมินเพื่อดู log ผู้เล่น</p>
            <form onSubmit={handleSubmit}>
              <label>
                รหัสผ่าน
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </label>
              {error ? <p className="admin-login-error">{error}</p> : null}
              <div className="admin-login-actions">
                <button
                  type="button"
                  className="home-btn"
                  onClick={close}
                  disabled={loading}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="primary" disabled={loading}>
                  {loading ? "กำลังเข้า..." : "เข้าสู่ระบบ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
