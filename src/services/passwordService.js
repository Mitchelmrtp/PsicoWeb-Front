import { ENDPOINTS } from '../config/api';

const forgotPassword = async (email) => {
  const res = await fetch(`${ENDPOINTS.FORGOT_PASSWORD}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al solicitar restablecimiento');
  return data;
};

export default {
  forgotPassword
};
