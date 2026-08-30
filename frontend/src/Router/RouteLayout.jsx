import { Link, Outlet } from "react-router";


export default function RootLayout() {
    return (
        <div>
            <nav>
                <Link to="/">Inicio</Link>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
