import { cn } from '../../utils/classNames';

// Componente Card siguiendo Atomic Design
const Card = ({ 
  children, 
  className = '',
  padding = 'default',
  shadow = 'default',
  ...props 
}) => {
  const paddingVariants = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const shadowVariants = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow',
    lg: 'shadow-lg',
  };

  const cardClasses = cn(
    'bg-white rounded-lg border border-gray-200',
    paddingVariants[padding],
    shadowVariants[shadow],
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Subcomponentes del Card
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={cn('border-b border-gray-200 pb-4 mb-4', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={cn('border-t border-gray-200 pt-4 mt-4', className)} {...props}>
    {children}
  </div>
);

// Exportamos el componente principal y sus subcomponentes
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
