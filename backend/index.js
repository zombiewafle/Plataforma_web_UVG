//Este archivo reune todas las llamadas a la db.

import express from "express";
import router from "./Rutas/usuario_route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/usuarios', router);

app.listen(PORT, () => {
    console.log('Servidor ejecutandose');
});

