import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader: React.FC = () => (
  <div className="flex justify-center items-center p-8">
    <Loader2 className="animate-spin mr-3 text-indigo-600" size={24} />
    <span className="text-indigo-600 font-semibold">Cargando...</span>
  </div>
);
