import { useState } from 'react';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return {
    isAuthenticated,
    setIsAuthenticated,
    isAdmin: isAuthenticated,
    isLoading: false,
  };
}
