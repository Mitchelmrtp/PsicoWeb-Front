import { useState, useEffect } from "react";

export default function GeneralContent() {
  const [editProfileCard, setEditProfileCard] = useState(false);
  const [editInfoCard, setEditInfoCard] = useState(false);

  const [user, setUser] = useState({
    name: "Ani Cavalcanti",
    bio: "Cardiac Doctor",
    location: "Leeds, United Kingdom",
    dob: "1997-01-07",
    phone: "945 346 347",
    email: "martha.johnson@gmail.com",
  });

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const saveChanges = () => {
    localStorage.setItem("userProfile", JSON.stringify(user));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(user));
    setEditing(false);
  };

  const calcularEdadCompleta = (fechaNacimiento) => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();

    let años = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();
    let dias = hoy.getDate() - nacimiento.getDate();

    if (dias < 0) {
      meses--;
      dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    }

    if (meses < 0) {
      años--;
      meses += 12;
    }

    return `${años} años, ${meses} meses y ${dias} días`;
  };

  return (
    <div className="space-y-6">
      {/* Card Foto */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Foto"
              className="w-16 h-16 rounded-full"
            />
            <div>
              {editProfileCard ? (
                <>
                  <input
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className="text-lg font-bold border p-1 rounded block"
                  />
                  <input
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    className="text-sm text-gray-500 border p-1 rounded mt-1 block"
                  />
                  <input
                    name="location"
                    value={user.location}
                    onChange={handleChange}
                    className="text-xs text-gray-400 border p-1 rounded mt-1 block"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold">{user.name}</h2>
                  <p className="text-gray-500 text-sm">{user.bio}</p>
                  <p className="text-gray-400 text-xs">{user.location}</p>
                </>
              )}
            </div>
          </div>
          <button
            className="border px-4 py-1 rounded hover:bg-gray-100"
            onClick={() => {
              if (editProfileCard) saveChanges();
              setEditProfileCard(!editProfileCard);
            }}
          >
            {editProfileCard ? "Guardar ✅" : "Editar ✏️"}
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Información Personal</h3>
          <button
            className="border px-4 py-1 rounded hover:bg-gray-100"
            onClick={() => {
              if (editInfoCard) saveChanges();
              setEditInfoCard(!editInfoCard);
            }}
          >
            {editInfoCard ? "Guardar ✅" : "Editar ✏️"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>Nombre Completo:</strong>{" "}
            {editInfoCard ? (
              <input
                name="name"
                value={user.name}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              user.name
            )}
          </div>
          <div>
            <strong>Fecha de Nacimiento:</strong>{" "}
            {editInfoCard ? (
              <input
                type="date"
                name="dob"
                value={user.dob}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              new Date(user.dob).toLocaleDateString()
            )}
          </div>
          <div>
            <strong>Celular:</strong>{" "}
            {editInfoCard ? (
              <input
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              user.phone
            )}
          </div>
          <div>
            <strong>Correo Electronico:</strong>{" "}
            {editInfoCard ? (
              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              user.email
            )}
          </div>
          <div>
            <strong>Edad:</strong>{" "}
            {user.dob ? calcularEdadCompleta(user.dob) : "—"}
          </div>
          <div>
            <strong>Biografía:</strong>{" "}
            {editInfoCard ? (
              <input
                name="bio"
                value={user.bio}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              user.bio
            )}
          </div>
        </div>
      </div>

      {/* Card General */}
<div className="bg-white p-6 rounded-xl shadow space-y-4">
  <h3 className="font-bold text-lg">General</h3>
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <span className="text-gray-700">Cambiar Contraseña</span>
      <button className="border px-4 py-1 rounded text-blue-600 hover:bg-blue-100">
        Cambiar
      </button>
    </div>
    <div className="flex items-center gap-2">
      <span>Notificaciones</span>
      <label className="inline-flex relative items-center cursor-pointer">
        <input type="checkbox" defaultChecked className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
      </label>
    </div>
  </div>
</div>


    </div>
  );
}
