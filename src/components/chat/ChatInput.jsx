import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiSend, FiPaperclip } from 'react-icons/fi';

/**
 * Componente de entrada de mensajes para el chat
 * Permite enviar texto y archivos
 */
const ChatInput = ({ onSendMessage, onSendFile, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Manejar envío de mensaje de texto
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      await onSendMessage(message);
      setMessage(''); // Limpiar input después de enviar
    } finally {
      setSending(false);
    }
  };

  // Manejar envío de archivo
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log('ChatInput - No file selected');
      return;
    }

    console.log('ChatInput - File selected:', { 
      name: file.name, 
      size: file.size, 
      type: file.type,
      lastModified: file.lastModified
    });

    // Alert temporal para debugging
    alert(`Archivo seleccionado: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)} KB)`);

    try {
      setSending(true);
      console.log('ChatInput - About to call onSendFile with file:', file);
      
      if (!onSendFile) {
        throw new Error('onSendFile function is not provided');
      }
      
      const result = await onSendFile(file);
      console.log('ChatInput - File sent successfully, result:', result);
      
      // Alert de éxito
      alert('Archivo enviado exitosamente!');
      
      // Limpiar input de archivo
      e.target.value = null;
    } catch (error) {
      console.error('ChatInput - Error sending file:', error);
      console.error('ChatInput - Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Alert de error
      alert(`Error enviando archivo: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <label htmlFor="file-upload" className="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <FiPaperclip size={20} />
          <input
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || sending}
          />
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 py-2 px-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled || sending}
        />
        <button
          type="submit"
          className={`p-2 rounded-full ${message.trim() ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          disabled={!message.trim() || disabled || sending}
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onSendFile: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ChatInput;
