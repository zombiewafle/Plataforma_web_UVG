import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function CursoDetalle() {
    const { id } = useParams();

    const API_URL = import.meta.env.VITE_API_URL;
    const HOME_API = `${API_URL}/home`;

    const [curso, setCurso] = useState(null);
    const [ejercicios, setEjercicios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        document.title = "Curso | Aprende Web GT";

        async function cargarCurso() {
            try {
                setError("");

                const [respuestaCursos, respuestaEjercicios] =
                    await Promise.all([
                        fetch(`${HOME_API}/cursos`, {
                            credentials: "include",
                        }),

                        fetch(`${HOME_API}/cursos/${id}/ejercicios`, {
                            credentials: "include",
                        }),
                    ]);

                const [datosCursos, datosEjercicios] =
                    await Promise.all([
                        respuestaCursos.json(),
                        respuestaEjercicios.json(),
                    ]);

                if (!respuestaCursos.ok) {
                    throw new Error(
                        datosCursos.error ||
                        "Error al obtener el curso"
                    );
                }

                if (!respuestaEjercicios.ok) {
                    throw new Error(
                        datosEjercicios.error ||
                        "Error al obtener los ejercicios"
                    );
                }

                const cursoEncontrado = datosCursos.find(
                    (curso) =>
                        Number(curso.id ?? curso.curso_id) === Number(id)
                );

                if (!cursoEncontrado) {
                    throw new Error("Curso no encontrado");
                }

                setCurso(cursoEncontrado);
                setEjercicios(datosEjercicios);

            } catch (error) {
                setError(error.message);

            } finally {
                setCargando(false);
            }
        }

        cargarCurso();

    }, [id]);

    if (cargando) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <p>Cargando curso...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <section className="w-full px-4 py-10">
            <div className="mx-auto max-w-5xl">

                <Link
                    to="/cursos"
                    className="text-sm text-green-500 hover:underline"
                >
                    ← Volver a cursos
                </Link>

                <div className="mt-6">
                    <h1 className="text-3xl font-bold">
                        {curso.titulo}
                    </h1>

                    <p className="mt-3 text-gray-400">
                        {curso.descripcion}
                    </p>
                </div>

                <div className="mt-10">
                    <h2 className="mb-5 text-2xl font-semibold">
                        Ejercicios
                    </h2>

                    {ejercicios.length === 0 ? (
                        <div className="rounded-xl border border-gray-700 p-6">
                            <p className="text-gray-400">
                                Este curso todavía no tiene ejercicios.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {ejercicios.map((ejercicio) => (
                                <article
                                    key={ejercicio.id}
                                    className="rounded-xl border border-gray-700 p-5"
                                >
                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Ejercicio {ejercicio.orden}
                                            </p>

                                            <h3 className="mt-1 text-lg font-semibold">
                                                {ejercicio.titulo}
                                            </h3>
                                        </div>

                                        <Link
                                            to={`/ejercicios/${ejercicio.id}`}
                                            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                                        >
                                            Abrir
                                        </Link>

                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}

export default CursoDetalle;