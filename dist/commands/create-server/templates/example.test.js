const request = require('supertest');
const server = require('../server');

const STATUS_OK = 200;

describe('Test the root path', () => {
    test('It should response the GET method', async () => {
        const response = await request(server).get('/');
        expect(response.statusCode).toBe(STATUS_OK);
    });
});