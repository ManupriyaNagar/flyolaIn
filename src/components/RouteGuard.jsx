"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';

// Define role constants
const ROLES = {
  ADMIN: '1',
  AGENT: '2', 
  USER: '3'
};

// Define route access rules (client-side validation)
const ROUTE_ACCESS = {
  '/admin-dashboard': [ROLES.ADMIN],
  '/agent-dashboard': [ROLES.AGENT],
  '/user-dashboard': [ROLES.USER],
  '/booking-agent-dashboard': [ROLES.AGENT],
  '/scheduled-flight': [ROLES.USER, ROLES.AGENT],
  '/combined-booking-page': [ROLES.USER, ROLES.AGENT],
  '/get-ticket': [ROLES.USER, ROLES.AGENT],
  '/ticket-page': [ROLES.USER, ROLES.AGENT]
};

const RouteGuard = ({ children }) => {
  const { authState } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      // If still loading auth state, wait
      if (authState.isLoading) {
        setIsLoading(true);
        return;
      }

      // If not logged in, redirect to sign-in
      if (!authState.isLoggedIn) {
        console.log('[RouteGuard] User not logged in, redirecting to sign-in');
        router.push('/sign-in');
        return;
      }

      const userRole = authState.userRole || authState.user?.role;
      console.log('[RouteGuard] Checking access for:', { pathname, userRole });

      // Check if current route requires specific role access
      let hasAccess = true;
      for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ACCESS)) {
        if (pathname.startsWith(routePrefix)) {
          hasAccess = allowedRoles.includes(userRole);
          if (!hasAccess) {
            console.log(`[RouteGuard] Access denied for ${routePrefix}. User role: ${userRole}, Required: ${allowedRoles}`);
            // Redirect to appropriate dashboard
            const redirectPath = getRedirectPath(userRole);
            router.push(redirectPath);
            return;
          }
          break;
        }
      }

      console.log('[RouteGuard] Access granted');
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAccess();
  }, [authState, pathname, router]);

  // Helper function to get redirect path based on user role
  const getRedirectPath = (userRole) => {
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
  };

  // Show loading while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if access is denied
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render children if authorized
  return children;
};

export default RouteGuard;