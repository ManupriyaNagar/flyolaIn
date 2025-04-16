"use client";

import React from "react";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();
  const { authState } = useAuth();

  React.useEffect(() => {
    if (authState.isLoggedIn) {
      if (authState.userRole === 1) {
        router.push("/admin-dashboard");
      } else if (authState.userRole === 3) {
        router.push("/scheduled-flight");
      }
    }
  }, [authState, router]);

  return <SignIn />;
};

export default SignInPage;