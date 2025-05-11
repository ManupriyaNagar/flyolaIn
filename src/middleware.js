export const runtime = 'experimental-edge';

import { NextResponse } from 'next/server'; // Ensure this import is present
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  console.log("[Middleware] Request path:", pathname);
  console.log("[Middleware] Token found:", !!token);

  if (!token) {
    console.log("[Middleware] No token found. Redirecting to /sign-in.");
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    console.log("[Middleware] JWT payload:", payload);

    const userRole = Number(payload.role);
    if (isNaN(userRole)) {
      console.error("[Middleware] Invalid role in payload:", payload.role);
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (pathname.startsWith('/admin-dashboard') && userRole !== 1) {
      console.log("[Middleware] Access denied for admin-dashboard. User role:", userRole);
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (pathname.startsWith('/user-dashboard') && userRole !== 3) {
      console.log("[Middleware] Access denied for user-dashboard. User role:", userRole);
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    console.log("[Middleware] Access granted for role:", userRole);
    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Token verification failed:", error.message);
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
}

export const config = {
  matcher: ['/admin-dashboard/:path*', '/user-dashboard/:path*'],
};