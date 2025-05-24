import React from "react";
import { Home, FileText, Calendar, LogOut } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg border-r min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-indigo-600 mb-8">PSICOWEB</h2>

      <nav className="flex flex-col space-y-4">
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600"
        >
          <Home size={20} />
          <span>Inicio</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600"
        >
          <FileText size={20} />
          <span>Tests</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600"
        >
          <Calendar size={20} />
          <span>Reservas</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 mt-auto"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
