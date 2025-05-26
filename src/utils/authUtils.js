/**
 * Utilidades para manejo de autenticación
 * Provee funciones para obtener y gestionar tokens de autenticación
 */

/**
 * Obtiene el encabezado de autorización con el token JWT
 * @returns {Object} Objeto con el encabezado Authorization
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`
  };
};

/**
 * Guarda el token en el almacenamiento local
 * @param {string} token - Token JWT recibido del servidor
 */
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Elimina el token del almacenamiento local
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Verifica si hay un token guardado
 * @returns {boolean} True si hay un token, false en caso contrario
 */
export const hasToken = () => {
  return !!localStorage.getItem('token');
};

/**
 * Decodifica el payload de un token JWT
 * @param {string} token - Token JWT
 * @returns {Object|null} Payload decodificado o null si el token no es válido
 */
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};