import { before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../app.js';


// Tests para el registro de usuarios
describe('POST /api/usuarios/registro', () => {
    it('debería crear un usuario correctamente', async () => {
        const identificadorUno = Date.now();

        const respuesta = await request(app)
            .post('/api/usuarios/registro')
            .send({
                username: `supertest${identificadorUno}`,
                nombre: 'Usuario supertest',
                correo: `supertest${identificadorUno}@test.com`,
                password: '123456'
            });

        assert.strictEqual(respuesta.status, 201);
        assert.ok(respuesta.body.id);
        assert.strictEqual(respuesta.body.nombre, 'Usuario supertest');
    });

    it('debería devolver 400 cuando faltan campos requeridos', async () => {
        const respuesta = await request(app)
            .post('/api/usuarios/registro')
            .send({
                username: 'test'
            });

        assert.strictEqual(respuesta.status, 400);
        assert.strictEqual(respuesta.body.error, 'Faltan campos requeridos');
    });

    it('debería devolver 409 cuando ya exista un usuario con ese correo', async () => {
        const identificadorUno = Date.now();

        const usuario = {
            username: `test${identificadorUno}`,
            nombre: 'Usuario supertest',
            correo: `supertest${identificadorUno}@test.com`,
            password: '123456'
        };

        const segundoUsuario = {
            username: `otro_test${identificadorUno}`,
            nombre: 'Usuario supertest dos',
            correo: `supertest${identificadorUno}@test.com`,
            password: '123456'
        };

        const primeraRespuesta = await request(app)
            .post('/api/usuarios/registro')
            .send(usuario);

        assert.strictEqual(primeraRespuesta.status, 201);

        const segundaRespuesta = await request(app)
            .post('/api/usuarios/registro')
            .send(segundoUsuario);

        assert.strictEqual(segundaRespuesta.status, 409);
        assert.strictEqual(segundaRespuesta.body.error, 'Un usuario con ese correo electrónico ya existe.');

    });
});


// Tests para el logeo de usuarios
describe('POST /api/usuarios/login', () => {
    let usuario;

    beforeEach(async () => {
        const id = Date.now();

        usuario = {
            username: `login_test${id}`,
            nombre: 'Usuario Login Test',
            correo: `login_test${id}@test.com`,
            password: '123456'
        };

        const registro = await request(app)
            .post('/api/usuarios/registro')
            .send(usuario);

        assert.strictEqual(registro.status, 201);
    });


    it('debería devolver 200 cuando se inicia sesión correctamente', async () => {
        const respuesta = await request(app)
            .post('/api/usuarios/login')
            .send({
                identificador: usuario.username,
                password: usuario.password
            });
        assert.strictEqual(respuesta.status, 200);
        const cookies = respuesta.headers['set-cookie'];
        assert.ok(cookies);
        assert.ok(cookies.some(cookie => cookie.startsWith('token=')));
        assert.ok(cookies.some(cookie => cookie.includes('HttpOnly')));
        assert.strictEqual(respuesta.body.token, undefined);


        assert.ok(respuesta.body.usuario.id);
        assert.strictEqual(respuesta.body.usuario.nombre, 'Usuario Login Test');
    });

    it('debería devovler 400 cuando uno de los parametros es incorrecto', async () => {
        const respuesta = await request(app)
            .post('/api/usuarios/login')
            .send({
                identificador: usuario.username
            });

        assert.strictEqual(respuesta.status, 400);
        assert.strictEqual(respuesta.body.error, 'Faltan campos requeridos');
    });

    it('debería devolver 401 cuando uno de los parametros sea incorrecto.', async () => {
        const respuesta = await request(app)
            .post('/api/usuarios/login')
            .send({
                identificador: usuario.username,
                password: "654321"
            });

        assert.strictEqual(respuesta.status, 401);
        assert.strictEqual(respuesta.body.error, 'Usuario o contraseña incorrectos');
    });

});
//Testing para la obtencion de perfiles
describe('GET /api/usuarios/perfil', () => {
    let usuario;
    before(async () => {
        const id = Date.now();

        usuario = {
            username: `perfil_test${id}`,
            nombre: 'Usuario Perfil Test',
            correo: `perfil_test${id}@test.com`,
            password: '123456'
        };

        const registro = await request(app)
            .post('/api/usuarios/registro')
            .send(usuario);

        assert.strictEqual(registro.status, 201);
    });


    it('debería devolver 200 si el usuario tiene una sesión válida', async () => {
        const agente = request.agent(app);

        const login = await agente
            .post('/api/usuarios/login')
            .send({
                identificador: usuario.username,
                password: usuario.password
            });

        assert.strictEqual(login.status, 200);

        const respuesta = await agente
            .get('/api/usuarios/perfil');

        assert.strictEqual(respuesta.status, 200);
        assert.ok(respuesta.body.id);
        assert.strictEqual(respuesta.body.nombre, 'Usuario Perfil Test');
    });

    it('debería devolver 401 si se solicita el perfil sin sesión', async () => {
        const respuesta = await request(app)
            .get('/api/usuarios/perfil');

        assert.strictEqual(respuesta.status, 401);
        assert.strictEqual(respuesta.body.error, 'No autenticado');
    });
});

//Testing para el logout
describe('POST /api/usuarios/logout', () => {
    let usuario;
    before(async () => {
        const id = Date.now();

        usuario = {
            username: `logout_test${id}`,
            nombre: 'Usuario Logout Test',
            correo: `logout_test${id}@test.com`,
            password: '123456'
        };

        const registro = await request(app)
            .post('/api/usuarios/registro')
            .send(usuario);

        assert.strictEqual(registro.status, 201);
    });

    it('deberia devolver 200 si cierra la sesion correctamente.', async () => {
        const agente = request.agent(app);

        const login = await agente
            .post('/api/usuarios/login')
            .send({
                identificador: usuario.username,
                password: usuario.password
            });

        assert.strictEqual(login.status, 200);

        const respuestaLogout = await agente
            .post('/api/usuarios/logout');
        assert.strictEqual(respuestaLogout.status, 200);

        const respuesta = await agente
            .get('/api/usuarios/perfil');

        assert.strictEqual(respuesta.status, 401);
    });

    it('deberia devolver 401 si se intenta hacer logout sin iniciar sesion', async () => {
        const logout = await request(app)
            .post('/api/usuarios/logout');

        assert.strictEqual(logout.status, 401);
        assert.strictEqual(logout.body.error, 'No autenticado');
    });
});