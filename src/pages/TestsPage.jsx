/**
 * Página principal para manejo de tests
 * Implementa Single Responsibility Principle - solo orquesta componentes
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';
import PatientTestViewContainer from '../components/test/PatientTestViewContainer';
import TestPageContainer from '../components/test/TestPageContainer';
import TestResultDetailContainer from '../components/test/TestResultDetailContainer';

const TestsPage = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Menú principal de tests para pacientes */}
        <Route path="/" element={<PatientTestViewContainer />} />
        
        {/* Realizar una prueba específica */}
        <Route path="/:testId" element={<TestPageContainer />} />
        
        {/* Ver detalle de resultado */}
        <Route path="/resultados/:resultId" element={<TestResultDetailContainer />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default TestsPage;
