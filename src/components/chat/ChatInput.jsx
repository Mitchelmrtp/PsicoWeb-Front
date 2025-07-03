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
    if (!file) return;

    try {
      setSending(true);
      await onSendFile(file);
      // Limpiar input de archivo
      e.target.value = null;
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
