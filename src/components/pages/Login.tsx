import React, { useState } from 'react';
import { LogIn, Truck } from 'lucide-react';
import { Button, FormInput, Alert } from '../common';

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  isLoading?: boolean;
  error?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isLoading = false, error }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!username.trim() || !password.trim()) {
      setLocalError('Por favor completa todos los campos');
      return;
    }

    onLogin({
      username: username.trim(),
      password: password.trim()
    });
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Truck className="text-indigo-600" size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Heavy Machinery</h1>
          <p className="text-indigo-100">Sistema de Gestión Local</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>

          {displayError && (
            <Alert
              text={displayError}
              type="error"
              onClose={() => setLocalError('')}
            />
          )}

          <FormInput
            label="Usuario"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={isLoading}
            required
          />

          <FormInput
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block mr-2">⟳</span>
                Conectando...
              </>
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Entrar
              </>
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Credenciales de prueba: <br />
            <span className="font-semibold">admin / 123</span>
          </p>
        </form>
      </div>
    </div>
  );
};
