// pages/PerfilPaciente.jsx
import React, { useState } from "react";
import GeneralContent from "../common/GeneralContent";
import ComingSoon from "../common/CommingSoon";
import PerfilLayout from "../common/PerfilLayout";

export default function PerfilPaciente() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { key: "general", label: "General" },
    { key: "historial", label: "Historial de Consultas" },
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
