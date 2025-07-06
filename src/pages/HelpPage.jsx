import React from 'react';
import { useAuth } from '../hooks/useAuth';

const HelpPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Centro de Ayuda
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Encuentra respuestas a las preguntas más frecuentes y obtén soporte para usar la plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preguntas Frecuentes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Preguntas Frecuentes
              </h2>
              
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600">
                    ¿Cómo puedo {user?.role === 'paciente' ? 'reservar' : 'gestionar'} una cita?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 pl-4">
                    {user?.role === 'paciente' 
                      ? 'Puedes reservar una cita desde el menú "Reservar Cita". Selecciona tu psicólogo preferido, elige una fecha y hora disponible, y completa el proceso de pago.'
                      : 'Puedes gestionar tus citas desde el dashboard principal. Allí verás todas las citas programadas y podrás confirmar asistencia, cancelar o reprogramar según sea necesario.'
                    }
                  </p>
                </details>

                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600">
                    ¿Cómo funciona el sistema de pagos?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 pl-4">
                    {user?.role === 'paciente'
                      ? 'El costo de cada sesión depende del psicólogo seleccionado. Se incluye un impuesto del 18% sobre la tarifa base. Los pagos se procesan de forma segura durante la reserva.'
                      : 'Los pagos se procesan automáticamente cuando los pacientes reservan citas. Recibirás el pago correspondiente según tus tarifas establecidas.'
                    }
                  </p>
                </details>

                {user?.role === 'paciente' && (
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600">
                      ¿Puedo cancelar o reprogramar mi cita?
                    </summary>
                    <p className="mt-2 text-sm text-gray-600 pl-4">
                      Sí, puedes cancelar o reprogramar tus citas desde "Mis Consultas". Ten en cuenta que las cancelaciones no incluyen reembolso. La primera reprogramación es gratuita, las siguientes tienen un costo adicional.
                    </p>
                  </details>
                )}

                {user?.role === 'psicologo' && (
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600">
                      ¿Cómo establezco mi disponibilidad?
                    </summary>
                    <p className="mt-2 text-sm text-gray-600 pl-4">
                      Puedes configurar tu disponibilidad desde el menú "Mi disponibilidad". Establece los días y horarios en los que puedes atender pacientes.
                    </p>
                  </details>
                )}

                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600">
                    ¿Cómo usar el sistema de mensajería?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 pl-4">
                    El sistema de mensajería te permite comunicarte de forma segura. Accede desde el menú "Mensajes" para enviar y recibir mensajes.
                  </p>
                </details>
              </div>
            </div>

            {/* Contacto y Soporte */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Soporte y Contacto
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Teléfono de Soporte</p>
                    <p className="text-sm text-gray-600">+51 1 234-5678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email de Soporte</p>
                    <p className="text-sm text-gray-600">soporte@psicoweb.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-0.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Horarios de Atención</p>
                    <p className="text-sm text-gray-600">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    <p className="text-sm text-gray-600">Sábados: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Guías Rápidas */}
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Guías Rápidas</h3>
                <div className="space-y-2">
                  <a 
                    href="#" 
                    className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <p className="text-sm font-medium text-blue-900">
                      {user?.role === 'paciente' ? 'Cómo reservar tu primera cita' : 'Configuración inicial para psicólogos'}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Guía paso a paso para comenzar
                    </p>
                  </a>
                  
                  <a 
                    href="#" 
                    className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <p className="text-sm font-medium text-green-900">
                      Usando el sistema de mensajería
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Aprende a comunicarte de forma segura
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de emergencia */}
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-900">En caso de emergencia</h3>
                <p className="text-sm text-red-700 mt-1">
                  Si experimentas una crisis emocional o pensamientos de autolesión, contacta inmediatamente:
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-red-900">• Línea de emergencia: 113</p>
                  <p className="text-sm font-medium text-red-900">• Servicio de urgencias médicas: 116</p>
                  <p className="text-sm font-medium text-red-900">• Tu centro de salud más cercano</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
