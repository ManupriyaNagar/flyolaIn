"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BASE_URL from "@/baseUrl/baseUrl";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setAuthState } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        const token = data.token;
        const role = data.role;

        // Save the token in localStorage for quick client access
        localStorage.setItem("token", token);

        // Update the auth context immediately
        setAuthState({
          isLoggedIn: true,
          userRole: role,
          user: { email, role },
        });

        // Redirect immediately based on user role
        if (Number(role) === 1) {
          router.push("/admin-dashboard");
        } else if (Number(role) === 3) {
          router.push("/scheduled-flight");
        } else {
          router.push("/"); // Fallback redirection
        }
      } else {
        setErrorMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
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
              <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            <a
              href="/forgot-password"
              className="text-blue-500 mr-2"
              onClick={(e) => {
                e.preventDefault();
                router.push("/forgot-password");
              }}
            >
              Forgot Password?
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/sign-up"
              className="text-blue-500 ml-2"
              onClick={(e) => {
                e.preventDefault();
                router.push("/sign-up");
              }}
            >
              Sign Up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
