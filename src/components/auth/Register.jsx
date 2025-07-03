import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authService } from "../../services/api";
import Input from "../ui/Input";
import Button from "../ui/Button";
import FormError from "../common/FormError";
import AuthSidebar from "../common/AuthSidebar";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("paciente");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    first_name: "",
    last_name: "",
    telephone: "",
    role: "paciente",
    especialidad: "",
    licencia: "",
    formacion: "",
    motivoConsulta: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  }, [selectedRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();

      let userData = {
        email: formData.email,
        password: formData.password,
        name: fullName,
        first_name: formData.first_name,
        last_name: formData.last_name,
        telephone: formData.telephone,
        role: selectedRole,
      };

      if (selectedRole === "psicologo") {
        userData = {
          ...userData,
          especialidad: formData.especialidad,
          licencia: formData.licencia,
          formacion: formData.formacion,
        };
      } else if (selectedRole === "paciente") {
        userData = {
          ...userData,
          motivoConsulta: formData.motivoConsulta,
        };
      }

      console.log("Sending registration data:", userData);

      const result = await authService.register(userData);
      console.log("Registration successful:", result);

      navigate("/login", { state: { registrationSuccess: true } });
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-2/5">
          <AuthSidebar
            title="Psicólogos cualificados"
            subtitle="El mejor trato posible"
          />
        </div>

        <div className="w-full md:w-3/5 p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="text-right mb-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <h2 className="text-3xl font-bold mb-2">¡Bienvenido!</h2>
            <p className="text-sm text-gray-600 mb-6">
              Ya conoces PsycoWeb?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Inicia sesión
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium mb-1"
                  >
                    Nombres
                  </label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium mb-1"
                  >
                    Apellidos
                  </label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="telephone"
                  className="block text-sm font-medium mb-1"
                >
                  Número de Teléfono
                </label>
                <div className="flex">
                  <div className="w-20 mr-2">
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="+51"
                    >
                      <option value="+51">+51</option>
                      <option value="+1">+1</option>
                      <option value="+34">+34</option>
                      <option value="+52">+52</option>
                      <option value="+57">+57</option>
                    </select>
                  </div>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Tu contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo de cuenta
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`flex items-center justify-center px-3 py-2 border rounded-md ${
                      selectedRole === "paciente"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 text-gray-700"
                    }`}
                    onClick={() => setSelectedRole("paciente")}
                  >
                    <span>Paciente</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center px-3 py-2 border rounded-md ${
                      selectedRole === "psicologo"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 text-gray-700"
                    }`}
                    onClick={() => setSelectedRole("psicologo")}
                  >
                    <span>Psicólogo</span>
                  </button>
                </div>
              </div>

              {selectedRole === "psicologo" && (
                <>
                  <div>
                    <label
                      htmlFor="especialidad"
                      className="block text-sm font-medium mb-1"
                    >
                      Especialidad
                    </label>
                    <Input
                      id="especialidad"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="licencia"
                      className="block text-sm font-medium mb-1"
                    >
                      Número de Licencia
                    </label>
                    <Input
                      id="licencia"
                      name="licencia"
                      value={formData.licencia}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="formacion"
                      className="block text-sm font-medium mb-1"
                    >
                      Formación Académica
                    </label>
                    <Input
                      id="formacion"
                      name="formacion"
                      value={formData.formacion}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {selectedRole === "paciente" && (
                <div>
                  <label
                    htmlFor="motivoConsulta"
                    className="block text-sm font-medium mb-1"
                  >
                    Motivo de Consulta
                  </label>
                  <textarea
                    id="motivoConsulta"
                    name="motivoConsulta"
                    value={formData.motivoConsulta}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
              )}

              <FormError error={error} />

              <Button
                type="submit"
                disabled={loading}
                fullWidth
                className="bg-indigo-800 hover:bg-indigo-900 mt-4"
              >
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
