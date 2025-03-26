import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const SignIn = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-10"
    style={{ backgroundImage: "url('/background6.png')" }}>
      <Card className="w-96 p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="Enter your password" required />
            </div>
            <Button className="w-full" type="submit">Sign In</Button>
            <div className="flex flex-col space-y-2">
            <Button className="flex items-center justify-center space-x-2 w-full bg-white border border-gray-300 text-gray-700">
              <FcGoogle className="text-xl" />
              <span>Sign In with Google</span>
            </Button>
            <Button className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white">
              <FaFacebook className="text-xl" />
              <span>Sign In with Facebook</span>
            </Button>
          </div>
          </form>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account? <a href="/SignUp" className="text-blue-500">Sign Up</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
