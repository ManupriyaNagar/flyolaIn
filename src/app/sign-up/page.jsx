"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";  // Corrected import
import BASE_URL from "@/baseUrl/baseUrl";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();  // Initialize useRouter

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, number }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("User registered successfully!");
        console.log(data);
        window.location.href = "/sign-in";
      } else {
        setErrorMessage(data.message);
        console.log("Registration failed:", data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center mt-20"
      style={{ backgroundImage: "url('/background6.png')" }}
    >
      <Card className="w-96 p-6 shadow-lg rounded-2xl bg-white bg-opacity-10 backdrop-blur-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-100">Sign Up</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="number">Phone Number</Label>
              <Input
                type="tel"
                id="number"
                placeholder="Enter your phone number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
            )}
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button className="flex items-center justify-center space-x-2 w-full bg-white border border-gray-300 text-gray-700">
              <FcGoogle className="text-xl" />
              <span>Sign up with Google</span>
            </Button>
            <Button className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white">
              <FaFacebook className="text-xl" />
              <span>Sign up with Facebook</span>
            </Button>
          </div>

          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-blue-500"
              onClick={(e) => {
                e.preventDefault();
                router.push("/sign-in"); // Redirect to sign-in
              }}
            >
              Sign In
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
