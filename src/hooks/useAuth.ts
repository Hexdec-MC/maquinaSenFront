import { useState, useCallback } from 'react';
import type { User } from '../types';
import { API_URL } from '../utils/constants';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        setError('Credenciales incorrectas');
        return false;
      }

      const userData = await response.json();
      setUser(userData);
      return true;
    } catch (err) {
      setError('Error de conexión con el servidor');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError('');
  }, []);

  return { user, setUser, isLoading, error, login, logout };
};
