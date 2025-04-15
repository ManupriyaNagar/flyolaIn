"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BASE_URL from "@/baseUrl/baseUrl";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setErrorMsg("");
      } else {
        setErrorMsg(data.error || "Error in sending email");
        setMessage("");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrorMsg("An error occurred. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Send Reset Link
            </Button>
          </form>
          {message && <p className="text-green-500 text-center mt-4">{message}</p>}
          {errorMsg && <p className="text-red-500 text-center mt-4">{errorMsg}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
