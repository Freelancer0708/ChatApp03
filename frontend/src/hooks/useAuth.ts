import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    setIsAuthenticated(!!username);
  }, []);

  return isAuthenticated;
}
