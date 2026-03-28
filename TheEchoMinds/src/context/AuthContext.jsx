import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiFetch, clearToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(() => {
    setLoading(true);
    return apiFetch("/auth/me")
      .then((data) => {
        setUser(data.user);
        return data;
      })
      .catch((err) => {
        setUser(null);
        throw err;
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refreshAuth().catch(() => {});
  }, [refreshAuth]);

  const logout = useCallback(async (navigate) => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (_err) {
      /* ignore */
    }
    clearToken();
    setUser(null);
    if (navigate) navigate("/");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
