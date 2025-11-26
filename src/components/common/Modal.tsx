import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl'
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
          <h3 className="text-xl font-bold text-indigo-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
