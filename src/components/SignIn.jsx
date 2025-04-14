"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BASE_URL from "@/baseUrl/baseUrl";
import { Loader2 } from "lucide-react"; // Add a loading icon (install lucide-react if not present)

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthState } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, role } = data;

        localStorage.setItem("token", token);
        localStorage.setItem("authState", JSON.stringify({ isLoggedIn: true, userRole: role }));

        setAuthState({
          isLoggedIn: true,
          userRole: role,
          user: { email, role },
        });
      } else {
        setErrorMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = () => {
    if (errorMessage) setErrorMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange();
                }}
                required
                className="mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                aria-label="Email address"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleInputChange();
                }}
                required
                className="mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                aria-label="Password"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/forgot-password";
                }}
              >
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            {errorMessage && (
              <p
                className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
          </form>
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a
              href="/sign-up"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/sign-up";
              }}
            >
              Sign Up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;