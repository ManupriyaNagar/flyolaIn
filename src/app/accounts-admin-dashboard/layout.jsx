"use client";

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountsAdminLayout({ children }) {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || authState.userRole !== '7')) {
      router.push('/sign-in');
    }
  }, [authState, router]);

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authState.isLoggedIn || authState.userRole !== '7') {
    return null;
  }

  return <>{children}</>;
}