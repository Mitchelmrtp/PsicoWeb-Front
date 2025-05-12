import React from 'react';

const Button = ({
  type = 'button',
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false,
}) => {
  const baseStyles = "py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
  };
  
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${widthClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;