"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BASE_URL from "@/baseUrl/baseUrl";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setAuthState } = useAuth();
  const router = useRouter();

  // ss
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        const { user, token } = data;

        // Store token in localStorage
        localStorage.setItem("token", token);

        const newAuthState = {
          isLoading: false,
          isLoggedIn: true,
          user: { id: user.id, email: user.email },
          userRole: String(user.role),
        };

        setAuthState(newAuthState);
        localStorage.setItem("authState", JSON.stringify(newAuthState));

        const redirectPath =
          user.role === 1 ? "/admin-dashboard" : "/scheduled-flight";
        router.push(redirectPath);
      } else {
        setErrorMessage(data.error || "Login failed");
      }
    } catch (err) {
      console.error("[SignIn] Error:", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-10">
      <Card className="w-96 p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Sign In
            </Button>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center mt-2">
                {errorMessage}
              </p>
            )}
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/sign-up")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
