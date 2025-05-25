import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";
import FormError from "../common/FormError";
import AuthSidebar from "../common/AuthSidebar";

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(credentials);
      console.log("Login successful:", result);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", credentials.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/PagPrincipal");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
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

        <div className="w-full md:w-3/5 p-8 md:p-12">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Bienvenido</h2>
            <p className="text-sm text-gray-600 mb-8">
              Nuevo en PsycoWeb?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Regístrate
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Tu Correo
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Correo"
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Tu contraseña
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <FormError error={error} />

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="bg-indigo-800 hover:bg-indigo-900"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
