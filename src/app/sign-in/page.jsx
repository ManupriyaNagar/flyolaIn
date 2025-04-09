
"use client";

import React, { useEffect } from "react"; // Single import for all React hooks
import SignIn from "@/components/SignIn";
import { useAuth } from "@/components/AuthContext";

const SignInPage = () => {
  const { setAuthState } = useAuth();

  useEffect(() => {
    // Ensure authState is cleared if invalid on page load
    const token = localStorage.getItem("token") || document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
    if (!token) setAuthState({ isLoggedIn: false, userRole: null, user: null });
  }, [setAuthState]);

  return <SignIn />;
};

export default SignInPage;