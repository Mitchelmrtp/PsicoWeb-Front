/**
 * Punto de entrada para componentes de tests refactorizados
 * Facilita las importaciones y mantiene la organización
 */

// Containers (lógica de negocio)
export { default as PatientTestViewContainer } from './PatientTestViewContainer';
export { default as TestPageContainer } from './TestPageContainer';
export { default as TestResultDetailContainer } from './TestResultDetailContainer';

// Presenters (lógica de presentación)
export { default as PatientTestViewPresenter } from './PatientTestViewPresenter';
export { default as TestPagePresenter } from './TestPagePresenter';
export { default as TestResultDetailPresenter } from './TestResultDetailPresenter';

// Componentes legacy (mantener compatibilidad temporal)
export { default as PatientTestView } from './PatientTestView';
export { default as TestPage } from './TestPage';
export { default as TestResultDetail } from './TestResultDetail';
export { default as CrearPruebas } from './CrearPruebas';
export { default as TestManagement } from './TestManagement';
