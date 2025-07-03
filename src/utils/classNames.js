// Utility function for combining class names
// Similar a clsx/classnames pero más ligero

export function cn(...classes) {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}
