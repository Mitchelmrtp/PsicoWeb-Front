/**
 * Servicio para la gestión de pagos
 * Implementa el patrón Repository para separar la lógica de acceso a datos
 */

import BaseApiService from './baseApi';
import { ENDPOINTS } from '../../config/api';

export class PagoService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.PAGOS || '/api/pagos');
  }

  /**
   * Procesa un nuevo pago
   * @param {Object} pagoData - Datos del pago
   * @returns {Promise<Object>} Pago procesado
   */
  async procesarPago(pagoData) {
    return this.post('', pagoData);
  }

  /**
   * Verifica el estado de un pago
   * @param {string} pagoId - ID del pago
   * @returns {Promise<Object>} Estado del pago
   */
  async verificarEstado(pagoId) {
    return this.get(`/${pagoId}/estado`);
  }

  /**
   * Confirma un pago (para administradores/psicólogos)
   * @param {string} pagoId - ID del pago
   * @param {string} transactionId - ID de transacción (opcional)
   * @returns {Promise<Object>} Pago confirmado
   */
  async confirmarPago(pagoId, transactionId = null) {
    return this.patch(`/${pagoId}/confirmar`, { transactionId });
  }

  /**
   * Genera comprobante de pago
   * @param {string} pagoId - ID del pago
   * @returns {Promise<Object>} Comprobante de pago
   */
  async generarComprobante(pagoId) {
    return this.get(`/${pagoId}/comprobante`);
  }

  /**
   * Obtiene comprobante por número
   * @param {string} numeroComprobante - Número del comprobante
   * @returns {Promise<Object>} Comprobante de pago
   */
  async obtenerComprobante(numeroComprobante) {
    return this.get(`/comprobante/${numeroComprobante}`);
  }

  /**
   * Obtiene los pagos del usuario actual (paciente)
   * @returns {Promise<Array>} Lista de pagos del paciente
   */
  async misPagos() {
    return this.get('/mis-pagos');
  }

  /**
   * Obtiene pagos de una sesión específica
   * @param {string} sesionId - ID de la sesión
   * @returns {Promise<Array>} Lista de pagos de la sesión
   */
  async pagosPorSesion(sesionId) {
    return this.get(`/sesion/${sesionId}`);
  }

  /**
   * Obtiene todos los pagos (solo para psicólogos/admin)
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} Lista de pagos
   */
  async obtenerTodosLosPagos(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.estado) {
      params.append('estado', filters.estado);
    }
    
    if (filters.pacienteId) {
      params.append('pacienteId', filters.pacienteId);
    }

    const queryString = params.toString();
    return this.get(queryString ? `?${queryString}` : '');
  }

  /**
   * Calcula el total del pago incluyendo impuestos
   * @param {number} monto - Monto base
   * @param {number} porcentajeImpuesto - Porcentaje de impuesto (default: 10%)
   * @returns {Object} Objeto con monto, impuestos y total
   */
  calcularTotal(monto, porcentajeImpuesto = 10) {
    const montoBase = parseFloat(monto) || 0;
    const impuestos = (montoBase * porcentajeImpuesto) / 100;
    const total = montoBase + impuestos;

    return {
      monto: montoBase,
      montoImpuestos: impuestos,
      montoTotal: total,
      porcentajeImpuesto
    };
  }

  /**
   * Valida los datos de una tarjeta de crédito (validación básica)
   * @param {Object} datosTargeta - Datos de la tarjeta
   * @returns {Object} Resultado de la validación
   */
  validarTarjeta(datosTarjeta) {
    const errores = [];

    if (!datosTarjeta.numero || datosTarjeta.numero.length < 13) {
      errores.push('Número de tarjeta inválido');
    }

    if (!datosTarjeta.nombreTitular || datosTarjeta.nombreTitular.trim().length === 0) {
      errores.push('Nombre del titular es requerido');
    }

    if (!datosTarjeta.mesExpiracion || !datosTarjeta.anoExpiracion) {
      errores.push('Fecha de expiración es requerida');
    }

    if (!datosTarjeta.cvv || datosTarjeta.cvv.length < 3) {
      errores.push('CVV inválido');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Formatea el número de tarjeta para mostrar
   * @param {string} numero - Número de tarjeta
   * @returns {string} Número formateado
   */
  formatearNumeroTarjeta(numero) {
    if (!numero) return '';
    
    // Remover espacios y caracteres no numéricos
    const cleaned = numero.replace(/\D/g, '');
    
    // Formatear en grupos de 4
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  /**
   * Obtiene el tipo de tarjeta basado en el número
   * @param {string} numero - Número de tarjeta
   * @returns {string} Tipo de tarjeta
   */
  obtenerTipoTarjeta(numero) {
    if (!numero) return 'unknown';
    
    const cleaned = numero.replace(/\D/g, '');
    
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    
    return 'unknown';
  }

  /**
   * Procesa un pago y crea la sesión asociada en una transacción
   * @param {Object} data - Datos del pago y la sesión
   * @returns {Promise<Object>} Resultado con pago y sesión creados
   */
  async procesarPagoConSesion(data) {
    return this.post('/procesar-con-sesion', data);
  }
}

// Instancia singleton
export const pagoService = new PagoService();

export default {
  pagos: pagoService
};
