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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { setAuthState } = useAuth();
  const router = useRouter();

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setErrorMessage("OTP sent to your email.");
      } else {
        setErrorMessage(data.error || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("[Forgot Password] Error:", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage("Password reset successfully. Please sign in.");
        setShowForgotPassword(false);
        setOtpSent(false);
        setEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        setErrorMessage(data.error || "Invalid OTP or error resetting password.");
      }
    } catch (err) {
      console.error("[Verify OTP] Error:", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-20"
      >
        <source src="/signin.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>

      <Card className="w-96 p-6 shadow-lg rounded-2xl z-20 bg-white bg-opacity-90 backdrop-blur-sm">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">
            {showForgotPassword ? "Reset Password" : "Sign In"}
          </h2>
          {!showForgotPassword ? (
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
              <p
                className="text-center text-sm text-blue-500 hover:underline cursor-pointer mt-2"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </p>
              {errorMessage && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {errorMessage}
                </p>
              )}
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={otpSent ? handleVerifyOtp : handleForgotPassword}
            >
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
              {otpSent && (
                <>
                  <div>
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                      type="text"
                      id="otp"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      type="password"
                      id="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <Button className="w-full" type="submit">
                {otpSent ? "Verify OTP" : "Send OTP"}
              </Button>
              <p
                className="text-center text-sm text-blue-500 hover:underline cursor-pointer mt-2"
                onClick={() => {
                  setShowForgotPassword(false);
                  setOtpSent(false);
                  setErrorMessage("");
                }}
              >
                Back to Sign In
              </p>
              {errorMessage && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {errorMessage}
                </p>
              )}
            </form>
          )}
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