import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { socket } from "./socket.js";
import { getGeoPosition } from "./geo.js";

const AuthContext = createContext(null);

async function authFetch(path, options = {}) {
  const res = await fetch(path, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const { data } = await authFetch("/api/auth/me");
    setUser(data.user ?? null);
    return data.user ?? null;
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (username, password) => {
    const geo = await getGeoPosition();
    const { res, data } = await authFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password, ...(geo || {}) }),
    });
    if (!res.ok) {
      throw new Error(data.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
    setUser(data.user);
    socket.disconnect();
    socket.connect();
    return data.user;
  }, []);

  const register = useCallback(async (username, password, displayName) => {
    const geo = await getGeoPosition();
    const { res, data } = await authFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, displayName, ...(geo || {}) }),
    });
    if (!res.ok) {
      throw new Error(data.message || "สมัครไม่สำเร็จ");
    }
    setUser(data.user);
    socket.disconnect();
    socket.connect();
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await authFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    socket.disconnect();
    socket.connect();
  }, []);

  const updateProfile = useCallback(async (displayName) => {
    const { res, data } = await authFetch("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify({ displayName }),
    });
    if (!res.ok) throw new Error(data.message || "บันทึกไม่สำเร็จ");
    setUser(data.user);
    return data.user;
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    const form = new FormData();
    form.append("avatar", file);
    const { res, data } = await authFetch("/api/auth/avatar", {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      throw new Error(data.message || data.error || "อัปโหลดไม่สำเร็จ");
    }
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
      uploadAvatar,
      isAdmin: user?.role === "admin",
    }),
    [user, loading, login, register, logout, refreshUser, updateProfile, uploadAvatar]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
