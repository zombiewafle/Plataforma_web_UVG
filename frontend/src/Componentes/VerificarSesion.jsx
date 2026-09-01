import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { obtenerPerfilFrontend } from "../Servicios/usuario_service";

function VerificarSesion() {
    const [cargando, setCargando] = useState(true);
    // const [error, setError] = useState('');
    const [perfil, setPerfil] = useState(null);

    useEffect(() => {
        async function revisarSesion() {
            try {
                const datosPerfil = await obtenerPerfilFrontend();
                setPerfil(datosPerfil);
            } catch (error) {
                console.error("Error comprobando sesión:", error);

            } finally {
                setCargando(false);
            }
        }
        revisarSesion();
    }, []);

    if (cargando) {
        return null;
    }

    if (perfil) {
        return <Navigate to="/home" replace />
    }

    return <Navigate to="/login" replace />

};

export default VerificarSesion;