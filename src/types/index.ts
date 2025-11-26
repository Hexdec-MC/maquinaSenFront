export interface User {
  id?: string;
  username: string;
  role: string;
}

export interface Machine {
  id: number;
  name: string;
  model: string;
  current_hm: number;
  is_in_use: boolean;
  last_pm_type: string;
  last_pm_hm: number;
  next_pm_type: string;
  next_pm_due_hm: number;
}

export interface Supply {
  id: string;
  name: string;
  stock: number;
  unit: string;
}

export interface MaintenanceRecord {
  id: number;
  machine_id: number;
  machine_name: string;
  type: string;
  description: string;
  hm_done_at: number;
  created_at: string;
}

export interface Message {
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface PMData {
  next_pm_type: string;
  next_pm_due_hm: number;
}
