import RootLayout from "./RouteLayout";
import AuthLayout from "./AuthLayout";
import Login from "../Vistas/Login";
import Registro from "../Vistas/Register"
import Home from "../Vistas/Home";
import OlvidoContraseña from "../Vistas/ForgotPassword";
import { createBrowserRouter } from "react-router";
import VerificarSesion from "../Componentes/VerificarSesion";
import RutaProtegida from "../Componentes/RutaProtegida";

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
                path: "/olvido_contraseña",
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
                    }
                ]
            },
        ],
    },
]);

export default router;