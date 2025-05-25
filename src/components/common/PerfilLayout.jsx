export default function PerfilLayout({
  tabs,
  activeTab,
  setActiveTab,
  children,
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <div className="w-64 bg-white border-r p-6">
        <div className="space-y-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`block w-full text-left px-4 py-2 rounded ${
                activeTab === tab.key
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido derecho */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
