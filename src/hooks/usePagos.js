/**
 * Custom hook para gestión de pagos
 * Implementa el patrón Custom Hook para separar lógica de presentación
 */
import { useState, useCallback } from 'react';
import { pagoService } from '../services/api/pagoService';
import { useAuth } from './useAuth';

export const usePagos = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Procesa un pago
   */
  const procesarPago = useCallback(async (datosPago) => {
    try {
      setLoading(true);
      setError(null);

      const response = await pagoService.procesarPago(datosPago);
      const pago = response?.data || response;

      return pago;
    } catch (err) {
      console.error('Error procesando pago:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al procesar el pago';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verifica el estado de un pago
   */
  const verificarEstado = useCallback(async (pagoId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await pagoService.verificarEstado(pagoId);
      const estado = response?.data || response;

      return estado;
    } catch (err) {
      console.error('Error verificando estado:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al verificar el estado';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Confirma un pago (solo para psicólogos/admin)
   */
  const confirmarPago = useCallback(async (pagoId, transactionId = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await pagoService.confirmarPago(pagoId, transactionId);
      const pago = response?.data || response;

      return pago;
    } catch (err) {
      console.error('Error confirmando pago:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al confirmar el pago';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Genera comprobante de pago
   */
  const generarComprobante = useCallback(async (pagoId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await pagoService.generarComprobante(pagoId);
      const comprobante = response?.data || response;

      return comprobante;
    } catch (err) {
      console.error('Error generando comprobante:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al generar el comprobante';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene comprobante por número
   */
  const obtenerComprobante = useCallback(async (numeroComprobante) => {
    try {
      setLoading(true);
      setError(null);

      const response = await pagoService.obtenerComprobante(numeroComprobante);
      const comprobante = response?.data || response;

      return comprobante;
    } catch (err) {
      console.error('Error obteniendo comprobante:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Comprobante no encontrado';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene pagos del paciente actual
   */
  const obtenerMisPagos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await pagoService.misPagos();
      const pagos = response?.data || response || [];

      return Array.isArray(pagos) ? pagos : [];
    } catch (err) {
      console.error('Error obteniendo mis pagos:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener los pagos';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene pagos de una sesión específica
   */
  const obtenerPagosPorSesion = useCallback(async (sesionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await pagoService.pagosPorSesion(sesionId);
      const pagos = response?.data || response || [];

      return Array.isArray(pagos) ? pagos : [];
    } catch (err) {
      console.error('Error obteniendo pagos por sesión:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener los pagos';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Procesa un pago y crea la sesión asociada
   */
  const procesarPagoConSesion = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);

      const response = await pagoService.procesarPagoConSesion(data);
      const resultado = response?.data || response;

      return resultado;
    } catch (err) {
      console.error('Error procesando pago con sesión:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al procesar el pago y crear la sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    procesarPago,
    verificarEstado,
    confirmarPago,
    generarComprobante,
    obtenerComprobante,
    obtenerMisPagos,
    obtenerPagosPorSesion,
    procesarPagoConSesion,
    // Métodos utilitarios del servicio
    calcularTotal: pagoService.calcularTotal.bind(pagoService),
    validarTarjeta: pagoService.validarTarjeta.bind(pagoService),
    formatearNumeroTarjeta: pagoService.formatearNumeroTarjeta.bind(pagoService),
    obtenerTipoTarjeta: pagoService.obtenerTipoTarjeta.bind(pagoService)
  };
};

/**
 * Hook específico para el procesamiento de pagos con estado local
 */
export const useProcesarPago = () => {
  const [pagoActual, setPagoActual] = useState(null);
  const [estadoPago, setEstadoPago] = useState('inicial'); // inicial, procesando, completado, fallido
  const { procesarPago, verificarEstado, loading, error } = usePagos();

  const iniciarPago = useCallback(async (datosPago) => {
    try {
      setEstadoPago('procesando');
      const pago = await procesarPago(datosPago);
      setPagoActual(pago);

      // Si el pago está en procesando, verificar estado cada 5 segundos
      if (pago.estado === 'procesando') {
        const intervalo = setInterval(async () => {
          try {
            const estado = await verificarEstado(pago.id);
            if (estado.estado === 'completado') {
              setEstadoPago('completado');
              setPagoActual(prev => ({ ...prev, ...estado }));
              clearInterval(intervalo);
            } else if (estado.estado === 'fallido') {
              setEstadoPago('fallido');
              setPagoActual(prev => ({ ...prev, ...estado }));
              clearInterval(intervalo);
            }
          } catch (error) {
            console.error('Error verificando estado:', error);
            clearInterval(intervalo);
          }
        }, 5000);

        // Limpiar el intervalo después de 5 minutos
        setTimeout(() => {
          clearInterval(intervalo);
        }, 300000);
      } else if (pago.estado === 'completado') {
        setEstadoPago('completado');
      } else if (pago.estado === 'fallido') {
        setEstadoPago('fallido');
      }

      return pago;
    } catch (error) {
      setEstadoPago('fallido');
      throw error;
    }
  }, [procesarPago, verificarEstado]);

  const resetearPago = useCallback(() => {
    setPagoActual(null);
    setEstadoPago('inicial');
  }, []);

  return {
    pagoActual,
    estadoPago,
    iniciarPago,
    resetearPago,
    loading,
    error
  };
};

export default usePagos;
