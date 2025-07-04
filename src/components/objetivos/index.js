/**
 * Barrel export para todos los componentes de objetivos
 * Principio DRY: centralizar importaciones
 */

// Containers
export { default as ObjetivosPacienteContainer } from './ObjetivosPacienteContainer';
export { default as MisObjetivosContainer } from './MisObjetivosContainer';

// Presenters
export { default as ObjetivosPacientePresenter } from './ObjetivosPacientePresenter';
export { default as MisObjetivosPresenter } from './MisObjetivosPresenter';

// Components
export { default as ObjetivoCard } from './ObjetivoCard';
export { default as EjerciciosList } from './EjerciciosList';
export { default as CreateObjetivoModal } from './CreateObjetivoModal';
export { default as AssignEjercicioModal } from './AssignEjercicioModal';
