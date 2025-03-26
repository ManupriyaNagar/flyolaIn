import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const SignUp = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center mt-20"
      style={{ backgroundImage: "url('/background6.png')" }}
    >
      <Card className="w-96 p-6 shadow-lg rounded-2xl bg-white bg-opacity-10 backdrop-blur-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-100">Sign Up</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input type="text" id="name" placeholder="Enter your full name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="Create a password" required />
            </div>
            <Button className="w-full" type="submit">Sign Up</Button>
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
            Already have an account? <a href="/SignIn" className="text-blue-500">Sign In</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;