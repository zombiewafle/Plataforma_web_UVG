import { Link } from "react-router";
import logoNavbar from "../assets/logoNavbar.png";
import { useState } from "react";
import LogoutButton from "./LogoutLogic";

function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [cargando, setCargando] = useState(false);

    return (
        <>
            <nav className="flex items-center justify-between px-10 py-3">
                <div className="h-10 w-auto object-contain cursor-pointer">
                    <Link to="/home">
                        <img src={logoNavbar} alt="Aprende Web GT" className="h-20 w-auto object-contain cursor-pointer hover:opacity-50" />
                    </Link>
                </div>
                <div className="pr-20 pl-20"></div>
                <ul className="flex items-center gap-6 text-green-600 font-medium px-4 py-2 rounded-md"  >
                    <li className="hover:text-white cursor-pointer rounded-md"><Link to="/home">Inicio</Link></li>
                    <li className="hover:text-white cursor-pointer rounded-md"><Link to="#">Cursos</Link></li>
                    <li className="hover:text-white cursor-pointer rounded-md"><Link to="#">Progreso</Link></li>

                    <li className="relative">
                        <button id="dropdownDefaultButton" onClick={() => setMenuAbierto(!menuAbierto)} className=" relative text-green-600 font-medium  inline-flex items-center justify-center bg-brand box-border border border-transparent hover:text-white hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-m px-4 py-2.5 focus:outline-none cursor-pointer" type="button">Cuenta
                            <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" /></svg>
                        </button>

                        <div id="dropdown" className={`z-10  ${menuAbierto ? ' block' : 'hidden'}  absolute left-0 top-full mt-2 z-20 w-44 bg-neutral-primary-medium border border-default-medium rounded-bas shadow-lg`}>
                            <ul className="p-2 text-sm text-body font-medium" aria-labelledby="dropdownDefaultButton" >
                                <li className="hover:opacity-90 cursor-pointer rounded-md"><Link to="/perfil">Perfil</Link></li>
                                <li className="hover:opacity-90 cursor-pointer rounded-md">
                                    <LogoutButton />
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav >
        </>
    );
}

export default Navbar;