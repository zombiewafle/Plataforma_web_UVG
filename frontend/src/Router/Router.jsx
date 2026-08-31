import RootLayout from "./RouteLayout";
import AuthLayout from "./AuthLayout";
import Login from "../Vistas/Login";
import Registro from "../Vistas/Register"
import Home from "../Vistas/Home";
import OlvidoContraseña from "../Vistas/ForgotPassword";
import { createBrowserRouter, Navigate } from "react-router";


const router = createBrowserRouter([

    {
        path: "/",
        element: <Navigate to="/login" replace />,
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
        element: <RootLayout />,
        children: [
            {
                path: "/home",
                element: <Home />,
            },
        ],
    },
]);

export default router;