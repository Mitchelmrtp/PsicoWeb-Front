import { ENDPOINTS } from '../config/api';
import { handleApiResponse, getErrorMessage } from '../utils/apiResponseHandler';

const forgotPassword = async (email) => {
  const res = await fetch(`${ENDPOINTS.FORGOT_PASSWORD}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(getErrorMessage(data) || 'Error al solicitar restablecimiento');
  
  return handleApiResponse(data);
};

export default {
  forgotPassword
};
