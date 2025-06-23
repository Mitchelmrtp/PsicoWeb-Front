// pages/PerfilPsicologo.jsx
import React, { useState } from "react";
import ComingSoon from "../common/CommingSoon";
import PerfilLayout from "../common/PerfilLayout";
import GeneralContent from "../common/GeneralContent";
import PsicologoSidebar from '../dashboard/PsicologoSidebar'

export default function PerfilPsicologo() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { key: "general", label: "General" },
    { key: "historial", label: "Historial de Consultas" },
    { key: "documentos", label: "Documentos del Paciente" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralContent />;
      default:
        return <ComingSoon />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PsicologoSidebar />
      <div className="flex-1">
          <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">Perfil</h1>
          </header>
      <div className="bg-white shadow-md rounded-lg p-6 mx-8">
      <PerfilLayout tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </PerfilLayout>
      </div>
      </div>

    </div>
  );
}
