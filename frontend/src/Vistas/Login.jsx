import { useState } from "react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function Login() {
    useEffect(() => {
        document.title = "Login | Aprende Web GT";
    }, []);

    const [identificador, setIdentificador] = useState('');
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
            const respuesta = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identificador: identificador,
                    password: password
                }),
            });


            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error || 'Credenciales Incorrectas');
            }

            navigate('/home', { replace: true })


        } catch (error) {
            setError(error.message);

        } finally {
            setCargando(false);
        }
    }



    return (
        <div className='w-screen flex flex-col items-center justify-center h-screen gap-5'>

            <h1 className="font-bold text-4xl">Login</h1>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-300 text-sm max-w-xs text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="gap-5 items-center justify-center flex flex-col">
                <input id="identificador" value={identificador} onChange={(e) => setIdentificador(e.target.value)} type="text" autoComplete="email" placeholder="Correo Electrónico" className=" px-4 py-2 border border-gray-300 rounded-lg shadow-md"></input>
                <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="Contraseña" className=" px-4 py-2 border border-gray-300 rounded-lg shadow-md "></input>

                <button
                    type="submit"
                    disabled={cargando}
                    className="shadow-md bg-green-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                >
                    {cargando ? 'Cargando...' : 'Iniciar sesión'}
                </button>

            </form>
            <a href="/olvido_contraseña" className="text-sm text-emerald-600 hover:underline font-bold">¿Olvidaste tu contraseña?</a>
            <a href="/registro" className="text-sm text-emerald-600 hover:underline font-bold">¿No tienes una cuenta? Registrate</a>

        </div >
    );
}

export default Login;