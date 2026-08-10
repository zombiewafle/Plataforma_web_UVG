//Este archivo reune todas las llamadas a la db.
import 'dotenv/config';
import express from "express";
import cookieParser from 'cookie-parser';
import usuarioRouter from "./Rutas/usuario_route.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/usuarios', usuarioRouter);

app.listen(PORT, () => {
    console.log('Servidor ejecutandose');
});

