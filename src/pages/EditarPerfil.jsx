// src/pages/EditarPerfil.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import PsicologoSidebar from "../components/dashboard/PsicologoSidebar";

const EditarPerfil = () => {
  const { user, token } = useAuth();  
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Configuración de headers con token
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // 1) Al montar, traigo el perfil según el rol
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const base = user.role === "psicologo" ? "psicologo" : "paciente";
        const { data } = await axios.get(`/api/${base}/profile`, config);
        setFormData(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar el perfil");
      }
    };
    fetchProfile();
  }, [user.role]);

  // 2) Handler genérico de inputs
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3) Guardar cambios
  const handleSave = async () => {
    try {
      const base = user.role === "psicologo" ? "psicologo" : "paciente";
      await axios.put(`/api/${base}/profile`, formData, config);
      toast.success("Perfil actualizado");
      setIsEditing(false);
    } catch (err) {
      console.error(err.response || err);
      toast.error("Error al actualizar el perfil");
    }
  };

  if (!formData) {
    return <div className="p-6">Cargando perfil…</div>;
  }

  return (
    <div className="flex h-full">
      <PsicologoSidebar />

      <div className="flex-1 flex flex-col p-6">
        <h2 className="text-2xl font-semibold mb-6">Editar Perfil</h2>

        {/* Campos comunes: Nombre, Apellidos, Email, Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Nombres</label>
            <input
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Apellidos</label>
            <input
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-1">Teléfono</label>
          <input
            name="telephone"
            value={formData.telephone || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded"
          />
        </div>

        {user.role === "psicologo" && (
          <>
            {/* Campos específicos de Psicólogo */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Especialidad</label>
              <input
                name="especialidad"
                value={formData.especialidad || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Licencia</label>
              <input
                name="licencia"
                value={formData.licencia || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Formación</label>
              <input
                name="formacion"
                value={formData.formacion || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Biografía</label>
              <textarea
                name="biografia"
                value={formData.biografia || ""}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm mb-1">Años de experiencia</label>
                <input
                  type="number"
                  name="anosExperiencia"
                  value={formData.anosExperiencia || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Tarifa por sesión (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="tarifaPorSesion"
                  value={formData.tarifaPorSesion || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </>
        )}

        {user.role === "paciente" && (
          <>
            {/* Campos específicos de Paciente */}
            <div className="mb-6">
              <label className="block text-sm mb-1">Motivo de consulta</label>
              <textarea
                name="motivoConsulta"
                value={formData.motivoConsulta || ""}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Editar perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditarPerfil;
