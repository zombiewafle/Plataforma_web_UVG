import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";


const API_URL = import.meta.env.VITE_API_URL;
const HOME_API = `${API_URL}/home`;

export default function Playground() {
    const { ejercicioId } = useParams();

    const [ejercicio, setEjercicio] = useState(null);
    const [codigos, setCodigos] = useState({});
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarDatos() {
            try {
                setCargando(true);
                setError("");

                // 1. Cargar ejercicio y lenguajes
                const respuestaEjercicio = await fetch(
                    `${HOME_API}/ejercicios/${ejercicioId}`,
                    {
                        credentials: "include"
                    }
                );

                if (!respuestaEjercicio.ok) {
                    throw new Error("Error al cargar el ejercicio");
                }

                const datosEjercicio =
                    await respuestaEjercicio.json();

                setEjercicio(datosEjercicio);

                // Código inicial de cada lenguaje
                const codigosIniciales = {};

                datosEjercicio.lenguajes.forEach((lenguaje) => {
                    codigosIniciales[lenguaje.slug] =
                        lenguaje.codigo_inicial || "";
                });

                // 2. Cargar progreso guardado
                const respuestaProgreso = await fetch(
                    `${HOME_API}/ejercicios/${ejercicioId}/progreso`,
                    {
                        credentials: "include"
                    }
                );

                if (!respuestaProgreso.ok) {
                    throw new Error(
                        "Error al cargar el progreso"
                    );
                }

                const progreso =
                    await respuestaProgreso.json();

                // Si ya hay progreso, sobrescribimos el código inicial
                if (progreso) {
                    progreso.codigos.forEach((item) => {
                        codigosIniciales[item.lenguaje] =
                            item.codigo;
                    });
                }

                setCodigos(codigosIniciales);

            } catch (error) {
                console.error(error);
                setError(error.message);

            } finally {
                setCargando(false);
            }
        }

        cargarDatos();

    }, [ejercicioId]);


    async function guardarProgreso() {
        try {
            setGuardando(true);
            setMensaje("");
            setError("");

            const listaCodigos = Object.entries(codigos).map(
                ([lenguaje, codigo]) => ({
                    lenguaje,
                    codigo
                })
            );

            const respuesta = await fetch(
                `${HOME_API}/ejercicios/${ejercicioId}/progreso`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        codigos: listaCodigos
                    })
                }
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo guardar el progreso"
                );
            }

            setMensaje("Progreso guardado correctamente");

        } catch (error) {
            console.error(error);
            setError(error.message);

        } finally {
            setGuardando(false);
        }
    }


    const resultado = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                ${codigos.css ?? ""}
            </style>
        </head>

        <body>
            ${codigos.html ?? ""}

            <script>
                ${codigos.javascript ?? ""}
            <\/script>
        </body>
        </html>
    `;


    if (cargando) {
        return (
            <div className="p-8">
                Cargando ejercicio...
            </div>
        );
    }


    if (error && !ejercicio) {
        return (
            <div className="p-8 text-red-600">
                {error}
            </div>
        );
    }


    return (
        <main className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-7xl">

                <div className="mb-6">

                    <p className="text-sm text-gray-500">
                        Ejercicio {ejercicio?.orden}
                    </p>

                    <Link
                        to={`/ejercicios/${ejercicioId}`}
                        className="mb-4 inline-block text-sm font-medium text-green-700 hover:underline"
                    >
                        ← Regresar al ejercicio
                    </Link>

                    <h1 className="text-3xl font-bold">
                        {ejercicio?.titulo}
                    </h1>

                    <p className="mt-2 text-gray-600">
                        {ejercicio?.instrucciones}
                    </p>

                </div>


                <div className="grid gap-6 lg:grid-cols-2">

                    {/* EDITORES */}
                    <div className="space-y-5">

                        {ejercicio?.lenguajes.map((lenguaje) => (

                            <div key={lenguaje.id}>

                                <h2 className="mb-2 font-semibold">
                                    {lenguaje.nombre}
                                </h2>

                                <textarea
                                    value={
                                        codigos[lenguaje.slug] ?? ""
                                    }

                                    onChange={(e) =>
                                        setCodigos((actuales) => ({
                                            ...actuales,
                                            [lenguaje.slug]:
                                                e.target.value
                                        }))
                                    }

                                    className="
                                        h-64
                                        w-full
                                        resize-none
                                        rounded-lg
                                        border
                                        bg-gray-900
                                        p-4
                                        font-mono
                                        text-sm
                                        text-white
                                    "
                                />

                            </div>

                        ))}


                        <button
                            onClick={guardarProgreso}
                            disabled={guardando}
                            className="
                                rounded-lg
                                bg-green-600
                                px-5
                                py-2.5
                                font-medium
                                text-white
                                transition
                                hover:bg-green-700
                                disabled:opacity-50
                            "
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar progreso"
                            }
                        </button>


                        {mensaje && (
                            <p className="text-green-600">
                                {mensaje}
                            </p>
                        )}


                        {error && (
                            <p className="text-red-600">
                                {error}
                            </p>
                        )}

                    </div>


                    {/* VISTA PREVIA */}
                    <div>

                        <h2 className="mb-2 font-semibold">
                            Vista previa
                        </h2>

                        <iframe
                            title="Vista previa"
                            srcDoc={resultado}
                            sandbox="allow-scripts"
                            className="
                                h-[600px]
                                w-full
                                rounded-lg
                                border
                                bg-white
                            "
                        />

                    </div>

                </div>

            </div>

        </main>
    );
}