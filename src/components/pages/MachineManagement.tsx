import React, { useState } from 'react';
import { Plus, ShieldCheck } from 'lucide-react';
import { Card, Button, Modal, FormInput } from '../common';
import type { Machine } from '../../types';
import { calculateNextPm } from '../../utils/constants';
import { useApi } from '../../hooks';

interface MachineManagementProps {
  machines: Machine[];
  refreshData: () => void;
  showMessage: (text: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const MachineCard: React.FC<{ machine: Machine }> = ({ machine }) => (
  <div
    className={`p-5 rounded-xl border-l-4 shadow-md hover:shadow-lg transition ${
      machine.is_in_use ? 'border-l-orange-500 bg-orange-50' : 'border-l-green-500 bg-green-50'
    }`}
  >
    <h3 className="font-bold text-lg text-gray-800">{machine.name}</h3>
    <p className="text-gray-600 text-sm mb-3">{machine.model}</p>

    <div className="space-y-2 mb-4">
      <p className="flex justify-between items-center">
        <span className="text-gray-600">Horómetro:</span>
        <span className="font-bold text-indigo-600 text-lg">{machine.current_hm}h</span>
      </p>
      <p className="flex justify-between items-center">
        <span className="text-gray-600">Próximo PM:</span>
        <span className="font-semibold text-blue-600">{machine.next_pm_type}</span>
      </p>
      <p className="flex justify-between items-center text-sm text-gray-500">
        <span>Vencimiento:</span>
        <span>{machine.next_pm_due_hm}h</span>
      </p>
    </div>

    <div className="flex items-center justify-between">
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full ${
          machine.is_in_use
            ? 'bg-orange-200 text-orange-800'
            : 'bg-green-200 text-green-800'
        }`}
      >
        {machine.is_in_use ? '⚙️ En Uso' : '✓ Disponible'}
      </span>
    </div>
  </div>
);

export const MachineManagement: React.FC<MachineManagementProps> = ({
  machines,
  refreshData,
  showMessage
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', model: '', current_hm: '' });
  const { post } = useApi();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.model.trim() || !formData.current_hm) {
      showMessage('Por favor completa todos los campos', 'warning');
      return;
    }

    const hmInt = parseInt(formData.current_hm);
    const pmData = calculateNextPm('Nuevo', hmInt);
    const newMachine = {
      ...formData,
      current_hm: hmInt,
      ...pmData,
      last_pm_type: 'Nuevo',
      last_pm_hm: 0,
      is_in_use: false
    };

    if (await post('/machines', newMachine)) {
      showMessage('Máquina registrada exitosamente', 'success');
      setModalOpen(false);
      setFormData({ name: '', model: '', current_hm: '' });
      refreshData();
    } else {
      showMessage('Error al registrar la máquina', 'error');
    }
  };

  return (
    <>
      <Card title="Maquinaria" icon={ShieldCheck}>
        <div className="mb-6">
          <Button
            onClick={() => setModalOpen(true)}
            variant="success"
            className="flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Registrar Nueva Máquina
          </Button>
        </div>

        {machines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay máquinas registradas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.map(machine => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={modalOpen} title="Registrar Nueva Máquina" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput
            label="Nombre de la Máquina"
            placeholder="Ej: Excavadora CAT 320"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormInput
            label="Modelo"
            placeholder="Ej: CAT 320"
            value={formData.model}
            onChange={e => setFormData({ ...formData, model: e.target.value })}
            required
          />
          <FormInput
            label="Horómetro Actual (horas)"
            type="number"
            placeholder="Ej: 1000"
            value={formData.current_hm}
            onChange={e => setFormData({ ...formData, current_hm: e.target.value })}
            required
          />
          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Guardar Máquina
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
