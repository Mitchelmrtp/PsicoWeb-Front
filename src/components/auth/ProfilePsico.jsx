// pages/PerfilPsicologo.jsx
import React, { useState } from "react";
import ComingSoon from "../common/CommingSoon";
import PerfilLayout from "../common/PerfilLayout";
import GeneralContent from "../common/GeneralContent";

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
    <PerfilLayout tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </PerfilLayout>
  );
}
