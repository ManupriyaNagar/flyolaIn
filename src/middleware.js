import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  console.log("[Middleware] Request path:", req.nextUrl.pathname);
  console.log("[Middleware] Token found:", !!token);

  if (!token) {
    console.log("[Middleware] No token found. Redirecting to /sign-in.");
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[Middleware] JWT payload:", payload);

    if (req.nextUrl.pathname.startsWith("/admin-dashboard") && payload.role !== "1") {
      console.log("[Middleware] Unauthorized role for admin dashboard.");
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/user-dashboard") && payload.role !== "3") {
      console.log("[Middleware] Unauthorized role for user dashboard.");
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    console.log("[Middleware] Access granted.");
    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Token verification error:", error.message);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/admin-dashboard/:path*", "/user-dashboard/:path*"],
};