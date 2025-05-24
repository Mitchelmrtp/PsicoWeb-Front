export async function enviarResultados(apiEndpoint, respuestas) {
  const res = await fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ respuestas }),
  });
  if (!res.ok) throw new Error('Error en servidor');
  return await res.json();
}

export function adaptarRespuestaBackend(data) {
  return {
    mensaje: data.mensaje || '',
  };
}
