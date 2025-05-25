import React from 'react';

const Input = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  label,
  required = false,
  placeholder = '',
  className = '',
  disabled = false,
  min,
  max,
}) => {
  return (
    <div className="mb-0">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
    </div>
  );
};

export default Input;