import { useState, useCallback } from 'react';
import type { User } from '../types';
import { supabase } from '../utils/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError('');
    try {
      // We treat `username` as email for Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: username,
        password
      });

      if (authError || !authData?.user) {
        setError(authError?.message || 'Credenciales incorrectas');
        return false;
      }

      // Try to get profile (optional) from `profiles` table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username, role')
        .eq('id', authData.user.id)
        .single();

      const userObj: User = {
        id: authData.user.id,
        username: (profile && (profile.username || username)) || username,
        role: (profile && profile.role) || 'user'
      };

      if (profileError && profileError.code !== 'PGRST116') {
        // ignore "no rows" type errors, otherwise log
        console.warn('Profile fetch error:', profileError.message);
      }

      setUser(userObj);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión con el servidor');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error signing out', e);
    }
    setUser(null);
    setError('');
  }, []);

  return { user, setUser, isLoading, error, login, logout };
};
