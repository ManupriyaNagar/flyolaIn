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
    // 1️⃣ Try to read token + saved authState from localStorage
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("authState");

    if (token && saved) {
      // Optimistically apply saved state (while we verify)
      const parsed = JSON.parse(saved);
      setAuthState({ ...parsed, isLoading: true });

      // 2️⃣ Verify against your backend using the Bearer header
      (async () => {
        try {
          const res = await fetch(`${BASE_URL}/users/verify`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error("Invalid token");

          const { id, email, role } = await res.json();
          const newState = {
            isLoading: false,
            isLoggedIn: true,
            user: { id, email },
            userRole: String(role),
          };
          setAuthState(newState);
          localStorage.setItem("authState", JSON.stringify(newState));
        } catch (err) {
          console.error("[AuthContext] verify failed:", err);
          // 3️⃣ On error, clear everything and redirect to sign-in
          setAuthState({ ...INITIAL, isLoading: false });
          localStorage.removeItem("authState");
          localStorage.removeItem("token");
          router.push("/sign-in");
        }
      })();
    } else {
      // No token → logged out
      setAuthState({ ...INITIAL, isLoading: false });
    }
  }, [router]);

  const logout = () => {
    // Just clear local storage & state, then redirect
    localStorage.removeItem("token");
    localStorage.removeItem("authState");
    setAuthState({ ...INITIAL, isLoading: false });
    router.push("/sign-in");
  };

  // Delay rendering until we know one way or the other
  if (authState.isLoading) {
    return <div>Loading authentication…</div>;
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
