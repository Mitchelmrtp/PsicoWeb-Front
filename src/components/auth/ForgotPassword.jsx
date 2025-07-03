// src/components/auth/ForgotPassword.jsx
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import FormError from "../common/FormError";
import { authService } from "../../services/api";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await authService.forgotPassword(email);
      setSuccessMsg("Recibirás un enlace para restablecer tu contraseña.");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "Error al solicitar restablecimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Recuperar Contraseña
          </h2>
          {successMsg && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormError error={error} />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="primary"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>

            <div className="text-center mt-4">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
