export const runtime = 'experimental-edge';

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define role constants for better maintainability
const ROLES = {
  ADMIN: 1,
  AGENT: 2,
  USER: 3
};

// Define route access rules
const ROUTE_ACCESS = {
  '/admin-dashboard': [ROLES.ADMIN],
  '/agent-dashboard': [ROLES.AGENT],
  '/user-dashboard': [ROLES.USER],
  '/booking-agent-dashboard': [ROLES.AGENT],
  '/scheduled-flight': [ROLES.USER, ROLES.AGENT], // Users and agents can access
  '/booking': [ROLES.USER, ROLES.AGENT], // Users and agents can access booking page
  '/combined-booking-page': [ROLES.USER, ROLES.AGENT],
  '/get-ticket': [ROLES.USER, ROLES.AGENT],
  '/ticket-page': [ROLES.USER, ROLES.AGENT]
};

// Routes that require authentication but allow multiple roles
const PROTECTED_ROUTES = [
  '/admin-dashboard',
  '/agent-dashboard', 
  '/user-dashboard',
  '/booking-agent-dashboard',
  '/scheduled-flight',
  '/booking',
  '/combined-booking-page',
  '/get-ticket',
  '/ticket-page'
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  console.log("[Middleware] Request path:", pathname);
  console.log("[Middleware] Token found:", !!token);

  // Check if the route requires protection
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    console.log("[Middleware] Public route, allowing access");
    return NextResponse.next();
  }

  // If protected route but no token, redirect to sign-in
  if (!token) {
    console.log("[Middleware] No token found for protected route. Redirecting to /sign-in.");
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

    // Check role-based access for specific routes
    for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ACCESS)) {
      if (pathname.startsWith(routePrefix)) {
        if (!allowedRoles.includes(userRole)) {
          console.log(`[Middleware] Access denied for ${routePrefix}. User role: ${userRole}, Required roles: ${allowedRoles}`);
          
          // Redirect to appropriate dashboard based on user role
          const redirectPath = getRedirectPath(userRole);
          return NextResponse.redirect(new URL(redirectPath, req.url));
        }
        break;
      }
    }

    console.log("[Middleware] Access granted for role:", userRole);
    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Token verification failed:", error.message);
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
}

// Helper function to get redirect path based on user role
function getRedirectPath(userRole) {
  switch (userRole) {
    case ROLES.ADMIN:
      return '/admin-dashboard';
    case ROLES.AGENT:
      return '/agent-dashboard';
    case ROLES.USER:
      return '/user-dashboard';
    default:
      return '/sign-in';
  }
}

export const config = {
  matcher: [
    '/admin-dashboard/:path*', 
    '/agent-dashboard/:path*',
    '/user-dashboard/:path*', 
    '/booking-agent-dashboard/:path*',
    '/scheduled-flight/:path*',
    '/booking/:path*',
    '/combined-booking-page/:path*',
    '/get-ticket/:path*',
    '/ticket-page/:path*'
  ],
};
