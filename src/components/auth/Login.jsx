import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import FormError from '../common/FormError';

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(credentials);
      console.log('Login successful:', result);

    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        
        <FormError error={error} />
        
        <Button
          type="submit"
          fullWidth
          disabled={loading}
          variant="primary"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>
        
        <div className="text-center mt-4">
          <p>¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate aquí</Link></p>
        </div>
      </form>
    </div>
  );
};