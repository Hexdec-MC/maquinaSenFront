import { useState, useCallback } from 'react';
import type { Machine, Supply, MaintenanceRecord } from '../types';
import { API_URL } from '../utils/constants';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMachines = useCallback(async (): Promise<Machine[]> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/machines`);
      if (!response.ok) throw new Error('Error al cargar máquinas');
      return await response.json();
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
      const response = await fetch(`${API_URL}/supplies`);
      if (!response.ok) throw new Error('Error al cargar suministros');
      return await response.json();
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
      const response = await fetch(`${API_URL}/maintenance`);
      if (!response.ok) throw new Error('Error al cargar mantenimientos');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const post = useCallback(async <T,>(endpoint: string, data: T): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Error en POST ${endpoint}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  }, []);

  const put = useCallback(async <T,>(endpoint: string, data: T): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Error en PUT ${endpoint}`);
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
