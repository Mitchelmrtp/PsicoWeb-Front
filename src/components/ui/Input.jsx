import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';

// Componente Input siguiendo principios de Atomic Design
const Input = forwardRef(({ 
  type = 'text',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  labelClassName = '',
  ...props 
}, ref) => {
  const baseInputClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed';
  
  const errorClasses = error 
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
    : '';

  const inputClasses = cn(
    baseInputClasses,
    errorClasses,
    {
      'pl-10': leftIcon,
      'pr-10': rightIcon,
    },
    className
  );

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label 
          className={cn(
            'block text-sm font-medium text-gray-700 mb-1',
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">
              {leftIcon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
