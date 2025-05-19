import React from 'react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import MyCalendar from '../common/Calendar';

export const Disponibilidad = () => {
    const perfiles = [{ 
        nombre: 'Pepe', 
        disponibilidad: '10 a.m. - 11 a.m.',
              eventos: [
        {
          title: 'Disponible',
          start: new Date(2025, 4, 23, 10, 0),
          end:   new Date(2025, 4, 23, 11, 0),
        }
      ]
    },
    { 
        nombre: 'Mili', 
        disponibilidad: 'No disponible',
        eventos: [], 
    }
    ];
    const navigate = useNavigate();

    const handlePagPrincipal = (e) => {
        e.preventDefault();
        navigate('/PagPrincipal');
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <header className="flex items-center justify-between px-8 py-6">
                <h1 className="text-4xl font-extrabold text-gray-800">DISPONIBILIDAD</h1>
            </header>
            <div className="flex flex-col items-center mt-12 ">
                {perfiles.map((perfil, idx) => (
                    <div
                        key={idx}
                        className=""
                    >
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            Perfil {idx + 1}
                        </h2>
                        <p className="text-lg text-gray-600">
                            <span className="font-semibold">Nombre:</span> {perfil.nombre}
                        </p>
                        <p className="text-lg text-gray-600">
                            <span className="font-semibold">Disponibilidad:</span> {perfil.disponibilidad}
                        </p>
                        <MyCalendar events={perfil.eventos} />
                    </div>
                ))}
            </div>
            <div>
                <Button
                    type="submit"
                    variant="primary"
                    className="auth-btn"
                    onClick={handlePagPrincipal}
                    >
                        Regresar a la Página Principal
                </Button>
            </div>
        </div>
    );
};

