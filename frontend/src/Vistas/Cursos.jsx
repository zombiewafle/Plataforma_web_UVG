import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

function Cursos() {
    const API_URL = import.meta.env.VITE_API_URL;
    const HOME_API = `${API_URL}/home`;

    const [cursos, setCursos] = useState([]);
    const [misCursos, setMisCursos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [inscribiendo, setInscribiendo] = useState(null);
    const [error, setError] = useState("");

    async function cargarCursos() {
        try {
            setError("");
            setCargando(true);

            const [respuestaCursos, respuestaMisCursos] = await Promise.all([
                fetch(`${HOME_API}/cursos`, {
                    credentials: "include",
                }),
                fetch(`${HOME_API}/mis-cursos`, {
                    credentials: "include",
                }),
            ]);

            const [datosCursos, datosMisCursos] = await Promise.all([
                respuestaCursos.json(),
                respuestaMisCursos.json(),
            ]);

            if (!respuestaCursos.ok) {
                throw new Error(
                    datosCursos.error || "Error al obtener los cursos"
                );
            }

            if (!respuestaMisCursos.ok) {
                throw new Error(
                    datosMisCursos.error || "Error al obtener tus cursos"
                );
            }

            setCursos(datosCursos);
            setMisCursos(datosMisCursos);
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        document.title = "Cursos | Aprende Web GT";
        cargarCursos();
    }, []);

    const idsMisCursos = useMemo(() => {
        return new Set(
            misCursos.map((curso) => curso.id ?? curso.curso_id)
        );
    }, [misCursos]);

    async function inscribirse(cursoId) {
        try {
            setError("");
            setInscribiendo(cursoId);

            const respuesta = await fetch(
                `${HOME_API}/cursos/${cursoId}/inscripcion`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.error || "No fue posible inscribirse al curso"
                );
            }

            await cargarCursos();
        } catch (error) {
            setError(error.message);
        } finally {
            setInscribiendo(null);
        }
    }

    if (cargando) {
        return (
            <section className="w-full px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <p className="text-gray-600">Cargando cursos...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full px-4 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Cursos
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Explora los cursos disponibles y continúa aprendiendo.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {cursos.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Todavía no hay cursos disponibles
                        </h2>

                        <p className="mt-2 text-gray-600">
                            Los cursos aparecerán aquí cuando sean agregados a la plataforma.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {cursos.map((curso) => {
                            const cursoId = curso.id ?? curso.curso_id;
                            const inscrito = idsMisCursos.has(cursoId);
                            const procesando = inscribiendo === cursoId;

                            return (
                                <article
                                    key={cursoId}
                                    className="flex min-h-64 flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                                >
                                    <div className="flex-1">
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {curso.titulo}
                                            </h2>

                                            {inscrito && (
                                                <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    Inscrito
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm leading-6 text-gray-600">
                                            {curso.descripcion ||
                                                "Este curso todavía no tiene descripción."}
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        {inscrito ? (
                                            <Link
                                                to={`/cursos/${cursoId}`}
                                                className="block w-full rounded-lg bg-green-600 px-4 py-2.5 text-center font-medium text-white transition hover:bg-green-700"
                                            >
                                                Ver curso
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => inscribirse(cursoId)}
                                                disabled={procesando}
                                                className="w-full rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {procesando
                                                    ? "Inscribiendo..."
                                                    : "Inscribirme"}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Cursos;
