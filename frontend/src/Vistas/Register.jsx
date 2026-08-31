import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

function Register() {
    const [username, setUsername] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const respuesta = await fetch(`${API_URL}/usuarios/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    nombre: nombre,
                    correo: correo,
                    password: password
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
            <h1 className="font-bold text-4xl">Registro</h1>
            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-300 text-sm max-w-xs text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-80 gap-5 items-center justify-center flex flex-col">
                <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" autoComplete="email" placeholder="Usuario" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"></input>
                <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" autoComplete="name" placeholder="Nombre (Un nombre y 1 apellido)" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md "></input>
                <input id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} type="text" autoComplete="on" placeholder="Correo Electrónico" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"></input>
                <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" placeholder="Contraseña" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"></input>

                <button type="submit" disabled={cargando} className="shadow-md bg-green-600 text-white font-medium px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer">{cargando ? 'Cargando...' : 'Registrar'}</button>
                <Link to="/login" type="button" className="border-2 border-green-600 text-green-600 font-medium px-4 py-2 rounded-md hover:bg-green-700 hover:text-white cursor-pointer">Regresar</Link>
            </form>

        </div>
    );
};

export default Register;