import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function EjercicioDetalle() {
    const { id } = useParams();

    const API_URL = import.meta.env.VITE_API_URL;
    const HOME_API = `${API_URL}/home`;

    const [ejercicio, setEjercicio] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarEjercicio() {
            try {
                setError("");

                const respuesta = await fetch(
                    `${HOME_API}/ejercicios/${id}`,
                    {
                        credentials: "include",
                    }
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        datos.error || "Error al obtener el ejercicio"
                    );
                }

                setEjercicio(datos);

            } catch (error) {
                setError(error.message);

            } finally {
                setCargando(false);
            }
        }

        cargarEjercicio();

    }, [id]);

    useEffect(() => {
        if (ejercicio) {
            document.title =
                `${ejercicio.titulo} | Aprende Web GT`;
        }
    }, [ejercicio]);

    if (cargando) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <p>Cargando ejercicio...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <section className="w-full px-4 py-10">
            <div className="mx-auto max-w-5xl">

                <Link
                    to={`/cursos/${ejercicio.curso_id}`}
                    className="text-sm text-green-500 hover:underline"
                >
                    ← Volver al curso
                </Link>

                <div className="mt-6">
                    <p className="text-sm text-gray-400">
                        Ejercicio {ejercicio.orden}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        {ejercicio.titulo}
                    </h1>

                    <p className="mt-5 leading-7 text-gray-300">
                        {ejercicio.instrucciones}
                    </p>
                </div>

                <div className="mt-10">
                    <h2 className="text-xl font-semibold">
                        Código inicial
                    </h2>

                    <pre className="mt-4 overflow-x-auto rounded-xl border border-gray-700 bg-black/20 p-5">
                        <code>
                            {ejercicio.codigo_inicial ||
                                "Este ejercicio no tiene código inicial."}
                        </code>
                    </pre>
                </div>

                <div className="mt-8">
                    <button
                        type="button"
                        className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700"
                    >
                        <Link
                            to={`/playground/${ejercicio.id}`}
                            className="inline-block rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700"
                        >
                            Empezar ejercicio
                        </Link>
                    </button>
                </div>

            </div>
        </section>
    );
}

export default EjercicioDetalle;