import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            error: 'No autenticado'
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = payload;

        next();

    } catch (error) {
        return res.status(401).json({
            error: 'Sesión inválida o expirada'
        });
    }
}

export function verificarToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "No autenticado" });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        req.usuario = payload;
        next();

    } catch (error) {
        console.log("Error verificando token:", error.message);

        return res.status(401).json({
            error: "Sesión inválida o expirada"
        });
    }
}