import React from 'react';
import PropTypes from 'prop-types';
import { FiMessageCircle, FiUsers } from 'react-icons/fi';

/**
 * Componente que muestra un mensaje de bienvenida con guía para usar el chat
 */
const WelcomeMessage = ({ isPsychologist, onContactsClick }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg text-center">
        <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <FiMessageCircle size={40} className="text-blue-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bienvenido al sistema de mensajería
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isPsychologist 
            ? "Aquí puedes comunicarte con tus pacientes y otros profesionales de forma segura."
            : "Aquí puedes comunicarte con tu psicólogo de forma segura y privada."}
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
            <FiUsers className="mr-2" /> 
            {isPsychologist ? "Tus contactos" : "Tu psicólogo"}
          </h3>
          <p className="text-blue-700 text-sm">
            {isPsychologist
              ? "Para iniciar una conversación, ve a la pestaña 'Contactos' donde encontrarás a tus pacientes y colegas."
              : "Para iniciar una conversación con tu psicólogo, ve a la pestaña 'Contactos' y selecciónalo."}
          </p>
        </div>
        
        <button
          onClick={onContactsClick}
          className="w-full px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <span className="flex items-center justify-center">
            <FiUsers className="mr-2" />
            {isPsychologist ? "Ver mis contactos" : "Hablar con mi psicólogo"}
          </span>
        </button>
      </div>
    </div>
  );
};

WelcomeMessage.propTypes = {
  isPsychologist: PropTypes.bool.isRequired,
  onContactsClick: PropTypes.func.isRequired
};

export default WelcomeMessage;
