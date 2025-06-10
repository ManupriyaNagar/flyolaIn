"use client";

import React from "react";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();
  const { authState } = useAuth();

  React.useEffect(() => {
    console.log("[SignInPage] authState:", authState);
    if (authState.isLoggedIn) {
      const redirectPath =
        authState.userRole === "1" ? "/admin-dashboard" : "/";
      console.log("[SignInPage] Redirecting to:", redirectPath);
      router.push(redirectPath);
    }
  }, [authState, router]);

  return <SignIn />;
};

export default SignInPage;