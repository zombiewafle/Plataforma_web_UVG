function Login() {
    return (
        <div className='w-screen flex flex-col items-center justify-center h-screen gap-5'>

            <h1 className="font-bold text-4xl">Login</h1>
            <form className="gap-5 items-center justify-center flex flex-col">
                <input type="email" autoComplete="email" placeholder="Correo Electrónico" className=" px-4 py-2 border border-gray-300 rounded-lg shadow-md"></input>
                <input type="password" autoComplete="current-password" placeholder="Contraseña" className=" px-4 py-2 border border-gray-300 rounded-lg shadow-md "></input>

                <button
                    type="submit"
                    className="shadow-md bg-green-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                >
                    Iniciar sesión
                </button>

            </form>
            <a href="#" className="text-sm text-emerald-600 hover:underline font-bold">¿Olvidaste tu contraseña?</a>
            <a href="#" className="text-sm text-emerald-600 hover:underline font-bold">¿No tienes una cuenta? Registrate</a>

        </div>
    );
}

export default Login;