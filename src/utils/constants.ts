import type { PMData } from '../types';

export const API_URL = 'http://localhost:3001/api';

export const PM_INTERVALS = {
  PM1: 250,
  PM2: 500,
  PM3: 1000,
  PM4: 2000
};

export const calculateNextPm = (lastPmType: string, lastPmHm: number): PMData => {
  const nextPmOrder: Record<string, number> = {
    'Nuevo': 1,
    'PM1': 2,
    'PM2': 3,
    'PM3': 4,
    'PM4': 1
  };

  const currentPmOrder = nextPmOrder[lastPmType] || 1;
  let nextPmType: string;
  let interval: number;

  switch (currentPmOrder) {
    case 1:
      nextPmType = 'PM1';
      interval = PM_INTERVALS.PM1;
      break;
    case 2:
      nextPmType = 'PM2';
      interval = PM_INTERVALS.PM2;
      break;
    case 3:
      nextPmType = 'PM3';
      interval = PM_INTERVALS.PM3;
      break;
    case 4:
      nextPmType = 'PM4';
      interval = PM_INTERVALS.PM4;
      break;
    default:
      nextPmType = 'PM1';
      interval = PM_INTERVALS.PM1;
  }

  return {
    next_pm_type: nextPmType,
    next_pm_due_hm: lastPmHm + interval
  };
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getMaintenanceColor = (pmType: string): string => {
  const colors: Record<string, string> = {
    'PM1': 'bg-blue-100 text-blue-800 border-blue-300',
    'PM2': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'PM3': 'bg-orange-100 text-orange-800 border-orange-300',
    'PM4': 'bg-red-100 text-red-800 border-red-300'
  };
  return colors[pmType] || 'bg-gray-100 text-gray-800 border-gray-300';
};
