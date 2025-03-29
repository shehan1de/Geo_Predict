const request = require('supertest');
const app = require('../server');
const User = require('../Model/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

describe('User Management API', () => {
    let userId;

    beforeAll(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('Should create a new user', async () => {
        const res = await request(app).post('/api/users/add').send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'user'
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe('test@example.com');

        userId = res.body._id;
    });

    test('Should fetch all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('Should fetch a single user by userId', async () => {
        const res = await request(app).get(`/api/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(userId);
    });

    test('Should update user details', async () => {
        const res = await request(app).put(`/api/users/${userId}`).send({
            name: 'Updated User',
            role: 'admin'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated User');
        expect(res.body.role).toBe('admin');
    });

    test('Should delete a user', async () => {
        const res = await request(app).delete(`/api/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User deleted successfully');
    });

    test('Should return 404 for a deleted user', async () => {
        const res = await request(app).get(`/api/users/${userId}`);
        expect(res.statusCode).toBe(404);
    });
});