// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = authService.getToken();
    const userData = authService.getUser();
    if (token && userData) {
      setUser(userData);
    }
  }, []);

  return { user };
};