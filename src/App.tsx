import React, { useEffect } from 'react';
import { LogOut, Truck } from 'lucide-react';
import {
  Login,
  MachineManagement,
  MaintenanceManagement,
  InventoryManagement
} from './components/pages';
import { Alert, Button } from './components/common';
import { useAuth, useMessage, useMachineData } from './hooks';

type TabType = 'machines' | 'maintenance' | 'inventory';

const Tabs: React.FC<{ activeTab: TabType; onTabChange: (tab: TabType) => void }> = ({
  activeTab,
  onTabChange
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'machines', label: 'Maquinaria', icon: '⚙️' },
    { id: 'maintenance', label: 'Mantenimiento', icon: '🔧' },
    { id: 'inventory', label: 'Inventario', icon: '📦' }
  ];

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
          }`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const Header: React.FC<{
  user: { username: string; role: string };
  onLogout: () => void;
}> = ({ user, onLogout }) => (
  <header className="bg-gradient-to-r from-indigo-800 to-blue-800 text-white p-6 rounded-xl shadow-lg mb-6 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
        <Truck size={28} />
      </div>
      <div>
        <h1 className="text-3xl font-bold">Heavy Machinery Local</h1>
        <p className="text-indigo-100 text-sm">Sistema de Gestión</p>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className="font-semibold">{user.username}</p>
        <p className="text-indigo-200 text-sm capitalize">{user.role}</p>
      </div>
      <Button
        onClick={onLogout}
        variant="danger"
        size="md"
        className="flex items-center gap-2"
      >
        <LogOut size={18} />
        Salir
      </Button>
    </div>
  </header>
);

export default function App() {
  const { user, isLoading: authLoading, error: authError, login, logout } = useAuth();
  const { message, showMessage, clearMessage } = useMessage();
  const {
    machines,
    supplies,
    maintenanceHistory,
    isLoading: dataLoading,
    refreshData
  } = useMachineData();
  const [activeTab, setActiveTab] = React.useState<TabType>('machines');

  useEffect(() => {
    if (user) {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    const success = await login(credentials.username, credentials.password);
    if (!success) {
      showMessage('Credenciales incorrectas', 'error');
    }
  };

  if (!user) {
    return (
      <Login
        onLogin={handleLogin}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Header user={user} onLogout={logout} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Messages */}
        {message && (
          <div className="mb-6">
            <Alert
              text={message.text}
              type={message.type}
              onClose={clearMessage}
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Loading State */}
        {dataLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin mr-3">⟳</div>
            <span className="text-indigo-600 font-semibold">Cargando datos...</span>
          </div>
        ) : (
          <>
            {/* Content by Tab */}
            {activeTab === 'machines' && (
              <MachineManagement
                machines={machines}
                refreshData={refreshData}
                showMessage={showMessage}
              />
            )}

            {activeTab === 'maintenance' && (
              <MaintenanceManagement
                machines={machines}
                maintenanceHistory={maintenanceHistory}
                refreshData={refreshData}
                showMessage={showMessage}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryManagement
                supplies={supplies}
                refreshData={refreshData}
                showMessage={showMessage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}