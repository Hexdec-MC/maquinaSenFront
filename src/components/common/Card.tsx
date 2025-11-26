import React from 'react';
interface CardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  icon: Icon,
  children,
  className = ''
}) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100 ${className}`}>
    <div className="flex items-center mb-6 pb-3 border-b-2 border-indigo-200">
      <div className="bg-indigo-100 p-2 rounded-lg mr-4">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);
