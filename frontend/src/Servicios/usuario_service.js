
export async function obtenerPerfilFrontend() {
    const API_URL = import.meta.env.VITE_API_URL;
    const revision = await fetch(`${API_URL}/usuarios/perfil`, {
        method: 'GET',
        credentials: 'include'
    });

    if (revision.status === 200) {
        return revision.json();
    }

    if (revision.status === 401) {
        return null;
    }

    if (!revision.ok) {
        throw new Error('No se pudo obtener el perfil.')
    }

}

