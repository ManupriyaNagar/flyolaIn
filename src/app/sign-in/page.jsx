"use client";

import React, { useEffect } from "react";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();
  const { authState, setAuthState } = useAuth();

  // Check local token on page load
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
      setAuthState({ isLoggedIn: false, userRole: null, user: null });
    }
  }, [setAuthState]);

  // Redirect after successful login
  useEffect(() => {
    if (authState?.isLoggedIn) {
      if (authState.userRole === 1) {
        router.push("/admin-dashboard");
      } else if (authState.userRole === 3) {
        router.push("/user-dashboard");
      }
    }
  }, [authState, router]);

  return <SignIn />;
};

export default SignInPage;
