"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userRole: null,
    user: null,
  });

  // Helper to get the token from localStorage or cookie.
  const getToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      token = match ? match[1] : null;
    }
    return token;
  };

  // Asynchronously check auth and decode the token.
  const checkAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        // Dynamically import jwt-decode at runtime.
        const jwtDecodeModule = await import("jwt-decode");
        // Use the default export if it exists, otherwise assume the module itself is callable.
        const decodeFn = jwtDecodeModule.default || jwtDecodeModule;
        const decoded = decodeFn(token);
        setAuthState({
          isLoggedIn: true,
          userRole: decoded.role,
          user: decoded.user || null,
        });
      } catch (error) {
        console.error("Token decoding error:", error);
        clearAuth();
      }
    } else {
      setAuthState({ isLoggedIn: false, userRole: null, user: null });
    }
  };

  // Clear authentication info.
  const clearAuth = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setAuthState({ isLoggedIn: false, userRole: null, user: null });
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const logout = () => {
    clearAuth();
    window.location.href = "/sign-in";
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
