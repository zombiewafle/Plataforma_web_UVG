import { useEffect, useState } from "react";
import { obtenerPerfilFrontend } from "../Servicios/usuario_service";
import { Navigate, Outlet } from "react-router";

function RutaProtegida() {
    const [cargando, setCargando] = useState(true);
    const [autenticado, setAutenticado] = useState(false);

    useEffect(() => {
        async function proteger() {
            try {
                const perfil = await obtenerPerfilFrontend();
                if (perfil) {
                    setAutenticado(true);
                }
                else {
                    setAutenticado(false);
                }
            } catch (error) {
                setAutenticado(false);
                console.error("Error verificando acceso:", error);
            } finally {
                setCargando(false)
            }
        }
        proteger();
    }, []);

    if (cargando) {
        return null;
    }

    if (!autenticado) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default RutaProtegida;