// SignIn Component
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "./AuthContext";
import BASE_URL from "@/baseUrl/baseUrl";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { setAuthState } = useAuth();

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
  
        document.cookie = `token=${token}; path=/; max-age=3600; samesite=strict`;
        localStorage.setItem("token", token);
        localStorage.setItem("authState", JSON.stringify({ isLoggedIn: true, userRole: role }));
  
        setAuthState({
          isLoggedIn: true,
          userRole: role,
          user: { email, role },
        });
  
        // Directly redirect after state update
        if (role === 1) {
          router.push("/admin-dashboard");
        } else if (role === 3) {
          router.push("/user-dashboard");
        } else {
          router.push("/sign-in");
          setErrorMessage("Invalid role. Please contact support.");
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
            {errorMessage && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}
          </form>

          <p className="text-center text-sm text-gray-300 mt-4">
            Don't have an account?{" "}
            <a
              href="/sign-up"
              className="text-blue-500"
              onClick={(e) => {
                e.preventDefault();
                router.push("/sign-up"); // Add redirect to sign-up
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
