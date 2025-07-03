import PropTypes from 'prop-types';
import { FiTrash2, FiDownload, FiFile, FiImage } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente para un mensaje individual
 */
const ChatMessage = ({
  message,
  isOwnMessage,
  canDelete,
  onDelete,
  formatFileSize,
  getFileIcon
}) => {
  const { 
    id, 
    contenido, 
    createdAt, 
    tipoMensaje, 
    rutaArchivo, 
    nombreArchivo,
    tamanoArchivo,
    mimeType,
    emisor = {}
  } = message;

  // Formatear fecha
  const formattedDate = format(new Date(createdAt), "d 'de' MMMM, HH:mm", { locale: es });
  
  // Determinar si es un archivo de imagen
  const isImage = tipoMensaje === 'imagen' || mimeType?.startsWith('image/');
  
  // Determinar si es un PDF (para previsualización)
  const isPDF = tipoMensaje === 'pdf' || mimeType === 'application/pdf';

  // Estilo basado en si es propio o recibido
  const messageStyle = isOwnMessage
    ? 'ml-auto bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
    : 'mr-auto bg-gray-200 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg';

  return (
    <div className={`max-w-[75%] mb-4 ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}>
      <div className="flex flex-col">
        {!isOwnMessage && (
          <span className="text-xs text-gray-500 mb-1">
            {emisor.first_name || emisor.name || 'Usuario'}
          </span>
        )}
        
        <div className={`p-3 ${messageStyle}`}>
          {/* Contenido de texto */}
          {(tipoMensaje === 'texto' || contenido) && (
            <p className="mb-1 whitespace-pre-wrap break-words">{contenido}</p>
          )}
          
          {/* Vista previa de imagen */}
          {isImage && rutaArchivo && (
            <div className="mt-2">
              <img 
                src={rutaArchivo} 
                alt={nombreArchivo || "Imagen"} 
                className="max-w-full rounded-lg" 
                style={{ maxHeight: '200px' }}
              />
            </div>
          )}
          
          {/* Vista previa de PDF */}
          {isPDF && rutaArchivo && (
            <div className="mt-2 bg-gray-50 p-2 rounded-lg border border-gray-200 flex items-center">
              <FiFile className="text-red-500 mr-2" size={24} />
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate">{nombreArchivo || "Documento PDF"}</div>
                <div className="text-xs text-gray-500">
                  {tamanoArchivo ? formatFileSize(tamanoArchivo) : "PDF"}
                </div>
              </div>
              <a 
                href={rutaArchivo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <FiDownload size={18} />
              </a>
            </div>
          )}
          
          {/* Otro tipo de archivo */}
          {tipoMensaje !== 'texto' && tipoMensaje !== 'imagen' && !isPDF && rutaArchivo && (
            <div className="mt-2 bg-gray-50 p-2 rounded-lg border border-gray-200 flex items-center">
              <div className="mr-2 text-blue-500">
                {getFileIcon(mimeType)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate">{nombreArchivo || "Archivo"}</div>
                <div className="text-xs text-gray-500">
                  {tamanoArchivo ? formatFileSize(tamanoArchivo) : "Archivo adjunto"}
                </div>
              </div>
              <a 
                href={rutaArchivo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <FiDownload size={18} />
              </a>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">
            {formattedDate}
          </span>
          
          {/* Opción de eliminar mensaje */}
          {canDelete && (
            <button 
              onClick={() => onDelete(id)}
              className="text-gray-400 hover:text-red-500 p-1 rounded-full"
              title="Eliminar mensaje"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    contenido: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    tipoMensaje: PropTypes.string.isRequired,
    rutaArchivo: PropTypes.string,
    nombreArchivo: PropTypes.string,
    tamanoArchivo: PropTypes.number,
    mimeType: PropTypes.string,
    emisor: PropTypes.object
  }).isRequired,
  isOwnMessage: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatFileSize: PropTypes.func.isRequired,
  getFileIcon: PropTypes.func.isRequired
};

export default ChatMessage;
