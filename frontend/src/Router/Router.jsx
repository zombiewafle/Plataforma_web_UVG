import Login from "../Vistas/Login";
import RootLayout from "./RouteLayout";
import AuthLayout from "./AuthLayout";
import Home from "../Vistas/Home";
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