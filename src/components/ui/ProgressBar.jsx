/**
 * Componente Progress Bar reutilizable
 * Muestra progreso con animaciones y personalización
 */
import React from 'react';

const ProgressBar = ({ 
  value, 
  max = 100, 
  size = 'md',
  variant = 'primary',
  showLabel = true,
  label = null,
  animated = true,
  className = ''
}) => {
  // Calcular porcentaje
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Clases de tamaño
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  };

  // Clases de color/variante
  const variantClasses = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-cyan-500'
  };

  // Determinar color basado en porcentaje si no se especifica variante
  const getVariantByPercentage = () => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'primary';
    if (percentage >= 40) return 'warning';
    return 'danger';
  };

  const finalVariant = variant === 'auto' ? getVariantByPercentage() : variant;

  // Label por defecto
  const displayLabel = label || `${Math.round(percentage)}%`;

  return (
    <div className={`w-full ${className}`}>
      {/* Label superior */}
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            {displayLabel}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      {/* Barra de progreso */}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${sizeClasses[size]} ${variantClasses[finalVariant]} rounded-full transition-all duration-500 ease-out ${
            animated ? 'transform' : ''
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax={max}
        >
          {/* Animación de brillo para barras más grandes */}
          {size === 'lg' || size === 'xl' ? (
            <div className="h-full bg-gradient-to-r from-transparent via-white via-transparent to-transparent opacity-30 animate-pulse" />
          ) : null}
        </div>
      </div>

      {/* Información adicional */}
      {(size === 'lg' || size === 'xl') && showLabel && (
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
          <span>{value} de {max}</span>
          <span>
            {percentage === 100 ? 'Completado' : 'En progreso'}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Componente Progress Circle para espacios más compactos
 */
export const ProgressCircle = ({ 
  value, 
  max = 100, 
  size = 60,
  strokeWidth = 4,
  variant = 'primary',
  showLabel = true,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Label central */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
