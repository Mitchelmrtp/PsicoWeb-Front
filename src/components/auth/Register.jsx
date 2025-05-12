import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import FormError from '../common/FormError';

export const RegisterForm = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    name: '',
    first_name: '',
    last_name: '',
    telephone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const result = await register(userData);
      console.log('Registration successful:', result);
      setSuccess(true);
      setUserData({ email: '', password: '', name: '', first_name: '', last_name: '', telephone: '' });
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ¡Registro exitoso! Ahora puedes <Link to="/login" className="font-bold hover:underline">iniciar sesión</Link>.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={userData.email}
          onChange={handleChange}
          required
        />
        
        <Input
          id="name"
          name="name"
          label="Nombre de usuario"
          value={userData.name}
          onChange={handleChange}
          required
        />
        
        <Input
          id="first_name"
          name="first_name"
          label="Nombre"
          value={userData.first_name}
          onChange={handleChange}
        />
        
        <Input
          id="last_name"
          name="last_name"
          label="Apellidos"
          value={userData.last_name}
          onChange={handleChange}
        />
        
        <Input
          id="telephone"
          name="telephone"
          label="Teléfono"
          value={userData.telephone}
          onChange={handleChange}
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          value={userData.password}
          onChange={handleChange}
          required
        />
        
        <FormError error={error} />
        
        <Button
          type="submit"
          fullWidth
          disabled={loading}
          variant="success"
        >
          {loading ? 'Cargando...' : 'Registrarse'}
        </Button>
        
        <div className="text-center mt-4">
          <p>¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión aquí</Link></p>
        </div>
      </form>
    </div>
  );
};