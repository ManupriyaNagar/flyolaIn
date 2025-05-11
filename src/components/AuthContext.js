"use client";

import { createContext, useContext, useState, useEffect } from "react";
import BASE_URL from "@/baseUrl/baseUrl";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isLoggedIn: false,
    user: null,
    userRole: null,
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
  
        console.log("[AuthContext] Fetching /users/verify from:", `${BASE_URL}/users/verify`);
        const res = await fetch(`${BASE_URL}/users/verify`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
  
        console.log("[AuthContext] /users/verify status:", res.status);
        if (res.ok) {
          const { id, email, role } = await res.json();
          console.log("[AuthContext] /users/verify response:", { id, email, role });
          const newAuthState = {
            isLoading: false,
            isLoggedIn: true,
            user: { id, email },
            userRole: String(role),
          };
          setAuthState(newAuthState);
          localStorage.setItem("authState", JSON.stringify(newAuthState));
        } else {
          console.error("[AuthContext] /users/verify failed:", await res.text());
          setAuthState({
            isLoading: false,
            isLoggedIn: false,
            user: null,
            userRole: null,
          });
          localStorage.removeItem("authState");
        }
      } catch (error) {
        console.error("[AuthContext] verify error:", error.message);
        setAuthState({
          isLoading: false,
          isLoggedIn: false,
          user: null,
          userRole: null,
        });
        localStorage.removeItem("authState");
      }
    };
  
    verifyToken();
  }, []);

  // Delay rendering children until we know login status
  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
