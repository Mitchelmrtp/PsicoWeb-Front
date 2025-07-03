import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';

// Variantes del botón
const buttonVariants = {
  variant: {
    primary: 'bg-indigo-800 text-white hover:bg-indigo-900 focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-indigo-800 text-indigo-800 hover:bg-indigo-50 focus:ring-indigo-500',
    ghost: 'text-indigo-800 hover:bg-indigo-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  },
};

// Componente Button siguiendo el principio de responsabilidad única
const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = buttonVariants.variant[variant];
  const sizeClasses = buttonVariants.size[size];
  
  const buttonClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    className,
    {
      'cursor-not-allowed opacity-50': isLoading || disabled,
    }
  );

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
