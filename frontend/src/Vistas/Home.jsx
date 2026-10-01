import { useState } from "react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import LogoutButton from "../Componentes/LogoutLogic";

function Home() {
    useEffect(() => {
        document.title = "Inicio | Aprende Web GT";
    }, []);


    return (
        <div className="w-full h-full flex items-center justify-center flex-col items-center justify-center gap-5">
        </div>
    )
};

export default Home;