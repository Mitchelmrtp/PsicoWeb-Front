import React, { useState, useEffect } from 'react';
import { usePagos } from '../../hooks/usePagos';
import { useAuth } from '../../hooks/useAuth';
import PaymentStatus from '../payment/PaymentStatus';
import PaymentReceipt from '../payment/PaymentReceipt';
import { toast } from 'react-toastify';

const PaymentHistory = () => {
  const [pagos, setPagos] = useState([]);
  const [selectedPago, setSelectedPago] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [comprobanteData, setComprobanteData] = useState(null);
  const { user } = useAuth();
  const { 
    obtenerMisPagos, 
    verificarEstado, 
    generarComprobante,
    loading 
  } = usePagos();

  useEffect(() => {
    if (user?.id) {
      loadPaymentHistory();
    }
  }, [user]);

  const loadPaymentHistory = async () => {
    try {
      const historia = await obtenerMisPagos();
      setPagos(historia || []);
    } catch (error) {
      console.error('Error loading payment history:', error);
      toast.error('Error al cargar el historial de pagos');
    }
  };

  const handleViewReceipt = async (pago) => {
    try {
      if (pago.estado === 'completado') {
        const comprobante = await generarComprobante(pago.id);
        setComprobanteData(comprobante);
        setSelectedPago(pago);
        setShowReceipt(true);
      } else {
        toast.info('El comprobante solo está disponible para pagos completados');
      }
    } catch (error) {
      console.error('Error getting receipt:', error);
      toast.error('Error al obtener el comprobante');
    }
  };

  const handleRefreshStatus = async (pagoId) => {
    try {
      const estadoActualizado = await verificarEstado(pagoId);
      setPagos(prev => prev.map(pago => 
        pago.id === pagoId ? { ...pago, ...estadoActualizado } : pago
      ));
      toast.success('Estado actualizado');
    } catch (error) {
      console.error('Error refreshing payment status:', error);
      toast.error('Error al actualizar el estado del pago');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Historial de Pagos</h1>
        <p className="text-gray-600">Gestiona y consulta tus pagos de sesiones</p>
      </div>

      {pagos.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pagos registrados</h3>
          <p className="text-gray-500">Cuando realices pagos por sesiones, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pagos.map((pago) => (
            <div key={pago.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatCurrency(pago.monto)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(pago.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRefreshStatus(pago.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Actualizar estado"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  {pago.estado === 'completado' && (
                    <button
                      onClick={() => handleViewReceipt(pago)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ver Comprobante
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ID de Pago:</span>
                    <span className="font-mono ml-2">{pago.id}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Método:</span>
                    <span className="capitalize ml-2">{pago.metodoPago}</span>
                  </p>
                </div>
                <div>
                  {pago.descripcion && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Descripción:</span>
                      <span className="ml-2">{pago.descripcion}</span>
                    </p>
                  )}
                </div>
              </div>

              <PaymentStatus
                status={pago.estado}
                paymentId={pago.id}
                amount={pago.monto}
                method={pago.metodoPago}
                onRetry={() => toast.info('Funcionalidad de reintento en desarrollo')}
                className="mt-4"
              />
            </div>
          ))}
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && selectedPago && comprobanteData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowReceipt(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Comprobante de Pago
                  </h3>
                  <button
                    onClick={() => setShowReceipt(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <PaymentReceipt
                  pagoData={selectedPago}
                  comprobanteData={comprobanteData}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
