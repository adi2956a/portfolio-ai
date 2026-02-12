import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = "admin_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY) || "");

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login(nextToken) {
        setToken(nextToken);
        localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      },
      logout() {
        setToken("");
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      },
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
