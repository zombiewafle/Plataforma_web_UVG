import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

function OlvidoContraseña() {
    const [identificador, setIdentificador] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const respuesta = await fetch(`${API_URL}/usuarios/olvido_contraseña`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identificador: identificador
                }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error || 'Faltan campos requeridos')
            }

            navigate('/login');

        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className='w-screen flex flex-col items-center justify-center h-screen gap-5'>
            <h1 className="font-bold text-4xl">¿Olvidaste tu Contraseña?</h1>
            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-300 text-sm max-w-xs text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-80 gap-5 items-center justify-center flex flex-col">
                <input id="identificador" value={identificador} onChange={(e) => setIdentificador(e.target.value)} type="text" autoComplete="on" placeholder="Correo Electrónico  / Usuario" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"></input>

                <button type="submit" disabled={cargando} className="shadow-md bg-green-600 text-white font-medium px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer">{cargando ? 'Cargando...' : 'Enviar'}</button>
                <Link to="/login" type="button" className="border-2 border-green-600 text-green-600 font-medium px-4 py-2 rounded-md hover:bg-green-700 hover:text-white cursor-pointer">Regresar</Link>
            </form>

        </div>
    );
};

export default OlvidoContraseña;