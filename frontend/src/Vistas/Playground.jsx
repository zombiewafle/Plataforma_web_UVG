import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function Playground() {
    const { ejercicioId } = useParams();

    const API_URL = import.meta.env.VITE_API_URL;
    const HOME_API = `${API_URL}/home`;

    const [ejercicio, setEjercicio] = useState(null);

    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [javascript, setJavascript] = useState("");

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarEjercicio() {
            try {
                const respuesta = await fetch(
                    `${HOME_API}/ejercicios/${ejercicioId}`,
                    {
                        credentials: "include",
                    }
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        datos.error || "Error al cargar el ejercicio"
                    );
                }

                setEjercicio(datos);
                setHtml(datos.codigo_inicial || "");

            } catch (error) {
                setError(error.message);

            } finally {
                setCargando(false);
            }
        }

        cargarEjercicio();

    }, [ejercicioId]);

    const resultado = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}

                <script>
                    ${javascript}
                <\/script>
            </body>
        </html>
    `;

    if (cargando) {
        return (
            <div className="p-8">
                Cargando playground...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <section className="w-full px-4 py-8">

            <div className="mx-auto max-w-7xl">

                <Link
                    to={`/ejercicios/${ejercicio.id}`}
                    className="text-sm text-green-500 hover:underline"
                >
                    ← Volver al ejercicio
                </Link>

                <div className="mt-5">
                    <h1 className="text-2xl font-bold">
                        {ejercicio.titulo}
                    </h1>

                    <p className="mt-2 text-gray-400">
                        {ejercicio.instrucciones}
                    </p>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">

                    <div className="flex flex-col gap-5">

                        <div>
                            <h2 className="mb-2 font-semibold">
                                HTML
                            </h2>

                            <textarea
                                value={html}
                                onChange={(e) => setHtml(e.target.value)}
                                className="min-h-48 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-white"
                            />
                        </div>

                        <div>
                            <h2 className="mb-2 font-semibold">
                                CSS
                            </h2>

                            <textarea
                                value={css}
                                onChange={(e) => setCss(e.target.value)}
                                className="min-h-40 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-white"
                            />
                        </div>

                        <div>
                            <h2 className="mb-2 font-semibold">
                                JavaScript
                            </h2>

                            <textarea
                                value={javascript}
                                onChange={(e) =>
                                    setJavascript(e.target.value)
                                }
                                className="min-h-40 w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-white"
                            />
                        </div>

                    </div>

                    <div>
                        <h2 className="mb-2 font-semibold">
                            Resultado
                        </h2>

                        <iframe
                            title="Vista previa"
                            srcDoc={resultado}
                            sandbox="allow-scripts"
                            className="h-[600px] w-full rounded-lg border border-gray-700 bg-white"
                        />
                    </div>

                </div>

            </div>

        </section>
    );
}

export default Playground;