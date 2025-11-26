import React, { useState } from 'react';
import { Plus, Package as PackageIcon } from 'lucide-react';
import { Card, Button, Modal, FormInput } from '../common';
import type { Supply } from '../../types';
import { useApi } from '../../hooks';

interface InventoryManagementProps {
  supplies: Supply[];
  refreshData: () => void;
  showMessage: (text: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const SupplyCard: React.FC<{ supply: Supply }> = ({ supply }) => {
  const stockStatus =
    supply.stock === 0 ? 'bg-red-100' : supply.stock < 10 ? 'bg-yellow-100' : 'bg-green-100';
  const stockColor = supply.stock === 0 ? 'text-red-700' : supply.stock < 10 ? 'text-yellow-700' : 'text-green-700';

  return (
    <div className={`p-4 rounded-lg border-l-4 border-indigo-500 shadow hover:shadow-md transition ${stockStatus}`}>
      <h4 className="font-bold text-gray-800 mb-2">{supply.name}</h4>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm">Stock:</span>
        <span className={`font-bold text-lg ${stockColor}`}>
          {supply.stock} {supply.unit}
        </span>
      </div>
      {supply.stock < 10 && (
        <p className="text-yellow-700 text-xs mt-2 font-semibold">⚠️ Stock bajo</p>
      )}
    </div>
  );
};

export const InventoryManagement: React.FC<InventoryManagementProps> = ({
  supplies,
  refreshData,
  showMessage
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', stock: '', unit: 'Unidades' });
  const { post } = useApi();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.stock || !formData.unit.trim()) {
      showMessage('Por favor completa todos los campos', 'warning');
      return;
    }

    const supplyData = {
      name: formData.name.trim(),
      stock: parseInt(formData.stock),
      unit: formData.unit.trim()
    };

    if (await post('/supplies', supplyData)) {
      showMessage('Suministro guardado exitosamente', 'success');
      setModalOpen(false);
      setFormData({ name: '', stock: '', unit: 'Unidades' });
      refreshData();
    } else {
      showMessage('Error al guardar el suministro', 'error');
    }
  };

  const totalValue = supplies.reduce((sum, s) => sum + s.stock, 0);
  const lowStockCount = supplies.filter(s => s.stock < 10).length;

  return (
    <>
      <Card title="Inventario de Suministros" icon={PackageIcon}>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Total de Artículos</p>
            <p className="text-2xl font-bold text-blue-600">{supplies.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Stock Total</p>
            <p className="text-2xl font-bold text-green-600">{totalValue}</p>
          </div>
          <div className={`p-4 rounded-lg border-l-4 ${lowStockCount > 0 ? 'bg-yellow-50 border-yellow-500' : 'bg-green-50 border-green-500'}`}>
            <p className="text-sm text-gray-600">Stock Bajo</p>
            <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
              {lowStockCount}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <Button
            onClick={() => setModalOpen(true)}
            variant="success"
            className="flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Agregar Suministro
          </Button>
        </div>

        {supplies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay suministros registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplies.map(supply => (
              <SupplyCard key={supply.id} supply={supply} />
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={modalOpen} title="Nuevo Suministro" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput
            label="Nombre del Suministro"
            placeholder="Ej: Aceite hidráulico"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormInput
            label="Cantidad"
            type="number"
            placeholder="Ej: 50"
            value={formData.stock}
            onChange={e => setFormData({ ...formData, stock: e.target.value })}
            required
          />
          <FormInput
            label="Unidad de Medida"
            placeholder="Ej: Litros"
            value={formData.unit}
            onChange={e => setFormData({ ...formData, unit: e.target.value })}
            required
          />
          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Guardar Suministro
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
