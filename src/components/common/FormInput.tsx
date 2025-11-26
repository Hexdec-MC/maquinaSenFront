import React from 'react';

interface FormInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  disabled = false
}) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
        error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
