import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PaymentReceipt = ({ pagoData, comprobanteData, citaData }) => {
  const receiptRef = useRef(null);

  const downloadPDF = async () => {
    try {
      if (!receiptRef.current) return;

      // Mostrar un loading state
      const downloadButton = document.getElementById('pdf-download-btn');
      const originalText = downloadButton?.textContent;
      if (downloadButton) {
        downloadButton.textContent = 'Generando PDF...';
        downloadButton.disabled = true;
      }

      // Configurar opciones para html2canvas
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Mayor resolución
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: receiptRef.current.offsetWidth,
        height: receiptRef.current.offsetHeight,
      });

      // Configurar el PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calcular dimensiones para centrar la imagen
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgAspectRatio = canvas.width / canvas.height;
      const maxWidth = pdfWidth - 20; // Margen de 10mm a cada lado
      const maxHeight = pdfHeight - 20; // Margen de 10mm arriba y abajo

      let imgWidth = maxWidth;
      let imgHeight = imgWidth / imgAspectRatio;

      // Si la altura es mayor que el máximo, ajustar por altura
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = imgHeight * imgAspectRatio;
      }

      // Centrar la imagen
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      // Agregar la imagen al PDF
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      // Generar nombre del archivo
      const fechaActual = new Date().toISOString().split('T')[0];
      const numeroComprobante = comprobanteData?.numeroComprobante || pagoData?.id || 'comprobante';
      const fileName = `comprobante-pago-${numeroComprobante}-${fechaActual}.pdf`;

      // Descargar el PDF
      pdf.save(fileName);

      // Restaurar el botón
      if (downloadButton) {
        downloadButton.textContent = originalText;
        downloadButton.disabled = false;
      }

    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
      
      // Restaurar el botón en caso de error
      const downloadButton = document.getElementById('pdf-download-btn');
      if (downloadButton) {
        downloadButton.textContent = 'Descargar PDF';
        downloadButton.disabled = false;
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!pagoData && !comprobanteData) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* Contenedor para el PDF */}
      <div ref={receiptRef} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
        {/* Header con información de la empresa */}
        <div className="bg-green-600 text-white px-6 py-4">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold">PsicoWeb</h2>
            <p className="text-sm opacity-90">Plataforma de Servicios Psicológicos</p>
          </div>
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold">Pago Exitoso</h3>
          </div>
        </div>

        <div className="px-6 py-4">
          {comprobanteData && (
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600">Comprobante de Pago</p>
              <p className="text-lg font-mono font-bold text-gray-800">
                #{comprobanteData.numeroComprobante}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {pagoData && (
              <>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">ID de Transacción:</span>
                  <span className="font-mono text-sm">{pagoData.id}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Monto:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(pagoData.monto)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Método de Pago:</span>
                  <span className="capitalize">{pagoData.metodoPago}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Estado:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {pagoData.estado}
                  </span>
                </div>
              </>
            )}

            {comprobanteData && (
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Fecha de Emisión:</span>
                <span className="text-sm">{formatDate(comprobanteData.fechaEmision)}</span>
              </div>
            )}

            {citaData && (
              <>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Detalles de la Cita</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Psicólogo:</span>
                      <span>{citaData.psicologoNombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span>{citaData.date?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hora:</span>
                      <span>{citaData.time}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {comprobanteData?.urlDescarga && (
            <div className="mt-6">
              <button 
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                onClick={() => window.open(comprobanteData.urlDescarga, '_blank')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar Comprobante
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">
              Guarde este comprobante para sus registros
            </p>
            <p className="text-xs text-gray-400">
              Generado el: {new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Botón de descarga PDF fuera del área de captura */}
      <div className="mt-4 px-6 pb-4">
        <button
          id="pdf-download-btn"
          onClick={downloadPDF}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default PaymentReceipt;
