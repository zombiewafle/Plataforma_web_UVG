//Este archivo reune todas las llamadas a la db.
import express from "express";
import cookieParser from 'cookie-parser';
import usuarioRouter from "./rutas/usuario_route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
    return res.status(200).json({
        status: 'ok'
    });
});

app.use('/api/usuarios', usuarioRouter);

export default app;

