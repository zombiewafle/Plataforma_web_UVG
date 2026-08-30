import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../app.js';

describe('GET /api/health', () => {
    it('debería devolver 200 si el backend está funcionando', async () => {
        const respuesta = await request(app)
            .get('/api/health');

        assert.strictEqual(respuesta.status, 200);
        assert.strictEqual(respuesta.body.status, 'ok');
    });
});