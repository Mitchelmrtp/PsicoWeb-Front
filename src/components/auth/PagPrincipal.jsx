import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

export const PagPrincipal = () => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const handleDisponibilidad = (e) => {
        e.preventDefault();
        navigate('/Disponibilidad');
    };

    return (
        <div className="">
            <div className="flex justify-between items-center px-8 py-6 bg-gray-50">
                <h1 className="text-4xl font-extrabold text-gray-800">Bienvenido a PSICOWEB</h1>
                    <Button
                        type="submit"
                        variant="primary"
                        className="auth-btn logout-btn"
                        onClick={handleLogout}
                    >
                        Cerrar Sesión
                    </Button>
            </div>
            <div className="flex justify-center mt-12">
                    <Button
                        type="submit"
                        variant="primary"
                        className="auth-btn"
                        onClick={handleDisponibilidad}
                    >
                        Ver disponibilidad de psicólogos
                    </Button>
            </div>
        </div>
    );
};