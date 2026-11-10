
import { useState, useEffect } from "react";
import LogoutButton from "../Componentes/LogoutLogic";

function Home() {
    const API_URL = import.meta.env.VITE_API_URL;

    const HOME_API = `${API_URL}/home`;

    const [cursos, setCursos] = useState([]);
    const [misCursos, setMisCursos] = useState([]);
    const [enProgreso, setEnProgreso] = useState([]);

    const [ejerciciosCurso, setEjerciciosCurso] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [cargandoEjercicios, setCargandoEjercicios] = useState(false);
    const [inscribiendoId, setInscribiendoId] = useState(null);

    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');

    useEffect(() => {
        document.title = "Inicio | Aprende Web GT";

        let activo = true;

        async function cargarHome() {
            try {
                const respuestas = await Promise.all([
                    fetch(`${HOME_API}/cursos`, {
                        credentials: 'include'
                    }),
                    fetch(`${HOME_API}/mis-cursos`, {
                        credentials: 'include'
                    }),
                    fetch(`${HOME_API}/en-progreso`, {
                        credentials: 'include'
                    })
                ]);

                const datos = await Promise.all(
                    respuestas.map(respuesta => respuesta.json())
                );

                for (let i = 0; i < respuestas.length; i++) {
                    if (!respuestas[i].ok) {
                        throw new Error(
                            datos[i].error || 'Error al cargar el Home'
                        );
                    }
                }

                if (!activo) return;

                setCursos(datos[0]);
                setMisCursos(datos[1]);
                setEnProgreso(datos[2]);

            } catch (error) {
                if (activo) setError(error.message);
            } finally {
                if (activo) setCargando(false);
            }
        }

        cargarHome();

        return () => {
            activo = false;
        };
    }, []);

    async function inscribirse(curso_id) {
        setInscribiendoId(curso_id);
        setError('');
        setAviso('');

        try {
            const respuesta = await fetch(
                `${HOME_API}/cursos/${curso_id}/inscripcion`,
                {
                    method: 'POST',
                    credentials: 'include'
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error || 'Error al inscribirse');
            }

            // Actualizar los cursos inscritos
            const respuestaCursos = await fetch(
                `${HOME_API}/mis-cursos`,
                {
                    credentials: 'include'
                }
            );

            const cursosActualizados = await respuestaCursos.json();

            if (!respuestaCursos.ok) {
                throw new Error(
                    cursosActualizados.error ||
                    'No se pudieron actualizar los cursos'
                );
            }

            setMisCursos(cursosActualizados);
            setAviso('Te has inscrito correctamente al curso.');

        } catch (error) {
            setError(error.message);
        } finally {
            setInscribiendoId(null);
        }
    }

    async function verEjercicios(curso_id) {
        setCursoSeleccionado(curso_id);
        setEjerciciosCurso([]);
        setCargandoEjercicios(true);
        setError('');

        try {
            const respuesta = await fetch(
                `${HOME_API}/cursos/${curso_id}/ejercicios`,
                {
                    credentials: 'include'
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.error || 'Error al obtener los ejercicios'
                );
            }

            setEjerciciosCurso(datos);

        } catch (error) {
            setError(error.message);
        } finally {
            setCargandoEjercicios(false);
        }
    }

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Cargando información...</p>
            </div>
        );
    }

    const inscritosIds = new Set(
        misCursos.map(curso => Number(curso.id))
    );

    const disponibles = cursos.filter(
        curso => !inscritosIds.has(Number(curso.id))
    );

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-8">

            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                {/* ENCABEZADO */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-3xl">
                            Bienvenido a Aprende Web GT
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Continúa aprendiendo o explora nuevos cursos.
                        </p>
                    </div>

                </header>

                {/* MENSAJES */}
                {error && (
                    <div role="alert"
                        className="bg-red-100 text-red-700 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                {aviso && (
                    <div role="status"
                        className="bg-green-100 text-green-700 p-3 rounded-lg">
                        {aviso}
                    </div>
                )}

                {/* MIS CURSOS */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">
                        Mis cursos
                    </h2>

                    {misCursos.length === 0 ? (
                        <p className="text-gray-600">
                            Todavía no estás inscrito en ningún curso.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {misCursos.map(curso => (
                                <article
                                    key={curso.id}
                                    className="bg-white p-5 rounded-lg shadow-md"
                                >
                                    <h3 className="font-bold text-lg">
                                        {curso.titulo}
                                    </h3>

                                    <p className="text-gray-600 my-3">
                                        {curso.descripcion}
                                    </p>

                                    <button
                                        onClick={() => verEjercicios(curso.id)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer"
                                    >
                                        Ver ejercicios
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* EJERCICIOS EN PROGRESO */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">
                        Continuar aprendiendo
                    </h2>

                    {enProgreso.length === 0 ? (
                        <p className="text-gray-600">
                            No tienes ejercicios en progreso.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {enProgreso.map(ejercicio => (
                                <article
                                    key={ejercicio.id}
                                    className="bg-white p-5 rounded-lg shadow-md"
                                >
                                    <h3 className="font-bold">
                                        {ejercicio.titulo}
                                    </h3>

                                    <p className="text-gray-600 mt-2">
                                        {ejercicio.curso_titulo}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* CURSOS DISPONIBLES */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">
                        Explorar cursos
                    </h2>

                    {misCursos.length === 0 && disponibles.length > 0 && (
                        <p className="text-green-700 mb-4">
                            Te recomendamos comenzar por {disponibles[0].titulo}.
                        </p>
                    )}

                    {disponibles.length === 0 ? (
                        <p className="text-gray-600">
                            No hay más cursos disponibles.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {disponibles.map(curso => (
                                <article
                                    key={curso.id}
                                    className="bg-white p-5 rounded-lg shadow-md"
                                >
                                    <h3 className="font-bold text-lg">
                                        {curso.titulo}
                                    </h3>

                                    <p className="text-gray-600 my-3">
                                        {curso.descripcion}
                                    </p>

                                    <button
                                        disabled={inscribiendoId !== null}
                                        onClick={() => inscribirse(curso.id)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                                    >
                                        {inscribiendoId === curso.id
                                            ? 'Inscribiendo...'
                                            : 'Inscribirme'}
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* EJERCICIOS DE UN CURSO */}
                {cursoSeleccionado !== null && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4">
                            Ejercicios del curso
                        </h2>

                        {cargandoEjercicios ? (
                            <p>Cargando ejercicios...</p>
                        ) : ejerciciosCurso.length === 0 ? (
                            <p>No hay ejercicios disponibles.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {ejerciciosCurso.map(ejercicio => (
                                    <article
                                        key={ejercicio.id}
                                        className="bg-white p-4 rounded-lg shadow-md"
                                    >
                                        <h3 className="font-bold">
                                            {ejercicio.ejercicio_titulo}
                                        </h3>

                                        <p className="text-gray-600 mt-2">
                                            {ejercicio.instrucciones}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* DOCUMENTACIÓN */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">
                        Documentación
                    </h2>

                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-3">
                            Consulta documentación para apoyar tu aprendizaje.
                        </p>

                        <a
                            href="https://developer.mozilla.org/es/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 font-bold hover:underline"
                        >
                            MDN Web Docs
                        </a>
                    </div>
                </section>

            </div>
        </main>
    );
}

export default Home;
