"use client";

import { createContext, useContext, useState, useEffect } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

const INITIAL = {
  isLoading: true,
  isLoggedIn: false,
  user: null,
  userRole: null,
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [authState, setAuthState] = useState(INITIAL);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("authState");

    if (token && saved) {
      const parsed = JSON.parse(saved);
      setAuthState({ ...parsed, isLoading: true });

      (async () => {
        try {
          const { id, email, role } = await API.users.getProfile();
          const newState = {
            isLoading: false,
            isLoggedIn: true,
            user: { id, email, role: String(role) }, // Include role
            userRole: String(role), // Keep for compatibility
          };
          console.log("[AuthProvider] Verified authState:", newState); // Debug
          setAuthState(newState);
          localStorage.setItem("authState", JSON.stringify(newState));
        } catch (err) {
          // Only log out if error is 401/403 (unauthorized/forbidden)
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            setAuthState({ ...INITIAL, isLoading: false });
            localStorage.removeItem("authState");
            localStorage.removeItem("token");
            router.push("/sign-in");
          } else {
            // For other errors (network/server), keep user logged in and just stop loading
            setAuthState((prev) => ({ ...prev, isLoading: false }));
            console.error("[AuthContext] Non-auth error during profile fetch:", err);
            // Optionally, show a notification to the user here
          }
        }
      })();
    } else {
      setAuthState({ ...INITIAL, isLoading: false });
    }
  }, [router]);

  const login = (token, user) => {
    console.log('[AuthContext] Login called with:', { token: token ? 'present' : 'missing', user });
    
    // Store token
    localStorage.setItem("token", token);
    
    // Update auth state
    const newState = {
      isLoading: false,
      isLoggedIn: true,
      user: user,
      userRole: String(user.role),
    };
    
    setAuthState(newState);
    localStorage.setItem("authState", JSON.stringify(newState));
    
    console.log('[AuthContext] Login successful, new state:', newState);
  };

  const logout = () => {
    console.log('[AuthContext] Logout called');
    localStorage.removeItem("token");
    localStorage.removeItem("authState");
    setAuthState({ ...INITIAL, isLoading: false });
    router.push("/sign-in");
  };

  

  return (
    <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}