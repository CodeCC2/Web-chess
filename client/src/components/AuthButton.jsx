import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext.jsx";

function UserAvatar({ user, size = 32 }) {
  if (user?.avatarUrl) {
    return (
      <img
        className="auth-avatar-img"
        src={user.avatarUrl}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
      />
    );
  }
  const initial = (user?.displayName || user?.username || "?")[0];
  return (
    <span className="auth-avatar-fallback" style={{ width: size, height: size }}>
      {initial.toUpperCase()}
    </span>
  );
}

export default function AuthButton() {
  const { user, loading, login, register, logout, updateProfile, uploadAvatar, isAdmin } =
    useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const fileRef = useRef(null);
  const inputRef = useRef(null);

  const closeAuth = useCallback(() => {
    setOpen(false);
    setError("");
    setBusy(false);
    setPassword("");
  }, []);

  const closeProfile = useCallback(() => {
    setProfileOpen(false);
    setError("");
    setBusy(false);
  }, []);

  useEffect(() => {
    if (!open && !profileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeAuth();
        closeProfile();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, profileOpen, closeAuth, closeProfile]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open, tab]);

  useEffect(() => {
    if (profileOpen && user) setEditName(user.displayName);
  }, [profileOpen, user]);

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (tab === "login") {
        const u = await login(username, password);
        closeAuth();
        if (u?.role === "admin") window.location.href = "/admin";
      } else {
        await register(username, password, displayName || username);
        closeAuth();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await updateProfile(editName);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      await uploadAvatar(file);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  if (loading) return null;

  if (user) {
    return (
      <>
        <button
          type="button"
          className="auth-user-btn"
          onClick={() => setProfileOpen(true)}
          aria-label="โปรไฟล์"
        >
          <UserAvatar user={user} size={30} />
          <span className="auth-user-name">{user.displayName}</span>
        </button>

        {profileOpen ? (
          <div className="admin-login-overlay" role="presentation" onClick={closeProfile}>
            <div
              className="admin-login-modal card auth-profile-modal"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="auth-profile-header">
                <UserAvatar user={user} size={56} />
                <div>
                  <h2 className="admin-login-title">{user.displayName}</h2>
                  <p className="auth-profile-meta">@{user.username}</p>
                </div>
              </div>

              <div className="auth-stats">
                <span>ชนะ {user.wins}</span>
                <span>แพ้ {user.losses}</span>
                <span>เสมอ {user.draws}</span>
              </div>

              <form onSubmit={handleSaveProfile}>
                <label>
                  ชื่อที่แสดง
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={30}
                    disabled={busy}
                  />
                </label>
                <button type="submit" className="primary" disabled={busy}>
                  บันทึกชื่อ
                </button>
              </form>

              <div className="auth-avatar-upload">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className="home-btn"
                  disabled={busy}
                  onClick={() => fileRef.current?.click()}
                >
                  เปลี่ยนรูปโปรไฟล์
                </button>
              </div>

              {isAdmin ? (
                <p className="auth-admin-link">
                  <a className="btn primary" href="/admin">
                    แดชบอร์ดแอดมิน
                  </a>
                </p>
              ) : null}

              {error ? <p className="admin-login-error">{error}</p> : null}

              <div className="admin-login-actions">
                <button
                  type="button"
                  className="danger"
                  disabled={busy}
                  onClick={async () => {
                    await logout();
                    closeProfile();
                  }}
                >
                  ออกจากระบบ
                </button>
                <button type="button" className="home-btn" onClick={closeProfile}>
                  ปิด
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className="admin-login-btn"
        onClick={() => {
          setTab("login");
          setOpen(true);
        }}
      >
        Login
      </button>

      {open ? (
        <div className="admin-login-overlay" role="presentation" onClick={closeAuth}>
          <div
            className="admin-login-modal card"
            role="dialog"
            aria-labelledby="auth-title"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-tabs">
              <button
                type="button"
                className={tab === "login" ? "auth-tab active" : "auth-tab"}
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                className={tab === "register" ? "auth-tab active" : "auth-tab"}
                onClick={() => {
                  setTab("register");
                  setError("");
                }}
              >
                สมัครสมาชิก
              </button>
            </div>

            <form onSubmit={handleAuthSubmit}>
              <label>
                ชื่อผู้ใช้
                <input
                  ref={inputRef}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={busy}
                  minLength={3}
                  maxLength={20}
                />
              </label>
              {tab === "register" ? (
                <label>
                  ชื่อที่แสดง (ไม่บังคับ)
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={30}
                    disabled={busy}
                  />
                </label>
              ) : null}
              <label>
                รหัสผ่าน
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    tab === "login" ? "current-password" : "new-password"
                  }
                  required
                  disabled={busy}
                  minLength={6}
                />
              </label>
              {error ? <p className="admin-login-error">{error}</p> : null}
              <div className="admin-login-actions">
                <button type="button" className="home-btn" onClick={closeAuth} disabled={busy}>
                  ยกเลิก
                </button>
                <button type="submit" className="primary" disabled={busy}>
                  {busy
                    ? "กำลังดำเนินการ..."
                    : tab === "login"
                      ? "เข้าสู่ระบบ"
                      : "สมัครสมาชิก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
