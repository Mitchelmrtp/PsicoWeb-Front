// Exportaciones centralizadas para mejor organización

// UI Components
export * from './ui';

// Feature Components
export { default as AppointmentCard } from './features/AppointmentCard';
export { default as AppointmentList } from './features/AppointmentList';
export { default as PsychologistCard } from './features/PsychologistCard';

// Layout Components
export { default as NavigationSidebar } from './layout/NavigationSidebar';

// Legacy Components (mantener para compatibilidad)
export { default as DashboardContainer } from './dashboard/DashboardContainer';
