import { Resend } from 'resend';

export const correoService = {

    async enviarRestablecimiento(correo, enlace) {

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: "AprendeWebGT <no-reply@aprendewebgt.lat>",
            to: correo,
            subject: 'Restablecer contraseña',
            html: `
                Haz clic
                <a href="${enlace}">aquí</a>
                para restablecer tu contraseña.
                Este enlace expira en 10 minutos.
            `
        });

        if (error) {
            throw new Error('ERROR_CORREO');
        }

        return data;
    }
};