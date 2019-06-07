const request = require('supertest');
const server = require('../server');
const graphql = require('../graphql');

const STATUS_OK = 200;

describe('HTTP Server', () => {
    test('load root path', async () => {
        const {statusCode} = await request(server).get('/');
        expect(statusCode).toBe(STATUS_OK);
    });
    test('load example markdown file', async () => {
        const {statusCode} = await request(server).get('/example.md');
        expect(statusCode).toBe(STATUS_OK);
    });
});
describe('GraphQL Server', () => {
    test('load root path', async () => {
        const {statusCode} = await request(graphql).get('/');
        expect(statusCode).toBe(STATUS_OK);
    });
});