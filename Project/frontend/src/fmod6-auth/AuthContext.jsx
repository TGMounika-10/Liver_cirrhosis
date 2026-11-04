import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { setClientAuthToken, registerUnauthorizedHandler } from "../fmod1-app-shell/api/client";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // In-memory token storage (per f1.md & f6.md specification: never written to localStorage)
  const [patientId, setPatientId] = useState(null);
  const [token, setToken] = useState(null);

  const logout = useCallback(() => {
    setPatientId(null);
    setToken(null);
    setClientAuthToken(null);
  }, []);

  const login = useCallback((id, authToken) => {
    // Normalise Patient ID to uppercase per spec
    const normalizedId = (id || "").trim().toUpperCase();
    setPatientId(normalizedId);
    setToken(authToken);
    setClientAuthToken(authToken);
  }, []);

  const signup = useCallback((id, authToken) => {
    const normalizedId = (id || "").trim().toUpperCase();
    setPatientId(normalizedId);
    setToken(authToken);
    setClientAuthToken(authToken);
  }, []);

  useEffect(() => {
    // Register auto-logout handler for 401 Unauthorized responses from Axios
    registerUnauthorizedHandler(() => {
      logout();
    });
  }, [logout]);

  const value = useMemo(
    () => ({
      patientId,
      token,
      login,
      signup,
      logout,
      isAuthenticated: Boolean(token && patientId),
    }),
    [patientId, token, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

