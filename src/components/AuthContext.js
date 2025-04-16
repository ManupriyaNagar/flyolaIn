"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userRole: null,
    user: null,
  });
  const timeoutRef = useRef(null);

  const clearAuth = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    localStorage.removeItem("authState");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setAuthState({ isLoggedIn: false, userRole: null, user: null });
  };

  useEffect(() => {
    const checkAuth = () => {
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      const token = cookieToken || localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const nowInSeconds = Math.floor(Date.now() / 1000);

          if (decoded.exp < nowInSeconds) {
            clearAuth();
            return;
          }

          const expiresInMs = (decoded.exp - nowInSeconds) * 1000;

          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            clearAuth();
            window.location.href = "/sign-in";
          }, expiresInMs);

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
        clearAuth();
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};