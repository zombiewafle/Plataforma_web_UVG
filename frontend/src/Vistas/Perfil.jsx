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
        <div className="flex flex-col items-center gap-5 py-10">
            <h1 className="font-bold text-4xl">Perfil</h1>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-300 text-sm max-w-xs text-center">
                    {error}
                </div>
            )}

            <div className="flex flex-col items-left gap-5">
                <ul>
                    <li>Nombre: {dNombre}</li>
                    <li>Correo: {dcorreo}</li>
                    <li>Rol: {drol}</li>
                </ul>
            </div>

            {
                !editando ? (
                    <button
                        type="button"
                        onClick={() => setEditando(true)}
                    >
                        Editar perfil
                    </button>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 w-80"
                    >
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre"
                            className="border rounded-md px-4 py-2"
                        />

                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="Correo"
                            className="border rounded-md px-4 py-2"
                        />

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={cargando}
                            >
                                {cargando ? "Guardando..." : "Guardar cambios"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditando(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )
            }

        </div >
    );
}

export default Perfil;