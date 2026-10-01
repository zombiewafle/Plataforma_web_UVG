import RootLayout from "./RouteLayout";
import AuthLayout from "./AuthLayout";
import Login from "../Vistas/Login";
import Registro from "../Vistas/Register"
import Home from "../Vistas/Home";
import OlvidoContraseña from "../Vistas/ForgotPassword";
import { createBrowserRouter } from "react-router";
import VerificarSesion from "../Componentes/VerificarSesion";
import RutaProtegida from "../Componentes/RutaProtegida";
import Perfil from "../Vistas/Perfil";

const router = createBrowserRouter([

    {
        path: "/",
        element: <VerificarSesion />,
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/registro",
                element: <Registro />,
            },
            {
                path: "/olvido-contrasena",
                element: <OlvidoContraseña />,
            },
        ],
    },
    {
        element: <RutaProtegida />,
        children: [
            {
                element: <RootLayout />,
                children: [
                    {
                        path: "/home",
                        element: <Home />,
                    },
                    {
                        path: "/perfil",
                        element: <Perfil />,
                    }
                ]
            },
        ],
    },
]);

export default router;