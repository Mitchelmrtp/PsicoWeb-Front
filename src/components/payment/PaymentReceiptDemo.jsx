import React from 'react';
import PaymentReceipt from './PaymentReceipt';

const PaymentReceiptDemo = () => {
  // Datos de ejemplo para demostrar la funcionalidad
  const pagoDataDemo = {
    id: 'PAY123456789',
    monto: 75.00,
    metodoPago: 'tarjeta',
    estado: 'completado',
    fechaCreacion: new Date().toISOString()
  };

  const comprobanteDataDemo = {
    numeroComprobante: 'COMP-2024-001234',
    fechaEmision: new Date().toISOString(),
    // urlDescarga: 'https://example.com/comprobante' // Opcional
  };

  const citaDataDemo = {
    psicologoNombre: 'Dr. María Elena Rodríguez',
    date: new Date(2024, 2, 15), // 15 de marzo de 2024
    time: '10:30 AM',
    servicio: 'Consulta Psicológica Individual'
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Demo - Comprobante de Pago PDF
          </h1>
          <p className="text-gray-600">
            Ejemplo de comprobante de pago con funcionalidad de descarga PDF
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Instrucciones de Uso:
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>El comprobante muestra todos los detalles del pago realizado</li>
              <li>Haz clic en el botón "Descargar PDF" (rojo) para generar el archivo PDF</li>
              <li>El PDF contendrá únicamente el área del comprobante (sin el botón de descarga)</li>
              <li>El archivo se nombrará automáticamente con la fecha y número de comprobante</li>
              <li>La descarga comenzará automáticamente en tu navegador</li>
            </ul>
          </div>

          <PaymentReceipt 
            pagoData={pagoDataDemo}
            comprobanteData={comprobanteDataDemo}
            citaData={citaDataDemo}
          />

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Características del PDF:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
              <li>Alta resolución (escala 2x)</li>
              <li>Formato A4 centrado</li>
              <li>Fondo blanco limpio</li>
              <li>Nombres de archivo descriptivos</li>
              <li>Márgenes apropiados para impresión</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptDemo;
