// frontend/middleware.js
export const runtime = 'experimental-edge';

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  console.log("[Middleware] Request path:", pathname);

  // Only protect routes under /admin-dashboard and /user-dashboard
  if (!pathname.startsWith('/admin-dashboard') && !pathname.startsWith('/user-dashboard')) {
    console.log("[Middleware] Unprotected route. Continuing.");
    return NextResponse.next();
  }

  if (!token) {
    console.log("[Middleware] No token found. Redirecting to /sign-in.");
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  try {
    // Use the JWT_SECRET from next.config.js
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    console.log("[Middleware] JWT payload:", payload);
    const userRole = Number(payload.role);

    // For admin-dashboard: Only allow if role === 1 and remember_token is present
    if (pathname.startsWith('/admin-dashboard')) {
      if (userRole !== 1 || !payload.remember_token) {
        console.log("[Middleware] DENIED: Admin-dashboard access denied. User role:", userRole, "remember_token:", payload.remember_token);
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }
    }

    // For user-dashboard: Only allow if role === 3
    if (pathname.startsWith('/user-dashboard')) {
      if (userRole !== 3) {
        console.log("[Middleware] DENIED: User-dashboard access denied. User role:", userRole);
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }
    }

    console.log("[Middleware] Access granted for path:", pathname);
    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Token verification failed:", error);
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
}

export const config = {
  matcher: ['/admin-dashboard/:path*', '/user-dashboard/:path*'],
};
