import { useState } from "react";
import { useNavigate } from "react-router";

function LogoutButton() {
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    async function handleLogout(e) {
        setError('');
        setCargando(true);

        try {
            const respuesta = await fetch(`${API_URL}/usuarios/logout`, {
                method: 'POST',
                credentials: 'include'
            });


            if (!respuesta.ok) {
                throw new Error("No se pudo cerrar la sesión");
            }

            navigate('/login', { replace: true });


        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false)
        }
    }



    return (
        <>
            <button onClick={handleLogout} disabled={cargando} className="text-green-600 font-medium  rounded-md  hover:text-white cursor-pointer">
                {cargando ? "Cerrando sesión..." : "Cerrar Sesión"}
            </button>
        </>
    );

}

export default LogoutButton;