import { cn } from '../../utils/classNames';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue',
  className = '',
  fullScreen = false 
}) => {
  const sizeVariants = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorVariants = {
    blue: 'border-blue-500',
    indigo: 'border-indigo-500',
    gray: 'border-gray-500',
    green: 'border-green-500',
    red: 'border-red-500',
  };

  const spinnerClasses = cn(
    'animate-spin rounded-full border-t-2 border-b-2',
    sizeVariants[size],
    colorVariants[color],
    className
  );

  const containerClasses = cn(
    'flex items-center justify-center',
    {
      'min-h-screen bg-gray-50': fullScreen,
      'h-40': !fullScreen,
    }
  );

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} />
    </div>
  );
};

export default LoadingSpinner;
