import Login from "../Vistas/Login"
import RootLayout from "./RouteLayout";
import AuthLayout from "./AuthLayout";
import Home from '../Vistas/Home';
import { createBrowserRouter, Navigate } from "react-router";

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: "/", element: <Navigate to="/login" replace /> },
            { path: "/login", element: <Login /> },

        ],
    },
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <Home /> },

        ],
    },
]);

export default router;