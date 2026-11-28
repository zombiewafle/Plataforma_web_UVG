import { Link, Outlet } from "react-router";
import Navbar from "../Componentes/Navbar";


export default function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar></Navbar>
            {/* <nav>
                <Link to="/">Inicio</Link>
            </nav> */}
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
