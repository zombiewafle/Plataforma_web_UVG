import { useState } from "react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function Perfil() {
    useEffect(() => {
        document.title = "Perfil | Aprende Web GT";
        showProfile();
    }, []);

    const [correo, setCorreo] = useState('');
    const [nombre, setNombre] = useState('');
    const [cargando, setCargando] = useState(false);
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;

    const [dNombre, setdNombre] = useState('');
    const [dcorreo, setdCorreo] = useState('');
    const [drol, setdRol] = useState('');


    // const navigate = useNavigate();

    async function showProfile() {
        try {
            const respuesta = await fetch(`${API_URL}/usuarios/perfil`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const datos = await respuesta.json();
            if (!respuesta.ok) {
                throw new Error(datos.error || "No se pudo obtener los datos del perfil");
            }

            setdNombre(datos.nombre);
            setdCorreo(datos.correo);
            setdRol(datos.rol);

            setNombre(datos.nombre);
            setCorreo(datos.correo);

        }
        catch (error) {
            setError(error.message);

        } finally {
            setCargando(false);
        }
    }


    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {

            const cambios = {};

            if (nombre !== dNombre) {
                cambios.nombre = nombre;
            }

            if (correo !== dcorreo) {
                cambios.correo = correo;
            }

            const respuesta = await fetch(`${API_URL}/usuarios/perfil`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(cambios),
            });
            const datos = await respuesta.json();

            console.log(datos)
            console.log(error)

            if (!respuesta.ok) {
                throw new Error(datos.error || "No se pudo actualizar el perfil");
            }
            await showProfile();
            setEditando(false);
        }
        catch (error) {
            setError(error.message);

        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="flex justify-center py-12 px-4">

            <div className="w-full max-w-md flex flex-col gap-6">

                <h1 className="text-4xl font-bold">
                    Perfil
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm text-gray-400">
                            Nombre
                        </p>
                        <p className="font-medium">
                            {dNombre}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400">
                            Correo
                        </p>
                        <p className="font-medium">
                            {dcorreo}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-400">
                            Rol
                        </p>
                        <p className="font-medium capitalize">
                            {drol}
                        </p>
                    </div>
                </div>

                {!editando ? (
                    <button
                        type="button"
                        onClick={() => setEditando(true)}
                        className="self-start px-4 py-2 rounded-md border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    >
                        Editar perfil
                    </button>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 w-full"
                    >
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={cargando}
                                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {cargando ? "Guardando..." : "Guardar cambios"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setNombre(dNombre);
                                    setCorreo(dcorreo);
                                    setEditando(false);
                                }}
                                className="flex-1 border border-gray-300 text-gray-300 py-2 rounded-md hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
}

export default Perfil;