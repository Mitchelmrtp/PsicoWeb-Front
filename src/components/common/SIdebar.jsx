import React from "react";
import { Home, FileText, Calendar, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white shadow-lg border-r min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-indigo-600 mb-8">PSICOWEB</h2>

      <nav className="flex flex-col space-y-4">
        <button
          onClick={() => navigate("/PagPrincipal")}
          className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 bg-transparent border-none cursor-pointer text-left"
          type="button"
        >
          <Home size={20} />
          <span>Inicio</span>
        </button>
        <button
          onClick={() => navigate("/Form")}
          className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 bg-transparent border-none cursor-pointer text-left"
          type="button"
        >
          <FileText size={20} />
          <span>Tests</span>
        </button>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600"
        >
          <Calendar size={20} />
          <span>Reservas</span>
        </a>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 mt-auto bg-transparent border-none cursor-pointer"
          type="button"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
