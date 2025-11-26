import React, { useState } from 'react';
import { Wrench, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, Button, Modal, FormInput } from '../common';
import type { Machine, MaintenanceRecord } from '../../types';
import { calculateNextPm, formatDate, getMaintenanceColor } from '../../utils/constants';
import { useApi } from '../../hooks';

interface MaintenanceManagementProps {
  machines: Machine[];
  maintenanceHistory: MaintenanceRecord[];
  refreshData: () => void;
  showMessage: (text: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const MachineMaintenanceCard: React.FC<{
  machine: Machine;
  onRegister: (machine: Machine) => void;
}> = ({ machine, onRegister }) => {
  const daysOverdue = machine.next_pm_due_hm < machine.current_hm;
  const hoursRemaining = machine.next_pm_due_hm - machine.current_hm;

  return (
    <div
      className={`p-4 rounded-lg border-l-4 shadow hover:shadow-md transition ${
        daysOverdue
          ? 'border-l-red-500 bg-red-50'
          : hoursRemaining < 50
            ? 'border-l-yellow-500 bg-yellow-50'
            : 'border-l-green-500 bg-green-50'
      }`}
    >
      <h4 className="font-bold text-gray-800 mb-3 flex items-center">
        {daysOverdue && <AlertCircle className="text-red-600 mr-2" size={18} />}
        {machine.name}
      </h4>

      <div className="space-y-2 mb-4 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-600">Horómetro actual:</span>
          <span className="font-semibold">{machine.current_hm}h</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Próximo PM:</span>
          <span className={`font-semibold px-2 py-1 rounded text-xs ${getMaintenanceColor(
            machine.next_pm_type
          )}`}>
            {machine.next_pm_type}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Vencimiento:</span>
          <span className={`font-semibold ${daysOverdue ? 'text-red-600' : 'text-gray-700'}`}>
            {machine.next_pm_due_hm}h
          </span>
        </p>
        <p className="flex justify-between text-xs text-gray-500 pt-2">
          <span>Horas restantes:</span>
          <span className={`font-bold ${daysOverdue ? 'text-red-600' : 'text-green-600'}`}>
            {Math.max(0, hoursRemaining)}h
          </span>
        </p>
      </div>

      <Button
        onClick={() => onRegister(machine)}
        variant={daysOverdue ? 'danger' : 'primary'}
        size="sm"
        className="w-full"
      >
        {daysOverdue ? '⚠️ Registrar PM (VENCIDO)' : 'Registrar PM'}
      </Button>
    </div>
  );
};

const MaintenanceHistoryItem: React.FC<{ record: MaintenanceRecord }> = ({ record }) => (
  <div className="border-l-4 border-indigo-300 pl-4 py-3 hover:bg-gray-50 rounded transition">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{record.machine_name}</p>
        <p className="text-sm text-gray-600 mt-1">{record.description}</p>
        <p className="text-xs text-gray-500 mt-2">
          <Clock size={14} className="inline mr-1" />
          Realizado a {record.hm_done_at}h
        </p>
      </div>
      <div className="text-right">
        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-semibold">
          {record.type}
        </span>
        <p className="text-xs text-gray-500 mt-2">{formatDate(record.created_at)}</p>
      </div>
    </div>
  </div>
);

export const MaintenanceManagement: React.FC<MaintenanceManagementProps> = ({
  machines,
  maintenanceHistory,
  refreshData,
  showMessage
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState({ hm_done_at: '', description: '' });
  const { post, put } = useApi();

  const handleOpenModal = (machine: Machine) => {
    setSelectedMachine(machine);
    setFormData({
      hm_done_at: machine.current_hm.toString(),
      description: machine.next_pm_type
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMachine || !formData.hm_done_at || !formData.description.trim()) {
      showMessage('Por favor completa todos los campos', 'warning');
      return;
    }

    const hmDoneAt = parseInt(formData.hm_done_at);

    if (hmDoneAt < selectedMachine.last_pm_hm) {
      showMessage('El horómetro no puede ser menor al último registro', 'error');
      return;
    }

    const newPmData = calculateNextPm(selectedMachine.next_pm_type, hmDoneAt);

    try {
      // Actualizar máquina
      await put(`/machines/${selectedMachine.id}`, {
        current_hm: hmDoneAt,
        ...newPmData,
        last_pm_type: selectedMachine.next_pm_type,
        last_pm_hm: hmDoneAt
      });

      // Guardar historial
      await post('/maintenance', {
        machine_id: selectedMachine.id,
        machine_name: selectedMachine.name,
        type: 'Programado',
        description: formData.description.trim(),
        hm_done_at: hmDoneAt
      });

      showMessage('Mantenimiento registrado exitosamente', 'success');
      setModalOpen(false);
      setSelectedMachine(null);
      setFormData({ hm_done_at: '', description: '' });
      refreshData();
    } catch {
      showMessage('Error al registrar el mantenimiento', 'error');
    }
  };

  const overdueCount = machines.filter(m => m.next_pm_due_hm < m.current_hm).length;
  const warningCount = machines.filter(
    m => m.next_pm_due_hm - m.current_hm < 50 && m.next_pm_due_hm >= m.current_hm
  ).length;

  return (
    <>
      <Card title="Gestión de Mantenimiento" icon={Wrench}>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <p className="text-sm text-gray-600 flex items-center">
              <AlertCircle className="mr-2" size={16} />
              Vencidos
            </p>
            <p className="text-2xl font-bold text-red-600 mt-2">{overdueCount}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 flex items-center">
              <Clock className="mr-2" size={16} />
              Por Vencer
            </p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{warningCount}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-600 flex items-center">
              <CheckCircle className="mr-2" size={16} />
              Vigentes
            </p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {machines.length - overdueCount - warningCount}
            </p>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-4 text-gray-800">Máquinas Requieren PM</h3>
        {machines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay máquinas registradas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {machines.map(machine => (
              <MachineMaintenanceCard
                key={machine.id}
                machine={machine}
                onRegister={handleOpenModal}
              />
            ))}
          </div>
        )}

        {/* Maintenance History */}
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Historial Reciente</h3>
          {maintenanceHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay registros de mantenimiento</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {maintenanceHistory.slice(0, 10).map(record => (
                <MaintenanceHistoryItem key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        title={`Registrar PM - ${selectedMachine?.name || ''}`}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">Próximo PM: {selectedMachine?.next_pm_type}</p>
            <p>Vencimiento: {selectedMachine?.next_pm_due_hm}h</p>
          </div>

          <FormInput
            label="Horómetro al Realizar PM"
            type="number"
            placeholder="Ej: 1500"
            value={formData.hm_done_at}
            onChange={e => setFormData({ ...formData, hm_done_at: e.target.value })}
            required
          />

          <FormInput
            label="Descripción de Actividades"
            placeholder="Describe el mantenimiento realizado..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Registrar PM
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
