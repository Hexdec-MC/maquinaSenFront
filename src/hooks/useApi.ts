import { useState, useCallback } from 'react';
import type { Machine, Supply, MaintenanceRecord } from '../types';
import { supabase } from '../utils/supabaseClient';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMachines = useCallback(async (): Promise<Machine[]> => {
    try {
      setIsLoading(true);
      const { data, error: e } = await supabase.from('machines').select('*');
      if (e) throw e;
      return (data as Machine[]) ?? [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSupplies = useCallback(async (): Promise<Supply[]> => {
    try {
      setIsLoading(true);
      const { data, error: e } = await supabase.from('supplies').select('*');
      if (e) throw e;
      return (data as Supply[]) ?? [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMaintenance = useCallback(async (): Promise<MaintenanceRecord[]> => {
    try {
      setIsLoading(true);
      const { data, error: e } = await supabase.from('maintenance').select('*').order('created_at', { ascending: false });
      if (e) throw e;
      return (data as MaintenanceRecord[]) ?? [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const post = useCallback(async <T,>(endpoint: string, data: T): Promise<boolean> => {
    try {
      const table = endpoint.replace(/^\//, '').split('/')[0];
      const { error: e } = await supabase.from(table).insert([data]);
      if (e) throw e;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  }, []);

  const put = useCallback(async <T,>(endpoint: string, data: T): Promise<boolean> => {
    try {
      const parts = endpoint.replace(/^\//, '').split('/');
      const table = parts[0];
      const id = parts[1];
      if (!id) throw new Error('PUT endpoint must include id');
      const idValue = isNaN(Number(id)) ? id : Number(id);
      const { error: e } = await supabase.from(table).update(data).eq('id', idValue);
      if (e) throw e;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return {
    isLoading,
    error,
    fetchMachines,
    fetchSupplies,
    fetchMaintenance,
    post,
    put,
    clearError
  };
};
