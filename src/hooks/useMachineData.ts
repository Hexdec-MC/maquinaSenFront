import { useState, useEffect } from 'react';
import type { Machine, Supply, MaintenanceRecord } from '../types';
import { useApi } from './useApi';

export const useMachineData = () => {
  const { fetchMachines, fetchSupplies, fetchMaintenance } = useApi();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [machinesData, suppliesData, maintenanceData] = await Promise.all([
        fetchMachines(),
        fetchSupplies(),
        fetchMaintenance()
      ]);
      setMachines(machinesData);
      setSupplies(suppliesData);
      setMaintenanceHistory(maintenanceData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    machines,
    setMachines,
    supplies,
    setSupplies,
    maintenanceHistory,
    setMaintenanceHistory,
    isLoading,
    refreshData: loadData
  };
};
