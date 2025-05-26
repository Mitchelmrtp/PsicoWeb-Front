/**
 * Definiciones para la escala Likert usada en los tests psicológicos
 */

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Indiferente' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' }
];

/**
 * Interpreta una puntuación según la escala Likert
 * @param {number} puntuacion - Puntuación a interpretar
 * @param {string} tipoTest - Tipo de test (ansiedad, depresion, etc.)
 * @returns {string} Interpretación de la puntuación
 */
export const interpretarPuntuacion = (puntuacion, tipoTest = '') => {
  const tipoLower = tipoTest.toLowerCase();
  
  if (tipoLower.includes('ansiedad')) {
    if (puntuacion >= 4.5) return 'Nivel de ansiedad muy alto';
    if (puntuacion >= 3.5) return 'Nivel de ansiedad alto';
    if (puntuacion >= 2.5) return 'Nivel de ansiedad moderado';
    if (puntuacion >= 1.5) return 'Nivel de ansiedad bajo';
    return 'Nivel de ansiedad mínimo';
  }
  
  if (tipoLower.includes('depresion') || tipoLower.includes('depresión')) {
    if (puntuacion >= 4.5) return 'Nivel de depresión muy alto';
    if (puntuacion >= 3.5) return 'Nivel de depresión alto';
    if (puntuacion >= 2.5) return 'Nivel de depresión moderado';
    if (puntuacion >= 1.5) return 'Nivel de depresión bajo';
    return 'Nivel de depresión mínimo';
  }
  
  // Interpretación genérica
  if (puntuacion >= 4.5) return 'Nivel muy alto';
  if (puntuacion >= 3.5) return 'Nivel alto';
  if (puntuacion >= 2.5) return 'Nivel moderado';
  if (puntuacion >= 1.5) return 'Nivel bajo';
  return 'Nivel mínimo';
};