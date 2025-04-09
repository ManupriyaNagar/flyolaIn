// hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [authState, setAuthState] = useState({ isLoggedIn: false, userRole: null });

  useEffect(() => {
    const savedAuthState = localStorage.getItem('authState');
    if (savedAuthState) {
      setAuthState(JSON.parse(savedAuthState));
    }
  }, []);

  return { authState, setAuthState };
};
