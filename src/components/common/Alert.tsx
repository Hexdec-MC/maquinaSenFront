import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { Message } from '../../types';

interface AlertProps extends Message {
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  text,
  type,
  onClose
}) => {
  const config = {
    success: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-500',
      icon: CheckCircle,
      text: 'text-green-800',
      title: 'Éxito'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-l-4 border-red-500',
      icon: AlertCircle,
      text: 'text-red-800',
      title: 'Error'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-l-4 border-yellow-500',
      icon: AlertTriangle,
      text: 'text-yellow-800',
      title: 'Advertencia'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-500',
      icon: Info,
      text: 'text-blue-800',
      title: 'Información'
    }
  };

  const { bg, border, icon: Icon, text: textColor, title } = config[type];

  return (
    <div className={`${bg} ${border} p-4 rounded flex items-start justify-between`}>
      <div className="flex items-start">
        <Icon className={`${textColor} mr-3 flex-shrink-0`} size={20} />
        <div>
          <h3 className={`${textColor} font-semibold`}>{title}</h3>
          <p className={`${textColor} text-sm mt-1`}>{text}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${textColor} hover:opacity-70 transition`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
