import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { useEffect } from "react";
import OlvidoContraseña from "./ForgotPassword";

function resetPassword() {
    useEffect(() => {
        document.title = "Reseteo de Contraseñas | Aprende Web GT";
    }, []);

    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');
    const token = searchParams.get("token");
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError();


        if (nuevaPassword !== confirmarPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setCargando(true);
        try {
            const respuesta = await fetch(`${API_URL}/usuarios/restablecer-contrasena`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenCrudo: token,
                    nuevaPassword: nuevaPassword,
                    confirmarPassword: confirmarPassword
                }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error || 'Faltan campos requeridos')
            }



            navigate('/login');

        } catch (error) {
            setError(error.message);
        }
        finally {
            setCargando(false);
        }
    }

    return (
        <div className='w-screen flex flex-col items-center justify-center h-screen gap-5'>
            <h1 className="font-bold text-4xl">Restablece tu contraseña</h1>
            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-300 text-sm max-w-xs text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="w-80 gap-5 items-center justify-center flex flex-col">
                <input id="nuevaPassword" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} type="password" autoComplete="on" placeholder="Nueva Contraseña" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"></input>
                <input id="confirmarNuevaPassword" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} type="password" autoComplete="off" placeholder="Confirmar nueva Contraseña" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"></input>

                <button type="submit" disabled={cargando} className="shadow-md bg-green-600 text-white font-medium px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer">{cargando ? 'Cargando...' : 'Enviar'}</button>
                <Link to="/login" type="button" className="border-2 border-green-600 text-green-600 font-medium px-4 py-2 rounded-md hover:bg-green-700 hover:text-white cursor-pointer">Regresar</Link>
            </form>

        </div>
    );

}

export default resetPassword;