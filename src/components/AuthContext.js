"use client";

import { createContext, useContext, useState, useEffect } from "react";
import BASE_URL from "@/baseUrl/baseUrl";
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
          const res = await fetch(`${BASE_URL}/users/verify`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error("Invalid token");

          const { id, email, role } = await res.json();
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
          console.error("[AuthContext] verify failed:", err);
          setAuthState({ ...INITIAL, isLoading: false });
          localStorage.removeItem("authState");
          localStorage.removeItem("token");
          router.push("/sign-in");
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

  if (authState.isLoading) {
    return <div>Loading authentication…</div>;
  }

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