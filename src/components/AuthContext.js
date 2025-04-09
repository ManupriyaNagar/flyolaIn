// components/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Install with `npm install jwt-decode`

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userRole: null,
    user: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          setAuthState({
            isLoggedIn: true,
            userRole: decoded.role,
            user: decoded.user || null,
          });
        } catch (error) {
          console.error("Token decoding error:", error);
          clearAuth();
        }
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("authState");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setAuthState({ isLoggedIn: false, userRole: null, user: null });
  };

  const logout = () => {
    clearAuth();
    window.location.href = "/sign-in"; // Force reload to ensure middleware applies
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);