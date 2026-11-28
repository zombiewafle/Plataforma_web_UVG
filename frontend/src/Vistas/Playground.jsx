import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;
const HOME_API = `${API_URL}/home`;

async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, {
        credentials: "include",
        ...opciones
    });

    const tipo = respuesta.headers.get("content-type") ?? "";

    if (!tipo.includes("application/json")) {
        throw new Error(
            `Respuesta inesperada del servidor (${respuesta.status})`
        );
    }

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos?.error ?? `Error ${respuesta.status}`
        );
    }

    return datos;
}

export default function Playground() {
    const { ejercicioId } = useParams();

    const [ejercicio, setEjercicio] = useState(null);
    const [codigos, setCodigos] = useState({});

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [entregando, setEntregando] = useState(false);
    const [retirando, setRetirando] = useState(false);

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const [estado, setEstado] = useState("pendiente");
    const [retroalimentacion, setRetroalimentacion] = useState("");

    const bloqueado =
        estado === "entregado" ||
        estado === "aprobado";

    const ocupado =
        guardando || entregando || retirando;

    // const estados = {
    //     pendiente: "Pendiente",
    //     en_progreso: "En progreso",
    //     // entregado: "Pendiente de revisión",
    //     aprobado: "Aprobado",
    //     requiere_correcciones: "Requiere correcciones"
    // };

    const coloresEstado = {
        pendiente: "bg-gray-100 text-gray-700",
        en_progreso: "bg-blue-100 text-blue-700",
        entregado: "bg-amber-100 text-amber-700",
        aprobado: "bg-green-100 text-green-700",
        requiere_correcciones: "bg-red-100 text-red-700"
    };


    // CARGAR EJERCICIO Y PROGRESO

    useEffect(() => {
        const controller = new AbortController();

        async function cargarDatos() {
            try {
                setCargando(true);
                setError("");
                setMensaje("");
                setEjercicio(null);

                const [datosEjercicio, progreso] =
                    await Promise.all([
                        solicitar(
                            `${HOME_API}/ejercicios/${ejercicioId}`,
                            { signal: controller.signal }
                        ),
                        solicitar(
                            `${HOME_API}/ejercicios/${ejercicioId}/progreso`,
                            { signal: controller.signal }
                        )
                    ]);

                const codigosIniciales = {};

                datosEjercicio.lenguajes.forEach((lenguaje) => {
                    const guardado = progreso?.codigos?.find(
                        item => item.lenguaje === lenguaje.slug
                    );

                    codigosIniciales[lenguaje.slug] =
                        guardado?.codigo ??
                        lenguaje.codigo_inicial ??
                        "";
                });

                setEjercicio(datosEjercicio);
                setCodigos(codigosIniciales);

                setEstado(progreso?.estado ?? "pendiente");

                setRetroalimentacion(
                    progreso?.retroalimentacion ?? ""
                );

            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(error);
                    setError(error.message);
                }

            } finally {
                if (!controller.signal.aborted) {
                    setCargando(false);
                }
            }
        }

        cargarDatos();

        return () => controller.abort();

    }, [ejercicioId]);


    // PERSISTIR CÓDIGO EN EL BACKEND

    async function persistirCodigo() {
        const listaCodigos = ejercicio.lenguajes.map(
            lenguaje => ({
                lenguaje: lenguaje.slug,
                codigo: codigos[lenguaje.slug] ?? ""
            })
        );

        const progreso = await solicitar(
            `${HOME_API}/ejercicios/${ejercicioId}/progreso`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codigos: listaCodigos
                })
            }
        );

        setEstado(progreso.estado);
    }


    // GUARDAR PROGRESO

    async function guardarProgreso() {
        if (bloqueado || ocupado) return;

        try {
            setGuardando(true);
            setMensaje("");
            setError("");

            await persistirCodigo();

            setMensaje("Progreso guardado correctamente");

        } catch (error) {
            console.error(error);
            setError(error.message);

        } finally {
            setGuardando(false);
        }
    }


    // ENTREGAR EJERCICIO

    async function entregarEjercicio() {
        if (bloqueado || ocupado) return;

        try {
            setEntregando(true);
            setMensaje("");
            setError("");

            // Guardar el código antes de entregarlo
            await persistirCodigo();

            const datos = await solicitar(
                `${HOME_API}/ejercicios/${ejercicioId}/entregar`,
                {
                    method: "PATCH"
                }
            );

            setEstado(datos.estado);
            setRetroalimentacion("");
            setMensaje(datos.message);

        } catch (error) {
            console.error(error);
            setError(error.message);

        } finally {
            setEntregando(false);
        }
    }


    // RETIRAR ENTREGA

    async function retirarEntrega() {
        if (estado !== "entregado" || ocupado) return;

        try {
            setRetirando(true);
            setMensaje("");
            setError("");

            const datos = await solicitar(
                `${HOME_API}/ejercicios/${ejercicioId}/retirar-entrega`,
                {
                    method: "PATCH"
                }
            );

            setEstado(datos.estado);
            setMensaje(datos.message);

        } catch (error) {
            console.error(error);
            setError(error.message);

        } finally {
            setRetirando(false);
        }
    }


    // VISTA PREVIA

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

    if (!ejercicio) {
        return (
            <div className="p-8 text-red-600">
                {error || "Ejercicio no encontrado"}
            </div>
        );
    }


    return (
        <main className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-7xl">

                {/* ENCABEZADO */}

                <div className="mb-6">

                    <Link
                        to={`/ejercicios/${ejercicioId}`}
                        className="mb-4 inline-block text-sm font-medium text-green-700 hover:underline"
                    >
                        ← Regresar al ejercicio
                    </Link>

                    <div className="flex flex-wrap items-center justify-between gap-3">

                        <p className="text-sm text-gray-500">
                            Ejercicio {ejercicio.orden}
                        </p>
                        {/* 
                        <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${coloresEstado[estado]}`}
                        >
                            {estados[estado]}
                        </span> */}

                    </div>

                    <h1 className="text-3xl font-bold">
                        {ejercicio.titulo}
                    </h1>

                    <p className="mt-2 text-gray-600">
                        {ejercicio.instrucciones}
                    </p>

                </div>


                {/* AVISOS DEL ESTADO

                {estado === "entregado" && (
                    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">

                        <p className="font-semibold">
                            Ejercicio entregado
                        </p>

                        <p className="mt-1 text-sm">
                            Tu ejercicio está pendiente de revisión.
                            Puedes retirar la entrega si necesitas
                            modificar tu código.
                        </p>

                    </div>
                )}
 */}

                {estado === "aprobado" && (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">

                        <p className="font-semibold">
                            ✓ Ejercicio aprobado
                        </p>

                        <p className="mt-1 text-sm">
                            El maestro ha aprobado tu trabajo.
                        </p>

                    </div>
                )}


                {estado === "requiere_correcciones" && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">

                        <p className="font-semibold">
                            Tu ejercicio requiere correcciones
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm">
                            {retroalimentacion ||
                                "Revisa tu código y vuelve a entregarlo."}
                        </p>

                    </div>
                )}


                <div className="grid gap-6 lg:grid-cols-2">

                    {/* EDITORES */}

                    <div className="space-y-5">

                        {ejercicio.lenguajes.map((lenguaje) => (

                            <div key={lenguaje.id}>

                                <div className="mb-2 flex items-center justify-between">

                                    <h2 className="font-semibold">
                                        {lenguaje.nombre}
                                    </h2>

                                    {bloqueado && (
                                        <span className="text-xs text-gray-500">
                                            Solo lectura
                                        </span>
                                    )}

                                </div>

                                <textarea

                                    value={
                                        codigos[lenguaje.slug] ?? ""
                                    }

                                    readOnly={bloqueado || ocupado}

                                    onChange={(e) => {
                                        setCodigos((actuales) => ({
                                            ...actuales,
                                            [lenguaje.slug]:
                                                e.target.value
                                        }));

                                        setMensaje("");
                                    }}

                                    className={`h-64 w-full resize-none rounded-lg border bg-gray-900 p-4 font-mono text-sm text-white ${bloqueado
                                        ? "cursor-not-allowed opacity-70"
                                        : ""
                                        }`}
                                />

                            </div>

                        ))}


                        {/* BOTONES */}

                        <div className="flex flex-wrap gap-3">

                            <button
                                onClick={guardarProgreso}
                                disabled={
                                    bloqueado ||
                                    ocupado ||
                                    !ejercicio.lenguajes.length
                                }
                                className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {guardando
                                    ? "Guardando..."
                                    : "Guardar progreso"}
                            </button>


                            {!bloqueado && (
                                <button
                                    onClick={entregarEjercicio}
                                    disabled={
                                        ocupado ||
                                        !ejercicio.lenguajes.length
                                    }
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {entregando
                                        ? "Entregando..."
                                        : "Entregar ejercicio"}
                                </button>
                            )}


                            {estado === "entregado" && (
                                <button
                                    onClick={retirarEntrega}
                                    disabled={ocupado}
                                    className="rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
                                >
                                    {retirando
                                        ? "Retirando..."
                                        : "Retirar entrega"}
                                </button>
                            )}

                        </div>


                        {/* MENSAJES */}

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
                            className="h-[600px] w-full rounded-lg border bg-white"
                        />

                    </div>

                </div>

            </div>

        </main>
    );
}