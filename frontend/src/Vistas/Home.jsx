import { useState } from "react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function Home() {
    useEffect(() => {
        document.title = "Inicio | Aprende Web GT";
    }, []);

    const [identificador, setIdentificador] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const respuesta = await fetch(`${API_URL}/usuarios/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            navigate('/login', { replace: true });


        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className='w-screen flex flex-col items-center justify-center h-screen gap-5'>
            <button onClick={handleLogout} disabled={cargando} className="border-2 border-green-600 text-green-600 font-medium px-4 py-2 rounded-md hover:bg-green-700 hover:text-white cursor-pointer">
                {cargando ? "Cerrando sesión..." : "Cerrar Sesión"}
            </button>
        </div>
    )
};

export default Home;